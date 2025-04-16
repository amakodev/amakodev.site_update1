import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Bot, Sparkles, Brain, 
  ChevronDown, ChevronUp, Loader2, RefreshCw, 
  ExternalLink, Copy, CheckCheck, Settings,
  Zap, Flame
} from 'lucide-react';
import { useChatbot, Message } from '../hooks/useChatbot';
import chatbotData from '../data/chatbot.json';

const ChatbotAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chatbot using our custom hook with the greeting from chatbot.json
  const { 
    messages, 
    isProcessing, 
    error, 
    sendMessage, 
    clearChat 
  } = useChatbot({ 
    initialGreeting: "👋 Welcome! I'm OkamaAI by Okamalabs. I'm here to assist with information about Amako Dev's experience, skills, and projects. How can I help you today?" 
  });

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

  // Set unread flag if new message arrives while minimized/closed
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.type === 'bot' && (!isOpen || isMinimized) && !lastMessage.isStreaming) {
      setHasUnreadMessages(true);
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userMessage = input.trim();
    setInput('');
    await sendMessage(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Copy message to clipboard
  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedMessage(index);
    setTimeout(() => setCopiedMessage(null), 2000);
  };

  // Suggest questions that users can click to ask
  const suggestions = [
    "Tell me about your skills",
    "What projects have you worked on?",
    "How can we connect?"
  ];

  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-3 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        aria-label="Open chat assistant"
      >
        <div className="relative ">
          <Flame size={22} className="text-white" />
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
            className={`absolute ${isMinimized ? 'bottom-full right-0 mb-2' : 'bottom-full right-0 mb-4'} w-96 ${
              isMinimized ? 'max-h-16' : 'max-h-[600px]'
            } bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-pink-500/30 overflow-hidden z-50`}
            style={{ boxShadow: '0 10px 35px -5px rgba(236, 72, 153, 0.3)' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-3 bg-gradient-to-r from-pink-900/50 to-purple-900/50 border-b border-pink-500/30 flex items-center justify-between backdrop-blur-sm">
              <div className="flex items-center space-x-2">
                <div className="bg-pink-500/20 p-2 rounded-full">
                  <Zap className="text-pink-400" size={16} />
                </div>
                <span className="font-medium text-gray-200">
                  <span className="text-pink-400">Okama</span>
                  <span className="text-purple-400">AI</span>
                  <span className="text-xs ml-1 text-gray-400">by Okamalabs</span>
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <motion.button
                  onClick={clearChat}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-700/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Reset chat"
                  title="Reset chat"
                >
                  <RefreshCw size={14} />
                </motion.button>
                <motion.button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-700/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  {isMinimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-gray-700/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close chat"
                >
                  <X size={14} />
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
                  <div className="h-96 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-900/40 backdrop-blur-sm">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * (index % 5) }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} group`}
                      >
                        <div
                          className={`max-w-[90%] p-3 rounded-xl shadow-md relative ${
                            message.type === 'user'
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-sm'
                              : 'bg-gray-800 text-gray-100 rounded-bl-sm border border-pink-500/20'
                          }`}
                        >
                          {message.type === 'bot' && (
                            <div className="flex items-center space-x-2 mb-1.5">
                              <Flame size={14} className="text-pink-400" />
                              <span className="text-xs font-medium">
                                <span className="text-pink-400">Okama</span>
                                <span className="text-purple-400">AI</span>
                              </span>
                              <span className="text-xs text-gray-500 ml-auto">{formatTime(message.timestamp)}</span>
                            </div>
                          )}
                          
                          <div className="relative">
                            <p className="whitespace-pre-line text-sm">
                              {message.content}
                              {message.isStreaming && (
                                <span className="inline-block w-1.5 h-4 bg-current animate-pulse ml-0.5"></span>
                              )}
                            </p>
                            
                            {message.type === 'bot' && !message.isStreaming && (
                              <div className="absolute -right-1 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => copyToClipboard(message.content, index)}
                                  className="p-1 bg-gray-700 rounded-md text-gray-300 hover:text-white"
                                  title="Copy to clipboard"
                                >
                                  {copiedMessage === index ? <CheckCheck size={12} /> : <Copy size={12} />}
                                </motion.button>
                              </div>
                            )}
                          </div>
                          
                          {message.type === 'user' && (
                            <span className="text-xs text-pink-200 block text-right mt-1">{formatTime(message.timestamp)}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    
                    {isProcessing && !messages[messages.length - 1]?.isStreaming && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center space-x-2 text-gray-400"
                      >
                        <div className="bg-gray-800 p-2 rounded-xl rounded-bl-sm border border-pink-500/20 shadow-md">
                          <div className="flex items-center space-x-2">
                            <Loader2 size={14} className="text-pink-400 animate-spin" />
                            <span className="text-xs">Processing your request...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-2 bg-red-500/20 border border-red-500/50 rounded-md text-xs text-red-300"
                      >
                        {error}
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {messages.length === 1 && (
                    <div className="px-4 py-3 bg-pink-900/10 border-y border-pink-900/20">
                      <p className="text-xs text-gray-400 mb-2 font-medium">Try asking me:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className="text-xs bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 py-1.5 px-3 rounded-md transition-colors border border-pink-700/30"
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

                  <div className="p-3 border-t border-gray-700/50 bg-gray-800/80 backdrop-blur-sm">
                    <div className="flex space-x-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything..."
                        className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-600/50"
                        disabled={isProcessing}
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSend}
                        disabled={isProcessing || !input.trim()}
                        className={`bg-gradient-to-r from-pink-600 to-purple-600 text-white p-2.5 rounded-lg transition-all ${
                          isProcessing || !input.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-pink-500/30'
                        }`}
                      >
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      </motion.button>
                    </div>
                    <div className="mt-2 text-center flex items-center justify-center space-x-1">
                      <Flame size={10} className="text-pink-400" />
                      <span className="text-xs text-gray-500">Powered by <span className="text-pink-400">Okama</span><span className="text-purple-400">Labs</span></span>
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