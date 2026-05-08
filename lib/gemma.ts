import { TriageResponse } from "./types";

export async function callGemma4(params: {
  messages: Array<{ role: string; content: any }>;
  imageBase64?: string;
  imageMimeType?: string;
}): Promise<TriageResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_google_ai_studio_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const model = process.env.GEMINI_MODEL || "gemma-4-it";
  const endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

  const openaiMessages = params.messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  if (params.imageBase64 && params.imageMimeType) {
    const lastUserIndex = openaiMessages.findLastIndex((m) => m.role === "user");
    if (lastUserIndex !== -1) {
      const originalContent = openaiMessages[lastUserIndex].content;
      openaiMessages[lastUserIndex] = {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: `data:${params.imageMimeType};base64,${params.imageBase64}`,
            },
          },
          { type: "text", text: String(originalContent) },
        ],
      };
    }
  }

  const body = {
    model,
    max_tokens: 1024,
    temperature: 0.3,
    messages: openaiMessages,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.status === 401) {
      throw new Error("Invalid Gemini API key");
    }
    if (response.status === 429) {
      throw new Error("Gemini API rate limited");
    }
    if (response.status >= 500) {
      throw new Error("Gemini API server error");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("No response from Gemini API");
    }

    let cleaned = rawContent.replace(/```json\n?|\n?```/g, "").trim();

    // Strip <thought>...</thought> wrapper if present
    cleaned = cleaned.replace(/<thought>[\s\S]*?<\/thought>/gi, "").trim();
    // Strip any other markdown code fences
    cleaned = cleaned.replace(/```[a-z]*\n?|\n?```/g, "").trim();

    const triage = JSON.parse(cleaned) as TriageResponse;

    if (!triage.severity || !triage.steps || !triage.watch_for || !triage.reassurance) {
      throw new Error(`Invalid triage response format: ${cleaned.substring(0, 100)}...`);
    }

    return triage;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL || "gemma-4-it";
}