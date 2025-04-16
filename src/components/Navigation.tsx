import React from 'react';
import { motion } from 'framer-motion';

interface NavigationProps {
  sections: string[];
  currentSection: number;
  onSelect: (index: number) => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
  sections, 
  currentSection, 
  onSelect 
}) => {
  return (
    <nav className="py-6 px-4 mb-8">
      <div className="max-w-4xl mx-auto relative">
        {/* Background with blur effect */}
        <div className="absolute inset-0 bg-gray-800/30 backdrop-blur-sm rounded-full border border-gray-700/50"></div>
        
        {/* Navigation items */}
        <ul className="relative flex justify-between items-center px-2 py-2 md:px-4 overflow-x-auto hide-scrollbar">
          {sections.map((section, index) => (
            <li key={section} className="relative px-1 md:px-2">
              <motion.button
                className={`relative px-3 py-2 md:px-4 rounded-full text-sm md:text-base whitespace-nowrap transition-colors ${
                  currentSection === index 
                    ? 'text-white font-medium' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => onSelect(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-current={currentSection === index ? 'page' : undefined}
              >
                {section}
                
                {/* Highlight for current section */}
                {currentSection === index && (
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/80 to-violet-500/80 rounded-full -z-10"
                    layoutId="navBackground"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                  />
                )}
              </motion.button>
              
              {/* Active indicator dot */}
              <motion.div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: currentSection === index ? 1 : 0,
                  scale: currentSection === index ? 1 : 0
                }}
                transition={{ duration: 0.2 }}
              />
            </li>
          ))}
        </ul>
      </div>
      
      {/* Progress bar */}
      <div className="max-w-4xl mx-auto mt-6 px-4">
        <div className="bg-gray-700/30 h-1 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
            initial={{ width: `${(currentSection / (sections.length - 1)) * 100}%` }}
            animate={{ width: `${(currentSection / (sections.length - 1)) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Start</span>
          <span>Progress</span>
          <span>End</span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;