import { Job } from "@/types";

/**
 * Mock job data used as the initial seed for the jobs table.
 * In production, replace with a real scraper or job board API integration
 * (e.g. Adzuna, Remotive, or The Muse API).
 */
export const MOCK_JOBS: Omit<Job, "id" | "created_at">[] = [
  {
    title: "Senior Frontend Engineer",
    company: "Stripe",
    description:
      "Join Stripe's Growth team to build beautiful, fast, and accessible web experiences. You'll work with React, TypeScript, and GraphQL to create products used by millions of developers worldwide. We value craftsmanship and move fast without breaking things.",
    apply_link: "https://stripe.com/jobs",
    location: "Remote (US)",
    salary_range: "$180k – $240k",
    tags: ["React", "TypeScript", "GraphQL", "Remote"],
  },
  {
    title: "Full Stack Engineer",
    company: "Linear",
    description:
      "Linear is looking for a full-stack engineer to help build the next generation of project management tools. You'll own features end-to-end, from database design to pixel-perfect UI. Stack: Node.js, PostgreSQL, React, TypeScript.",
    apply_link: "https://linear.app/jobs",
    location: "Remote (Worldwide)",
    salary_range: "$150k – $200k",
    tags: ["Node.js", "React", "PostgreSQL", "TypeScript"],
  },
  {
    title: "AI / ML Engineer",
    company: "Anthropic",
    description:
      "Anthropic is an AI safety company working to build reliable, interpretable, and steerable AI systems. We're hiring ML engineers to work on Claude and future models. Strong Python and PyTorch experience required.",
    apply_link: "https://anthropic.com/careers",
    location: "San Francisco, CA",
    salary_range: "$200k – $300k",
    tags: ["Python", "PyTorch", "ML", "AI Safety"],
  },
  {
    title: "Backend Engineer – Platform",
    company: "Vercel",
    description:
      "Build the infrastructure that powers millions of web deployments. You'll work on our edge network, CDN, and serverless compute platform. We're looking for engineers who love performance, distributed systems, and Go / Rust.",
    apply_link: "https://vercel.com/careers",
    location: "Remote (US/Europe)",
    salary_range: "$160k – $220k",
    tags: ["Go", "Rust", "Distributed Systems", "Edge"],
  },
  {
    title: "Product Designer",
    company: "Figma",
    description:
      "Design the future of collaborative design at Figma. You'll work closely with product and engineering to ship features used by millions of designers. Strong visual design skills, Figma proficiency, and user research experience required.",
    apply_link: "https://figma.com/careers",
    location: "San Francisco, CA / Remote",
    salary_range: "$160k – $210k",
    tags: ["Product Design", "Figma", "UX Research", "Prototyping"],
  },
  {
    title: "DevOps / Platform Engineer",
    company: "HashiCorp",
    description:
      "Join HashiCorp to build and operate the infrastructure that powers Terraform Cloud, Vault, and Consul. Strong Kubernetes, AWS, and Terraform experience preferred.",
    apply_link: "https://hashicorp.com/jobs",
    location: "Remote (US)",
    salary_range: "$150k – $200k",
    tags: ["Kubernetes", "AWS", "Terraform", "DevOps"],
  },
  {
    title: "iOS Engineer",
    company: "Notion",
    description:
      "Help shape the Notion iOS experience for millions of users. You'll own features from conception to App Store, working in Swift and SwiftUI. We care about performance, beautiful animations, and offline-first architecture.",
    apply_link: "https://notion.so/careers",
    location: "New York, NY / Remote",
    salary_range: "$160k – $210k",
    tags: ["Swift", "SwiftUI", "iOS", "Mobile"],
  },
  {
    title: "Data Engineer",
    company: "Snowflake",
    description:
      "Build scalable data pipelines and analytics infrastructure at Snowflake. You'll work with petabyte-scale data, dbt, Airflow, and Spark. Strong SQL and Python skills required.",
    apply_link: "https://snowflake.com/careers",
    location: "Remote (US)",
    salary_range: "$140k – $190k",
    tags: ["SQL", "Python", "dbt", "Airflow", "Data"],
  },
];
