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
  // Map variants to Tailwind classes
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
  
  // Ripple effect for Android
  const [ripple, setRipple] = React.useState({ active: false, x: 0, y: 0 });
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    // Create ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRipple({ active: true, x, y });
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipple({ active: false, x: 0, y: 0 });
    }, 600);
    
    onClick();
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden rounded-md px-4 py-2 min-h-[48px] min-w-[64px] flex items-center justify-center gap-2 transition-all duration-200 ${variantClasses[variant][color]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {icon && <span className="material-icon">{icon}</span>}
      <span className="font-medium">{label}</span>
      
      {/* Ripple effect */}
      {ripple.active && (
        <span 
          className="absolute bg-white/20 rounded-full animate-ripple" 
          style={{
            top: ripple.y,
            left: ripple.x,
            width: '300%',
            height: '300%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </button>
  );
};

export default Button;