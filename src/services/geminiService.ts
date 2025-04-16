import { GoogleGenAI, Content } from '@google/genai';
import { GEMINI_API_KEY } from '../credentials';

// Initialize the Gemini API client using the @google/genai structure
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Model name from the documentation
const MODEL_NAME = 'gemini-2.0-flash-001'; 

// Combine all context data into a single history object
export const prepareContextData = async () => {
  try {
    const [chatbotData, profileData, skillsData, experienceData, projectsData] = await Promise.all([
      import('../data/chatbot.json'),
      import('../data/profile.json'),
      import('../data/skills.json'),
      import('../data/experience.json'),
      import('../data/projects.json')
    ]);
    
    return {
      profile: profileData.default,
      skills: skillsData.default,
      experience: experienceData.default,
      projects: projectsData.default,
      chatbot: chatbotData.default
    };
  } catch (error) {
    console.error("Error loading context data:", error);
    return null;
  }
};

// Build system instructions for OkamaAI
const buildSystemInstructions = async () => {
  const contextData = await prepareContextData();
  if (!contextData) {
    throw new Error("Failed to load context data");
  }

  return `You are OkamaAI by Okamalabs, a charismatic, witty, and professional AI assistant for ${contextData.profile.name}, a ${contextData.profile.title}.

Use the following information to answer questions about them:

PROFILE: ${JSON.stringify(contextData.profile)}
SKILLS: ${JSON.stringify(contextData.skills)}
EXPERIENCE: ${JSON.stringify(contextData.experience)}
PROJECTS: ${JSON.stringify(contextData.projects)}

PERSONALITY TRAITS:
- You're professional but charismatic and confident
- You use appropriate humor and wit when relevant
- You're helpful and informative
- You remain professional at all times
- You use engaging language and clear explanations
- You're polite and respectful

Keep responses entertaining but professional. If you don't know something specific, be honest and offer to connect the user with ${contextData.profile.name} directly.`;
};

// Helper to format messages into the Content[] structure expected by the API
const formatChatHistory = (history: Array<{ role: 'user' | 'model', parts: string }>): Content[] => {
  // The new SDK expects roles to be 'user' or 'model'
  return history.map(msg => ({ role: msg.role, parts: [{ text: msg.parts }] }));
};

// Generate response using the @google/genai SDK structure
export const generateResponse = async (
  message: string, 
  chatHistory: Array<{ role: 'user' | 'model', parts: string }> = []
) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    // Build the system instructions
    const systemInstructions = await buildSystemInstructions();
    
    // Format the conversation history
    const formattedHistory: Content[] = formatChatHistory(chatHistory);

    // Construct the contents array for the API call
    const contents: Content[] = [
      // System instructions (often as the first model message, though practices vary)
      { role: 'model', parts: [{ text: systemInstructions }] }, 
      // Add existing history
      ...formattedHistory,
      // Add the current user message
      { role: 'user', parts: [{ text: message }] }
    ];
    
    // Use the ai.models.generateContent method with config parameters directly inside config
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: contents,
      config: { // Place generation parameters directly inside config
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });
    
    // Access response text directly
    return response.text;
  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm experiencing a technical issue. The team at Okamalabs is working to resolve this. Please try again in a moment.";
  }
};

// Stream response using the @google/genai SDK structure
export const streamResponse = async (
  message: string,
  onChunk: (chunk: string) => void,
  chatHistory: Array<{ role: 'user' | 'model', parts: string }> = []
) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    // Build the system instructions
    const systemInstructions = await buildSystemInstructions();
    
    // Format the conversation history
    const formattedHistory: Content[] = formatChatHistory(chatHistory);

    // Construct the contents array for the API call
    const contents: Content[] = [
      // System instructions (often as the first model message)
      { role: 'model', parts: [{ text: systemInstructions }] }, 
      // Add existing history
      ...formattedHistory,
      // Add the current user message
      { role: 'user', parts: [{ text: message }] }
    ];

    // Use the ai.models.generateContentStream method with config parameters directly inside config
    const responseStream = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: contents,
      config: { // Place generation parameters directly inside config
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });
    
    // Process the stream
    for await (const chunk of responseStream) {
      const chunkText = chunk.text;
      if (chunkText) { 
        onChunk(chunkText);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error streaming response:", error);
    onChunk("I'm experiencing a technical issue. The team at Okamalabs is working to resolve this. Please try again in a moment.");
    return false;
  }
}; 