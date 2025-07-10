import { useAssistant } from "ai/react";
import { useEffect } from "react";

export function useAiGenerate(
  lang: "move" | "solidity",
  onDone: (code: string) => void
) {
  const storageKey = `umi_thread_gen_${lang}`;
  const threadId =
    typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;

  const { input, handleInputChange, submitMessage, messages, status } =
    useAssistant({
      api: "/api/generate",
      body: { lang, threadId },
    });

  // remember thread
  useEffect(() => {
    const meta = messages.find((m) => (m as any).threadId);
    if (meta) localStorage.setItem(storageKey, (meta as any).threadId);
  }, [messages]);

  // push last assistant reply into Monaco
  useEffect(() => {
    if (messages.at(-1)?.role === "assistant") {
      onDone(messages.at(-1)!.content);
    }
  }, [messages, onDone]);

  return { input, handleInputChange, submitMessage, status };
}
