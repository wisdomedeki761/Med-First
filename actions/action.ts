"use server";

import { callGemma4, getGeminiModel } from "@/lib/gemma";
import { callOpenRouter, getOpenRouterKeys, getOpenRouterModels } from "@/lib/openrouter";
import { buildMessages } from "@/lib/prompts";
import { Message, TriageResponse, ActionResult } from "@/lib/types";

export async function triageEmergency(params: {
  messages: Message[];
  userText: string;
  imageBase64?: string;
  imageMimeType?: string;
}): Promise<ActionResult> {
  if (!params.userText.trim() && !params.imageBase64) {
    return {
      success: false,
      error: "Please provide a description of the emergency",
      provider: null,
      model: null,
    };
  }

  if (params.imageBase64 && !params.imageMimeType) {
    return {
      success: false,
      error: "Image mime type is required when providing an image",
      provider: null,
      model: null,
    };
  }

  console.log("[Med-First] Starting triage request...");

  const geminiModel = getGeminiModel() ?? null;

  try {
    console.log("[Med-First] Attempting Gemini API...");
    const apiMessages = buildMessages(params.messages, params.userText);

    const triage = await callGemma4({
      messages: apiMessages,
      imageBase64: params.imageBase64,
      imageMimeType: params.imageMimeType,
    });

    console.log("[Med-First] Gemini API success!");
    return {
      success: true,
      triage,
      provider: "gemini",
      model: geminiModel,
    };
  } catch (primaryError: any) {
    console.error("[Med-First] Gemini API failed:", primaryError?.message || primaryError);

    const openRouterKeys = getOpenRouterKeys();
    const openRouterModels = getOpenRouterModels();

    for (let keyIndex = 0; keyIndex < openRouterKeys.length; keyIndex++) {
      for (let modelIndex = 0; modelIndex < openRouterModels.length; modelIndex++) {
        try {
          console.log(`[Med-First] Attempting OpenRouter key ${keyIndex + 1}, model ${modelIndex + 1}...`);

          const apiMessages = buildMessages(params.messages, params.userText);

          const result = await callOpenRouter({
            messages: apiMessages,
            imageBase64: params.imageBase64,
            imageMimeType: params.imageMimeType,
            apiKey: openRouterKeys[keyIndex],
            modelIndex,
          });

          console.log(`[Med-First] OpenRouter success!`);
          return {
            success: true,
            triage: result.triage,
            provider: "openrouter",
            model: openRouterModels[modelIndex],
          };
        } catch (openRouterError: any) {
          console.error(`[Med-First] OpenRouter key ${keyIndex + 1}, model ${modelIndex + 1} failed:`, openRouterError?.message || openRouterError);
          continue;
        }
      }
    }

    const errorMsg = primaryError?.message || "Unknown error";
    console.error("[Med-First] All APIs failed");
    return {
      success: false,
      error: `AI service unavailable: ${errorMsg}`,
      provider: null,
      model: null,
    };
  }
}