import React, { useState } from 'react';
import Section from './Section';
import ProjectCard from './ProjectCard';
import projectsData from '../data/projects.json';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

// Note: We can remove this interface and projects array as we're using projectsData from json file
// interface Project {
//   id: number;
//   title: string;
//   description: string;
//   technologies: string[];
//   image: string;
//   github?: string;
//   demo?: string;
// }

// const projects: Project[] = [
//   {
//     id: 1,
//     title: "Cloud Infrastructure Management",
//     description: "AWS-based infrastructure management application with CI/CD pipelines, containerization, and automated deployment.",
//     technologies: ["AWS", "Terraform", "Docker", "GitHub Actions"],
//     image: "/images/projects/cloud-infra.jpg",
//     github: "https://github.com/amakodev/cloud-infrastructure"
//   },
//   {
//     id: 2,
//     title: "E-commerce Platform",
//     description: "Full-stack e-commerce solution with responsive design, secure payment processing, and comprehensive admin dashboard.",
//     technologies: ["React", "Node.js", "MongoDB", "Stripe"],
//     image: "/images/projects/ecommerce.jpg",
//     demo: "https://ecommerce-demo.amakodev.com"
//   },
//   {
//     id: 3,
//     title: "Real-time Analytics Dashboard",
//     description: "Data visualization platform with real-time updates, custom filtering options, and exportable reports.",
//     technologies: ["Vue.js", "Express", "PostgreSQL", "Socket.io"],
//     image: "/images/projects/analytics.jpg",
//     github: "https://github.com/amakodev/analytics-dashboard",
//     demo: "https://analytics.amakodev.com"
//   }
// ];

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  
  // Extract all unique technologies from projects
  const allTechnologies = Array.from(
    new Set(
      projectsData.projects.flatMap(project => project.technologies)
    )
  ).sort();
  
  // Filter projects based on search term and selected tech
  const filteredProjects = projectsData.projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTech = selectedTech ? project.technologies.includes(selectedTech) : true;
    
    return matchesSearch && matchesTech;
  });
  
  return (
    <Section>
      <div className="space-y-12">
        {/* Intro section with animation */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl font-bold mb-3 inline-block gradient-text"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{ 
              backgroundImage: 'linear-gradient(90deg, #3b82f6, #a855f7, #6366f1, #3b82f6)',
              backgroundSize: '300% 100%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            A collection of my recent work showcasing skills in web development, 
            UI/UX design, and application architecture.
          </motion.p>
        </motion.div>
        
        {/* Search and filter */}
        <motion.div 
          className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-80 bg-gray-800/80 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto hide-scrollbar py-2">
            <div className="flex items-center space-x-2 text-gray-400 whitespace-nowrap">
              <Filter size={16} />
              <span className="text-sm">Filter:</span>
            </div>
            
            <div className="flex space-x-2">
              <motion.button
                onClick={() => setSelectedTech(null)}
                className={`text-xs py-1 px-3 rounded-full transition-all ${
                  selectedTech === null
                    ? 'bg-blue-500/80 text-white'
                    : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                All
              </motion.button>
              
              {allTechnologies.map(tech => (
                <motion.button
                  key={tech}
                  onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                  className={`text-xs py-1 px-3 rounded-full whitespace-nowrap transition-all ${
                    tech === selectedTech
                      ? 'bg-blue-500/80 text-white'
                      : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tech}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Projects grid with alternating layout */}
        <div className="space-y-20">
          {filteredProjects.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-400">No projects match your search criteria.</p>
            </motion.div>
          ) : (
            filteredProjects.map((project, index) => (
              <ProjectCard
                key={index}
                project={{
                  ...project,
                  demo: project.live // Mapping live property to demo for ProjectCard component
                }}
              />
            ))
          )}
        </div>
      </div>
    </Section>
  );
};

export default Projects;