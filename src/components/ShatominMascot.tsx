import React from 'react';
import { ShatominPlush } from './ShatominPlush';
import { ShatominExpression } from './ShatominAvatar';

interface ShatominMascotProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  mood?: 'happy' | 'excited' | 'peaceful' | 'curious';
  interactive?: boolean;
  onClick?: () => void;
}

export const ShatominMascot: React.FC<ShatominMascotProps> = ({
  className = '',
  size = 'hero',
  mood = 'happy',
  interactive = false,
  onClick,
}) => {
  const expressionMap: Record<string, ShatominExpression> = {
    happy: 'smile',
    excited: 'sparkle',
    peaceful: 'happy_closed',
    curious: 'wink',
  };

  const plushSizes = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
    xl: 'xl' as const,
    hero: 'xl' as const,
  };

  const containerScales = {
    sm: 'scale-90',
    md: 'scale-100',
    lg: 'scale-110',
    xl: 'scale-125',
    hero: 'scale-110 sm:scale-130 md:scale-140',
  };

  return (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-center select-none py-8 ${containerScales[size]} ${
        interactive ? 'cursor-pointer transition-transform hover:scale-105 active:scale-95' : ''
      } ${className}`}
    >
      <ShatominPlush
        expression={expressionMap[mood] || 'smile'}
        size={plushSizes[size]}
        animate={interactive}
        onClick={onClick}
      />
    </div>
  );
};
