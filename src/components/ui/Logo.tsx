import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', variant = 'dark' }) => {
  const sizeClasses = {
    sm: {
      main: 'text-xl',
      tagline: 'text-[10px]',
      gap: 'gap-0',
    },
    md: {
      main: 'text-2xl',
      tagline: 'text-xs',
      gap: 'gap-0',
    },
    lg: {
      main: 'text-4xl',
      tagline: 'text-base',
      gap: 'gap-1',
    },
  };

  const currentSize = sizeClasses[size];
  
  const mainTextColor = variant === 'light' ? 'text-white' : 'text-foreground';
  const primaryTextColor = 'text-primary';
  const taglineColor = variant === 'light' ? 'text-white/80' : 'text-muted-foreground';

  return (
    <div className={`flex flex-col items-center ${currentSize.gap} ${className}`}>
      <div className="flex items-center gap-1 leading-none">
        <span className={`${currentSize.main} font-black ${mainTextColor} tracking-tighter italic drop-shadow-sm`}>
          Pretty
        </span>
        <span className={`${currentSize.main} font-black ${primaryTextColor} tracking-tighter italic drop-shadow-sm`}>
          Bunny
        </span>
        <span className={`${primaryTextColor} ${size === 'lg' ? 'text-2xl' : 'text-xl'} animate-pulse`}>◆</span>
      </div>
      <span 
        className={`${currentSize.tagline} font-medium ${taglineColor} italic tracking-wide leading-none`}
        style={{ fontFamily: "'Segoe UI', 'cursive', sans-serif" }}
      >
        Gia Đình Thỏ Xinh
      </span>
    </div>
  );
};

export default Logo;
