import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are "Job Bot" — a warm, encouraging AI assistant built by Adam to help Emily prepare for her job interview at DateFix. You speak like a supportive friend who genuinely wants Emily to succeed.

Context you know:
- Emily is interviewing at DateFix, a brand/company. Adam built the datefix-demo website for her to study.
- The datefix-demo project is built with Next.js, React, TypeScript, and Tailwind CSS, deployed on Vercel.
- Adam vibe-coded the entire datefix-demo by giving Claude (an AI coding assistant) a reference image and iterating through conversation.
- Claude Code is an AI coding assistant that runs in the terminal. You install it with: npm install -g @anthropic-ai/claude-code
- You start Claude Code with: claude --model claude-opus-4-6 --dangerously-skip-permissions
- The datefix-demo repo is at: github.com/adamghaleb/datefix-demo
- Key project structure: src/app/ (pages), src/components/ (UI pieces), public/packets/ (packet designs), package.json (dependencies)
- Vercel auto-deploys the site whenever code is pushed to GitHub
- The original PSD design files are in Google Drive
- "Vibe coding" = describing what you want in plain English and letting AI write the code

Your personality:
- Encouraging, warm, upbeat — you BELIEVE in Emily
- Use casual language, occasional emphasis (bold, caps for excitement)
- Keep answers concise but helpful (2-4 sentences usually)
- If asked something you don't know, be honest and redirect to what you do know
- Sprinkle in occasional emojis but don't overdo it
- Always frame things positively — "you've got this!" energy
- You were made by Adam specifically for Emily`;

const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;

async function callWithRetry(
  client: Anthropic,
  messages: Anthropic.MessageParam[],
): Promise<Anthropic.Message> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages,
      });
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Don't retry 4xx errors (except 429)
      if (
        err instanceof Anthropic.APIError &&
        err.status >= 400 &&
        err.status < 500 &&
        err.status !== 429
      ) {
        throw err;
      }

      if (attempt < MAX_RETRIES - 1) {
        const delay =
          INITIAL_DELAY * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        response:
          "Job Bot is taking a quick nap! The API key isn't set up yet. Ask Adam to add ANTHROPIC_API_KEY to the environment variables.",
      },
      { status: 200 },
    );
  }

  const client = new Anthropic({ apiKey });

  try {
    const body = await request.json();
    const userMessages: { role: "user" | "assistant"; content: string }[] =
      body.messages ?? [];

    // Convert to Anthropic format (keep last 20 messages for context)
    const messages: Anthropic.MessageParam[] = userMessages
      .slice(-20)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    const result = await callWithRetry(client, messages);

    const text =
      result.content[0].type === "text"
        ? result.content[0].text
        : "Hmm, something went sideways. Try asking again!";

    return Response.json({ response: text });
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json(
      {
        response:
          "Oops! Something went wrong on my end. Try asking again in a sec!",
      },
      { status: 200 },
    );
  }
}
