import React, { useState, useEffect } from 'react';
import { Coffee, Github, Linkedin, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialLinks = [
    { name: 'GitHub', icon: <Github size={20} />, url: 'https://github.com/johndeveloper' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, url: 'https://linkedin.com/in/johndeveloper' },
  ];

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${
        isScrolled 
          ? 'bg-gray-900/80 shadow-lg shadow-blue-900/10' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            whileHover={{ rotate: 15 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            <Coffee className="text-blue-400" size={24} />
          </motion.div>
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">DevPortfolio</span>
        </motion.div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {socialLinks.map((link) => (
              <motion.li key={link.name} whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors"
                  aria-label={link.name}
                >
                  <span className="text-blue-400">{link.icon}</span>
                  <span>{link.name}</span>
                </a>
              </motion.li>
            ))}
            <motion.li whileHover={{ y: -3 }} whileTap={{ scale: 0.95 }}>
              <a 
                href="/resume.pdf" 
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all"
              >
                Resume
              </a>
            </motion.li>
          </ul>
        </nav>

        {/* Mobile menu button */}
        <motion.button
          className="md:hidden text-gray-300 hover:text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-800/90 backdrop-blur-md border-t border-gray-700"
          >
            <div className="container mx-auto py-4 px-6">
              <ul className="space-y-4">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 text-gray-300 hover:text-blue-400 transition-colors py-2"
                    >
                      <span className="text-blue-400">{link.icon}</span>
                      <span>{link.name}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a 
                    href="/resume.pdf" 
                    className="flex items-center space-x-3 text-blue-400 font-semibold py-2"
                  >
                    Resume
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;