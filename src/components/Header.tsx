import React, { useState, useEffect, useCallback, memo } from 'react';
import { Coffee, Github, Linkedin, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference once on mount
  useEffect(() => {
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Optimized scroll handler with passive event and throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        // Use requestAnimationFrame to throttle the scroll event
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialLinks = [
    { name: 'GitHub', icon: <Github size={20} />, url: 'https://github.com/johndeveloper' },
    { name: 'LinkedIn', icon: <Linkedin size={20} />, url: 'https://linkedin.com/in/johndeveloper' },
  ];

  // Memoized toggle handler for mobile menu
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-colors backdrop-blur-md ${
        isScrolled 
          ? 'bg-gray-900/80 shadow-sm' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ willChange: 'transform' }}
    >
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-3 transform-gpu">
          {!prefersReducedMotion ? (
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Coffee className="text-blue-400" size={24} />
            </motion.div>
          ) : (
            <Coffee className="text-blue-400" size={24} />
          )}
          <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">DevPortfolio</span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            {socialLinks.map((link) => (
              <li key={link.name} className="transform-gpu">
                {!prefersReducedMotion ? (
                  <motion.a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors"
                    aria-label={link.name}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-blue-400">{link.icon}</span>
                    <span>{link.name}</span>
                  </motion.a>
                ) : (
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
                )}
              </li>
            ))}
            <li className="transform-gpu">
              {!prefersReducedMotion ? (
                <motion.a 
                  href="/resume.pdf" 
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-full text-sm font-medium hover:shadow-md transition-shadow"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Resume
                </motion.a>
              ) : (
                <a 
                  href="/resume.pdf" 
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-full text-sm font-medium hover:shadow-md transition-shadow"
                >
                  Resume
                </a>
              )}
            </li>
          </ul>
        </nav>

        {/* Mobile menu button - optimized */}
        <button
          className="md:hidden text-gray-300 hover:text-white focus:outline-none transform-gpu"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu - simplified animation */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden bg-gray-800/90 backdrop-blur-md border-t border-gray-700 transform-gpu mobile-menu-animation"
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
        </div>
      )}
    </motion.header>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(Header);