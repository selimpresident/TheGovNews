import React from 'react';
import { AppLogo } from './Logo';
import ThemeToggleButton from './ThemeToggleButton';

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
    className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors relative ${
      isActive
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    {label}
    {isActive && (
      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
    )}
  </button>
);

const Header: React.FC<HeaderProps> = ({ onNavigateBack, activeCategory, onSetCategory }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <button onClick={onNavigateBack} className="flex items-center gap-3 group">
            <AppLogo className="h-9 w-9 rounded-full" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tighter group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
              TheGovNews
            </h1>
          </button>
          
          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700/60">
            <NavButton
              label={'Official'}
              isActive={activeCategory === 'official'}
              onClick={() => onSetCategory('official')}
            />
            <NavButton
              label={'Intelligence'}
              isActive={activeCategory === 'intelligence'}
              onClick={() => onSetCategory('intelligence')}
            />
            <NavButton
              label={'Data'}
              isActive={activeCategory === 'data'}
              onClick={() => onSetCategory('data')}
            />
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;