import { useAssistant } from "ai/react";
import { useEffect, useRef } from "react";
import { stripFences } from "@/lib/sol-compile";

/* ------------------------------------------------------------------ */
/*  Hook streams the assistant code into the editor – no compiling    */
/* ------------------------------------------------------------------ */

export function useAiGenerate(
  lang: "move" | "solidity",
  onStream: (code: string) => void,
  onDone: (finalSource: string) => void // <── only source now
) {
  /* 1‒ keep conversation thread */
  const storageKey = `umi_thread_gen_${lang}`;
  const threadId =
    typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;

  const { input, handleInputChange, submitMessage, messages, status } =
    useAssistant({ api: "/api/generate", body: { lang, threadId } });

  /* 2‒ store the new thread-id once */
  useEffect(() => {
    const meta = messages.find((m) => (m as any).threadId);
    if (meta) localStorage.setItem(storageKey, (meta as any).threadId);
  }, [messages, storageKey]);

  /* 3‒ stream the partial answer straight into the editor */
  useEffect(() => {
    const last = messages.at(-1);
    if (last?.role === "assistant") {
      onStream(stripFences(last.content));
    }
  }, [messages, onStream]);

  /* 4‒ fire onDone only when streaming finishes – *no compile* */
  const prev = useRef(status);
  useEffect(() => {
    if (prev.current === "in_progress" && status !== "in_progress") {
      const last = messages.at(-1);
      if (last?.role === "assistant") {
        onDone(stripFences(last.content)); // <── just source
      }
    }
    prev.current = status;
  }, [status, messages, onDone]);

  return { input, handleInputChange, submitMessage, status };
}
