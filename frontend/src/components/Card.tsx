import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: 'primary' | 'warning' | 'danger' | 'none';
}

export function Card({ children, className = '', onClick, glow = 'none' }: CardProps) {
  const glowStyles = {
    primary: 'shadow-[0_0_20px_rgba(0,255,135,0.12)]',
    warning: 'shadow-[0_0_20px_rgba(255,184,0,0.12)]',
    danger: 'shadow-[0_0_20px_rgba(255,76,76,0.12)]',
    none: 'shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
  };

  return (
    <div
      className={`bg-[#111827] rounded-2xl border border-[#1F2937] ${glowStyles[glow]} transition-all duration-200 ${onClick ? 'cursor-pointer hover:bg-[#1a2235] hover:border-[#374151]' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
