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
    id: 12,
    question: "Why were the DateFix images regenerated in landscape format?",
    answer:
      "The landscape version became the base image for extracting all individual assets for the web layout.",
    term: "Landscape Regen",
    shortDef: "Base image for extracting individual web assets",
    distractors: [
      "The portrait images had low resolution artifacts that made them unsuitable for printing",
      "Landscape images load faster on mobile devices because they require less vertical scrolling",
      "The client specifically requested horizontal compositions for their social media marketing",
    ],
    category: "datefix",
  },
  {
    id: 13,
    question: "How many total assets were extracted from the DateFix image?",
    answer:
      "8 total — 4 packets (Original, Ginger, Turmeric, Cinnamon) plus 4 matching ingredient images.",
    term: "8 Assets",
    shortDef: "4 packets + 4 ingredients extracted from base image",
    distractors: [
      "12 total — 4 packets, 4 ingredients, and 4 background textures for each flavor variation",
      "6 total — 4 packets and 2 shared ingredient images that were reused across all flavors",
      "16 total — 4 packets, 4 ingredients, 4 shadows, and 4 color overlay layers for effects",
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
    id: 15,
    question: "Why did every DateFix asset need the exact same canvas size?",
    answer:
      "Because each image is positioned relative to a common coordinate system — mismatched sizes would misalign content.",
    term: "Same Canvas Size",
    shortDef: "Ensures proper alignment in the web coordinate system",
    distractors: [
      "Because the hosting platform Vercel has strict file size limits and rejects inconsistent image dimensions",
      "Because React components can only render images that share identical width and height properties",
      "Because the AI image generator only produces consistent quality when given uniform canvas inputs",
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
    id: 17,
    question: "Which ingredients needed the overlap layer trick?",
    answer:
      "Dates and cinnamon — their ingredients partially overlap the packet in the original image composition.",
    term: "Dates & Cinnamon",
    shortDef: "These ingredients overlap their packets in the image",
    distractors: [
      "Ginger and turmeric — their bright colors clashed with the packet design and needed separation",
      "All four ingredients — every flavor required the split technique for consistent visual quality",
      "Only the original flavor — the plain dates were the only ingredient touching the packet edge",
    ],
    category: "datefix",
  },
  {
    id: 18,
    question: "What are the 4 stacked layers for each DateFix flavor slot?",
    answer:
      "Color overlay (glow), bottom ingredient, the packet itself, and the top ingredient overlap layer.",
    term: "4 Layers",
    shortDef: "Color overlay → bottom ingredient → packet → top ingredient",
    distractors: [
      "Background gradient, packet shadow, the packet image, and a text label with the flavor name",
      "Ingredient photo, brand color border, the packet PNG, and an interactive hover tooltip overlay",
      "Base texture layer, color-tinted packet copy, ingredient cutout, and a transparent glass effect",
    ],
    category: "datefix",
  },
  {
    id: 19,
    question: "What was the reference image overlay technique used for?",
    answer:
      "The original AI image at 30% opacity served as 'tracing paper' to position each layer precisely.",
    term: "Reference Overlay",
    shortDef: "Original image at 30% opacity used as alignment guide",
    distractors: [
      "A grid of pixel-perfect guidelines that snapped each element into exact column-based positions",
      "A Figma design mockup imported as a background layer to compare against the live website",
      "A browser extension that highlights layout differences between the design file and live code",
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
    id: 21,
    question: "What key do you press to open the DateFix debug menu?",
    answer:
      "The equals key (=) — a quick keyboard shortcut to toggle the custom debug panel on and off.",
    term: "= Key",
    shortDef: "Keyboard shortcut to toggle the debug menu",
    distractors: [
      "The D key — a standard convention for debug menus used across most web development projects",
      "Ctrl+Shift+I — the same shortcut that opens the built-in browser developer tools panel",
      "The F12 key — a universal keyboard shortcut for accessing developer and debugging utilities",
    ],
    category: "datefix",
  },
  {
    id: 22,
    question: "What was the core iteration workflow in the DateFix build?",
    answer:
      "Visually tweak with debug tools → copy the config values → paste them back into the source code.",
    term: "Tweak → Copy → Paste",
    shortDef: "Visual tweaking → copy config → paste into code",
    distractors: [
      "Write CSS values by hand → refresh the browser → compare against the Figma design mockup",
      "Export assets from Photoshop → import into React → adjust component props until they match",
      "Run automated layout tests → review the pixel diff report → fix any failing alignment checks",
    ],
    category: "datefix",
  },
  {
    id: 23,
    question: "What interactive features were added to the DateFix demo?",
    answer:
      "Hover rise effect on packets, brand-colored glow, clickable flavor popups, and reactive drop shadows.",
    term: "Interactivity",
    shortDef: "Hover rise, color glow, flavor popups, drop shadows",
    distractors: [
      "Drag-and-drop packet sorting, animated cart system, checkout flow, and purchase confirmation",
      "Scrolling parallax background, sticky navigation header, animated counters, and a contact form",
      "Video autoplay on hover, audio narration for each flavor, swipe gestures, and a sharing modal",
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
