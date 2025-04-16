import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles, Brain, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import chatbotData from '../data/chatbot.json';

interface Message {
  type: 'user' | 'bot';
  content: string;
  timestamp: number;
}

const ChatbotAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      type: 'bot', 
      content: chatbotData.responses.greeting,
      timestamp: Date.now() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset unread indicator when chat opens
  useEffect(() => {
    if (isOpen) {
      setHasUnreadMessages(false);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const userMessageObj = { type: 'user' as const, content: userMessage, timestamp: Date.now() };
    
    setMessages(prev => [...prev, userMessageObj]);
    setInput('');
    setIsTyping(true);

    // Determine response based on user input
    let response = chatbotData.responses.default;
    const lowerCase = userMessage.toLowerCase();
    
    if (lowerCase.includes('experience') || lowerCase.includes('work')) {
      response = chatbotData.responses.experience;
    } else if (lowerCase.includes('skill') || lowerCase.includes('know') || lowerCase.includes('tech')) {
      response = chatbotData.responses.skills;
    } else if (lowerCase.includes('project')) {
      response = chatbotData.responses.projects;
    } else if (lowerCase.includes('contact') || lowerCase.includes('reach') || lowerCase.includes('email')) {
      response = chatbotData.responses.contact;
    } else if (lowerCase.includes('hello') || lowerCase.includes('hi') || lowerCase.includes('hey')) {
      response = "👋 Hello! I'm John's AI assistant. How can I help you today?";
    } else if (lowerCase.includes('thank')) {
      response = "You're welcome! Is there anything else you'd like to know about John or his work?";
    }

    // Simulate AI thinking and typing with variable delay based on response length
    const thinkingTime = Math.min(1000 + response.length * 10, 3000);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', content: response, timestamp: Date.now() }]);
      setIsTyping(false);
      
      // Set unread flag if chat is minimized or closed
      if (!isOpen || isMinimized) {
        setHasUnreadMessages(true);
      }
    }, thinkingTime);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Suggest questions that users can click to ask
  const suggestions = [
    "What are your skills?",
    "Tell me about your projects",
    "How can I contact you?"
  ];

  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: '#3b82f6' }}
        whileTap={{ scale: 0.9 }}
        className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white flex items-center justify-center shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        aria-label="Open chat assistant"
      >
        <div className="relative">
          <MessageSquare size={20} />
          {hasUnreadMessages && (
            <motion.div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              height: isMinimized ? 'auto' : 'auto'
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`absolute ${isMinimized ? 'bottom-full right-0 mb-2' : 'bottom-full right-0 mb-4'} w-80 ${
              isMinimized ? 'max-h-16' : 'max-h-[500px]'
            } bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50`}
            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-3 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-500/20 p-1.5 rounded-full">
                  <Bot className="text-blue-400" size={18} />
                </div>
                <span className="font-medium text-gray-200">AI Assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-700/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close chat"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="h-80 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-900/50">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (index % 3) }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] p-3 rounded-xl shadow-md ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                              : 'bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700'
                          }`}
                        >
                          {message.type === 'bot' && (
                            <div className="flex items-center space-x-2 mb-1.5">
                              <Brain size={14} className="text-blue-400" />
                              <span className="text-xs font-medium text-blue-400">AI Assistant</span>
                              <span className="text-xs text-gray-500 ml-auto">{formatTime(message.timestamp)}</span>
                            </div>
                          )}
                          <p className="whitespace-pre-line text-sm">{message.content}</p>
                          {message.type === 'user' && (
                            <span className="text-xs text-blue-200 block text-right mt-1">{formatTime(message.timestamp)}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center space-x-2 text-gray-400"
                      >
                        <div className="bg-gray-800 p-2 rounded-xl rounded-bl-none border border-gray-700 shadow-md">
                          <div className="flex items-center space-x-2">
                            <Loader2 size={14} className="text-blue-400 animate-spin" />
                            <span className="text-xs">AI is thinking...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {messages.length === 1 && (
                    <div className="px-4 py-2 bg-gray-800/50">
                      <p className="text-xs text-gray-400 mb-2">Suggested questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 py-1 px-2 rounded-md transition-colors"
                            onClick={() => {
                              setInput(suggestion);
                              inputRef.current?.focus();
                            }}
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3 border-t border-gray-700 bg-gray-800/80">
                    <div className="flex space-x-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about John's work..."
                        className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                        disabled={isTyping}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: '#3b82f6' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        disabled={isTyping || !input.trim()}
                        className={`bg-blue-500 text-white p-2 rounded-lg transition-colors ${
                          isTyping || !input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                        }`}
                      >
                        <Send size={18} />
                      </motion.button>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-xs text-gray-500">Powered by AI</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotAgent;