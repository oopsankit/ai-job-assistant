import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM = process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886";

/**
 * Send a WhatsApp notification to the given number.
 * `to` should be in E.164 format, e.g. "+919876543210".
 */
export async function sendWhatsAppMessage(
  to: string,
  body: string
): Promise<void> {
  const formattedTo = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  try {
    await client.messages.create({ from: FROM, to: formattedTo, body });
  } catch (err) {
    // Log but don't crash the API request if WhatsApp delivery fails
    console.error("[Twilio] Failed to send WhatsApp message:", err);
  }
}

/**
 * Notify a user when a new job is added.
 */
export async function notifyNewJob(
  whatsappNumber: string,
  jobTitle: string,
  company: string
): Promise<void> {
  const body = `🆕 *New Job Match!*\n\n*${jobTitle}* at *${company}* has been added to AI Job Assistant.\n\nLog in to generate a tailored resume and apply!\n\nhttps://aijobassistant.com/dashboard`;
  await sendWhatsAppMessage(whatsappNumber, body);
}

/**
 * Notify a user when their resume is generated.
 */
export async function notifyResumeGenerated(
  whatsappNumber: string,
  jobTitle: string,
  company: string
): Promise<void> {
  const body = `✅ *Resume Ready!*\n\nYour tailored resume for *${jobTitle}* at *${company}* is ready.\n\nLog in to review and download it. Good luck! 🍀`;
  await sendWhatsAppMessage(whatsappNumber, body);
}
