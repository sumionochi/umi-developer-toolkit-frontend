import { useAssistant } from "ai/react";
import { useEffect } from "react";

export function useAiDoubt(lang: "move" | "solidity") {
  const storageKey = `umi_thread_doubt_${lang}`;
  const threadId =
    typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;

  /* base hook (no question yet) */
  const {
    input, // text in <textarea>
    handleInputChange, // onChange handler
    submitMessage, // default submit (FormEvent)
    messages,
    status,
  } = useAssistant({
    api: "/api/doubt", // <—— matches the route above
    body: { lang, threadId }, // question will be injected per-call
  });

  /* wrapper so we send { question: input } */
  const askDoubt = () =>
    submitMessage(undefined, { data: { question: input } });

  /* persist thread-id once we receive it */
  useEffect(() => {
    const meta = messages.find((m) => (m as any).threadId);
    if (meta) localStorage.setItem(storageKey, (meta as any).threadId);
  }, [messages]);

  return {
    input,
    handleInputChange,
    submitMessage: askDoubt,
    messages,
    status,
  };
}
