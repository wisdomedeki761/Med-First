# Med-First - AI Emergency First Aid Assistant

Med-First is a multimodal AI-powered emergency first aid guidance application powered by Google's Gemma 4 model. It provides real-time, step-by-step guidance during medical emergencies through text, voice, or camera input.

![Med-First Banner](./public/meta-image.png)

## Features

### 🚀 Three Interaction Modes

| Mode | Description |
|------|-------------|
| **Text Mode** | Type your emergency description for AI analysis |
| **Voice Mode** | Speak hands-free - responses are read aloud automatically |
| **Camera Mode** | Show the situation for AI visual analysis |

### 🎯 Key Capabilities

- **Severity Assessment**: Automatically classifies emergencies as Critical, Urgent, or Stable
- **Step-by-Step Guidance**: Clear, actionable first aid instructions
- **Warning Signs**: Identifies what to watch for during emergencies
- **Multi-language Emergency Numbers**: Quick access to 911 (US), 999 (UK), 112 (EU)
- **Session Persistence**: Chat history saved within session (cleared on tab close)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI Model**: Google Gemma 4 (via Gemini API / OpenRouter)
- **Styling**: Tailwind CSS + Custom glass-morphism design
- **Voice**: Web Speech API (SpeechRecognition & SpeechSynthesis)
- **Camera**: MediaDevices API for image capture

## Getting Started

### Prerequisites

- Node.js 18+
- Google AI Studio API key (for Gemini)
- or OpenRouter API key (fallback)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Med-First.git
cd Med-First

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Configure your API keys in .env
```

### Environment Variables

```env
# Required: Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: OpenRouter fallback
OPENROUTER_API_KEY=your_openrouter_key

# App Configuration
NEXT_PUBLIC_APP_NAME=Med-First
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to use Med-First.

## Project Structure

```
Med-First/
├── app/
│   ├── page.tsx              # Landing page
│   ├── chat/
│   │   ├── page.tsx          # Main chat interface
│   │   └── loading.tsx       # Loading skeleton
│   ├── disclaimer/
│   │   └── page.tsx          # Medical disclaimer
│   └── terms/
│       └── page.tsx          # Terms of use
├── components/
│   ├── ChatWindow.tsx        # Chat message display
│   ├── TextInput.tsx         # Text input with attachment
│   ├── VoiceInput.tsx        # Voice recording interface
│   ├── CameraCapture.tsx     # Camera mode UI
│   ├── TriageCard.tsx        # AI response card
│   ├── MessageBubble.tsx     # Individual messages
│   ├── SeverityBadge.tsx     # Severity indicators
│   ├── ModeSelector.tsx      # Mode switching
│   ├── AboutModal.tsx        # App information
│   ├── ErrorCard.tsx         # Error states
│   └── Onboarding.tsx        # First-time experience
├── hooks/
│   ├── useSpeechRecognition.ts  # Voice-to-text
│   ├── useSpeechSynthesis.ts    # Text-to-speech
│   └── useCamera.ts             # Camera capture
├── lib/
│   ├── gemma.ts              # Gemini API client
│   ├── openrouter.ts         # OpenRouter fallback
│   ├── prompts.ts            # System prompts
│   ├── types.ts              # TypeScript definitions
│   └── imageUtils.ts         # Image processing
├── actions/
│   └── action.ts             # Server actions
└── public/
    └── video_1105953_1778238004.mp4  # Background video
```

## API Integration

### Primary: Google Gemini API

Med-First uses the OpenAI-compatible Gemini API endpoint:

```
POST https://generativelanguage.googleapis.com/v1beta/openai/chat/completions
Authorization: Bearer GEMINI_API_KEY
```

### Fallback: OpenRouter

If Gemini API fails, Med-First automatically falls back to OpenRouter:

```
POST https://openrouter.ai/api/v1/chat/completions
Authorization: Bearer OPENROUTER_API_KEY
```

## Response Schema

The AI returns structured JSON responses:

```typescript
{
  severity: "Critical" | "Urgent" | "Stable",
  call_emergency: boolean,
  what_i_see: string | null,      // For image inputs
  steps: string[],                 // Numbered action steps
  watch_for: string[],             // Warning signs
  reassurance: string              // Calm closing message
}
```

## Accessibility

- **ARIA labels** on all interactive elements
- **High contrast** colors (4.5:1 minimum ratio)
- **Touch-friendly** targets (48px+ minimum)
- **Focus management** for keyboard navigation
- **Screen reader** support for critical alerts

## Mobile Optimization

- Responsive design (375px - 1920px)
- Touch manipulation (no double-tap zoom)
- Back camera preference on mobile
- Large tap targets for emergency use

## Privacy

- API keys stored server-side (never exposed)
- Session-based chat storage
- Images processed in-memory, not stored
- No permanent user data retention

## Medical Disclaimer

Med-First provides general guidance only and is not a substitute for professional medical care. Always seek immediate medical attention for life-threatening emergencies.

- US: Call 911
- UK: Call 999
- EU: Call 112

## License

This project is submitted for the Gemini API Developer Challenge.

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## Acknowledgments

- Google for the Gemma 4 AI model
- Next.js team for the excellent framework
- Tailwind CSS for utility-first styling