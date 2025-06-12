
import React, { useEffect, useState } from 'react';

interface ParticleProps {
  id: number;
  x: number;
  y: number;
  opacity: number;
  speed: number;
}

export const CyberpunkEffects: React.FC = () => {
  const [particles, setParticles] = useState<ParticleProps[]>([]);

  useEffect(() => {
    // Initialize particles
    const initialParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 2 + 0.5
    }));
    
    setParticles(initialParticles);

    // Animate particles
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        y: particle.y + particle.speed,
        opacity: particle.opacity * 0.995,
        // Reset particle when it goes off screen or fades out
        ...(particle.y > window.innerHeight || particle.opacity < 0.1 ? {
          y: -10,
          x: Math.random() * window.innerWidth,
          opacity: Math.random() * 0.5 + 0.1,
          speed: Math.random() * 2 + 0.5
        } : {})
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Matrix rain particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-4 bg-green-400/30 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.opacity,
            boxShadow: `0 0 4px rgba(34, 197, 94, ${particle.opacity})`
          }}
        />
      ))}
      
      {/* Scanlines effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/5 to-transparent animate-pulse pointer-events-none" 
           style={{
             backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.03) 2px, rgba(34, 197, 94, 0.03) 4px)',
           }}
      />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30 pointer-events-none" />
    </div>
  );
};
