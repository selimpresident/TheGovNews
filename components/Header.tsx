import React from 'react';
import { AppLogo } from './Logo';
import ThemeToggleButton from './ThemeToggleButton';
import AppleHeader from './ui/AppleHeader';

type Category = 'official' | 'intelligence' | 'data';

interface HeaderProps {
  onNavigateBack: () => void;
  activeCategory: Category;
  onSetCategory: (category: Category) => void;
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-2 py-1 text-xs font-semibold rounded transition-colors relative ${isActive
        ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-700'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
  >
    {label}
  </button>
);

const Header: React.FC<HeaderProps> = React.memo(({ onNavigateBack, activeCategory, onSetCategory }) => {
  // Use the new Apple HIG compliant header
  return (
    <AppleHeader
      onNavigateBack={onNavigateBack}
      activeCategory={activeCategory}
      onSetCategory={onSetCategory}
    />
  );
});

Header.displayName = 'Header';

export default Header;