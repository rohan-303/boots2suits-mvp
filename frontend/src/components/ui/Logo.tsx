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
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon: The "Rank & Tie" Emblem */}
      <div className="relative flex items-center justify-center">
        <svg 
          viewBox="0 0 100 100" 
          className={`${sizeClasses[size]} w-auto drop-shadow-md`}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Tie Body - Dark Green */}
          <path 
            d="M50 20 L70 95 L50 100 L30 95 L50 20 Z" 
            className="fill-primary"
            stroke="currentColor"
            strokeWidth="0"
          />
          
          {/* The Knot - Gold Hexagon (Strength) */}
          <path 
            d="M32 20 L50 8 L68 20 L68 32 L50 44 L32 32 Z" 
            className="fill-accent"
          />

          {/* Upward Chevrons inside the tie (Progress/Rank) */}
          <path 
            d="M40 85 L50 75 L60 85 L50 90 Z" 
            className="fill-accent/80"
          />
          <path 
            d="M40 70 L50 60 L60 70 L50 75 Z" 
            className="fill-accent/60"
          />
           <path 
            d="M40 55 L50 45 L60 55 L50 60 Z" 
            className="fill-accent/40"
          />
        </svg>
      </div>

      {variant === 'full' && (
        <div className={`leading-none flex flex-col justify-center ${textSizeClasses[size]}`}>
          <div className="flex items-baseline tracking-tight">
            <span className="font-serif font-black text-primary-dark tracking-wider">BOOTS</span>
            <span className="font-sans font-bold text-accent mx-0.5">2</span>
            <span className="font-sans font-light text-primary tracking-widest">SUITS</span>
          </div>
        </div>
      )}
    </div>
  );
}
