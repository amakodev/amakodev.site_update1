import React, { useState, useEffect, lazy, Suspense, useRef, useCallback, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Code2, Database, Globe, Brain, Sparkles, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import Header from './components/Header';
import Section from './components/Section';
import Navigation from './components/Navigation';
import FloatingContact from './components/FloatingContact';
import Hero from './components/Hero';

// Static import for ChatbotAgent
import ChatbotAgent from './components/ChatbotAgent';

// Defer non-critical components with proper loading boundaries
const ParallaxBackground = lazy(() => import('./components/ParallaxBackground'));
const Experience = lazy(() => 
  import(/* webpackChunkName: "experience" */ './components/Experience')
    .then(module => ({ default: module.default }))
);
const Skills = lazy(() => 
  import(/* webpackChunkName: "skills" */ './components/Skills')
    .then(module => ({ default: module.default }))
);
const Projects = lazy(() => 
  import(/* webpackChunkName: "projects" */ './components/Projects')
    .then(module => ({ default: module.default }))
);
const TourGuide = lazy(() => 
  import(/* webpackChunkName: "tour-guide" */ './components/TourGuide')
    .then(module => ({ default: module.default }))
);

// Simple, lightweight loading placeholder
const LoadingPlaceholder = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-pulse bg-gray-800/80 rounded-xl p-8 flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-blue-500/30 mb-4"></div>
      <div className="h-2 w-24 bg-gray-700 rounded mb-2"></div>
      <div className="h-2 w-32 bg-gray-700 rounded"></div>
    </div>
  </div>
);

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [showTourGuide, setShowTourGuide] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const sections = useMemo(() => ['Introduction', 'Experience', 'Skills', 'Projects'], []);
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);

  // Check for low-end device once on mount
  useEffect(() => {
    // Check device capabilities
    const isLowEnd = 
      window.navigator.hardwareConcurrency <= 4 || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    setIsLowEndDevice(isLowEnd);
    
    // Reduce initial loading time based on device capability
    const loadTime = isLowEnd ? 800 : 1000;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, loadTime);
    return () => clearTimeout(timer);
  }, []);
  
  // Optimize parallax effect with reduced motion sensitivity
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"]
  });
  
  const smoothScrollYProgress = useSpring(scrollYProgress, { 
    stiffness: isLowEndDevice ? 50 : 100, 
    damping: isLowEndDevice ? 20 : 30 
  });
  
  const contentY = useTransform(
    smoothScrollYProgress, 
    [0, 1], 
    isLowEndDevice ? ['0%', '2%'] : ['0%', '5%']
  );
  
  const contentOpacity = useTransform(
    smoothScrollYProgress, 
    [0, 0.5], 
    [1, isLowEndDevice ? 0.9 : 0.8]
  );

  // Optimized scroll detection with debouncing
  useEffect(() => {
    let scrollTimeout: number;
    
    const handleScroll = () => {
      // Clear previous timeout to debounce
      window.clearTimeout(scrollTimeout);
      
      // Only set state if needed
      if (window.scrollY > 100 && !hasScrolled) {
        setHasScrolled(true);
      }
      
      // Debounce further scroll handling
      scrollTimeout = window.setTimeout(() => {
        // Additional scroll handling if needed
      }, 100);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasScrolled]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleNext = useCallback(() => {
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  }, [sections.length]);

  const handlePrev = useCallback(() => {
    setCurrentSection((prev) => Math.max(prev - 1, 0));
  }, []);

  // Optimized key navigation
  useEffect(() => {
    const handleKeyNavigation = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    
    window.addEventListener('keydown', handleKeyNavigation);
    return () => window.removeEventListener('keydown', handleKeyNavigation);
  }, [handleNext, handlePrev]);

  // Simplified animation variants for better performance
  const pageVariants = useMemo(() => ({
    initial: { opacity: 0, x: isLowEndDevice ? 20 : 50, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: isLowEndDevice ? -20 : -50, scale: 0.98 }
  }), [isLowEndDevice]);

  // Enhanced loader with simplified animation for fast initial render
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6 transform-gpu">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-full blur-xl opacity-70" 
                 style={{ transform: 'scale(1.1)' }}></div>
            <div className="relative animate-pulse">
              <Sparkles size={60} className="text-blue-300" />
            </div>
          </div>
          
          <div>
            <p className="text-2xl font-light tracking-wider text-blue-100 animate-pulse">
              Loading Experience
            </p>
            <div className="mt-2 flex justify-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"/>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-100"/>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-200"/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-x-hidden">
      {/* Defer background render for faster initial paint */}
      <Suspense fallback={null}>
        <ParallaxBackground />
      </Suspense>

      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
        <Navigation 
          sections={sections} 
          currentSection={currentSection} 
          onSelect={setCurrentSection} 
        />
      </div>
      
      {/* Add padding to account for fixed header */}
      <div className="pt-32 md:pt-40">
        <motion.div 
          className="relative z-10 pb-24 md:pb-32" 
          ref={mainRef}
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <main className="container mx-auto px-4 py-8 relative mb-20">
            <div className="flex items-center justify-between mb-12">
              <motion.button
                whileHover={!isLowEndDevice ? { scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.4)' } : undefined}
                whileTap={!isLowEndDevice ? { scale: 0.95 } : undefined}
                onClick={handlePrev}
                disabled={currentSection === 0}
                className={`p-3 rounded-full bg-blue-500/20 backdrop-blur-md transition-all ${
                  currentSection === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500/30 hover:border-blue-400'
                } transform-gpu`}
                aria-label="Previous section"
              >
                <ChevronLeft size={24} />
                <span className="sr-only">Previous</span>
              </motion.button>
              
              <h2 className="text-4xl font-bold text-center transition-opacity duration-300 transform-gpu">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-violet-400">
                  {sections[currentSection]}
                </span>
              </h2>
              
              <motion.button
                whileHover={!isLowEndDevice ? { scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.4)' } : undefined}
                whileTap={!isLowEndDevice ? { scale: 0.95 } : undefined}
                onClick={handleNext}
                disabled={currentSection === sections.length - 1}
                className={`p-3 rounded-full bg-blue-500/20 backdrop-blur-md transition-all ${
                  currentSection === sections.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500/30 hover:border-blue-400'
                } transform-gpu`}
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
                transition={{ 
                  type: "spring", 
                  stiffness: isLowEndDevice ? 200 : 300, 
                  damping: isLowEndDevice ? 25 : 30 
                }}
                className="glass-card backdrop-blur-md shadow-2xl overflow-hidden relative transform-gpu"
                style={{ boxShadow: '0 20px 80px -20px rgba(59, 130, 246, 0.3)' }}
              >
                {!isLowEndDevice && (
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
                  </div>
                )}

                <Suspense fallback={<LoadingPlaceholder />}>
                  {currentSection === 0 && <Hero onNavigate={setCurrentSection} />}
                  {currentSection === 1 && (
                    <Suspense fallback={<LoadingPlaceholder />}>
                      <Experience />
                    </Suspense>
                  )}
                  {currentSection === 2 && (
                    <Suspense fallback={<LoadingPlaceholder />}>
                      <Skills />
                    </Suspense>
                  )}
                  {currentSection === 3 && (
                    <Suspense fallback={<LoadingPlaceholder />}>
                      <Projects />
                    </Suspense>
                  )}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </main>
        </motion.div>
      </div>

      {/* Render ChatbotAgent directly */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatbotAgent />
      </div>

      {/* Conditionally render TourGuide with Suspense */}
      {showTourGuide && (
        <Suspense fallback={null}>
          <TourGuide 
            currentSection={currentSection}
            onClose={() => setShowTourGuide(false)} 
          />
        </Suspense>
      )}
      
      {/* Conditionally render FloatingContact with Suspense */}
      {hasScrolled && (
        <Suspense fallback={null}>
          <FloatingContact />
        </Suspense>
      )}
    </div>
  );
}

// Use memo to prevent unnecessary re-renders of the entire app
export default React.memo(App);