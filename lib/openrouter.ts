import { TriageResponse } from "./types";

const getOpenRouterKeys = (): string[] => {
  const keys: string[] = [];

  const oldKey = process.env.OPENROUTER_API_KEY;
  if (oldKey && oldKey !== "your_openrouter_api_key") {
    const splitKeys = oldKey.split(",").map(k => k.trim()).filter(k => k);
    keys.push(...splitKeys);
  }

  const key1 = process.env.OPENROUTER_API_KEY_1;
  const key2 = process.env.OPENROUTER_API_KEY_2;
  const key3 = process.env.OPENROUTER_API_KEY_3;

  if (key1 && key1 !== "your_first_openrouter_api_key") keys.push(key1);
  if (key2 && key2 !== "your_second_openrouter_api_key") keys.push(key2);
  if (key3 && key3 !== "your_third_openrouter_api_key") keys.push(key3);

  return [...new Set(keys)];
};

const getOpenRouterModels = (): string[] => {
  const modelsEnv = process.env.OPENROUTER_MODELS;
  if (modelsEnv) {
    return modelsEnv.split(",").map(m => m.trim()).filter(m => m);
  }
  return [
    "google/gemma-4-31b-it:free",
    "google/gemma-4-26b-a4b-it:free",
  ];
};

export { getOpenRouterKeys, getOpenRouterModels };

export async function callOpenRouter(params: {
  messages: Array<{ role: string; content: any }>;
  imageBase64?: string;
  imageMimeType?: string;
  apiKey?: string;
  modelIndex?: number;
}): Promise<{ triage: TriageResponse; keyIndex: number; modelIndex: number }> {
  const apiKeys = getOpenRouterKeys();
  const openRouterModels = getOpenRouterModels();
  const userKey = params.apiKey;

  const endpoint = "https://openrouter.ai/api/v1/chat/completions";

  const messageContent: any[] = [];

  for (const msg of params.messages) {
    messageContent.push({ type: "text", text: msg.content });
  }

  if (params.imageBase64 && params.imageMimeType) {
    messageContent.unshift({
      type: "image_url",
      image_url: {
        url: `data:${params.imageMimeType};base64,${params.imageBase64}`,
      },
    });
  }

  const modelIndex = params.modelIndex || 0;
  const model = openRouterModels[modelIndex] || openRouterModels[0];
  const apiKey = userKey || apiKeys[0];

  if (!apiKey) {
    throw new Error("No OpenRouter API key available");
  }

  const body = {
    model,
    messages: [{ role: "user", content: messageContent }],
    max_tokens: 1024,
    temperature: 0.3,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://Med-First.vercel.app",
        "X-Title": "Med-First",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.status === 401) {
      throw new Error("Invalid OpenRouter API key");
    }
    if (response.status === 429) {
      throw new Error("OpenRouter rate limited");
    }
    if (response.status >= 500) {
      throw new Error("OpenRouter server error");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenRouter API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("No response from OpenRouter API");
    }

    const cleaned = rawContent.replace(/```json\n?|\n?```/g, "").trim();
    const triage = JSON.parse(cleaned) as TriageResponse;

    if (!triage.severity || !triage.steps || !triage.watch_for || !triage.reassurance) {
      throw new Error(`Invalid triage response format: ${cleaned.substring(0, 100)}...`);
    }

    return { triage, keyIndex: apiKeys.indexOf(apiKey), modelIndex };
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}