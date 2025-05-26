
"use client";

import React, { useEffect, useState, useRef } from 'react';

interface ConfettiParticle {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  animationDelay: string;
  animationDuration: string;
}

const colors = [
  'hsl(var(--accent))', // Orange
  'hsl(var(--primary))', // Sky Blue
  '#FFD700', // Gold
  '#FF69B4', // Hot Pink
  '#32CD32', // Lime Green
];

const ConfettiEffect: React.FC<{ trigger: boolean }> = ({ trigger }) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger) {
      const newParticles: ConfettiParticle[] = [];
      const numParticles = 50 + Math.random() * 50; // 50 to 100 particles

      for (let i = 0; i < numParticles; i++) {
        newParticles.push({
          id: `particle-${Date.now()}-${i}`,
          x: Math.random() * 100, // percentage for vw
          y: -10 - Math.random() * 20, // percentage for vh, start above screen
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 5 + 5, // 5px to 10px
          animationDelay: `${Math.random() * 1}s`,
          animationDuration: `${2 + Math.random() * 2}s`, // 2 to 4 seconds fall time
        });
      }
      setParticles(newParticles);

      // Clear particles after animation
      const maxDuration = 4000; // Corresponds to max animationDuration
      const timer = setTimeout(() => {
        setParticles([]);
      }, maxDuration);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!particles.length) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-[200] overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: p.animationDelay,
            animationName: 'fall', // Make sure 'fall' keyframes are in globals.css
            animationDuration: p.animationDuration,
            // Add random horizontal movement to fall animation in globals.css if desired
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;
