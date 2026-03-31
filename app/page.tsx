import Link from "next/link";
import {
  Zap,
  FileText,
  MessageSquare,
  ClipboardList,
  Bell,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "AI-Tailored Resumes",
    description:
      "Paste the job description and your base resume. Our AI rewrites it to perfectly match ATS keywords and hiring criteria.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: MessageSquare,
    title: "Cold Outreach Messages",
    description:
      "Generate personalised LinkedIn notes and HR emails that get responses — crafted around your experience and the role.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: ClipboardList,
    title: "Application Tracker",
    description:
      "Keep every application organised. Track statuses from Saved → Applied → Interview → Offer in one clean dashboard.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Bell,
    title: "WhatsApp Notifications",
    description:
      "Get instant WhatsApp pings when new jobs match your profile or your AI resume is ready to download.",
    color: "bg-amber-50 text-amber-600",
  },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for casual job seekers",
    features: [
      "Browse unlimited jobs",
      "3 AI generations / day",
      "Application tracker",
      "Email notifications",
    ],
    cta: "Get Started Free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    description: "For serious job seekers",
    features: [
      "Everything in Free",
      "Unlimited AI generations",
      "WhatsApp notifications",
      "Priority support",
      "Export resumes as PDF",
    ],
    cta: "Upgrade to Pro",
    href: "/signup?plan=pro",
    highlight: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
              <Zap className="h-4 w-4 text-white fill-white" size={16} />
            </div>
            <span className="text-lg font-bold text-gray-900">JobAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary text-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-blue-50 px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
            <Star className="h-3.5 w-3.5 fill-brand-500 text-brand-500" />
            AI-powered job search tools
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            Land your dream job{" "}
            <span className="text-brand-600">faster</span> with AI
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover relevant jobs, generate ATS-optimised resumes, craft
            perfect cold messages, and track every application — all in one
            place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link href="/signup" className="btn-primary px-8 py-3 text-base">
              Start for Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="btn-secondary px-8 py-3 text-base">
              Sign In
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">No credit card required · 3 AI generations free every day</p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-24 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Everything you need to get hired
            </h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">
              Stop spending hours tailoring resumes manually. Let AI do the
              heavy lifting while you focus on interviewing.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <div key={title} className="card hover:shadow-md transition-shadow">
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Browse Jobs", desc: "Explore curated job listings updated daily. Filter by role, location, and salary." },
              { step: "2", title: "Generate Resume", desc: "Click 'Generate Resume', paste your base resume, and get a tailored ATS-ready version in seconds." },
              { step: "3", title: "Track & Apply", desc: "Save applications, update statuses, and get notified via WhatsApp at every step." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white font-bold text-lg">
                  {step}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="px-6 py-24 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h2>
            <p className="mt-3 text-gray-500">Start free. Upgrade when you need more power.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {PRICING.map(({ name, price, period, description, features, cta, href, highlight }) => (
              <div
                key={name}
                className={`card relative flex flex-col ${
                  highlight ? "border-brand-300 ring-2 ring-brand-200 shadow-md" : ""
                }`}
              >
                {highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">{price}</span>
                    <span className="text-gray-500 text-sm">{period}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{description}</p>
                </div>
                <ul className="mb-6 space-y-2.5 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={href}
                  className={highlight ? "btn-primary w-full justify-center" : "btn-secondary w-full justify-center"}
                >
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 px-6 py-8 bg-white">
        <div className="mx-auto max-w-6xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-600">
              <Zap className="h-3 w-3 text-white fill-white" size={12} />
            </div>
            <span className="text-sm font-semibold text-gray-700">JobAI</span>
          </div>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} AI Job Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
