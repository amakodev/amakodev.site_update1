import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import profile from '../data/profile.json';

interface HeroProps {
  onNavigate: (index: number) => void;
}

const Hero = ({ onNavigate }: HeroProps) => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Building powerful web experiences';
  const unsplashImage = "https://images.unsplash.com/photo-1545670723-196ed0954986?auto=format&fit=crop&q=80&w=2952&ixlib=rb-4.0.3";
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(prev => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    
    return () => clearInterval(typingInterval);
  }, []);

  // Handle navigation to different sections
  const handleNavigate = (sectionIndex: number) => {
    // Ensure navigation function is called
    if (onNavigate) {
      onNavigate(sectionIndex);
    }
  };

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 pb-8">
          <motion.div 
            className="w-full md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-violet-500">{profile.name}</span>
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-300 mb-4">
              {profile.title}
            </h2>
            <div className="h-8 mb-6">
              <span className="text-lg md:text-xl text-blue-400">{typedText}<span className="animate-pulse">|</span></span>
            </div>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto md:mx-0">
              {profile.bio}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <motion.button 
                onClick={() => handleNavigate(3)} // Navigate to Projects section
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-semibold rounded-lg transition duration-300 shadow-lg shadow-blue-500/20"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                View Projects
              </motion.button>
              <motion.button
                onClick={() => handleNavigate(1)} // Navigate to Experience section
                className="px-5 py-2.5 border border-blue-600 text-blue-500 hover:bg-blue-900/20 font-semibold rounded-lg transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Experience
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-8 md:mt-0 w-full md:w-1/2 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl w-full max-w-md mx-auto">
              {/* Decorative elements */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/30 rounded-full blur-xl z-0"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-purple-500/30 rounded-full blur-xl z-0"></div>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-900/80 via-transparent to-transparent z-10"></div>
              
              {/* Hero image */}
              <img 
                src={unsplashImage}
                alt="Developer workspace"
                className="w-full h-auto object-cover z-0"
                style={{ maxHeight: '480px' }}
              />
              
              {/* Floating badge */}
              <motion.div 
                className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-gradient-to-r from-blue-600/90 to-violet-600/90 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-lg z-20"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs md:text-sm font-medium text-white">Ready for new projects</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 