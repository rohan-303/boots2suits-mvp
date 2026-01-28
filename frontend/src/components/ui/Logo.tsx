import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ className = '', variant = 'full', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-16',
    xl: 'h-24'
  };

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Icon: Chevron Tie */}
      <svg 
        viewBox="0 0 100 100" 
        className={`${sizeClasses[size]} w-auto`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Shield/Shape (Optional, keeping it clean for now) */}
        
        {/* The Tie Body */}
        <path 
          d="M50 30 L65 90 L50 100 L35 90 L50 30 Z" 
          className="fill-primary"
        />
        
        {/* The Knot (Chevron Style) */}
        <path 
          d="M35 15 L50 5 L65 15 L65 25 L50 35 L35 25 Z" 
          className="fill-accent"
        />

        {/* The "Collar" / Top Chevron above the knot */}
        <path 
          d="M25 15 L50 0 L75 15" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-primary-dark"
        />
      </svg>

      {variant === 'full' && (
        <div className={`font-bold leading-none ${textSizeClasses[size]}`}>
          <span className="text-primary-dark">BOOTS</span>
          <span className="text-accent">2</span>
          <span className="text-primary">SUITS</span>
        </div>
      )}
    </div>
  );
}
