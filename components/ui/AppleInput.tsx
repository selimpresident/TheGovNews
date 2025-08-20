/**
 * Apple HIG Compliant Input Components
 * Follows Apple design system with iOS-style inputs and golden ratio proportions
 */

import React, { memo, forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export type InputVariant = 'default' | 'filled' | 'outlined';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'error' | 'success' | 'disabled';

interface BaseInputProps {
  variant?: InputVariant;
  size?: InputSize;
  state?: InputState;
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

interface AppleInputProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {}
interface AppleTextareaProps extends BaseInputProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {}

/**
 * Get variant-specific styles
 */
const getVariantStyles = (variant: InputVariant, state: InputState) => {
  const baseStyles = {
    default: {
      base: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600',
      focus: 'focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20',
      hover: 'hover:border-gray-400 dark:hover:border-gray-500'
    },
    filled: {
      base: 'bg-gray-100 dark:bg-gray-800 border border-transparent',
      focus: 'focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20',
      hover: 'hover:bg-gray-200 dark:hover:bg-gray-700'
    },
    outlined: {
      base: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
      focus: 'focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-blue-400/20',
      hover: 'hover:border-gray-400 dark:hover:border-gray-500'
    }
  };

  const stateStyles = {
    error: {
      base: 'border-red-500 dark:border-red-400',
      focus: 'focus:border-red-500 dark:focus:border-red-400 focus:ring-4 focus:ring-red-500/20 dark:focus:ring-red-400/20'
    },
    success: {
      base: 'border-green-500 dark:border-green-400',
      focus: 'focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/20 dark:focus:ring-green-400/20'
    },
    disabled: {
      base: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
    }
  };

  if (state === 'error' || state === 'success' || state === 'disabled') {
    return stateStyles[state];
  }

  return baseStyles[variant];
};

/**
 * Get size-specific styles with golden ratio proportions
 */
const getSizeStyles = (size: InputSize) => {
  const styles = {
    sm: {
      input: 'h-8 px-3 text-sm', // 32px height
      label: 'text-sm font-medium',
      helper: 'text-xs'
    },
    md: {
      input: 'h-10 px-4 text-sm', // 40px height
      label: 'text-sm font-medium',
      helper: 'text-sm'
    },
    lg: {
      input: 'h-12 px-4 text-base', // 48px height
      label: 'text-base font-medium',
      helper: 'text-sm'
    }
  };

  return styles[size];
};

/**
 * Apple-style text input
 */
const AppleInput = forwardRef<HTMLInputElement, AppleInputProps>(({
  variant = 'default',
  size = 'md',
  state = 'default',
  label,
  helperText,
  errorText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}, ref) => {
  const actualState = disabled ? 'disabled' : state;
  const variantStyles = getVariantStyles(variant, actualState);
  const sizeStyles = getSizeStyles(size);

  const inputClasses = `
    ${sizeStyles.input}
    ${variantStyles.base}
    ${!disabled ? variantStyles.focus : ''}
    ${!disabled ? variantStyles.hover : ''}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    rounded-lg
    font-medium
    placeholder-gray-400 dark:placeholder-gray-500
    text-gray-900 dark:text-white
    transition-all duration-200 ease-out
    focus:outline-none
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {/* Label */}
      {label && (
        <label className={`block ${sizeStyles.label} text-gray-700 dark:text-gray-300 mb-2`}>
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          disabled={disabled}
          className={inputClasses}
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Helper/Error Text */}
      {(helperText || errorText) && (
        <p className={`
          ${sizeStyles.helper} mt-2
          ${state === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}
        `}>
          {errorText || helperText}
        </p>
      )}
    </div>
  );
});

AppleInput.displayName = 'AppleInput';

/**
 * Apple-style textarea
 */
const AppleTextarea = forwardRef<HTMLTextAreaElement, AppleTextareaProps>(({
  variant = 'default',
  size = 'md',
  state = 'default',
  label,
  helperText,
  errorText,
  fullWidth = false,
  className = '',
  disabled,
  rows = 4,
  ...props
}, ref) => {
  const actualState = disabled ? 'disabled' : state;
  const variantStyles = getVariantStyles(variant, actualState);
  const sizeStyles = getSizeStyles(size);

  const textareaClasses = `
    ${sizeStyles.input.replace('h-8', '').replace('h-10', '').replace('h-12', '')}
    py-3
    ${variantStyles.base}
    ${!disabled ? variantStyles.focus : ''}
    ${!disabled ? variantStyles.hover : ''}
    rounded-lg
    font-medium
    placeholder-gray-400 dark:placeholder-gray-500
    text-gray-900 dark:text-white
    transition-all duration-200 ease-out
    focus:outline-none
    resize-vertical
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {/* Label */}
      {label && (
        <label className={`block ${sizeStyles.label} text-gray-700 dark:text-gray-300 mb-2`}>
          {label}
        </label>
      )}

      {/* Textarea */}
      <textarea
        ref={ref}
        disabled={disabled}
        rows={rows}
        className={textareaClasses}
        {...props}
      />

      {/* Helper/Error Text */}
      {(helperText || errorText) && (
        <p className={`
          ${sizeStyles.helper} mt-2
          ${state === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}
        `}>
          {errorText || helperText}
        </p>
      )}
    </div>
  );
});

AppleTextarea.displayName = 'AppleTextarea';

/**
 * Apple-style search input
 */
const AppleSearchInput = memo<Omit<AppleInputProps, 'leftIcon' | 'type'>>(({
  placeholder = 'Search...',
  ...props
}) => (
  <AppleInput
    type="search"
    placeholder={placeholder}
    leftIcon={
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    }
    {...props}
  />
));

AppleSearchInput.displayName = 'AppleSearchInput';

/**
 * Apple-style select input
 */
interface AppleSelectProps extends BaseInputProps {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const AppleSelect = memo<AppleSelectProps>(({
  variant = 'default',
  size = 'md',
  state = 'default',
  label,
  helperText,
  errorText,
  fullWidth = false,
  className = '',
  disabled,
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  ...props
}) => {
  const actualState = disabled ? 'disabled' : state;
  const variantStyles = getVariantStyles(variant, actualState);
  const sizeStyles = getSizeStyles(size);

  const selectClasses = `
    ${sizeStyles.input}
    ${variantStyles.base}
    ${!disabled ? variantStyles.focus : ''}
    ${!disabled ? variantStyles.hover : ''}
    pr-10
    rounded-lg
    font-medium
    text-gray-900 dark:text-white
    transition-all duration-200 ease-out
    focus:outline-none
    appearance-none
    cursor-pointer
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {/* Label */}
      {label && (
        <label className={`block ${sizeStyles.label} text-gray-700 dark:text-gray-300 mb-2`}>
          {label}
        </label>
      )}

      {/* Select Container */}
      <div className="relative">
        <select
          disabled={disabled}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Helper/Error Text */}
      {(helperText || errorText) && (
        <p className={`
          ${sizeStyles.helper} mt-2
          ${state === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}
        `}>
          {errorText || helperText}
        </p>
      )}
    </div>
  );
});

AppleSelect.displayName = 'AppleSelect';

export default AppleInput;
export { AppleTextarea, AppleSearchInput, AppleSelect };