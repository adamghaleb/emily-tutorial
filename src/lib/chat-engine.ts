import { faqResponses, fallbackResponse } from "@/data/faq-responses";

export function getResponse(input: string): string {
  const normalized = input.toLowerCase().trim();

  let bestMatch: { response: string; matchCount: number } | null = null;

  for (const entry of faqResponses) {
    const matchCount = entry.keywords.filter((kw) =>
      normalized.includes(kw.toLowerCase()),
    ).length;

    if (matchCount > 0 && (!bestMatch || matchCount > bestMatch.matchCount)) {
      bestMatch = { response: entry.response, matchCount };
    }
  }

  return bestMatch?.response ?? fallbackResponse;
}
