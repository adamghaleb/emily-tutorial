"use client";

import { playClick } from "@/lib/sounds";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Pin,
  Lightbulb,
  Target,
  Wrench,
  Globe,
} from "lucide-react";
import Image from "next/image";

interface BuildGuideProps {
  onBack: () => void;
}

const BRAND_COLORS = [
  { flavor: "Original", color: "#89B4D4", label: "Light Blue" },
  { flavor: "Ginger", color: "#7CB342", label: "Green" },
  { flavor: "Turmeric", color: "#F09819", label: "Orange" },
  { flavor: "Cinnamon", color: "#E879A8", label: "Pink" },
];

export function BuildGuide({ onBack }: BuildGuideProps) {
  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-border/50 bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            How DateFix Demo Was Built
          </h2>
          <p className="text-xs text-muted-foreground">
            The complete build breakdown
          </p>
        </div>
      </div>

      {/* PDF download button */}
      <a
        href="/build-guide/datefix-build-guide.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-2xl border border-datefix-blue/20 bg-datefix-blue/5 p-4 transition-all hover:bg-datefix-blue/10"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-datefix-blue/15">
          <FileText className="h-5 w-5 text-datefix-blue" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">
            Read Full Build Guide PDF
          </p>
          <p className="text-xs text-muted-foreground">
            18-page detailed breakdown with images
          </p>
        </div>
        <ExternalLink className="h-4 w-4 text-datefix-blue" />
      </a>

      {/* Visit demo button */}
      <a
        href="https://datefix-demo.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 rounded-2xl border border-datefix-pink/20 bg-datefix-pink/5 p-4 transition-all hover:bg-datefix-pink/10"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-datefix-pink/15">
          <Globe className="h-5 w-5 text-datefix-pink" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">
            Visit DateFix Demo
          </p>
          <p className="text-xs text-muted-foreground">
            See the live site this guide is about
          </p>
        </div>
        <ExternalLink className="h-4 w-4 text-datefix-pink" />
      </a>

      {/* Hero image */}
      <div className="overflow-hidden rounded-2xl border border-border/50">
        <Image
          src="/build-guide/landscape.png"
          alt="DateFix product lineup — Original, Ginger, Turmeric, Cinnamon"
          width={800}
          height={400}
          className="w-full"
          priority
        />
      </div>

      {/* Section 1: Overview */}
      <Section number={1} title="What Is the DateFix Demo?">
        <p>
          An interactive web page showcasing the DateFix product line — four
          date-based fruit gel pouches (Original, Ginger, Turmeric, Cinnamon).
          The tagline is &ldquo;Fresh Fruit Made To Go&rdquo;. Each pouch
          contains dates blended with orange blossom water.
        </p>
        <p>
          The goal was a polished, portfolio-quality brand demo with real
          product photography aesthetics, hover effects, and informational
          popups — all built entirely from <Strong>AI-generated imagery</Strong>{" "}
          + Photoshop + Claude Code.
        </p>
      </Section>

      {/* Packets row */}
      <div className="grid grid-cols-4 gap-3">
        {["original", "ginger", "turmeric", "cinnamon"].map((flavor) => (
          <div
            key={flavor}
            className="overflow-hidden rounded-xl border border-border/50 bg-card p-2"
          >
            <Image
              src={`/build-guide/${flavor}.webp`}
              alt={`${flavor} packet`}
              width={200}
              height={300}
              className="w-full"
            />
            <p className="mt-1 text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {flavor}
            </p>
          </div>
        ))}
      </div>

      {/* Section 2: Image Generation */}
      <Section number={2} title="Image Generation with AI">
        <p>
          Everything started with <Strong>Nano Banana</Strong> — an AI image
          generation tool. It created product photography-style images of all
          four DateFix pouches with their ingredients.
        </p>
        <Callout>
          First generation was portrait (1080x1920), then re-generated in
          landscape/horizontal for the web layout. The landscape version became
          the base image for extracting all individual assets.
        </Callout>
      </Section>

      {/* Section 3: Asset Extraction */}
      <Section number={3} title="Asset Extraction in Photoshop">
        <p>
          Each element — every packet and ingredient — needed to be isolated on
          its own transparent layer. Three masking techniques were used:
        </p>
        <ol className="ml-4 list-decimal space-y-2 text-sm text-muted-foreground">
          <li>
            <Strong>Manual Selection</Strong> — Pen tool or Lasso for
            clean-edged areas. Most precise but most time-consuming.
          </li>
          <li>
            <Strong>Select Color Range</Strong> — Photoshop&apos;s Select &rarr;
            Color Range to quickly grab the white background. Adjust Fuzziness
            to control the range.
          </li>
          <li>
            <Strong>Blend If (Blending Options)</Strong> — The key technique.
            Hold Alt/Option and drag the white slider to split it, creating a
            smooth feathered transition. This blends white backgrounds away
            seamlessly.
          </li>
        </ol>
        <Callout>
          8 total assets were extracted: 4 packets + 4 ingredients (dates,
          ginger, turmeric, cinnamon) — each on transparent backgrounds.
        </Callout>
      </Section>

      {/* Section 4: Asset Preparation */}
      <Section number={4} title="Asset Preparation">
        <p>
          Every asset needed the <Strong>exact same canvas size</Strong>. Why?
          Because in the web demo, each image is positioned relative to a common
          coordinate system. Mismatched sizes = misaligned content.
        </p>
        <Callout icon={<Lightbulb className="h-4 w-4" />}>
          <Strong>The Overlap Layer Trick:</Strong> For dates and cinnamon, the
          ingredient partially overlaps the packet. Solution: split into a{" "}
          <Strong>bottom layer</Strong> (behind the packet) and a{" "}
          <Strong>top layer</Strong> (just the overlapping part, in front).
          Sandwich the packet between them for a seamless depth illusion.
        </Callout>
      </Section>

      {/* Section 5: Project Setup */}
      <Section number={5} title="Project Setup">
        <p>
          A new folder (<code>datefix-demo</code>) was created and connected to
          GitHub. All PNG assets went into an assets folder.
        </p>
        <p>
          The project was built with <Strong>Claude Code</Strong> — Adam gave
          Claude a detailed brief with all the assets and described the desired
          layout, interactions, and visual style. A planning conversation
          generated a <code>ROADMAP.md</code>.
        </p>

        {/* Brand colors */}
        <div className="mt-3 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Brand Colors
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BRAND_COLORS.map(({ flavor, color, label }) => (
              <div
                key={flavor}
                className="flex items-center gap-2 rounded-xl border border-border/50 bg-card px-3 py-2"
              >
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <div>
                  <p className="text-xs font-bold text-foreground">{flavor}</p>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 6: Building the UI */}
      <Section number={6} title="Building the UI">
        <p>
          The key architectural decision was recreating Photoshop&apos;s layer
          system in the browser. Each flavor &ldquo;slot&rdquo; has four stacked
          layers:
        </p>
        <ol className="ml-4 list-decimal space-y-1.5 text-sm text-muted-foreground">
          <li>
            <Strong>Color overlay</Strong> — Duplicate of packet with brand
            color tint (glow/shadow effect)
          </li>
          <li>
            <Strong>Bottom ingredient</Strong> — Main ingredient behind the
            packet
          </li>
          <li>
            <Strong>Packet</Strong> — The actual product pouch
          </li>
          <li>
            <Strong>Top ingredient</Strong> — Overlap portion in front (dates
            &amp; cinnamon only)
          </li>
        </ol>
        <Callout icon={<Target className="h-4 w-4" />}>
          A reference image overlay technique was used for alignment — the
          original AI image at 30% opacity served as &ldquo;tracing paper&rdquo;
          to position each layer precisely.
        </Callout>
      </Section>

      {/* Section 7: Debug Menu */}
      <Section number={7} title="Custom Debug Tools">
        <p>
          Adam built a <Strong>custom debug menu</Strong> (press <code>=</code>{" "}
          key) with:
        </p>
        <ul className="ml-4 list-disc space-y-1.5 text-sm text-muted-foreground">
          <li>Layout controls for spacing and positioning</li>
          <li>Reference image toggle with opacity, size, and offset sliders</li>
          <li>Per-flavor scale, X, and Y controls for each ingredient layer</li>
          <li>
            <Strong>Photoshop-style shadow panel</Strong> — offset, blur,
            spread, color, all in real-time
          </li>
          <li>
            <Strong>Copy Config button</Strong> — exports all visual settings to
            paste back into code
          </li>
        </ul>
        <Callout icon={<Wrench className="h-4 w-4" />}>
          This &ldquo;visual tweaking &rarr; copy config &rarr; paste into
          code&rdquo; workflow was the core iteration loop for pixel-perfect
          results.
        </Callout>
      </Section>

      {/* Section 8: Transform Controls */}
      <Section number={8} title="Photoshop-Style Transform Controls">
        <p>
          When sliders weren&apos;t precise enough,{" "}
          <Strong>drag handles</Strong> were built directly into the web page —
          the familiar bounding-box corners from Photoshop. Click any element to
          select it, drag corners to resize, drag center to reposition.
        </p>
        <Callout>
          Build custom tooling to solve specific problems! Rather than fighting
          CSS values, build visual tools that let you work the way you naturally
          think.
        </Callout>
      </Section>

      {/* Section 9: Interactivity */}
      <Section number={9} title="Interactivity & Polish">
        <ul className="ml-4 list-disc space-y-1.5 text-sm text-muted-foreground">
          <li>
            <Strong>Hover rise effect</Strong> — Packets smoothly lift up on
            hover
          </li>
          <li>
            <Strong>Color glow</Strong> — Brand-colored overlay becomes visible
            behind each packet
          </li>
          <li>
            <Strong>Flavor popups</Strong> — Click a packet for name,
            description, and flavor info
          </li>
          <li>
            <Strong>Reactive drop shadows</Strong> — Custom-tuned via the debug
            panel, respond to hover
          </li>
        </ul>
      </Section>

      {/* Section 10: The Pipeline */}
      <Section number={10} title="The Full Pipeline">
        <div className="space-y-3">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-datefix-gold/10 text-xs font-black text-datefix-gold">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Key Takeaways */}
      <div className="space-y-3 rounded-2xl border border-datefix-gold/30 bg-gradient-to-r from-datefix-gold/5 via-datefix-pink/5 to-datefix-blue/5 p-6">
        <h3 className="text-base font-extrabold text-foreground">
          Key Takeaways
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <Strong>AI is a starting point, not the final product.</Strong>{" "}
            AI-generated images still needed significant Photoshop work.
          </li>
          <li>
            <Strong>Build your own tools.</Strong> The debug menu and transform
            controls were custom-built for this project. When standard tools
            aren&apos;t enough, build your own.
          </li>
          <li>
            <Strong>Visual iteration &rarr; code export.</Strong> Work visually
            where your eyes judge quality, then programmatically lock in
            results.
          </li>
          <li>
            <Strong>Layer thinking translates.</Strong> Photoshop&apos;s layers
            map directly to CSS z-index stacking.
          </li>
          <li>
            <Strong>Consistent canvas sizes matter.</Strong> Same dimensions on
            every asset saves hours of alignment headaches.
          </li>
        </ul>
      </div>

      {/* Bottom PDF link */}
      <a
        href="/build-guide/datefix-build-guide.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-2xl bg-datefix-blue px-6 py-4 text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98]"
      >
        <FileText className="h-4 w-4" />
        Read Full Build Guide PDF (18 pages)
      </a>
    </div>
  );
}

/* ---- Helper Components ---- */

function Section({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-datefix-pink/10 text-xs font-black text-datefix-pink">
          {number}
        </div>
        <h3 className="text-base font-extrabold tracking-tight text-foreground">
          {title}
        </h3>
      </div>
      <div className="space-y-2 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-foreground">{children}</span>;
}

function Callout({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex gap-2 rounded-xl border border-datefix-gold/20 bg-datefix-gold/5 px-4 py-3">
      <span className="mt-0.5 shrink-0 text-datefix-gold">
        {icon ?? <Pin className="h-4 w-4" />}
      </span>
      <span className="text-sm text-muted-foreground">{children}</span>
    </div>
  );
}

/* ---- Pipeline Data ---- */

const PIPELINE_STEPS = [
  {
    title: "Generate",
    desc: "Use Nano Banana to create product photography images, then re-generate in landscape for web.",
  },
  {
    title: "Extract",
    desc: "Open in Photoshop. Use manual selection, Select Color Range, and Blend If to mask each element.",
  },
  {
    title: "Split Overlaps",
    desc: 'For ingredients overlapping packets (dates, cinnamon), cut the overlap onto a separate "top" layer.',
  },
  {
    title: "Standardize",
    desc: "Make every asset the exact same canvas size. Export all as PNGs with transparency.",
  },
  {
    title: "Collect Brand",
    desc: "Screenshot the logo from the official site. Color-pick each packet's brand color.",
  },
  {
    title: "Set Up Project",
    desc: "Create folder, connect to GitHub, add all assets. Brief Claude Code with the full spec.",
  },
  {
    title: "Build Layers",
    desc: "Assemble in HTML/CSS: color overlay → bottom ingredient → packet → top ingredient.",
  },
  {
    title: "Build Debug Tools",
    desc: "Create custom debug menu with layout sliders, shadow controls, and reference overlay.",
  },
  {
    title: "Align Visually",
    desc: "Use the reference overlay at low opacity as a guide. Adjust with debug tools until it matches.",
  },
  {
    title: "Copy Config",
    desc: "Export visual settings, feed them back into Claude Code to hard-code into the source.",
  },
  {
    title: "Add Interactivity",
    desc: "Implement hover rise, color glow, flavor popups, and reactive drop shadows.",
  },
  {
    title: "Polish & Ship",
    desc: "Remove debug tools from production, final QA, push to GitHub → auto-deploy to Vercel.",
  },
];
