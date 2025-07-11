import { useAssistant } from "ai/react";
import { useEffect, useRef } from "react";
import {
  unwrapSolidity,
  compileSolidity,
  stripFences,
} from "@/lib/sol-compile";

/**
 * Custom hook for generating smart contracts with AI.
 *
 * @param lang - The smart contract language ('solidity' or 'move').
 * @param onStreamUpdate - Callback function that receives the streaming code in real-time.
 * @param onDone - Callback function executed when code generation is complete, providing the final source and a compilation message.
 */
export function useAiGenerate(
  lang: "move" | "solidity",
  onStreamUpdate: (code: string) => void,
  onDone: (source: string, compiledMsg: string) => void
) {
  // 1. Restore previous OpenAI thread to maintain conversation context.
  const storageKey = `umi_thread_gen_${lang}`;
  const threadId =
    typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;

  const { input, handleInputChange, submitMessage, messages, status } =
    useAssistant({
      api: "/api/generate",
      body: { lang, threadId },
    });

  // 2. Remember the thread-id once the first assistant message returns.
  useEffect(() => {
    const meta = messages.find((m) => (m as any).threadId);
    if (meta) localStorage.setItem(storageKey, (meta as any).threadId);
  }, [messages, storageKey]);

  // 3. (NEW) Stream the assistant's response directly to the editor.
  useEffect(() => {
    const lastMessage = messages.at(-1);
    // As the assistant's message content updates (streams),
    // call the onStreamUpdate callback to update the UI in real-time.
    if (lastMessage && lastMessage.role === "assistant") {
      onStreamUpdate(stripFences(lastMessage.content));
    }
  }, [messages, onStreamUpdate]);

  // 4. (MODIFIED) Compile only when the assistant is *finished* sending.
  // We now use the `status` field for a more reliable "done" signal.
  const prevStatus = useRef(status);

  useEffect(() => {
    // If the status was 'in_progress' and has now changed, we know generation is complete.
    if (prevStatus.current === "in_progress" && status !== "in_progress") {
      const lastMessage = messages.at(-1);
      if (lastMessage && lastMessage.role === "assistant") {
        const finalSource = stripFences(lastMessage.content);
        console.log("[Generate] Final source length:", finalSource.length);

        if (lang === "solidity") {
          compileSolidity(unwrapSolidity(finalSource))
            .then((out) => onDone(finalSource, out))
            .catch((e) => onDone(finalSource, `❌ ${e}`));
        } else {
          // For Move, provide a stub success message.
          onDone(finalSource, "✅ compiled successfully (Move stub)");
        }
      }
    }
    // Update the ref for the next render cycle.
    prevStatus.current = status;
  }, [status, messages, lang, onDone]);

  return { input, handleInputChange, submitMessage, status };
}
