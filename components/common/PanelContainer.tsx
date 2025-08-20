/**
 * PanelContainer Component
 * A modern container for organizing multiple panels in a responsive grid layout with animations
 */

import React, { ReactNode, useState } from 'react';

export type PanelContainerLayout = 'grid' | 'masonry' | 'stack' | 'flex' | 'carousel';
export type PanelContainerSize = 'sm' | 'md' | 'lg';

export interface PanelContainerProps {
  children: ReactNode;
  layout?: PanelContainerLayout;
  size?: PanelContainerSize;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const PanelContainer: React.FC<PanelContainerProps> = ({
  children,
  layout = 'grid',
  size = 'md',
  className = '',
  title,
  subtitle,
}) => {
  // Layout styles with enhanced options
  const layoutStyles = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    masonry: 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 space-y-4',
    stack: 'space-y-4',
    flex: 'flex flex-wrap',
    carousel: 'flex overflow-x-auto snap-x snap-mandatory py-4 -mx-4 px-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent',
  };

  // Gap size styles
  const gapSizeStyles = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  // Track hover state for enhanced interactions
  const [isHovered, setIsHovered] = useState(false);

  // Add special styles for carousel layout
  const childrenWithCarouselProps = layout === 'carousel' 
    ? React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            className: `${child.props.className || ''} snap-center min-w-[280px] md:min-w-[320px] px-2`,
          });
        }
        return child;
      })
    : children;

  return (
    <div 
      className={`w-full ${className} transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(title || subtitle) && (
        <div className={`mb-6 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
          {title && <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{title}</h2>}
          {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">{subtitle}</p>}
        </div>
      )}
      
      <div className={`${layoutStyles[layout]} ${layout !== 'masonry' && layout !== 'carousel' ? gapSizeStyles[size] : ''} transition-opacity duration-300`}>
        {childrenWithCarouselProps}
      </div>
    </div>
  );
};

export default PanelContainer;