import { AssistantResponse } from "ai";
import OpenAI from "openai";

export const runtime = "edge";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type Body = { lang: "move" | "solidity"; message: string; threadId?: string };

export async function POST(req: Request) {
  const { lang, message, threadId } = (await req.json()) as Body;

  const assistant_id =
    lang === "solidity"
      ? process.env.SOLIDITY_ASSISTANT_ID!
      : process.env.UMI_MOVE_ASSISTANT_ID!;

  const tid = threadId ?? (await openai.beta.threads.create({})).id;
  const userMsg = await openai.beta.threads.messages.create(tid, {
    role: "user",
    content: message,
  });

  return AssistantResponse(
    { threadId: tid, messageId: userMsg.id },
    async ({ forwardStream }) => {
      const runStream = openai.beta.threads.runs.stream(tid, { assistant_id });
      await forwardStream(runStream); // stream delta chunks
    }
  );
}
