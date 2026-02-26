import { QuizCard } from "@/types";

export const quizCards: QuizCard[] = [
  {
    id: 1,
    question: "What is GitHub?",
    answer:
      "A platform where developers store and share code — like Google Drive for code projects.",
    category: "github",
  },
  {
    id: 2,
    question: 'What is a "repository"?',
    answer:
      "A project folder that lives on GitHub. It contains all the code, images, and config files for a project.",
    category: "github",
  },
  {
    id: 3,
    question: "What does 'git clone' do?",
    answer:
      "Downloads a copy of a GitHub repository to your local computer so you can work on it.",
    category: "github",
  },
  {
    id: 4,
    question: "What command installs Claude Code?",
    answer: "npm install -g @anthropic-ai/claude-code",
    category: "claude",
  },
  {
    id: 5,
    question: "What is Claude Code?",
    answer:
      "An AI coding assistant that runs in your terminal. It can read files, write code, and run commands through conversation.",
    category: "claude",
  },
  {
    id: 6,
    question: 'What is "vibe coding"?',
    answer:
      "Describing what you want in plain English and letting an AI (like Claude) write the code for you.",
    category: "claude",
  },
  {
    id: 7,
    question: "How was datefix-demo built?",
    answer:
      "Adam vibe-coded it! He gave Claude a reference image and asked it to recreate the design, then iterated through conversation.",
    category: "datefix",
  },
  {
    id: 8,
    question: "Where do components live in the project?",
    answer:
      "In the src/components/ folder. Each component is a reusable piece of UI like a button or card.",
    category: "datefix",
  },
  {
    id: 9,
    question: "Where are the packet design images stored?",
    answer: "In the public/packets/ folder inside the datefix-demo project.",
    category: "datefix",
  },
  {
    id: 10,
    question: "What is Vercel?",
    answer:
      "A hosting platform that auto-deploys your website every time you push code to GitHub. No manual uploading needed.",
    category: "vercel",
  },
  {
    id: 11,
    question: "How do changes go live on the website?",
    answer:
      "Push code to GitHub → Vercel detects the change → automatically rebuilds and deploys the site.",
    category: "vercel",
  },
  {
    id: 12,
    question: "What does the terminal do?",
    answer:
      "It's a text-based interface to talk to your computer. You use it to run commands like git, npm, and Claude Code.",
    category: "terminal",
  },
  {
    id: 13,
    question: "What is package.json?",
    answer:
      "A file that lists all the tools and libraries a project needs. Running 'npm install' reads it and downloads everything.",
    category: "terminal",
  },
  {
    id: 14,
    question: "What are PSD files?",
    answer:
      "Photoshop design files — the original source designs that the datefix-demo was built from. Stored in Google Drive.",
    category: "datefix",
  },
  {
    id: 15,
    question: "What 3 commands push your changes to GitHub?",
    answer: 'git add .\ngit commit -m "message"\ngit push',
    category: "github",
  },
];
