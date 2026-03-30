import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Job Assistant – Land Your Dream Job Faster",
  description:
    "Discover jobs, generate ATS-optimised resumes, craft cold outreach messages, and track your applications — all powered by AI.",
  keywords: ["job search", "AI resume", "job tracker", "career assistant"],
  openGraph: {
    title: "AI Job Assistant",
    description: "Land your dream job faster with AI-powered tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
