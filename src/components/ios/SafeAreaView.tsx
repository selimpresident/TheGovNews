import React from 'react';

interface SafeAreaViewProps {
  children: React.ReactNode;
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
  className?: string;
}

export const SafeAreaView: React.FC<SafeAreaViewProps> = ({
  children,
  top = true,
  bottom = true,
  left = true,
  right = true,
  className = ''
}) => {
  const safeAreaClasses = [
    top ? 'safe-area-top' : '',
    bottom ? 'safe-area-bottom' : '',
    left ? 'safe-area-left' : '',
    right ? 'safe-area-right' : '',
  ].filter(Boolean).join(' ');
  
  return (
    <div className={`${safeAreaClasses} ${className}`}>
      {children}
    </div>
  );
};

export default SafeAreaView;