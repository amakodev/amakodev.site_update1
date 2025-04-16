import React, { useState, useRef, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

interface ProjectProps {
  project: {
    title: string;
    description: string;
    technologies: string[];
    image: string;
    github?: string;
    demo?: string;
  };
}

const ProjectCard: React.FC<ProjectProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for 3D tilting effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animations
  const springConfig = { damping: 15, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  
  // Handle mouse move for 3D effect
  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to card (0-1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Set mouse position as motion values (-0.5 to 0.5)
    mouseX.set(x - 0.5);
    mouseY.set(y - 0.5);
  };
  
  // Reset mouse position when mouse leaves
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };
  
  return (
    <motion.div
      ref={cardRef}
      className="flex flex-col lg:flex-row items-center gap-10"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      {/* Image container with 3D tilt effect */}
      <motion.div
        className="w-full lg:w-1/2 h-64 md:h-80 relative overflow-hidden rounded-xl"
        style={{
          perspective: 1000,
          transformStyle: "preserve-3d",
          rotateX,
          rotateY,
        }}
        whileHover={{ scale: 1.02 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full h-full relative">
          {/* Project image */}
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-500"
            style={{
              filter: isHovered ? "brightness(70%)" : "brightness(50%)",
            }}
          />
          
          {/* Gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 transition-opacity duration-300"
            style={{ opacity: isHovered ? 0.9 : 0.7 }}
          />
          
          {/* Project title overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-6 transition-all duration-300">
            <motion.h3
              className="text-xl md:text-2xl font-bold text-white text-center break-words"
              style={{
                textShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
                opacity: isHovered ? 0 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {project.title}
            </motion.h3>
          </div>
          
          {/* Links that appear on hover */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gray-900/80 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                aria-label="View GitHub repository"
              >
                <FiGithub size={22} />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gray-900/80 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                aria-label="View live demo"
              >
                <FiExternalLink size={22} />
              </a>
            )}
          </motion.div>
        </div>
      </motion.div>
      
      {/* Project details */}
      <div className="w-full lg:w-1/2 space-y-4">
        <motion.h3 
          className="text-xl md:text-2xl font-bold text-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {project.title}
        </motion.h3>
        
        <motion.p 
          className="text-gray-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {project.description}
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {project.technologies.map((tech, index) => (
            <span 
              key={index} 
              className="px-3 py-1 bg-gray-800 text-blue-400 text-xs rounded-full"
            >
              {tech}
            </span>
          ))}
        </motion.div>
        
        <motion.div 
          className="flex gap-4 pt-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
              aria-label="View GitHub repository"
            >
              <FiGithub size={16} />
              <span>View Code</span>
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400 transition-colors"
              aria-label="View live demo"
            >
              <FiExternalLink size={16} />
              <span>Live Demo</span>
            </a>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 