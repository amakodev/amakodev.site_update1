import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  const lastTimeRef = useRef<number>(0);
  const [lowPerformanceMode, setLowPerformanceMode] = useState(false);
  
  // Parallax effect based on scroll with reduced sensitivity
  const { scrollYProgress } = useScroll();
  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });
  const backgroundY = useTransform(smoothScrollY, [0, 1], ['0%', '20%']);
  
  // Particle class for 3D star field effect with optimized calculations
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
    friction: number = 0.92; // Increased friction for less CPU usage
    
    constructor(
      canvasWidth: number, 
      canvasHeight: number, 
      depth: number, 
      colors: string[]
    ) {
      this.x = Math.random() * canvasWidth - canvasWidth / 2;
      this.y = Math.random() * canvasHeight - canvasHeight / 2;
      this.z = Math.random() * depth;
      this.radius = Math.random() * 1.2 + 0.3; // Smaller particles 
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.initialX = this.x;
      this.initialY = this.y;
      this.vx = 0;
      this.vy = 0;
    }
    
    update(mouseX: number, mouseY: number, canvasWidth: number, canvasHeight: number, delta: number, lowPerformance: boolean) {
      // Skip computation for offscreen particles in low performance mode
      if (lowPerformance && (
        this.x < -canvasWidth || 
        this.x > canvasWidth || 
        this.y < -canvasHeight || 
        this.y > canvasHeight
      )) {
        return;
      }
      
      // Parallax effect based on mouse position with reduced intensity
      const mouseXNormalized = (mouseX - canvasWidth / 2) / (canvasWidth / 2);
      const mouseYNormalized = (mouseY - canvasHeight / 2) / (canvasHeight / 2);
      
      // Calculate acceleration based on depth (z-value) with reduced sensitivity
      const depthFactor = this.z / 2000; 
      const targetX = this.initialX - mouseXNormalized * 30 * depthFactor;
      const targetY = this.initialY - mouseYNormalized * 30 * depthFactor;
      
      // Apply delta time for consistent motion regardless of frame rate
      const accelerationFactor = 0.008 * (delta / 16.67);
      
      // Smooth movement with acceleration and friction
      this.accX = (targetX - this.x) * accelerationFactor;
      this.accY = (targetY - this.y) * accelerationFactor;
      
      this.vx += this.accX;
      this.vy += this.accY;
      
      this.vx *= this.friction;
      this.vy *= this.friction;
      
      this.x += this.vx;
      this.y += this.vy;
    }
    
    draw(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, lowPerformance: boolean) {
      // Project 3D position to 2D screen
      const screenX = this.x + canvasWidth / 2;
      const screenY = this.y + canvasHeight / 2;
      const scale = 1000 / (1000 + this.z);
      
      // Skip rendering particles that are too small or offscreen
      if (scale < 0.2 || 
          screenX < -10 || 
          screenX > canvasWidth + 10 || 
          screenY < -10 || 
          screenY > canvasHeight + 10) {
        return;
      }
      
      // Calculate opacity based on depth
      const opacity = Math.min(1, scale * 1.5);
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(screenX, screenY, this.radius * scale, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = opacity;
      ctx.fill();
      
      // Add glow effect for closer particles - but skip in low performance mode
      if (scale > 0.8 && !lowPerformance) {
        ctx.beginPath();
        ctx.arc(screenX, screenY, this.radius * scale * 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = opacity * 0.15;
        ctx.fill();
      }
    }
  }
  
  // Initialize particles with count based on performance
  const initParticles = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const width = canvas.width;
    const height = canvas.height;
    
    // Detect if device is likely low-end
    const isLowEndDevice = 
      window.navigator.hardwareConcurrency <= 4 || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    setLowPerformanceMode(isLowEndDevice);
    
    const particleSettings: ParticleProps = {
      count: isLowEndDevice ? 80 : 150, // Reduced from 200
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
  }, []);
  
  // Animation loop with delta time for consistent animations
  const animate = useCallback((timestamp: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    // Calculate delta time for frame rate independent motion
    const delta = lastTimeRef.current ? timestamp - lastTimeRef.current : 16.67;
    lastTimeRef.current = timestamp;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particlesRef.current.forEach(particle => {
      particle.update(mouseRef.current.x, mouseRef.current.y, canvas.width, canvas.height, delta, lowPerformanceMode);
      particle.draw(ctx, canvas.width, canvas.height, lowPerformanceMode);
    });
    
    // Continue animation loop
    frameRef.current = requestAnimationFrame(animate);
  }, [lowPerformanceMode]);
  
  // Throttled resize handler
  const handleResize = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const dpr = lowPerformanceMode ? 1 : (window.devicePixelRatio || 1);
    
    // Set physical size but not visual size
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    // Scale canvas context for high DPI displays
    const ctx = canvas.getContext('2d');
    if (ctx && dpr > 1 && !lowPerformanceMode) {
      ctx.scale(dpr, dpr);
    }
    
    initParticles();
  }, [initParticles, lowPerformanceMode]);
  
  // Throttled mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Skip updates when throttling
    if (lastTimeRef.current && performance.now() - lastTimeRef.current < 16) {
      return;
    }
    
    mouseRef.current = {
      x: e.clientX,
      y: e.clientY
    };
  }, []);
  
  // Initialize canvas and start animation
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    // Set canvas dimensions
    handleResize();
    
    // Start animation
    frameRef.current = requestAnimationFrame(animate);
    
    // Add event listeners with throttling
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Cleanup
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [animate, handleResize, handleMouseMove]);
  
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
        style={{ 
          transform: lowPerformanceMode ? 'translateZ(0)' : undefined, // Hardware acceleration hint
          willChange: lowPerformanceMode ? 'auto' : 'transform' // Performance optimization
        }}
      />
      
      {/* Optimized gradient overlay - static element */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.08),rgba(17,24,39,0.5))] z-10" />
      
      {/* Simplified grid overlay for depth - static element with reduced opacity */}
      {!lowPerformanceMode && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] z-20"></div>
      )}
    </motion.div>
  );
};

export default React.memo(ParallaxBackground); 