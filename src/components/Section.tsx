import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  children: ReactNode;
}

const Section = ({ children }: SectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-8 shadow-xl border border-gray-700/50"
    >
      {children}
    </motion.div>
  );
};

export default Section;