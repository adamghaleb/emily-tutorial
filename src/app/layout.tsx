import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const epilogue = localFont({
  src: [
    { path: "../fonts/Epilogue-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Epilogue-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Epilogue-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/Epilogue-Bold.ttf", weight: "700", style: "normal" },
    {
      path: "../fonts/Epilogue-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    { path: "../fonts/Epilogue-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-epilogue",
  display: "swap",
});

const bethany = localFont({
  src: "../fonts/Bethany Elingston.otf",
  variable: "--font-bethany",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emily's DateFix Tutorial",
  description:
    "A step-by-step guide to GitHub, Claude Code, and the datefix-demo project. You got this!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${epilogue.variable} ${bethany.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
