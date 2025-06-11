
import React from 'react';
import { Button } from './button';

interface ButtonAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
}

interface ButtonContainerProps {
  buttons: ButtonAction[];
  containerPosition: {
    top: number;
    left: number;
  };
  className?: string;
}

export const ButtonContainer: React.FC<ButtonContainerProps> = ({
  buttons,
  containerPosition,
  className = ''
}) => {
  const containerStyle = {
    position: 'fixed' as const,
    top: `${containerPosition.top}px`,
    left: `${containerPosition.left}px`,
    zIndex: 1000,
    // Avoid hardware UI overlap
    paddingBottom: 'env(safe-area-inset-bottom)',
    paddingTop: 'env(safe-area-inset-top)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
  };

  return (
    <div 
      style={containerStyle}
      className={`flex flex-col gap-2 bg-black/80 backdrop-blur-sm border border-matrix-green/30 rounded-lg p-2 ${className}`}
    >
      {buttons.map((button, index) => (
        <Button
          key={index}
          onClick={button.onClick}
          variant={button.variant || 'outline'}
          disabled={button.disabled}
          className="min-h-[44px] text-matrix-green border-matrix-green hover:bg-matrix-green/20"
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
};
