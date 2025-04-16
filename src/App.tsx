import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import { ChevronRight, ChevronLeft, Code2, Database, Globe, Brain, Sparkles, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import Header from './components/Header';
import Section from './components/Section';
import Navigation from './components/Navigation';
import FloatingContact from './components/FloatingContact';
import ParallaxBackground from './components/ParallaxBackground';
import Hero from './components/Hero';

// Lazy load components for better performance
const Experience = lazy(() => import('./components/Experience'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const TourGuide = lazy(() => import('./components/TourGuide'));
const ChatbotAgent = lazy(() => import('./components/ChatbotAgent'));

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [showTourGuide, setShowTourGuide] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const sections = ['Introduction', 'Experience', 'Skills', 'Projects'];

  // Parallax effect for scrolling
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"]
  });
  
  const smoothScrollYProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const contentY = useTransform(smoothScrollYProgress, [0, 1], ['0%', '5%']);
  const contentOpacity = useTransform(smoothScrollYProgress, [0, 0.5], [1, 0.8]);

  // Simulate loading state for smoother initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Scroll detection for animation triggers
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !hasScrolled) {
        setHasScrolled(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolled]);

  const handleNext = () => {
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const handlePrev = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 0));
  };

  const handleKeyNavigation = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, x: 50, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -50, scale: 0.98 }
  };

  // Enhanced loader with animation sequence
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }
            }}
            className="relative mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full blur-xl opacity-70" 
                 style={{ transform: 'scale(1.1)' }}></div>
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <Sparkles size={60} className="text-blue-300" />
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.p 
              className="text-2xl font-light tracking-wider text-blue-100"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Crafting Experience
            </motion.p>
            <div className="mt-2 flex justify-center space-x-1">
              <motion.div
                className="w-2 h-2 rounded-full bg-blue-400"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-blue-400"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.3, delay: 0.1 }}
              />
              <motion.div
                className="w-2 h-2 rounded-full bg-blue-400"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.4, delay: 0.2 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-x-hidden">
      {/* Interactive 3D Parallax Background */}
      <ParallaxBackground />

      <motion.div 
        className="relative z-10 pb-24 md:pb-32" 
        ref={mainRef}
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <Header />
        <Navigation 
          sections={sections} 
          currentSection={currentSection} 
          onSelect={setCurrentSection} 
        />
        
        <main className="container mx-auto px-4 py-8 relative mb-20">
          <div className="flex items-center justify-between mb-12">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.4)', boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              disabled={currentSection === 0}
              className={`p-3 rounded-full bg-blue-500/20 backdrop-blur-md transition-all duration-300 border border-blue-500/30 ${
                currentSection === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500/30 hover:border-blue-400'
              }`}
              aria-label="Previous section"
            >
              <ChevronLeft size={24} />
              <span className="sr-only">Previous</span>
            </motion.button>
            
            <motion.h2 
              className="text-4xl font-bold text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={currentSection}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-violet-400 text-shadow">
                {sections[currentSection]}
              </span>
            </motion.h2>
            
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.4)', boxShadow: '0 0 15px rgba(59, 130, 246, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={currentSection === sections.length - 1}
              className={`p-3 rounded-full bg-blue-500/20 backdrop-blur-md transition-all duration-300 border border-blue-500/30 ${
                currentSection === sections.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500/30 hover:border-blue-400'
              }`}
              aria-label="Next section"
            >
              <ChevronRight size={24} />
              <span className="sr-only">Next</span>
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="glass-card backdrop-blur-md shadow-2xl overflow-hidden relative"
              style={{ boxShadow: '0 20px 80px -20px rgba(59, 130, 246, 0.3)' }}
            >
              {/* Glowing accent border animation */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <motion.div 
                  className="absolute top-0 -inset-x-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-violet-500"
                  animate={{ x: ['0%', '200%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute bottom-0 -inset-x-full h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-blue-500"
                  animate={{ x: ['200%', '0%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute right-0 -inset-y-full w-0.5 bg-gradient-to-b from-transparent via-blue-500 to-violet-500"
                  animate={{ y: ['0%', '200%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute left-0 -inset-y-full w-0.5 bg-gradient-to-b from-transparent via-violet-500 to-blue-500"
                  animate={{ y: ['200%', '0%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
              </div>

              <Suspense fallback={
                <div className="flex justify-center items-center h-96">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="text-blue-400" size={30} />
                  </motion.div>
                  <motion.span 
                    className="ml-3 text-blue-200 font-light tracking-wider"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Loading...
                  </motion.span>
                </div>
              }>
                {currentSection === 0 && <Hero onNavigate={setCurrentSection} />}
                {currentSection === 1 && <Experience />}
                {currentSection === 2 && <Skills />}
                {currentSection === 3 && <Projects />}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>

        {showTourGuide && (
          <Suspense fallback={null}>
            <TourGuide 
              currentSection={currentSection} 
              onClose={() => setShowTourGuide(false)} 
            />
          </Suspense>
        )}
        
        <Suspense fallback={null}>
          <ChatbotAgent />
        </Suspense>
        
        <Suspense fallback={null}>
          <FloatingContact />
        </Suspense>
      </motion.div>
    </div>
  );
}

export default App;