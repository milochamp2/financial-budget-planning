'use client';

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlassCard({ children, className = '', glowColor }: GlassCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/5 backdrop-blur-xl
        border border-white/10
        shadow-2xl
        transition-all duration-300
        hover:bg-white/[0.07] hover:border-white/20
        ${className}
      `}
      style={
        glowColor
          ? {
              boxShadow: `0 0 40px -10px ${glowColor}`,
            }
          : undefined
      }
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
