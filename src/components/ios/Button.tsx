import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'filled' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error';
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'filled',
  color = 'primary',
  icon,
  disabled = false,
  className = ''
}) => {
  // Map variants to Tailwind classes (iOS style)
  const variantClasses = {
    filled: {
      primary: 'bg-analyst-accent text-white',
      secondary: 'bg-analyst-green text-white',
      error: 'bg-red-500 text-white'
    },
    outlined: {
      primary: 'border border-analyst-accent text-analyst-accent',
      secondary: 'border border-analyst-green text-analyst-green',
      error: 'border border-red-500 text-red-500'
    },
    text: {
      primary: 'text-analyst-accent',
      secondary: 'text-analyst-green',
      error: 'text-red-500'
    }
  };
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`rounded-full px-4 py-2 min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 transition-all duration-200 ${variantClasses[variant][color]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:opacity-70 cursor-pointer'} ${className}`}
    >
      {icon && <span className="ios-icon">{icon}</span>}
      <span className="font-semibold">{label}</span>
    </button>
  );
};

export default Button;