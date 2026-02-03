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
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-6xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon: The Realistic Tie */}
      <div className="relative flex items-center justify-center">
        <svg 
          viewBox="0 0 100 100" 
          className={`${sizeClasses[size]} w-auto drop-shadow-sm`}
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* The Knot - Classic Trapezoid */}
          <path 
            d="M38 5 L62 5 L58 25 L42 25 Z" 
            className="fill-primary-dark"
          />
          
          {/* The Body - Long and Tapered */}
          <path 
            d="M42 25 L58 25 L65 90 L50 100 L35 90 Z" 
            className="fill-primary"
          />

          {/* The "Tie Clip" - A Gold Chevron/Bar */}
          <path 
            d="M38 45 L50 52 L62 45 L62 50 L50 57 L38 50 Z" 
            className="fill-accent"
          />
          
          {/* Subtle shine/fold line on the right side for depth */}
          <path 
            d="M58 25 L65 90 L50 100 L50 25 Z" 
            className="fill-black/10"
          />
        </svg>
      </div>

      {variant === 'full' && (
        <div className={`leading-none flex flex-col justify-center ${textSizeClasses[size]}`}>
          <div className="flex items-center tracking-tighter font-heading font-bold">
            <span className="text-primary-dark">BOOTS</span>
            <span className="text-accent mx-1">2</span>
            <span className="text-primary">SUITS</span>
          </div>
        </div>
      )}
    </div>
  );
}
