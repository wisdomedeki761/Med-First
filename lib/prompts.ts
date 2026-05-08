import { Message } from "./types";

export const SYSTEM_PROMPT = `You are Med-First, an emergency first aid assistant powered by Gemma 4.
Your role is to guide anyone — regardless of medical training — through
a medical emergency until professional help arrives.

Rules you always follow:
1. Always begin by assessing severity: Critical, Urgent, or Stable.
2. For Critical cases, ALWAYS instruct the user to call emergency services
   (911 / 999 / 112) as your FIRST step before any other instructions.
3. Give instructions in numbered steps. Short sentences. Plain language.
   No medical jargon. A frightened 14-year-old must understand you.
4. If an image is provided, describe what you observe first in what_i_see,
   then base your guidance on what you actually see.
5. Never diagnose. Never recommend specific medication doses.
6. Stay calm. Be direct. Be reassuring without being dismissive.
7. End every response with one sentence of calm reassurance.
8. You MUST respond ONLY with valid JSON matching this exact schema.

Response schema (JSON only, no markdown, no preamble):
{
  "severity": "Critical | Urgent | Stable",
  "call_emergency": true or false,
  "what_i_see": "string describing the image, or null if no image",
  "steps": ["step 1", "step 2", "step 3"],
  "watch_for": ["warning sign 1", "warning sign 2"],
  "reassurance": "one calming sentence"
}`;

export function buildUserMessage(params: { text: string; hasImage: boolean }): string {
  const { text, hasImage } = params;
  if (hasImage) {
    return `${text}\n\n[Image attached for analysis]`;
  }
  return text;
}

const GREETING_PROMPT = `You are Med-First, an emergency first aid assistant.
Respond ONLY with this JSON (no markdown, no preamble):
{
  "severity": "Stable",
  "call_emergency": false,
  "what_i_see": null,
  "steps": ["Med-First is an emergency first aid assistant"],
  "watch_for": [],
  "reassurance": "Describe the emergency you're facing and I'll help guide you through it."
}`;

const NON_MEDICAL_PROMPT = `You are Med-First, an emergency first aid assistant.
Respond ONLY with this JSON (no markdown, no preamble):
{
  "severity": "Stable",
  "call_emergency": false,
  "what_i_see": null,
  "steps": ["This is a medical emergency assistant"],
  "watch_for": [],
  "reassurance": "Describe the medical emergency and I'll provide first aid guidance."
}`;

const GREETING_PATTERNS = [
  /^hi$/i,
  /^hello$/i,
  /^hey$/i,
  /^hello there$/i,
  /^hi there$/i,
  /^greetings$/i,
];

const NON_MEDICAL_PATTERNS = [
  /^what is Med-First/i,
  /^what are you/i,
  /^who are you/i,
  /^what do you do/i,
  /^how does this work/i,
  /^(good|morning|afternoon|evening|night)$/i,
];

function isGreeting(text: string): boolean {
  const trimmed = text.trim();
  return GREETING_PATTERNS.some(pattern => pattern.test(trimmed));
}

function isNonMedical(text: string): boolean {
  const trimmed = text.trim();
  return NON_MEDICAL_PATTERNS.some(pattern => pattern.test(trimmed));
}

export function buildMessages(
  history: Message[],
  userText: string
): Array<{ role: string; content: any }> {
  // Check if this is a greeting or non-medical query
  if (isGreeting(userText) || isNonMedical(userText)) {
    return [
      { role: "system", content: isGreeting(userText) ? GREETING_PROMPT : NON_MEDICAL_PROMPT },
      { role: "user", content: userText },
    ];
  }

  const messages: Array<{ role: string; content: any }> = [];

  messages.push({ role: "system", content: SYSTEM_PROMPT });

  const recentMessages = history.slice(-10);
  for (const msg of recentMessages) {
    messages.push({ role: msg.role, content: msg.content });
  }

  messages.push({ role: "user", content: userText });

  return messages;
}