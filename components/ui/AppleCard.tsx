/**
 * Apple HIG Compliant Card Component
 * Follows Apple design system with golden ratio proportions and iOS aesthetics
 */

import React, { memo, forwardRef } from 'react';

export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'glass';
export type CardSize = 'sm' | 'md' | 'lg' | 'xl';
export type CardRadius = 'sm' | 'md' | 'lg' | 'xl';

interface AppleCardProps {
  variant?: CardVariant;
  size?: CardSize;
  radius?: CardRadius;
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

/**
 * Get variant-specific styles following Apple's design system
 */
const getVariantStyles = (variant: CardVariant) => {
  const styles = {
    elevated: {
      base: 'bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-900/50',
      hover: 'hover:shadow-xl dark:hover:shadow-gray-900/60',
      border: 'border border-gray-100 dark:border-gray-800'
    },
    outlined: {
      base: 'bg-white dark:bg-gray-900 shadow-sm',
      hover: 'hover:shadow-md',
      border: 'border border-gray-200 dark:border-gray-700'
    },
    filled: {
      base: 'bg-gray-50 dark:bg-gray-800',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-750',
      border: 'border border-transparent'
    },
    glass: {
      base: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl backdrop-saturate-150',
      hover: 'hover:bg-white/90 dark:hover:bg-gray-900/90',
      border: 'border border-white/20 dark:border-gray-700/50'
    }
  };

  return styles[variant];
};

/**
 * Get size-specific styles with golden ratio proportions
 */
const getSizeStyles = (size: CardSize) => {
  const styles = {
    sm: {
      padding: 'p-3', // 12px
      minHeight: 'min-h-[78px]' // 12 * φ² ≈ 78px
    },
    md: {
      padding: 'p-4', // 16px
      minHeight: 'min-h-[104px]' // 16 * φ² ≈ 104px
    },
    lg: {
      padding: 'p-6', // 24px
      minHeight: 'min-h-[156px]' // 24 * φ² ≈ 156px
    },
    xl: {
      padding: 'p-8', // 32px
      minHeight: 'min-h-[208px]' // 32 * φ² ≈ 208px
    }
  };

  return styles[size];
};

/**
 * Get radius-specific styles
 */
const getRadiusStyles = (radius: CardRadius) => {
  const styles = {
    sm: 'rounded-lg', // 8px - iOS standard
    md: 'rounded-xl', // 12px
    lg: 'rounded-2xl', // 16px
    xl: 'rounded-3xl' // 24px
  };

  return styles[radius];
};

/**
 * Apple HIG compliant card component
 */
const AppleCard = forwardRef<HTMLDivElement, AppleCardProps>(({
  variant = 'elevated',
  size = 'md',
  radius = 'md',
  interactive = false,
  selected = false,
  disabled = false,
  className = '',
  children,
  onClick,
  ...props
}, ref) => {
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);
  const radiusStyles = getRadiusStyles(radius);

  const isClickable = interactive || onClick;

  const cardClasses = `
    ${variantStyles.base}
    ${variantStyles.border}
    ${sizeStyles.padding}
    ${sizeStyles.minHeight}
    ${radiusStyles}
    ${isClickable && !disabled ? variantStyles.hover : ''}
    ${isClickable && !disabled ? 'cursor-pointer' : ''}
    ${isClickable && !disabled ? 'active:scale-98 transform' : ''}
    ${selected ? 'ring-2 ring-blue-500 dark:ring-blue-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''}
    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    transition-all duration-200 ease-out
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const Component = isClickable ? 'button' : 'div';

  return (
    <Component
      ref={ref as any}
      className={cardClasses}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
});

AppleCard.displayName = 'AppleCard';

export default AppleCard;

/**
 * Card Header Component
 */
interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = memo(({
  title,
  subtitle,
  action,
  className = ''
}) => (
  <div className={`flex items-start justify-between mb-4 ${className}`}>
    <div className="flex-1 min-w-0">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight truncate">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
          {subtitle}
        </p>
      )}
    </div>
    {action && (
      <div className="flex-shrink-0 ml-4">
        {action}
      </div>
    )}
  </div>
));

CardHeader.displayName = 'CardHeader';

/**
 * Card Content Component
 */
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = memo(({
  children,
  className = ''
}) => (
  <div className={`text-gray-700 dark:text-gray-300 ${className}`}>
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

/**
 * Card Footer Component
 */
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = memo(({
  children,
  className = ''
}) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

/**
 * Specialized Card Variants
 */

// Article Card
export const ArticleCard = memo<{
  title: string;
  summary: string;
  date: string;
  source: string;
  topics?: string[];
  bookmarked?: boolean;
  onBookmark?: () => void;
  onClick?: () => void;
}>(({
  title,
  summary,
  date,
  source,
  topics = [],
  bookmarked = false,
  onBookmark,
  onClick
}) => (
  <AppleCard
    variant="elevated"
    size="md"
    interactive
    onClick={onClick}
    className="hover:shadow-lg transition-shadow duration-200"
  >
    <CardHeader
      title={title}
      subtitle={`${date} • ${source}`}
      action={onBookmark && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
          className={`
            p-2 rounded-lg transition-colors duration-200
            ${bookmarked 
              ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }
          `}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        </button>
      )}
    />
    <CardContent>
      <p className="text-sm leading-relaxed line-clamp-3">
        {summary}
      </p>
    </CardContent>
    {topics.length > 0 && (
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          {topics.slice(0, 3).map((topic, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md"
            >
              {topic}
            </span>
          ))}
          {topics.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{topics.length - 3} more
            </span>
          )}
        </div>
      </CardFooter>
    )}
  </AppleCard>
));

ArticleCard.displayName = 'ArticleCard';

// Stats Card
export const StatsCard = memo<{
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
}>(({
  title,
  value,
  change,
  trend = 'neutral',
  icon
}) => (
  <AppleCard variant="glass" size="sm">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </p>
        {change && (
          <p className={`text-sm mt-1 ${
            trend === 'up' ? 'text-green-600 dark:text-green-400' :
            trend === 'down' ? 'text-red-600 dark:text-red-400' :
            'text-gray-600 dark:text-gray-400'
          }`}>
            {change}
          </p>
        )}
      </div>
      {icon && (
        <div className="text-gray-400 dark:text-gray-500">
          {icon}
        </div>
      )}
    </div>
  </AppleCard>
));

StatsCard.displayName = 'StatsCard';