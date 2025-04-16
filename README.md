# Amako Dev Portfolio Site

This portfolio website features an interactive AI chatbot powered by **OkamaAI by Okamalabs**.

## OkamaAI Features

The AI-powered chatbot offers a unique and engaging user experience:

- **Charismatic Personality**: Delivers responses with wit, charm, and a touch of playful manipulation
- **Real-time Response Streaming**: Watch as OkamaAI crafts responses character by character
- **Context-Aware Interactions**: Uses portfolio data (experience, skills, projects) to provide accurate information
- **Modern UI/UX**: Vibrant design with smooth animations and glass-like effects
- **Practical Features**: Message copying, chat reset, and responsive layout

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Get a Google Gemini API key from [https://ai.google.dev/](https://ai.google.dev/)
   - Add your API key to `.env.local` as `NEXT_PUBLIC_GEMINI_API_KEY`

4. Start the development server:
   ```
   npm run dev
   ```

## Customization

You can customize OkamaAI by:

1. **Personality**: Adjust the system prompt in `geminiService.ts` to change OkamaAI's tone and character
2. **Content**: Modify the data files in the `src/data` folder to update portfolio information
3. **Appearance**: Change the styling in `ChatbotAgent.tsx` to match your brand
4. **Behavior**: Fine-tune API parameters in `geminiService.ts` to adjust response style

## Technologies Used

- Next.js & React 
- TypeScript
- Framer Motion for animations
- Google Gemini AI API
- Tailwind CSS

## About OkamaAI

OkamaAI is powered by Google's Gemini large language model but enhanced with a unique personality and branding layer. The chatbot combines technical capabilities with charismatic interaction to create a memorable user experience. 