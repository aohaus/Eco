import React from 'react';
import { ShatominAvatar, ShatominExpression } from './ShatominAvatar';

interface ShatominPlushProps {
  expression?: ShatominExpression;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
  onClick?: () => void;
  mood?: string;
  hat?: string;
  accessory?: string;
}

export const ShatominPlush: React.FC<ShatominPlushProps> = ({
  expression = 'smile',
  size = 'md',
  className = '',
  animate = true,
  onClick,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <ShatominAvatar
        expression={expression}
        size={size}
        animate={animate}
        onClick={onClick}
      />
    </div>
  );
};
