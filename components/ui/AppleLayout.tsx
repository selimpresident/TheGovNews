/**
 * Apple HIG Compliant Layout System
 * Provides consistent spacing and layout patterns following Apple design guidelines
 */

import React, { memo } from 'react';

/**
 * Golden ratio and Apple spacing constants
 */
export const GOLDEN_RATIO = 1.618;
export const APPLE_SPACING = {
  xs: 4,   // 4px
  sm: 8,   // 8px
  md: 16,  // 16px (base unit)
  lg: 24,  // 24px
  xl: 32,  // 32px
  '2xl': 48, // 48px
  '3xl': 64, // 64px
} as const;

/**
 * Apple-style container with proper margins and max-width
 */
interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: keyof typeof APPLE_SPACING;
  className?: string;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = memo(({
  size = 'xl',
  padding = 'md',
  className = '',
  children
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingValue = APPLE_SPACING[padding];

  return (
    <div 
      className={`mx-auto ${sizeClasses[size]} ${className}`}
      style={{ padding: `0 ${paddingValue}px` }}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';

/**
 * Apple-style stack layout with consistent spacing
 */
interface StackProps {
  direction?: 'vertical' | 'horizontal';
  spacing?: keyof typeof APPLE_SPACING;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Stack: React.FC<StackProps> = memo(({
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  className = '',
  children
}) => {
  const spacingValue = APPLE_SPACING[spacing];
  
  const directionClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  return (
    <div 
      className={`
        flex ${directionClasses[direction]} ${alignClasses[align]} ${justifyClasses[justify]}
        ${wrap ? 'flex-wrap' : ''}
        ${className}
      `}
      style={{
        gap: `${spacingValue}px`
      }}
    >
      {children}
    </div>
  );
});

Stack.displayName = 'Stack';

/**
 * Apple-style grid layout with golden ratio proportions
 */
interface GridProps {
  columns?: number | 'auto' | 'fit';
  spacing?: keyof typeof APPLE_SPACING;
  minItemWidth?: number;
  className?: string;
  children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = memo(({
  columns = 'auto',
  spacing = 'md',
  minItemWidth = 280, // Golden ratio: 280px ≈ 173 * φ
  className = '',
  children
}) => {
  const spacingValue = APPLE_SPACING[spacing];

  const getGridTemplate = () => {
    if (typeof columns === 'number') {
      return `repeat(${columns}, 1fr)`;
    }
    if (columns === 'fit') {
      return `repeat(auto-fit, minmax(${minItemWidth}px, 1fr))`;
    }
    return `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))`;
  };

  return (
    <div 
      className={`grid ${className}`}
      style={{
        gridTemplateColumns: getGridTemplate(),
        gap: `${spacingValue}px`
      }}
    >
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

/**
 * Apple-style section with proper spacing and typography
 */
interface SectionProps {
  title?: string;
  subtitle?: string;
  spacing?: keyof typeof APPLE_SPACING;
  className?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = memo(({
  title,
  subtitle,
  spacing = 'xl',
  className = '',
  children
}) => {
  const spacingValue = APPLE_SPACING[spacing];

  return (
    <section 
      className={className}
      style={{ marginBottom: `${spacingValue}px` }}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: `${APPLE_SPACING.lg}px` }}>
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
});

Section.displayName = 'Section';

/**
 * Apple-style safe area wrapper for mobile
 */
interface SafeAreaProps {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const SafeArea: React.FC<SafeAreaProps> = memo(({
  top = true,
  bottom = true,
  left = true,
  right = true,
  className = '',
  children
}) => {
  const safeAreaStyles = {
    paddingTop: top ? 'env(safe-area-inset-top, 0px)' : undefined,
    paddingBottom: bottom ? 'env(safe-area-inset-bottom, 0px)' : undefined,
    paddingLeft: left ? 'env(safe-area-inset-left, 0px)' : undefined,
    paddingRight: right ? 'env(safe-area-inset-right, 0px)' : undefined,
  };

  return (
    <div className={className} style={safeAreaStyles}>
      {children}
    </div>
  );
});

SafeArea.displayName = 'SafeArea';

/**
 * Apple-style divider
 */
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: keyof typeof APPLE_SPACING;
  className?: string;
}

export const Divider: React.FC<DividerProps> = memo(({
  orientation = 'horizontal',
  spacing = 'md',
  className = ''
}) => {
  const spacingValue = APPLE_SPACING[spacing];

  if (orientation === 'vertical') {
    return (
      <div 
        className={`w-px bg-gray-200 dark:bg-gray-700 ${className}`}
        style={{ 
          marginLeft: `${spacingValue}px`,
          marginRight: `${spacingValue}px`
        }}
      />
    );
  }

  return (
    <hr 
      className={`border-0 border-t border-gray-200 dark:border-gray-700 ${className}`}
      style={{ 
        marginTop: `${spacingValue}px`,
        marginBottom: `${spacingValue}px`
      }}
    />
  );
});

Divider.displayName = 'Divider';

/**
 * Apple-style aspect ratio container
 */
interface AspectRatioProps {
  ratio?: number; // e.g., 16/9, 4/3, GOLDEN_RATIO
  className?: string;
  children: React.ReactNode;
}

export const AspectRatio: React.FC<AspectRatioProps> = memo(({
  ratio = GOLDEN_RATIO,
  className = '',
  children
}) => {
  const paddingTop = `${(1 / ratio) * 100}%`;

  return (
    <div className={`relative w-full ${className}`} style={{ paddingTop }}>
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
});

AspectRatio.displayName = 'AspectRatio';

/**
 * Apple-style sticky header/footer
 */
interface StickyProps {
  position?: 'top' | 'bottom';
  offset?: number;
  zIndex?: number;
  className?: string;
  children: React.ReactNode;
}

export const Sticky: React.FC<StickyProps> = memo(({
  position = 'top',
  offset = 0,
  zIndex = 50,
  className = '',
  children
}) => {
  const positionStyles = {
    position: 'sticky' as const,
    [position]: `${offset}px`,
    zIndex
  };

  return (
    <div className={className} style={positionStyles}>
      {children}
    </div>
  );
});

Sticky.displayName = 'Sticky';

/**
 * Apple-style center layout
 */
interface CenterProps {
  maxWidth?: number;
  className?: string;
  children: React.ReactNode;
}

export const Center: React.FC<CenterProps> = memo(({
  maxWidth,
  className = '',
  children
}) => (
  <div 
    className={`flex items-center justify-center ${className}`}
    style={{ maxWidth: maxWidth ? `${maxWidth}px` : undefined }}
  >
    {children}
  </div>
));

Center.displayName = 'Center';