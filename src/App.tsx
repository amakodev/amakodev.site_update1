import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ChevronRight, ChevronLeft, Code2, Database, Globe, Brain, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Section from './components/Section';
import Navigation from './components/Navigation';
// Lazy load components for better performance
const Experience = lazy(() => import('./components/Experience'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));
const TourGuide = lazy(() => import('./components/TourGuide'));
const ChatbotAgent = lazy(() => import('./components/ChatbotAgent'));

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [showTourGuide, setShowTourGuide] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const sections = ['Introduction', 'Experience', 'Skills', 'Projects', 'Contact'];

  // Simulate loading state for smoother initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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

  // Loader component
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-block"
          >
            <Sparkles size={40} className="text-blue-400" />
          </motion.div>
          <p className="mt-4 text-blue-300 font-light tracking-wide">Loading experience...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
      {/* Enhanced background with animated particles */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.08),rgba(17,24,39,0.4))]" />
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-60 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10">
        <Header />
        <Navigation 
          sections={sections} 
          currentSection={currentSection} 
          onSelect={setCurrentSection} 
        />
        
        <main className="container mx-auto px-4 py-8 relative">
          <div className="flex items-center justify-between mb-12">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              disabled={currentSection === 0}
              className={`p-3 rounded-full bg-blue-500/20 backdrop-blur-sm transition-colors border border-blue-500/30 ${
                currentSection === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500/30'
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
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                {sections[currentSection]}
              </span>
            </motion.h2>
            
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={currentSection === sections.length - 1}
              className={`p-3 rounded-full bg-blue-500/20 backdrop-blur-sm transition-colors border border-blue-500/30 ${
                currentSection === sections.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500/30'
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
              className="backdrop-blur-sm bg-gray-900/50 rounded-2xl border border-gray-800/60 shadow-xl"
            >
              <Suspense fallback={
                <div className="flex justify-center items-center h-80">
                  <Sparkles className="text-blue-400 animate-pulse" />
                  <span className="ml-2 text-blue-200">Loading...</span>
                </div>
              }>
                {currentSection === 0 && (
                  <Section>
                    <div className="text-center space-y-8 py-8">
                      <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="relative inline-block"
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-md opacity-70 animate-pulse" style={{ transform: 'scale(1.05)' }}></div>
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300"
                          alt="Profile"
                          className="w-36 h-36 rounded-full mx-auto border-4 border-blue-500/50 shadow-lg shadow-blue-500/30 relative z-10 object-cover"
                          loading="eager"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, type: "spring" }}
                      >
                        <h1 className="text-5xl font-bold mb-4 tracking-tight">John Developer</h1>
                        <p className="text-xl text-blue-300 mb-6 font-light">Full Stack Web Developer</p>
                      </motion.div>
                      <motion.div 
                        className="flex justify-center space-x-6 text-blue-400"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        <motion.div whileHover={{ y: -5, color: "#60A5FA" }} whileTap={{ scale: 0.9 }}>
                          <Code2 size={28} className="transition-all" />
                        </motion.div>
                        <motion.div whileHover={{ y: -5, color: "#60A5FA" }} whileTap={{ scale: 0.9 }}>
                          <Database size={28} className="transition-all" />
                        </motion.div>
                        <motion.div whileHover={{ y: -5, color: "#60A5FA" }} whileTap={{ scale: 0.9 }}>
                          <Globe size={28} className="transition-all" />
                        </motion.div>
                        <motion.div whileHover={{ y: -5, color: "#60A5FA" }} whileTap={{ scale: 0.9 }}>
                          <Brain size={28} className="transition-all" />
                        </motion.div>
                      </motion.div>
                      <motion.p 
                        className="max-w-xl mx-auto text-gray-300 leading-relaxed text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        Passionate full stack developer with 5+ years of experience building scalable web applications.
                        Specialized in React, Node.js, and cloud technologies. Let's build something amazing together!
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <button className="mt-4 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-medium py-3 px-8 rounded-full transform transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-lg shadow-blue-500/20">
                          View Resume
                        </button>
                      </motion.div>
                    </div>
                  </Section>
                )}

                {currentSection === 1 && <Experience />}
                {currentSection === 2 && <Skills />}
                {currentSection === 3 && <Projects />}
                {currentSection === 4 && <Contact />}
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
      </div>
    </div>
  );
}

export default App;