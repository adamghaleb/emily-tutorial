import { QuizCard } from "@/types";

export const quizCards: QuizCard[] = [
  // --- GitHub & Git Basics ---
  {
    id: 1,
    question: "What is GitHub?",
    answer:
      "A cloud platform where developers store, share, and collaborate on code projects together.",
    term: "GitHub",
    shortDef: "Cloud platform for storing and sharing code",
    distractors: [
      "A desktop application for editing images and design files on your computer",
      "A programming language used to build interactive websites and mobile apps",
      "A cloud service for hosting databases and managing user authentication",
    ],
    category: "github",
  },
  {
    id: 2,
    question: "What is a repository (repo)?",
    answer:
      "A project folder hosted on GitHub that contains all the code, images, and config files for a project.",
    term: "Repository",
    shortDef: "A project folder hosted on GitHub",
    distractors: [
      "A backup system that automatically saves copies of your entire computer's hard drive",
      "A testing environment where you can preview websites before they go live online",
      "A tool that scans your code for security vulnerabilities and performance issues",
    ],
    category: "github",
  },
  {
    id: 3,
    question: "What does 'git clone' do?",
    answer:
      "Downloads a full copy of a GitHub repository to your local computer so you can work on it.",
    term: "Git Clone",
    shortDef: "Downloads a repo to your computer",
    distractors: [
      "Uploads all of your local project files to a new repository on GitHub's servers",
      "Creates a separate branch in the repository so you can test changes safely",
      "Compares two versions of your code and highlights every line that changed",
    ],
    category: "github",
  },
  {
    id: 4,
    question: "What does 'git push' do?",
    answer:
      "Uploads your local code changes to GitHub so others can see them and Vercel can auto-deploy.",
    term: "Git Push",
    shortDef: "Uploads local changes to GitHub",
    distractors: [
      "Downloads the latest version of someone else's code from GitHub to your machine",
      "Merges two separate branches of code together into one unified version",
      "Reverts your project back to a previous saved snapshot of the codebase",
    ],
    category: "github",
  },
  {
    id: 5,
    question: "What is a commit?",
    answer:
      "A saved snapshot of your code changes with a message describing what you changed — like a save point.",
    term: "Commit",
    shortDef: "Saved snapshot of code changes with a message",
    distractors: [
      "A request you submit asking someone to review and approve your code changes",
      "A notification that your website has been successfully deployed to the internet",
      "A comment you leave on someone else's code to suggest improvements or fixes",
    ],
    category: "github",
  },

  // --- Claude & AI ---
  {
    id: 6,
    question: "What is Claude Code?",
    answer:
      "An AI coding assistant that runs in your terminal — it can read files, write code, and run commands.",
    term: "Claude Code",
    shortDef: "AI coding assistant in the terminal",
    distractors: [
      "A visual website builder where you drag and drop elements to create page layouts",
      "A cloud-based code editor similar to VS Code that runs entirely in your browser",
      "A command-line tool that checks your code for syntax errors and security issues",
    ],
    category: "claude",
  },
  {
    id: 7,
    question: "What is vibe coding?",
    answer:
      "Describing what you want in plain English and letting an AI like Claude write all the actual code.",
    term: "Vibe Coding",
    shortDef: "Describing what you want and AI writes the code",
    distractors: [
      "A coding style where you write everything from scratch without using any external libraries",
      "A technique where you copy working code snippets from documentation and adapt them",
      "A method of pair programming where two developers alternate writing each function",
    ],
    category: "claude",
  },
  {
    id: 8,
    question: "What is an AI model?",
    answer:
      "A trained AI brain that can understand and generate text, code, or images — like Claude or GPT.",
    term: "AI Model",
    shortDef: "Trained AI brain that generates text, code, or images",
    distractors: [
      "A 3D wireframe mockup that designers use to preview how a website will look",
      "A reusable template file that automatically generates new project folder structures",
      "A diagram that maps out how data flows between different parts of an application",
    ],
    category: "claude",
  },
  {
    id: 9,
    question: "What is a prompt?",
    answer:
      "The text instruction you give to an AI telling it what to do — better prompts get better results.",
    term: "Prompt",
    shortDef: "Text instruction you give to an AI",
    distractors: [
      "A pop-up confirmation dialog that appears before you delete files from your project",
      "The blinking cursor in the terminal that indicates it's ready for your next command",
      "A loading indicator that shows the progress of a website deployment in real time",
    ],
    category: "claude",
  },
  {
    id: 10,
    question: "What is Claude Opus?",
    answer:
      "Anthropic's most powerful AI model — the smartest and most capable, best for complex coding tasks.",
    term: "Claude Opus",
    shortDef: "Anthropic's most powerful and capable AI model",
    distractors: [
      "A lightweight and fast AI model designed specifically for quick, simple chat responses",
      "An open-source image generation tool that creates artwork from text descriptions",
      "A browser extension that auto-completes code suggestions while you type in editors",
    ],
    category: "claude",
  },

  // --- DateFix Build Process ---
  {
    id: 11,
    question: "What tool generated the original DateFix product images?",
    answer:
      "Nano Banana — an AI image generation tool that created product photography-style images of the pouches.",
    term: "Nano Banana",
    shortDef: "AI tool that generated the DateFix product images",
    distractors: [
      "Midjourney — a popular AI art generator known for its photorealistic style and composition",
      "Adobe Firefly — the built-in AI image generator that comes packaged with Photoshop",
      "Stable Diffusion — an open-source model that runs locally on your own computer",
    ],
    category: "datefix",
  },
  {
    id: 14,
    question: "What is the 'Blend If' technique used for in the DateFix build?",
    answer:
      "A Photoshop blending option that feathers away white backgrounds smoothly by splitting the white slider.",
    term: "Blend If",
    shortDef: "Photoshop technique to feather away white backgrounds",
    distractors: [
      "A CSS filter property that blends two overlapping elements together with adjustable opacity",
      "A color grading tool that shifts the hue and saturation of an image to match brand colors",
      "A Photoshop layer style that creates a smooth gradient transition between two separate layers",
    ],
    category: "datefix",
  },
  {
    id: 16,
    question: "What is the 'Overlap Layer Trick' in the DateFix build?",
    answer:
      "Splitting an ingredient into a bottom layer (behind the packet) and a top layer (in front) for depth.",
    term: "Overlap Layer Trick",
    shortDef: "Split ingredient into bottom + top layers for depth",
    distractors: [
      "Duplicating the packet image and blurring one copy to create a soft drop shadow behind it",
      "Using CSS clip-path to cut the ingredient image into two halves positioned side by side",
      "Stacking two copies of the same image with different opacity levels to simulate translucency",
    ],
    category: "datefix",
  },
  {
    id: 20,
    question: "What did Adam's custom debug menu include?",
    answer:
      "Layout controls, reference image toggle, per-flavor scale/position sliders, and a copy-config button.",
    term: "Debug Menu",
    shortDef: "Custom sliders, toggles, and copy-config for visual tuning",
    distractors: [
      "Automated test runners, code coverage reports, error logging panels, and performance profiling",
      "Browser DevTools integration, network request monitoring, CSS inspection, and memory analysis",
      "Git commit history, branch switching, file comparison diffs, and merge conflict resolution tools",
    ],
    category: "datefix",
  },
  {
    id: 22,
    question: "What was the core iteration workflow in the DateFix build?",
    answer:
      "Visually tweak with debug tools → copy the config values → paste them back into the source code.",
    term: "Debug Iteration",
    shortDef: "Visual tweaking → copy config → paste into code",
    distractors: [
      "Write CSS values by hand → refresh the browser → compare against the Figma design mockup",
      "Export assets from Photoshop → import into React → adjust component props until they match",
      "Run automated layout tests → review the pixel diff report → fix any failing alignment checks",
    ],
    category: "datefix",
  },

  // --- Tech Stack & Tools ---
  {
    id: 24,
    question: "What is Next.js?",
    answer:
      "A React framework for building websites — it handles routing, server rendering, and optimization automatically.",
    term: "Next.js",
    shortDef: "React framework for building modern websites",
    distractors: [
      "A standalone CSS library that provides pre-built responsive grid layouts and styled components",
      "A mobile app development platform created by Apple for building iOS and Android applications",
      "A backend server framework built on Python for creating REST APIs and database connections",
    ],
    category: "datefix",
  },
  {
    id: 25,
    question: "What is a component in React?",
    answer:
      "A reusable piece of UI — like a button, card, or header — that you build once and use anywhere.",
    term: "Component",
    shortDef: "Reusable piece of UI like a button or card",
    distractors: [
      "A configuration file that defines the color scheme and typography settings for your project",
      "A JavaScript function that sends data to a database and returns the results as a response",
      "A deployment step where your code gets bundled and optimized before being sent to the server",
    ],
    category: "datefix",
  },
  {
    id: 26,
    question: "What is Tailwind CSS?",
    answer:
      "A CSS framework where you style elements using utility classes directly in HTML, like 'bg-blue-500'.",
    term: "Tailwind CSS",
    shortDef: "Utility-first CSS framework for styling in HTML",
    distractors: [
      "A JavaScript animation library that handles complex transitions and motion effects on websites",
      "A React component library that provides pre-built buttons, modals, and navigation elements",
      "A CSS preprocessor that adds variables, nesting, and functions to standard stylesheet syntax",
    ],
    category: "datefix",
  },
  {
    id: 27,
    question: "What is Vercel?",
    answer:
      "A hosting platform that auto-deploys your website every time you push new code changes to GitHub.",
    term: "Vercel",
    shortDef: "Hosting platform with auto-deploy from GitHub",
    distractors: [
      "A version control system that tracks every change made to your codebase over its full history",
      "A cloud database service that stores user accounts, content, and application data securely",
      "A design collaboration tool where teams create and share interactive website prototypes",
    ],
    category: "vercel",
  },
  {
    id: 28,
    question: "What is the terminal?",
    answer:
      "A text-based interface to control your computer — you use it to run commands like git, npm, and Claude.",
    term: "Terminal",
    shortDef: "Text-based interface for running commands",
    distractors: [
      "The visual preview window where you can see how your website looks before deploying it live",
      "A wireless networking device that connects your computer to the internet through your router",
      "The search bar at the top of your web browser where you type URLs to visit websites",
    ],
    category: "terminal",
  },
  {
    id: 29,
    question: "What does 'npm install' do?",
    answer:
      "Reads package.json and downloads all the libraries and tools your project needs into node_modules.",
    term: "npm install",
    shortDef: "Downloads all project dependencies from package.json",
    distractors: [
      "Uploads your completed project files to a hosting platform and makes your website go live",
      "Creates a brand new project folder with starter files from a pre-configured template setup",
      "Runs a local development server so you can preview your website changes in the browser",
    ],
    category: "terminal",
  },
  {
    id: 30,
    question: "What are the 4 DateFix flavors and their brand colors?",
    answer:
      "Original (Light Blue), Ginger (Green), Turmeric (Orange), and Cinnamon (Pink) — each has a unique color.",
    term: "4 Flavors",
    shortDef: "Original, Ginger, Turmeric, Cinnamon — each with a brand color",
    distractors: [
      "Classic (Red), Tropical (Yellow), Berry (Purple), and Mint (Teal) — matching fruit-based themes",
      "Original (White), Ginger (Brown), Turmeric (Gold), and Cinnamon (Dark Red) — earth-tone palette",
      "Plain (Gray), Spicy (Orange), Herbal (Green), and Sweet (Pink) — based on ingredient categories",
    ],
    category: "datefix",
  },
];
