import { QuizCard } from "@/types";

export const quizCards: QuizCard[] = [
  {
    id: 1,
    question: "What is GitHub?",
    answer:
      "A platform where developers store and share code — like Google Drive for code projects.",
    term: "GitHub",
    shortDef: "Cloud platform for storing and sharing code",
    distractors: [
      "A text editor for writing code on your computer",
      "A programming language used to build websites",
      "A chat app for software teams",
    ],
    category: "github",
  },
  {
    id: 2,
    question: "What is a repository?",
    answer:
      "A project folder that lives on GitHub. It contains all the code, images, and config files for a project.",
    term: "Repository",
    shortDef: "A project folder hosted on GitHub",
    distractors: [
      "A backup copy of your computer's hard drive",
      "A list of programming languages you know",
      "A tool that checks your code for errors",
    ],
    category: "github",
  },
  {
    id: 3,
    question: "What does 'git clone' do?",
    answer:
      "Downloads a copy of a GitHub repository to your local computer so you can work on it.",
    term: "Git Clone",
    shortDef: "Downloads a repo to your computer",
    distractors: [
      "Uploads your local files to GitHub",
      "Deletes a repository from GitHub",
      "Creates a new empty repository on GitHub",
    ],
    category: "github",
  },
  {
    id: 4,
    question: "What is Claude Code?",
    answer:
      "An AI coding assistant that runs in your terminal. It can read files, write code, and run commands through conversation.",
    term: "Claude Code",
    shortDef: "AI coding assistant in the terminal",
    distractors: [
      "A website builder with drag-and-drop templates",
      "A text editor similar to VS Code",
      "A cloud hosting service for websites",
    ],
    category: "claude",
  },
  {
    id: 5,
    question: "What is vibe coding?",
    answer:
      "Describing what you want in plain English and letting an AI (like Claude) write the code for you.",
    term: "Vibe Coding",
    shortDef: "Describing what you want and AI writes the code",
    distractors: [
      "Writing code while listening to music",
      "Copying and pasting code from Stack Overflow",
      "Programming using only keyboard shortcuts",
    ],
    category: "claude",
  },
  {
    id: 6,
    question: "What is Vercel?",
    answer:
      "A hosting platform that auto-deploys your website every time you push code to GitHub.",
    term: "Vercel",
    shortDef: "Hosting platform with auto-deploy from GitHub",
    distractors: [
      "A version control system for tracking code changes",
      "A database service for storing user information",
      "A design tool for creating website mockups",
    ],
    category: "vercel",
  },
  {
    id: 7,
    question: "What is the terminal?",
    answer:
      "A text-based interface to talk to your computer. You use it to run commands like git, npm, and Claude Code.",
    term: "Terminal",
    shortDef: "Text-based interface for running commands",
    distractors: [
      "The screen where you see your website preview",
      "A wireless device for connecting to the internet",
      "The address bar in your web browser",
    ],
    category: "terminal",
  },
  {
    id: 8,
    question: "What is npm?",
    answer:
      "Node Package Manager — a tool that installs libraries and tools that your project needs to run.",
    term: "npm",
    shortDef: "Tool that installs project libraries and tools",
    distractors: [
      "A programming language for building mobile apps",
      "A file format for saving images on the web",
      "A security tool that scans code for vulnerabilities",
    ],
    category: "terminal",
  },
  {
    id: 9,
    question: "What is package.json?",
    answer:
      "A file that lists all the tools and libraries a project needs. Running 'npm install' reads it and downloads everything.",
    term: "package.json",
    shortDef: "File listing all project dependencies",
    distractors: [
      "A file that stores your website's text content",
      "A database file where user data is saved",
      "A configuration file for your computer's settings",
    ],
    category: "terminal",
  },
  {
    id: 10,
    question: "What is an IDE?",
    answer:
      "Integrated Development Environment — a fancy code editor with features like auto-complete, debugging, and file browsing. VS Code is the most popular one.",
    term: "IDE",
    shortDef: "Code editor with built-in developer tools",
    distractors: [
      "A type of internet connection for downloading files",
      "A cloud service for running server applications",
      "A testing framework for checking code quality",
    ],
    category: "terminal",
  },
  {
    id: 11,
    question: "What is Next.js?",
    answer:
      "A React framework for building websites. It handles routing, server rendering, and optimization so you don't have to do it manually.",
    term: "Next.js",
    shortDef: "React framework for building modern websites",
    distractors: [
      "A mobile app development platform by Apple",
      "A database management system",
      "A CSS library for styling web pages",
    ],
    category: "datefix",
  },
  {
    id: 12,
    question: "What is React?",
    answer:
      "A JavaScript library for building user interfaces. It lets you create reusable components (buttons, cards, layouts) that update automatically.",
    term: "React",
    shortDef: "JavaScript library for building UIs with components",
    distractors: [
      "A programming language for creating databases",
      "A tool for deploying websites to the internet",
      "A version control system for tracking file changes",
    ],
    category: "datefix",
  },
  {
    id: 13,
    question: "What is a component?",
    answer:
      "A reusable piece of UI — like a button, card, or header. You build them once and use them anywhere in your project.",
    term: "Component",
    shortDef: "Reusable piece of UI like a button or card",
    distractors: [
      "A file that stores your project's color scheme",
      "A command that deploys your website",
      "A branch in your GitHub repository",
    ],
    category: "datefix",
  },
  {
    id: 14,
    question: "What is Tailwind CSS?",
    answer:
      "A CSS framework where you style elements using small utility classes directly in your HTML, like 'bg-blue-500' or 'text-center'.",
    term: "Tailwind CSS",
    shortDef: "Utility-first CSS framework for styling",
    distractors: [
      "A JavaScript testing library for components",
      "A cloud platform for hosting databases",
      "A tool for compressing images on websites",
    ],
    category: "datefix",
  },
  {
    id: 15,
    question: "What is deployment?",
    answer:
      "The process of putting your website on the internet so anyone can visit it. Vercel does this automatically when you push code to GitHub.",
    term: "Deployment",
    shortDef: "Putting your website live on the internet",
    distractors: [
      "The process of writing test cases for your code",
      "Downloading a project from GitHub to your computer",
      "Creating a new branch to work on a feature",
    ],
    category: "vercel",
  },
  {
    id: 16,
    question: "What is an AI model?",
    answer:
      "A trained AI brain that can understand and generate text, code, or images. Claude is a model — different versions (Haiku, Sonnet, Opus) have different capabilities.",
    term: "AI Model",
    shortDef: "Trained AI brain that generates text, code, or images",
    distractors: [
      "A 3D wireframe mockup of a website design",
      "A template file used to create new projects",
      "A diagram showing how data flows through an app",
    ],
    category: "claude",
  },
  {
    id: 17,
    question: "What is Claude Opus?",
    answer:
      "Anthropic's most powerful AI model. It's the smartest and most capable, best for complex coding and reasoning tasks.",
    term: "Claude Opus",
    shortDef: "Anthropic's most powerful and capable AI model",
    distractors: [
      "A lightweight model designed for quick simple tasks",
      "An image-generation AI that creates artwork",
      "A free open-source alternative to ChatGPT",
    ],
    category: "claude",
  },
  {
    id: 18,
    question: "What is Claude Haiku?",
    answer:
      "Anthropic's fastest and cheapest AI model. Great for simple tasks where you need quick responses without high cost.",
    term: "Claude Haiku",
    shortDef: "Anthropic's fastest and cheapest AI model",
    distractors: [
      "The most powerful model for complex coding tasks",
      "A tool for generating images from text prompts",
      "A code review bot that checks for security issues",
    ],
    category: "claude",
  },
  {
    id: 19,
    question: "What is an API?",
    answer:
      "Application Programming Interface — a way for two programs to talk to each other. Like ordering from a menu: you send a request, you get a response.",
    term: "API",
    shortDef: "Way for programs to send requests and get responses",
    distractors: [
      "A programming language used for data science",
      "A type of database that stores files in the cloud",
      "A visual tool for designing website layouts",
    ],
    category: "terminal",
  },
  {
    id: 20,
    question: "What is 'git push'?",
    answer:
      "A command that uploads your local code changes to GitHub so others can see them and Vercel can auto-deploy.",
    term: "Git Push",
    shortDef: "Uploads your local changes to GitHub",
    distractors: [
      "Downloads the latest code from GitHub to your computer",
      "Creates a new branch in your repository",
      "Deletes files that you no longer need",
    ],
    category: "github",
  },
  {
    id: 21,
    question: "What is a branch?",
    answer:
      "A parallel version of your code. You create branches to work on new features without affecting the main version.",
    term: "Branch",
    shortDef: "Parallel version of code for safe changes",
    distractors: [
      "A folder where images are stored in a project",
      "A backup of your entire repository",
      "A command that installs new packages",
    ],
    category: "github",
  },
  {
    id: 22,
    question: "How was datefix-demo built?",
    answer:
      "Adam vibe-coded it! He gave Claude a reference image and asked it to recreate the design, then iterated through conversation.",
    term: "datefix-demo",
    shortDef: "Built by vibe coding with Claude from a reference image",
    distractors: [
      "It was hand-coded line by line over several months",
      "It was generated by a Figma-to-code plugin",
      "It was built using a WordPress template",
    ],
    category: "datefix",
  },
  {
    id: 23,
    question: "What is TypeScript?",
    answer:
      "JavaScript with types — it adds type checking so you catch bugs before running your code. Most modern projects use it.",
    term: "TypeScript",
    shortDef: "JavaScript with type checking to catch bugs early",
    distractors: [
      "A note-taking app for developers",
      "A CSS framework for responsive layouts",
      "A database query language like SQL",
    ],
    category: "terminal",
  },
  {
    id: 24,
    question: "What is an image model?",
    answer:
      "An AI that generates images from text descriptions. Examples include DALL-E, Midjourney, and Stable Diffusion.",
    term: "Image Model",
    shortDef: "AI that generates images from text prompts",
    distractors: [
      "A tool for compressing photos to reduce file size",
      "A Photoshop filter for enhancing photos",
      "A file format for storing vector graphics",
    ],
    category: "claude",
  },
  {
    id: 25,
    question: "What is an AI agent?",
    answer:
      "An AI that can take actions on its own — like reading files, running commands, and making decisions — not just answer questions.",
    term: "AI Agent",
    shortDef: "AI that takes actions autonomously, not just answers",
    distractors: [
      "A human who reviews AI-generated code",
      "A chatbot that only answers pre-written FAQs",
      "A plugin that adds AI features to Photoshop",
    ],
    category: "claude",
  },
  {
    id: 26,
    question: "What does 'npm install' do?",
    answer:
      "Reads package.json and downloads all the libraries and tools your project depends on into a node_modules folder.",
    term: "npm install",
    shortDef: "Downloads all project dependencies",
    distractors: [
      "Uploads your project to a hosting platform",
      "Creates a new project from a template",
      "Runs your website in a local preview mode",
    ],
    category: "terminal",
  },
  {
    id: 27,
    question: "What is localhost?",
    answer:
      "Your own computer acting as a web server. When you run 'npm run dev', you can see your site at localhost:3000 before it's deployed.",
    term: "Localhost",
    shortDef: "Your computer acting as a local web server",
    distractors: [
      "The main server where GitHub stores all repositories",
      "A public URL where anyone can view your site",
      "A tool for testing website speed and performance",
    ],
    category: "terminal",
  },
  {
    id: 28,
    question: "What is a prompt?",
    answer:
      "The text you type to tell an AI what to do. Better prompts give better results — be specific about what you want.",
    term: "Prompt",
    shortDef: "Text instruction you give to an AI",
    distractors: [
      "A pop-up notification on your phone",
      "The loading screen while a website is starting",
      "A keyboard shortcut to open the terminal",
    ],
    category: "claude",
  },
  {
    id: 29,
    question: "What is auto-deploy?",
    answer:
      "When Vercel automatically rebuilds and publishes your website every time you push new code to GitHub. No manual steps needed.",
    term: "Auto-Deploy",
    shortDef: "Automatic website updates when code is pushed",
    distractors: [
      "A tool that writes code for you automatically",
      "A backup system that saves your files every hour",
      "A GitHub feature that merges branches automatically",
    ],
    category: "vercel",
  },
  {
    id: 30,
    question: "What is a commit?",
    answer:
      "A saved snapshot of your code changes with a message describing what you changed. Like a save point in a video game.",
    term: "Commit",
    shortDef: "Saved snapshot of code changes with a message",
    distractors: [
      "A request to merge your code into the main branch",
      "A comment left on someone else's code",
      "A notification that your deployment is ready",
    ],
    category: "github",
  },
];
