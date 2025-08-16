import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  widths?: number[];
  formats?: ('webp' | 'jpg' | 'png')[];
  lazy?: boolean;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  sizes = '100vw',
  widths = [320, 640, 768, 1024, 1280],
  formats = ['webp', 'jpg'],
  lazy = true
}) => {
  // Extract base path and extension
  const basePath = src.substring(0, src.lastIndexOf('.'));
  const ext = src.substring(src.lastIndexOf('.') + 1);
  
  // Generate srcset for each format
  const srcSets = formats.map(format => {
    const srcSet = widths
      .map(width => `${basePath}-${width}.${format} ${width}w`)
      .join(', ');
    return { format, srcSet };
  });
  
  return (
    <picture>
      {srcSets.map(({ format, srcSet }, index) => (
        <source 
          key={format} 
          type={`image/${format}`} 
          srcSet={srcSet} 
          sizes={sizes} 
        />
      ))}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={lazy ? 'lazy' : 'eager'}
        sizes={sizes}
      />
    </picture>
  );
};

export default ResponsiveImage;