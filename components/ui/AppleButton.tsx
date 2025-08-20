/**
 * Apple HIG Compliant Button System
 * Follows Apple Human Interface Guidelines with golden ratio proportions
 */

import React, { memo, forwardRef, ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonShape = 'rounded' | 'pill' | 'square';

interface AppleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

/**
 * Apple-style loading spinner
 */
const LoadingSpinner: React.FC<{ size: ButtonSize }> = ({ size }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };

  return (
    <svg 
      className={`${sizeClasses[size]} animate-spin`} 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

/**
 * Get variant-specific styles following Apple's design system
 */
const getVariantStyles = (variant: ButtonVariant) => {
  const styles = {
    primary: {
      base: 'bg-blue-600 dark:bg-blue-500 text-white border border-blue-600 dark:border-blue-500',
      hover: 'hover:bg-blue-700 dark:hover:bg-blue-600 hover:border-blue-700 dark:hover:border-blue-600',
      active: 'active:bg-blue-800 dark:active:bg-blue-700',
      disabled: 'disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-300 dark:disabled:border-gray-700',
      focus: 'focus:ring-4 focus:ring-blue-500/30 dark:focus:ring-blue-400/30'
    },
    secondary: {
      base: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600',
      hover: 'hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500',
      active: 'active:bg-gray-300 dark:active:bg-gray-600',
      disabled: 'disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 disabled:border-gray-200 dark:disabled:border-gray-700',
      focus: 'focus:ring-4 focus:ring-gray-500/30 dark:focus:ring-gray-400/30'
    },
    tertiary: {
      base: 'bg-transparent text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400',
      hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-700 dark:hover:border-blue-300',
      active: 'active:bg-blue-100 dark:active:bg-blue-900/40',
      disabled: 'disabled:text-gray-400 disabled:border-gray-300 dark:disabled:border-gray-600',
      focus: 'focus:ring-4 focus:ring-blue-500/30 dark:focus:ring-blue-400/30'
    },
    destructive: {
      base: 'bg-red-600 dark:bg-red-500 text-white border border-red-600 dark:border-red-500',
      hover: 'hover:bg-red-700 dark:hover:bg-red-600 hover:border-red-700 dark:hover:border-red-600',
      active: 'active:bg-red-800 dark:active:bg-red-700',
      disabled: 'disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 disabled:border-gray-300 dark:disabled:border-gray-700',
      focus: 'focus:ring-4 focus:ring-red-500/30 dark:focus:ring-red-400/30'
    },
    ghost: {
      base: 'bg-transparent text-gray-700 dark:text-gray-300 border border-transparent',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
      active: 'active:bg-gray-200 dark:active:bg-gray-700',
      disabled: 'disabled:text-gray-400 dark:disabled:text-gray-600',
      focus: 'focus:ring-4 focus:ring-gray-500/30 dark:focus:ring-gray-400/30'
    }
  };

  return styles[variant];
};

/**
 * Get size-specific styles with golden ratio proportions
 */
const getSizeStyles = (size: ButtonSize) => {
  const styles = {
    sm: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      height: 'h-8', // 32px
      minWidth: 'min-w-[52px]' // 32 * φ ≈ 52px
    },
    md: {
      padding: 'px-4 py-2',
      text: 'text-sm',
      height: 'h-10', // 40px
      minWidth: 'min-w-[65px]' // 40 * φ ≈ 65px
    },
    lg: {
      padding: 'px-6 py-3',
      text: 'text-base',
      height: 'h-12', // 48px
      minWidth: 'min-w-[78px]' // 48 * φ ≈ 78px
    },
    xl: {
      padding: 'px-8 py-4',
      text: 'text-lg',
      height: 'h-14', // 56px
      minWidth: 'min-w-[91px]' // 56 * φ ≈ 91px
    }
  };

  return styles[size];
};

/**
 * Get shape-specific styles
 */
const getShapeStyles = (shape: ButtonShape) => {
  const styles = {
    rounded: 'rounded-lg',
    pill: 'rounded-full',
    square: 'rounded-md'
  };

  return styles[shape];
};

/**
 * Apple HIG compliant button component
 */
const AppleButton = forwardRef<HTMLButtonElement, AppleButtonProps>(({
  variant = 'primary',
  size = 'md',
  shape = 'rounded',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}, ref) => {
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);
  const shapeStyles = getShapeStyles(shape);

  const isDisabled = disabled || loading;

  const buttonClasses = `
    inline-flex items-center justify-center gap-2
    font-medium tracking-tight
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
    active:scale-95 transform
    select-none
    ${variantStyles.base}
    ${variantStyles.hover}
    ${variantStyles.active}
    ${variantStyles.disabled}
    ${variantStyles.focus}
    ${sizeStyles.padding}
    ${sizeStyles.text}
    ${sizeStyles.height}
    ${sizeStyles.minWidth}
    ${shapeStyles}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={buttonClasses}
      {...props}
    >
      {loading && <LoadingSpinner size={size} />}
      {!loading && icon && iconPosition === 'left' && icon}
      {children && (
        <span className={loading ? 'opacity-0' : 'opacity-100'}>
          {children}
        </span>
      )}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
});

AppleButton.displayName = 'AppleButton';

export default AppleButton;

/**
 * Specialized button variants for common use cases
 */

// Primary CTA Button
export const PrimaryButton = memo<Omit<AppleButtonProps, 'variant'>>(
  (props) => <AppleButton variant="primary" {...props} />
);
PrimaryButton.displayName = 'PrimaryButton';

// Secondary Button
export const SecondaryButton = memo<Omit<AppleButtonProps, 'variant'>>(
  (props) => <AppleButton variant="secondary" {...props} />
);
SecondaryButton.displayName = 'SecondaryButton';

// Destructive Button
export const DestructiveButton = memo<Omit<AppleButtonProps, 'variant'>>(
  (props) => <AppleButton variant="destructive" {...props} />
);
DestructiveButton.displayName = 'DestructiveButton';

// Ghost Button
export const GhostButton = memo<Omit<AppleButtonProps, 'variant'>>(
  (props) => <AppleButton variant="ghost" {...props} />
);
GhostButton.displayName = 'GhostButton';

// Icon Button
export const IconButton = memo<Omit<AppleButtonProps, 'children' | 'shape'> & { 
  icon: React.ReactNode;
  'aria-label': string;
}>(({ icon, size = 'md', ...props }) => (
  <AppleButton 
    shape="rounded" 
    size={size}
    className="!min-w-0 !p-2"
    {...props}
  >
    {icon}
  </AppleButton>
));
IconButton.displayName = 'IconButton';

// Floating Action Button
export const FloatingActionButton = memo<Omit<AppleButtonProps, 'shape' | 'variant'>>(
  (props) => (
    <AppleButton 
      variant="primary" 
      shape="pill" 
      size="lg"
      className="shadow-lg hover:shadow-xl transition-shadow duration-200"
      {...props} 
    />
  )
);
FloatingActionButton.displayName = 'FloatingActionButton';