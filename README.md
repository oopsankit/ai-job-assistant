# 🚀 AI Job Assistant

A production-ready SaaS web app that helps users **discover jobs**, **generate AI-tailored resumes**, **craft cold outreach messages**, and **track applications** — with WhatsApp notifications and Stripe subscriptions.

---

## Tech Stack

| Layer       | Technology                          |
|------------|-------------------------------------|
| Framework  | Next.js 14 (App Router, TypeScript) |
| Styling    | Tailwind CSS                        |
| Database   | Supabase (PostgreSQL + Auth)        |
| AI         | OpenAI GPT-4o-mini                  |
| Payments   | Stripe Subscriptions                |
| Messaging  | Twilio WhatsApp API                 |
| Deploy     | Vercel                              |

---

## Features

- **Google & Email/password auth** via Supabase Auth
- **Job discovery dashboard** with search
- **AI Resume Generator** — tailored, ATS-optimised resumes per job
- **AI Message Generator** — LinkedIn notes and HR emails
- **Application Tracker** — status pipeline (Saved → Applied → Interview → Offer)
- **WhatsApp Notifications** via Twilio (Pro plan)
- **Stripe Subscriptions** — Free (3 AI gen/day) vs Pro (unlimited)
- **Admin Panel** at `/admin` — view all users & applications

---

## Project Structure

```
ai-job-assistant/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Email + Google login
│   │   └── signup/page.tsx         # Registration
│   ├── (dashboard)/                # Protected routes (requires auth)
│   │   ├── layout.tsx              # Sidebar + TopBar
│   │   ├── dashboard/page.tsx      # Stats overview
│   │   ├── jobs/
│   │   │   ├── page.tsx            # Job listing with search
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # Job details (server)
│   │   │       └── JobDetailClient.tsx  # AI tools (client)
│   │   ├── applications/
│   │   │   ├── page.tsx            # Tracker (server)
│   │   │   └── ApplicationsClient.tsx  # Interactive table
│   │   └── profile/page.tsx        # Profile + WhatsApp number
│   ├── admin/page.tsx              # Admin panel (restricted)
│   ├── api/
│   │   ├── generate-resume/route.ts   # POST – AI resume gen
│   │   ├── generate-message/route.ts  # POST – AI message gen
│   │   ├── jobs/route.ts              # GET/POST jobs
│   │   ├── applications/
│   │   │   ├── route.ts               # GET/POST applications
│   │   │   └── [id]/route.ts          # PATCH/DELETE application
│   │   ├── notifications/route.ts     # POST – send WhatsApp test
│   │   └── stripe/
│   │       ├── create-checkout/route.ts  # Redirect to Stripe
│   │       └── webhook/route.ts          # Stripe webhook handler
│   ├── auth/callback/route.ts      # OAuth callback
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Tailwind + design tokens
│   └── page.tsx                    # Landing page
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── jobs/
│   │   └── JobCard.tsx
│   ├── applications/               # (extend as needed)
│   └── ui/
│       ├── Spinner.tsx
│       ├── Toast.tsx
│       ├── Modal.tsx
│       └── StatusBadge.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts              # Browser Supabase client
│   │   ├── server.ts              # Server Supabase client
│   │   └── admin.ts               # Service-role admin client
│   ├── openai.ts                  # OpenAI helpers
│   ├── stripe.ts                  # Stripe helpers
│   ├── twilio.ts                  # Twilio WhatsApp helpers
│   ├── rate-limit.ts              # In-memory rate limiter
│   └── mock-jobs.ts               # Seed data
├── types/index.ts                 # Shared TypeScript types
├── supabase/
│   ├── schema.sql                 # Database schema + RLS policies
│   └── seed.ts                    # Seed script
├── .env.example                   # Environment variable template
└── README.md
```

---

## 1. Local Setup

### Prerequisites
- Node.js 18+
- npm or pnpm
- A Supabase project (free tier works)
- OpenAI API key
- Stripe account
- Twilio account (for WhatsApp)

### Steps

```bash
# 1. Clone / extract the project
cd ai-job-assistant

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local
# → Fill in all values (see section below)

# 4. Set up the database
# → Go to Supabase Dashboard → SQL Editor → New Query
# → Paste the contents of supabase/schema.sql and run it

# 5. Seed sample jobs
npx ts-node --project tsconfig.json supabase/seed.ts

# 6. Run the development server
npm run dev
# → Open http://localhost:3000
```

---

## 2. Environment Variables

Fill in `.env.local` based on `.env.example`:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API (secret) |
| `OPENAI_API_KEY` | platform.openai.com → API Keys |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → your endpoint → Signing secret |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API Keys |
| `STRIPE_PRO_PRICE_ID` | Stripe Dashboard → Products → your Pro plan → Price ID |
| `TWILIO_ACCOUNT_SID` | Twilio Console → Dashboard |
| `TWILIO_AUTH_TOKEN` | Twilio Console → Dashboard |
| `TWILIO_WHATSAPP_FROM` | Twilio Console → Messaging → WhatsApp Sandbox (e.g. `whatsapp:+14155238886`) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` locally, your Vercel URL in prod |
| `ADMIN_EMAIL` | Your email address for admin access to `/admin` |

---

## 3. Supabase Setup

### Auth configuration
1. Go to **Authentication → Providers**
2. Enable **Google** provider → enter your Google OAuth credentials
3. Add `http://localhost:3000/auth/callback` to allowed redirect URLs
4. Add your production URL callback as well

### Google OAuth credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add `https://[your-project].supabase.co/auth/v1/callback` as an authorised redirect URI

---

## 4. Stripe Setup

### Create a Pro product
1. Stripe Dashboard → Products → Add Product
2. Name: "AI Job Assistant Pro"
3. Add a price: $19/month recurring
4. Copy the **Price ID** → set as `STRIPE_PRO_PRICE_ID`

### Configure webhook (local dev)
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Listen and forward to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the webhook signing secret displayed → set as STRIPE_WEBHOOK_SECRET
```

### Configure webhook (production)
1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://your-domain.vercel.app/api/stripe/webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.deleted`

---

## 5. Twilio WhatsApp Setup

1. Sign up at [twilio.com](https://twilio.com)
2. Go to **Messaging → Try it Out → Send a WhatsApp Message**
3. Follow the sandbox setup instructions
4. Your sandbox number is the `TWILIO_WHATSAPP_FROM` value
5. Users must first send a join message to the sandbox number to receive messages

**For production:** Apply for a WhatsApp Business Account through Twilio.

---

## 6. Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables on Vercel:
# → vercel.com → your project → Settings → Environment Variables
# → Add all variables from .env.example with production values

# Or use the CLI:
vercel env add OPENAI_API_KEY
# (repeat for each variable)

# Deploy to production
vercel --prod
```

**Important Vercel settings:**
- Framework Preset: **Next.js**
- Node.js version: **18.x**
- Build command: `npm run build`
- Output directory: `.next`

---

## 7. Admin Access

Navigate to `/admin` — access is restricted to the email set in `ADMIN_EMAIL` env var.

From the admin panel you can:
- View all registered users and their plans
- View all job applications across all users
- See application status breakdown

---

## 8. Rate Limiting

| Plan | AI Generations | WhatsApp Alerts |
|------|---------------|-----------------|
| Free | 3 / day       | ❌ Not available |
| Pro  | Unlimited     | ✅ On all events |

The rate limiter is in `lib/rate-limit.ts` and uses in-memory storage. For production at scale, replace with a Redis-backed store (e.g. [Upstash Redis](https://upstash.com)).

---

## 9. Extending the App

### Add real job sources
Replace `lib/mock-jobs.ts` with real job board API calls:
- **Adzuna API** (free tier) — job listings
- **Remotive API** — remote jobs
- **The Muse API** — company culture + jobs
- Custom scraper with Playwright (ensure TOS compliance)

### Add PDF resume export
```bash
npm install @react-pdf/renderer
```
Create a `/api/export-resume` route that renders the resume text as a PDF.

### Replace in-memory rate limiter with Redis
```bash
npm install @upstash/ratelimit @upstash/redis
```

---

## License

MIT
