import React, { useState, useEffect } from 'react';
import { Sparkles, MessageCircle, X, ChevronRight, Lightbulb, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import tourData from '../data/tour.json';

interface TourGuideProps {
  currentSection: number;
  onClose: () => void;
}

// Create a type to match the structure in tour.json
type TourMessages = {
  [key: string]: string;
};

const TourGuide: React.FC<TourGuideProps> = ({ currentSection, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  // Use the explicit type for messages
  const [message, setMessage] = useState<string>(tourData.messages["0"]);
  const [currentTip, setCurrentTip] = useState(0);
  const [hasBeenSeen, setHasBeenSeen] = useState(false);

  // Array of general tips about the portfolio
  const tips = [
    "Use arrow keys to navigate between sections",
    "All animations are optimized for performance",
    "The site is fully responsive for all devices",
    "Try the chatbot for quick information access",
    "Every UI element has keyboard accessibility"
  ];

  useEffect(() => {
    // Access messages with string key
    const sectionKey = currentSection.toString() as keyof typeof tourData.messages;
    setMessage(tourData.messages[sectionKey] || tourData.messages["0"]);
    
    // Mark as seen after first viewing
    if (!hasBeenSeen) {
      setHasBeenSeen(true);
    }
  }, [currentSection, hasBeenSeen]);

  useEffect(() => {
    // Rotate through tips every 5 seconds
    const interval = setInterval(() => {
      setCurrentTip((prevTip) => (prevTip + 1) % tips.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          height: isMinimized ? 'auto' : 'auto'
        }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className={`fixed ${
          isMinimized ? 'bottom-16 right-4' : 'bottom-24 left-4 right-4 md:left-auto md:right-20'
        } max-w-sm ${
          isMinimized ? 'w-auto' : 'w-full sm:w-96'
        } bg-gradient-to-br from-blue-900/90 to-violet-900/90 backdrop-blur-lg rounded-xl shadow-2xl border border-blue-700/50 overflow-hidden z-40`}
        style={{ 
          boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.3)',
          maxHeight: 'calc(80vh - 100px)', // Limit height to prevent overflow
          overflowY: 'auto'
        }}
      >
        <div className="p-2">
          <div className="flex items-center justify-between gap-2 ">
            <div className="flex items-center space-x-2">
              <Sparkles className="text-yellow-300 animate-pulse" size={20} />
              <span className="font-semibold text-white">Guide</span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:text-blue-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isMinimized ? "Expand guide" : "Minimize guide"}
              >
                <Info size={18} />
              </motion.button>
              <motion.button
                onClick={() => setIsVisible(false)}
                className="text-white hover:text-blue-300 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close guide"
              >
                <X size={18} />
              </motion.button>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mt-3 flex space-x-3">
                  <div className="mt-1 bg-blue-400/20 p-1.5 rounded-full">
                    <MessageCircle className="text-blue-300" size={18} />
                  </div>
                  <div className="flex-1">
                    <motion.p 
                      className="text-white"
                      key={currentSection}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {message}
                    </motion.p>
                    
                    <div className="mt-4 bg-blue-500/20 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Lightbulb size={16} className="text-yellow-300 mt-0.5" />
                        <motion.p 
                          className="text-sm text-blue-100"
                          key={currentTip}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <span className="font-semibold">Tip:</span> {tips[currentTip]}
                        </motion.p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <motion.div 
                            key={i}
                            className={`h-1.5 rounded-full ${
                              i === currentSection 
                                ? 'bg-blue-400 w-6' 
                                : 'bg-gray-600 w-2'
                            }`}
                            animate={{
                              backgroundColor: i === currentSection 
                                ? '#60A5FA' 
                                : '#4B5563',
                              width: i === currentSection ? 24 : 8
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        ))}
                      </div>
                      <motion.button
                        onClick={onClose}
                        className="text-xs text-blue-300 flex items-center hover:text-white transition-colors"
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Dismiss Guide <ChevronRight size={14} className="ml-1" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.div
          className="h-1 bg-gradient-to-r from-blue-400 to-violet-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default TourGuide;