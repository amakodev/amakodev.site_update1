import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Send, Phone, MapPin, User, AtSign, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when form opens
  useEffect(() => {
    if (isOpen && inputRef.current && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Reset form after showing success message
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Contact info details
  const contactInfo = [
    { icon: <Mail size={16} />, text: "john@developer.com" },
    { icon: <Phone size={16} />, text: "+1 (555) 123-4567" },
    { icon: <MapPin size={16} />, text: "San Francisco, CA" }
  ];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5)' }}
        whileTap={{ scale: 0.9 }}
        className="p-3 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white flex items-center justify-center shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring" }}
      >
        <Mail size={20} />
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
            className={`absolute ${isMinimized ? 'bottom-full right-0 mb-2' : 'bottom-full right-0 mb-4'} w-full md:w-96 ${
              isMinimized ? 'max-h-16' : 'max-h-[70vh] md:max-h-[600px]'
            } bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-violet-500/30 overflow-hidden z-50`}
            style={{ 
              boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.3)',
              overflowY: 'auto'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-4 bg-gradient-to-r from-violet-900/80 to-purple-900/80 border-b border-violet-700/50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-violet-500/20 p-2 rounded-full">
                  <Mail className="text-violet-300" size={18} />
                </div>
                <span className="font-medium text-gray-100">Contact Me</span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-gray-300 hover:text-white transition-colors p-1 rounded-full hover:bg-violet-700/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isMinimized ? "Expand contact form" : "Minimize contact form"}
                >
                  {isMinimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-white transition-colors p-1 rounded-full hover:bg-violet-700/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close contact form"
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
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-5 bg-gray-900/30 backdrop-blur-sm">
                    {!isSuccess ? (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="mb-6">
                          <h3 className="text-lg font-medium text-white mb-2">Get in Touch</h3>
                          <p className="text-xs text-gray-400">Fill out the form below and I'll get back to you as soon as possible.</p>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <User size={16} className="text-gray-500" />
                            </div>
                            <input
                              ref={inputRef}
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Your name"
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all placeholder:text-gray-500"
                              required
                            />
                          </div>
                          
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <AtSign size={16} className="text-gray-500" />
                            </div>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Your email"
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all placeholder:text-gray-500"
                              required
                            />
                          </div>
                          
                          <div className="relative">
                            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                              <MessageSquare size={16} className="text-gray-500" />
                            </div>
                            <textarea
                              id="message"
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              rows={4}
                              placeholder="Your message"
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm transition-all placeholder:text-gray-500"
                              required
                            ></textarea>
                          </div>
                        </div>
                        
                        <motion.button
                          type="submit"
                          className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Send size={18} />
                            </motion.div>
                          ) : (
                            <Send size={18} />
                          )}
                          <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                        </motion.button>
                      </form>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-8"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4"
                        >
                          <Send className="text-green-500" size={28} />
                        </motion.div>
                        <h3 className="text-xl font-medium text-white mb-2">Message Sent!</h3>
                        <p className="text-sm text-gray-400 text-center">
                          Thanks for reaching out. I'll get back to you as soon as possible.
                        </p>
                      </motion.div>
                    )}
                    
                    <div className="mt-6 pt-4 border-t border-gray-800">
                      <div className="grid grid-cols-1 gap-2">
                        {contactInfo.map((info, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ x: 5 }}
                            className="flex items-center space-x-3 text-sm"
                          >
                            <div className="text-violet-400">{info.icon}</div>
                            <span className="text-gray-300">{info.text}</span>
                          </motion.div>
                        ))}
                      </div>
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

export default FloatingContact; 