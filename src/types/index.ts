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
  /** Full question (used in Learn, Test, Flashcards) */
  question: string;
  /** Full answer / definition */
  answer: string;
  /** Short term for Match game tiles & Blast asteroids (e.g. "GitHub") */
  term: string;
  /** Short definition for Match game tiles & Blast asteroids */
  shortDef: string;
  /** 3 plausible wrong answers for multiple-choice modes */
  distractors: [string, string, string];
  category: "github" | "claude" | "datefix" | "terminal" | "vercel";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
