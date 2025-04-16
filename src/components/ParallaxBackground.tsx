import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParticleProps {
  count: number;
  depth: number;
  colors: string[];
}

const ParallaxBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);
  
  // Parallax effect based on scroll
  const { scrollYProgress } = useScroll();
  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const backgroundY = useTransform(smoothScrollY, [0, 1], ['0%', '30%']);
  
  // Particle class for 3D star field effect
  class Particle {
    x: number;
    y: number;
    z: number;
    radius: number;
    color: string;
    initialX: number;
    initialY: number;
    vx: number;
    vy: number;
    accX: number = 0;
    accY: number = 0;
    friction: number = 0.95;
    
    constructor(
      canvasWidth: number, 
      canvasHeight: number, 
      depth: number, 
      colors: string[]
    ) {
      this.x = Math.random() * canvasWidth - canvasWidth / 2;
      this.y = Math.random() * canvasHeight - canvasHeight / 2;
      this.z = Math.random() * depth;
      this.radius = Math.random() * 1.5 + 0.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.initialX = this.x;
      this.initialY = this.y;
      this.vx = 0;
      this.vy = 0;
    }
    
    update(mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number) {
      // Parallax effect based on mouse position
      const mouseXNormalized = (mouseX - canvasWidth / 2) / (canvasWidth / 2);
      const mouseYNormalized = (mouseY - canvasHeight / 2) / (canvasHeight / 2);
      
      // Calculate acceleration based on depth (z-value)
      const depthFactor = this.z / 1000;
      const targetX = this.initialX - mouseXNormalized * 50 * depthFactor;
      const targetY = this.initialY - mouseYNormalized * 50 * depthFactor;
      
      // Smooth movement with acceleration and friction
      this.accX = (targetX - this.x) * 0.01;
      this.accY = (targetY - this.y) * 0.01;
      
      this.vx += this.accX;
      this.vy += this.accY;
      
      this.vx *= this.friction;
      this.vy *= this.friction;
      
      this.x += this.vx;
      this.y += this.vy;
    }
    
    draw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
      // Project 3D position to 2D screen
      const screenX = this.x + canvasWidth / 2;
      const screenY = this.y + canvasHeight / 2;
      const scale = 1000 / (1000 + this.z);
      
      // Calculate opacity based on depth
      const opacity = Math.min(1, scale * 2);
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(screenX, screenY, this.radius * scale, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = opacity;
      ctx.fill();
      
      // Add glow effect for closer particles
      if (scale > 0.8) {
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius * scale * 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = opacity * 0.2;
        ctx.fill();
      }
    }
  }
  
  // Initialize particles
  const initParticles = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    const particleSettings: ParticleProps = {
      count: 200,
      depth: 1000,
      colors: [
        'rgba(59, 130, 246, 0.8)',   // Blue
        'rgba(139, 92, 246, 0.8)',   // Purple
        'rgba(14, 165, 233, 0.8)',   // Sky blue
        'rgba(79, 70, 229, 0.8)',    // Indigo
        'rgba(236, 72, 153, 0.7)'    // Pink
      ]
    };
    
    particlesRef.current = [];
    for (let i = 0; i < particleSettings.count; i++) {
      particlesRef.current.push(
        new Particle(
          width, 
          height, 
          particleSettings.depth, 
          particleSettings.colors
        )
      );
    }
  };
  
  // Animation loop
  const animate = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particlesRef.current.forEach(particle => {
      particle.update(mouseRef.current.x, mouseRef.current.y, canvas.width, canvas.height);
      particle.draw(ctx, canvas.width, canvas.height);
    });
    
    // Continue animation loop
    frameRef.current = requestAnimationFrame(animate);
  };
  
  // Handle resize
  const handleResize = () => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    initParticles();
  };
  
  // Handle mouse move
  const handleMouseMove = (e: MouseEvent) => {
    mouseRef.current = {
      x: e.clientX,
      y: e.clientY
    };
  };
  
  // Initialize canvas and start animation
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    // Set canvas dimensions
    handleResize();
    
    // Start animation
    frameRef.current = requestAnimationFrame(animate);
    
    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <motion.div 
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ y: backgroundY }}
    >
      {/* 3D particle effect */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.12),rgba(17,24,39,0.6))] z-10" />
      
      {/* Grid overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:70px_70px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] z-20"></div>
    </motion.div>
  );
};

export default ParallaxBackground; 