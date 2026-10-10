import { NextResponse } from "next/server";
import { produceReply } from "@/lib/tutor";
import { findKnowledge } from "@/lib/tutor-knowledge";

type Body = {
  message?: string;
  name?: string;
  band?: string;
  grade?: number;
  language?: string;
};

const LANG_NAME: Record<string, string> = {
  en: "English", hi: "Hindi", es: "Spanish", fr: "French", ar: "Arabic",
  pt: "Portuguese", bn: "Bengali", zh: "Chinese", ur: "Urdu", ps: "Pashto",
  sd: "Sindhi", pa: "Punjabi",
};

/** Optional LLM upgrade — used automatically when a key is configured. */
async function askLLM(body: Body): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const languageName = LANG_NAME[body.language ?? "en"] ?? "English";
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 420,
        messages: [
          {
            role: "system",
            content:
              `You are Zehn, a warm, patient tutor for a student called ${body.name ?? "the learner"} in ${body.band ?? "school"} (class ${body.grade ?? "unknown"}). ` +
              `Always reply in ${languageName}. Use short sentences, concrete examples and simple words suited to that class level. ` +
              `Explain the reasoning, never just the answer. If the student asks about an animal, book, country, history topic or science idea, give accurate, specific facts. ` +
              `Keep replies under 130 words. Never invent facts — if unsure, say so and suggest how to find out.`,
          },
          { role: "user", content: body.message ?? "" },
        ],
      }),
      signal: AbortSignal.timeout(14_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const message = (body.message ?? "").slice(0, 600).trim();
  if (!message) return NextResponse.json({ error: "empty" }, { status: 400 });

  const ctx = { name: body.name || "friend", gradeBandLabel: body.band || "your class" };

  // 1) quick commands and conversational intents stay instant and local
  if (message.startsWith("__")) {
    return NextResponse.json({ ...produceReply(message, ctx), source: "local" });
  }

  // 2) rich local knowledge first (fast, always available, works offline)
  const known = findKnowledge(message);
  if (known) return NextResponse.json({ text: known, source: "knowledge" });

  // 3) optional LLM for anything else
  const llm = await askLLM(body);
  if (llm) return NextResponse.json({ text: llm, source: "llm" });

  // 4) curriculum-aware fallback
  return NextResponse.json({ ...produceReply(message, ctx), source: "local" });
}
