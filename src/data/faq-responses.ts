import { FaqEntry } from "@/types";

export const faqResponses: FaqEntry[] = [
  {
    keywords: ["hello", "hi", "hey", "sup", "what's up"],
    response:
      "Hey Emily! I'm here to help you with anything about the datefix-demo project, GitHub, Claude Code, or anything else. What's on your mind?",
  },
  {
    keywords: ["github", "git hub", "account"],
    response:
      "GitHub is like Google Drive but for code! Head to github.com/signup to create a free account. You'll use it to access the datefix-demo project and track any changes you make.",
  },
  {
    keywords: ["repo", "repository", "what is a repo"],
    response:
      'A repository (or "repo") is just a project folder that lives on GitHub. The datefix-demo repo has all the code, images, and config files. You can browse it at github.com/adamghaleb/datefix-demo.',
  },
  {
    keywords: ["clone", "download", "get the code", "get the project"],
    response:
      'To get the project on your computer, open your terminal and run:\n\ngit clone https://github.com/adamghaleb/datefix-demo.git\n\nThis downloads everything into a "datefix-demo" folder.',
  },
  {
    keywords: ["install", "claude code", "npm install"],
    response:
      "To install Claude Code, run this in your terminal:\n\nnpm install -g @anthropic-ai/claude-code\n\nYou'll need Node.js installed first. If you don't have it, download it from nodejs.org.",
  },
  {
    keywords: ["start claude", "run claude", "magic command", "launch claude"],
    response:
      "Once Claude Code is installed, cd into the datefix-demo folder and run:\n\nclaude --model claude-opus-4-6 --dangerously-skip-permissions\n\nThis starts Claude in full-auto mode so it can make changes without asking for approval each time.",
  },
  {
    keywords: ["terminal", "command line", "cmd", "shell", "console"],
    response:
      "The terminal is a text-based way to talk to your computer. On Mac, open the Terminal app (search for it in Spotlight). On Windows, use PowerShell or Windows Terminal. It's where you'll run git and Claude Code commands.",
  },
  {
    keywords: ["node", "nodejs", "node.js", "npm"],
    response:
      "Node.js is what lets you run JavaScript outside a browser. You need it for Claude Code and the datefix-demo project. Download it from nodejs.org — get the LTS (Long Term Support) version.",
  },
  {
    keywords: ["vercel", "deploy", "hosting", "live", "website url"],
    response:
      "Vercel is where the datefix-demo is hosted live. It's connected to GitHub, so when you push code changes, Vercel automatically rebuilds the site. No manual uploading — just push to GitHub and it goes live!",
  },
  {
    keywords: ["psd", "photoshop", "design file", "google drive", "drive"],
    response:
      "The original Photoshop (.psd) design files are in Google Drive. These are the source-of-truth designs that the demo was built from. Ask Adam for the Drive link if you need them!",
  },
  {
    keywords: ["vibe coding", "vibe code", "how to code", "prompt"],
    response:
      'Vibe coding is when you describe what you want in plain English and let Claude write the code. For example, you can say "make the header pink" or "add a contact form" and Claude will figure out the code. It\'s how Adam built the entire datefix-demo!',
  },
  {
    keywords: ["change", "edit", "modify", "update the site"],
    response:
      'To make changes: 1) Clone the repo, 2) cd into the folder, 3) Start Claude Code, 4) Tell it what you want in plain English! Try things like "change the background color" or "add a new section." Claude handles the code.',
  },
  {
    keywords: ["push", "git push", "upload", "save changes"],
    response:
      'After making changes, push them to GitHub with these commands:\n\ngit add .\ngit commit -m "your message here"\ngit push\n\nOnce pushed, Vercel will auto-deploy your changes!',
  },
  {
    keywords: ["branch", "git branch"],
    response:
      "A branch is like a parallel version of your project. The main branch is the live version. You can create a new branch to experiment without affecting the live site. Claude can help you with this!",
  },
  {
    keywords: ["component", "components"],
    response:
      "Components are reusable pieces of UI — like a button, a card, or a navigation bar. In datefix-demo, they live in the src/components/ folder. Each component is its own file that you can use anywhere in the app.",
  },
  {
    keywords: ["package", "package.json", "dependencies"],
    response:
      "package.json is like a recipe card for the project. It lists all the tools and libraries the project needs. When you run 'npm install', it reads this file and downloads everything automatically.",
  },
  {
    keywords: ["src", "folder", "structure", "files"],
    response:
      "The main folders are:\n- src/app/ — the pages\n- src/components/ — reusable UI pieces\n- public/packets/ — design images\n- public/ — static files like logos\n\nMost of your changes will be in src/app/ and src/components/.",
  },
  {
    keywords: ["error", "bug", "broken", "not working", "help"],
    response:
      "Don't panic! Errors are normal in coding. Try these steps:\n1) Read the error message carefully — it usually tells you what's wrong\n2) Ask Claude Code to fix it — paste the error and say \"fix this\"\n3) If Claude is stuck, try restarting it\n4) Worst case, you can always re-clone the repo for a fresh start",
  },
  {
    keywords: ["api", "key", "anthropic", "api key"],
    response:
      "To use Claude Code, you need an Anthropic API key. You can get one at console.anthropic.com. Claude Code will ask for it the first time you run it. Keep your API key secret — don't share it or commit it to GitHub!",
  },
  {
    keywords: ["css", "style", "color", "font", "design"],
    response:
      "The datefix-demo uses Tailwind CSS for styling. Instead of writing CSS files, you add utility classes directly to HTML elements. But with Claude Code, you don't need to know Tailwind — just describe what you want and Claude writes the classes!",
  },
  {
    keywords: ["tailwind", "tw"],
    response:
      "Tailwind CSS is a utility-first CSS framework used in datefix-demo. Instead of writing traditional CSS, you use pre-built classes like 'bg-blue-500' or 'text-lg'. But don't worry — Claude Code knows Tailwind and will write the classes for you!",
  },
  {
    keywords: ["next", "nextjs", "next.js", "framework"],
    response:
      "Next.js is the React framework that datefix-demo is built with. It handles routing, page rendering, and optimization. You don't need to understand it deeply — Claude Code knows Next.js inside and out.",
  },
  {
    keywords: ["image", "logo", "photo", "picture"],
    response:
      "Images in the project go in the public/ folder. Reference them in code with paths like '/logo.png'. The packet designs are in public/packets/. You can ask Claude to add or swap images for you!",
  },
  {
    keywords: ["interview", "datefix", "job", "prepare"],
    response:
      "You've got this, Emily! For the interview, make sure you can explain: what the datefix-demo is, how it was built (vibe coding with Claude), and how changes get deployed (push to GitHub → Vercel auto-deploys). Being able to demo small changes live would be impressive!",
  },
  {
    keywords: ["thank", "thanks", "awesome", "great", "cool"],
    response:
      "You're welcome! You're doing great. Remember, everyone starts somewhere and the fact that you're learning this stuff puts you ahead. Keep going! 💪",
  },
];

export const fallbackResponse =
  "Hmm, I'm not sure about that one! Here's what I can help with:\n\n- GitHub basics (accounts, repos, cloning)\n- Claude Code (installing, running, prompts)\n- datefix-demo project (structure, files, making changes)\n- Terminal commands\n- Vercel deployment\n- Vibe coding tips\n\nTry asking about any of those topics!";
