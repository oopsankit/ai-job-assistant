import OpenAI from "openai";

// Singleton instance – reused across requests in the same Lambda/Node process
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;

/**
 * Generate a tailored, ATS-optimised resume from a base resume and job description.
 */
export async function generateTailoredResume(
  userResume: string,
  jobDescription: string,
  jobTitle: string,
  company: string
): Promise<string> {
  const systemPrompt = `You are an expert career coach and ATS resume optimiser.
Your task is to tailor the provided resume for the specific job description.
Rules:
- Keep factual content from the original resume (do NOT invent experience).
- Reorder, rephrase, and highlight the most relevant skills and achievements.
- Use strong action verbs and quantified achievements where possible.
- Incorporate keywords from the job description naturally.
- Format the output in clean plain text with clear sections.
- Output ONLY the tailored resume text – no commentary or explanations.`;

  const userPrompt = `Target Role: ${jobTitle} at ${company}

JOB DESCRIPTION:
${jobDescription}

ORIGINAL RESUME:
${userResume}

Please produce the tailored resume now.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 2000,
    temperature: 0.4,
  });

  return completion.choices[0]?.message?.content ?? "";
}

/**
 * Generate a cold LinkedIn message or HR email for a job application.
 */
export async function generateColdMessage(
  userBackground: string,
  jobTitle: string,
  company: string,
  jobDescription: string,
  messageType: "linkedin" | "email"
): Promise<string> {
  const isLinkedIn = messageType === "linkedin";

  const systemPrompt = `You are an expert career coach who writes highly effective ${
    isLinkedIn ? "LinkedIn connection request messages" : "cold outreach emails to HR managers"
  }.
Rules:
- Keep ${isLinkedIn ? "the message under 300 characters for the connection note and a follow-up message under 150 words" : "the email concise (under 200 words)"}.
- Be professional, genuine, and specific to the role and company.
- Highlight the most relevant 1-2 skills from the user's background.
- ${isLinkedIn ? "End with a clear, low-pressure call to action." : "End with a polite request for a brief chat and contact details."}
- Output ONLY the message text – no commentary.`;

  const userPrompt = `Role: ${jobTitle} at ${company}
Message type: ${messageType}

User Background:
${userBackground}

Job Description (summary):
${jobDescription.slice(0, 800)}

Generate the ${messageType} message now.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 500,
    temperature: 0.6,
  });

  return completion.choices[0]?.message?.content ?? "";
}
