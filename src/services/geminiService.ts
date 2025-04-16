import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../credentials';

// Initialize the Gemini API client with API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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

// Generate response using Gemini API with context
export const generateResponse = async (
  message: string, 
  chatHistory: Array<{ role: 'user' | 'model', parts: string }> = []
) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    // Get the generative model (Gemini Pro)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    
    // Build the system instructions
    const systemInstructions = await buildSystemInstructions();
    
    // Create a properly formatted history for Gemini
    // First, add the user's current message
    const currentUserMessage = { role: "user", parts: [{ text: message }] };
    
    // Then, format the chat history if it exists
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.parts }]
    }));

    // For the first message, we need to include system instructions with the user message
    let result;
    if (formattedHistory.length === 0) {
      // For the first message, include system instructions in the prompt
      const firstPrompt = systemInstructions + "\n\nUser's first message: " + message;
      result = await model.generateContent(firstPrompt);
    } else {
      // For subsequent messages, use the chat history and current message
      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      });
      
      // Add system instructions as a reminder before handling the message
      const reminderPrompt = `Remember: ${systemInstructions.substring(0, 200)}... Now, respond to this message: ${message}`;
      result = await chat.sendMessage(reminderPrompt);
    }
    
    return result.response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    return "I'm experiencing a technical issue. The team at Okamalabs is working to resolve this. Please try again in a moment.";
  }
};

// Stream response for real-time typing effect
export const streamResponse = async (
  message: string,
  onChunk: (chunk: string) => void,
  chatHistory: Array<{ role: 'user' | 'model', parts: string }> = []
) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    // Get the generative model (Gemini Pro)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Build the system instructions
    const systemInstructions = await buildSystemInstructions();
    
    // Create a properly formatted history for Gemini
    // Format the existing chat history
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.parts }]
    }));

    // Handle streaming based on whether this is the first message or not
    let result;
    if (formattedHistory.length === 0) {
      // For the first message, include system instructions in the prompt
      const firstPrompt = systemInstructions + "\n\nUser's first message: " + message;
      result = await model.generateContentStream(firstPrompt);
    } else {
      // For subsequent messages, use the chat history
      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      });
      
      // Add system instructions as a reminder before handling the message
      const reminderPrompt = `Remember: ${systemInstructions.substring(0, 200)}... Now, respond to this message: ${message}`;
      result = await chat.sendMessageStream(reminderPrompt);
    }
    
    // Process the stream
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      onChunk(chunkText);
    }
    
    return true;
  } catch (error) {
    console.error("Error streaming response:", error);
    onChunk("I'm experiencing a technical issue. The team at Okamalabs is working to resolve this. Please try again in a moment.");
    return false;
  }
}; 