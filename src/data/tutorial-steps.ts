import { TutorialStep } from "@/types";

export const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Create a GitHub Account",
    description:
      "GitHub is where developers store and share code. Think of it like Google Drive, but for code projects. You'll need an account to access the datefix-demo project and eventually make your own changes.",
    icon: "github",
    link: { url: "https://github.com/signup", label: "Sign up for GitHub" },
  },
  {
    id: 2,
    title: "What is a Repository?",
    description:
      'A repository (or "repo") is just a project folder that lives in the cloud on GitHub. The datefix-demo repo contains all the code, images, and files for the DateFix demo website. When you visit github.com/adamghaleb/datefix-demo, you\'re looking at the repo.',
    icon: "folder-git",
    link: {
      url: "https://github.com/adamghaleb/datefix-demo",
      label: "View datefix-demo repo",
    },
  },
  {
    id: 3,
    title: "Install Claude Code",
    description:
      "Claude Code is an AI coding assistant that runs in your terminal. It can read your project files, write code, run commands, and help you build things — all from a simple chat interface. Install it with one command:",
    code: "npm install -g @anthropic-ai/claude-code",
    icon: "terminal",
  },
  {
    id: 4,
    title: "The Magic Command",
    description:
      "Once Claude Code is installed, you start it with this command. The \"--dangerously-skip-permissions\" flag lets Claude make changes without asking you to approve every single one. It's safe for learning — just don't use it on production projects!",
    code: "claude --model claude-opus-4-6 --dangerously-skip-permissions",
    icon: "sparkles",
  },
  {
    id: 5,
    title: "Clone the Repo",
    description:
      '"Cloning" means downloading a copy of the repo to your computer. Run this command in your terminal and it will create a datefix-demo folder with all the project files inside.',
    code: "git clone https://github.com/adamghaleb/datefix-demo.git",
    icon: "download",
  },
  {
    id: 6,
    title: "Project Structure Map",
    description:
      "Here's what's inside the datefix-demo folder:\n\n- src/app/ — the main pages of the website\n- src/components/ — reusable UI pieces (buttons, cards, layouts)\n- public/packets/ — the packet design images and assets\n- public/ — static files like logos and favicons\n- package.json — lists all the project dependencies",
    icon: "folder-tree",
  },
  {
    id: 7,
    title: "Making Changes with Claude",
    description:
      'This is where it gets fun! Once Claude Code is running inside the datefix-demo folder, you can ask it to make changes in plain English. This is called "vibe coding" — you describe what you want and Claude writes the code. Try prompts like:\n\n- "Change the header color to pink"\n- "Add a new section with team member photos"\n- "Make the logo bigger on mobile"',
    icon: "wand",
  },
  {
    id: 8,
    title: "How DateFix Demo Was Built",
    description:
      "Fun fact: Adam built the entire datefix-demo by vibe coding! He started with AI-generated product images, extracted assets in Photoshop, then assembled everything into an interactive web experience with Claude Code. He even built custom debug tools to align everything pixel-perfectly.",
    icon: "paintbrush",
    action: { label: "Learn More", actionId: "build-guide" },
    link: {
      url: "/build-guide/datefix-build-guide.pdf",
      label: "Read Full Build Guide PDF",
    },
  },
  {
    id: 9,
    title: "PSD Files & Google Drive",
    description:
      "The original Photoshop (.psd) design files for DateFix are stored in Google Drive. These are the source-of-truth designs that the demo was built from. Use the links below to access both folders:",
    icon: "file-image",
    links: [
      {
        url: "https://drive.google.com/drive/folders/1EheaO8m1LEVwBMuhmgYMeFhHjUhMBB8V?usp=sharing",
        label: "Assets",
      },
      {
        url: "https://drive.google.com/drive/folders/1qPPWLOLd6l9PSk5Y2eCl4lX0U7gc-uSJ?usp=sharing",
        label: ".PSDs",
      },
    ],
  },
  {
    id: 10,
    title: "Vercel Deployment",
    description:
      "Vercel is where the website is hosted live on the internet. The best part? It's connected to GitHub, so every time you push code changes to the repo, Vercel automatically rebuilds and deploys the site. No manual uploading needed — push to GitHub and your changes go live!",
    icon: "rocket",
    link: {
      url: "https://vercel.com",
      label: "Learn about Vercel",
    },
  },
];
