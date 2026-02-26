export interface TutorialStep {
  id: number;
  title: string;
  description: string;
  code?: string;
  link?: { url: string; label: string };
  links?: { url: string; label: string }[];
  icon: string;
}

export interface FaqEntry {
  keywords: string[];
  response: string;
}

export interface QuizCard {
  id: number;
  question: string;
  answer: string;
  category: "github" | "claude" | "datefix" | "terminal" | "vercel";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
