import React from 'react';
import { isAndroid } from '../utils/platformUtils';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
}

interface MaterialBottomNavProps {
  items: NavItem[];
}

const MaterialBottomNav: React.FC<MaterialBottomNavProps> = ({ items }) => {
  // Only apply Material Design styles on Android
  if (!isAndroid()) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-analyst-sidebar border-t border-slate-200 dark:border-analyst-border flex items-center justify-around z-50">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className={`flex flex-col items-center justify-center h-full w-full ${item.isActive ? 'text-analyst-accent' : 'text-slate-600 dark:text-analyst-text-secondary'}`}
        >
          <div className="w-6 h-6">{item.icon}</div>
          <span className="text-xs mt-1">{item.label}</span>
          {item.isActive && (
            <div className="absolute bottom-0 w-12 h-2 bg-analyst-accent rounded-t-full" />
          )}
        </button>
      ))}
    </nav>
  );
};

export default MaterialBottomNav;