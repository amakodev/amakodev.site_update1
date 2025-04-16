import { useState, useCallback, useEffect } from 'react';
import { generateResponse, streamResponse } from '../services/geminiService';

export interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

interface UseChatbotProps {
  initialGreeting?: string;
}

export const useChatbot = ({ initialGreeting = "Hi! I'm the AI assistant. How can I help you today?" }: UseChatbotProps = {}) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      type: 'bot', 
      content: initialGreeting,
      timestamp: Date.now() 
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert messages to Gemini chat history format
  const getChatHistory = useCallback(() => {
    return messages.map(msg => ({
      role: msg.type === 'user' ? 'user' as const : 'model' as const,
      parts: msg.content
    }));
  }, [messages]);

  // Send message to Gemini API and handle response
  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    try {
      // Add user message to chat
      const userMessageObj: Message = { 
        type: 'user', 
        content: userMessage, 
        timestamp: Date.now() 
      };
      
      setMessages(prev => [...prev, userMessageObj]);
      setIsProcessing(true);
      setError(null);

      // Create placeholder for bot response with streaming indicator
      const botPlaceholder: Message = {
        type: 'bot',
        content: '',
        timestamp: Date.now(),
        isStreaming: true
      };
      
      setMessages(prev => [...prev, botPlaceholder]);

      // Get chat history for context
      const history = getChatHistory();
      
      // Send to Gemini with streaming response
      let messageComplete = false;
      const streamSuccess = await streamResponse(
        userMessage,
        (chunk) => {
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            
            if (lastMessage && lastMessage.type === 'bot' && lastMessage.isStreaming) {
              lastMessage.content += chunk;
            }
            
            return newMessages;
          });
        },
        // Exclude the placeholder message from history
        history.slice(0, -1)  
      );

      // Mark streaming as complete
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        
        if (lastMessage && lastMessage.type === 'bot' && lastMessage.isStreaming) {
          lastMessage.isStreaming = false;
        }
        
        return newMessages;
      });

      // Fallback if streaming fails
      if (!streamSuccess) {
        const response = await generateResponse(userMessage, history.slice(0, -1));
        
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          
          if (lastMessage && lastMessage.type === 'bot') {
            lastMessage.content = response;
            lastMessage.isStreaming = false;
          }
          
          return newMessages;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      // Remove streaming message if there was an error
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        
        if (lastMessage && lastMessage.type === 'bot' && lastMessage.isStreaming) {
          // Replace with error message
          lastMessage.content = "I'm experiencing a technical issue. The team at Okamalabs is working to resolve this. Please try again in a moment.";
          lastMessage.isStreaming = false;
        }
        
        return newMessages;
      });
    } finally {
      setIsProcessing(false);
    }
  }, [getChatHistory]);

  // Clear chat history
  const clearChat = useCallback(() => {
    setMessages([
      { 
        type: 'bot', 
        content: initialGreeting,
        timestamp: Date.now() 
      }
    ]);
    setError(null);
  }, [initialGreeting]);

  return {
    messages,
    isProcessing,
    error,
    sendMessage,
    clearChat
  };
};

export default useChatbot; 