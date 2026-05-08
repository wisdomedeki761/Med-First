export interface TriageResponse {
  severity: "Critical" | "Urgent" | "Stable";
  call_emergency: boolean;
  what_i_see: string | null;
  steps: string[];
  watch_for: string[];
  reassurance: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  triage: TriageResponse | null;
  imageUrl: string | null;
  timestamp: Date;
  mode: "text" | "voice" | "camera";
  provider?: "gemini" | "openrouter";
  model?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  activeMode: "text" | "voice" | "camera";
}

export interface ActionResult {
  success: boolean;
  triage?: TriageResponse;
  error?: string;
  provider?: "gemini" | "openrouter" | null;
  model?: string | null;
}