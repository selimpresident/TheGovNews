import React from 'react';
import { Portal } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { PlusIcon, TrashIcon, ArrowLeftIcon } from '../Icons';

interface PortalLeftSidebarProps {
  portals: Portal[];
  selectedPortalId: string | null;
  onSelectPortal: (id: string) => void;
  onCreatePortal: () => void;
  onDeletePortal: (portal: Portal) => void;
  setView: (view: { name: string; context?: any }) => void;
}

const PortalLeftSidebar: React.FC<PortalLeftSidebarProps> = ({ portals, selectedPortalId, onSelectPortal, onCreatePortal, onDeletePortal, setView }) => {
  const { currentUser } = useAuth();

  return (
    <div className="h-screen sticky top-0 flex flex-col p-4">
      <div className="bg-modern-surface/50 backdrop-blur-xl border border-modern-border/30 shadow-modern-lg rounded-xl flex flex-col h-full transition-all duration-300">
        {/* User Profile Section */}
        {currentUser && (
          <div className="p-4 flex items-center gap-3 border-b border-modern-border/30">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-modern-primary to-modern-secondary flex items-center justify-center font-bold text-white shadow-modern">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-sm text-modern-text-primary">{currentUser.name}</p>
              <p className="text-xs text-modern-text-secondary">{currentUser.email}</p>
            </div>
          </div>
        )}

        {/* Portal List */}
        <nav className="flex-grow p-2 overflow-y-auto">
          <p className="px-2 pb-2 text-xs font-semibold text-modern-text-secondary uppercase tracking-wider">My Portals</p>
          <ul className="space-y-1">
            {portals.map(portal => (
              <li key={portal.id} className="group relative">
                <button
                  onClick={() => onSelectPortal(portal.id)}
                  className={`w-full text-left pr-8 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                    selectedPortalId === portal.id
                      ? 'bg-gradient-to-r from-modern-primary/20 to-modern-secondary/20 text-modern-text-primary font-semibold border border-modern-primary/30 shadow-modern'
                      : 'text-modern-text-secondary hover:bg-modern-surface/30 hover:text-modern-text-primary hover:scale-105'
                  }`}
                >
                  {portal.name}
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDeletePortal(portal); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-modern-text-secondary opacity-0 group-hover:opacity-100 hover:bg-modern-error/20 hover:text-modern-error transition-all duration-300"
                    title="Delete Portal"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions Section */}
        <div className="p-4 border-t border-modern-border/30 space-y-2">
          <button 
            onClick={onCreatePortal}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-modern-primary to-modern-secondary text-white text-sm font-semibold hover:scale-105 hover:shadow-modern-glow transition-all duration-300 animate-fade-in"
          >
            <PlusIcon className="w-5 h-5" />
            New Portal
          </button>
           <button 
            onClick={() => setView({ name: 'landing' })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-modern-surface/50 text-modern-text-secondary text-sm font-semibold hover:bg-modern-surface hover:text-modern-text-primary hover:scale-105 transition-all duration-300"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortalLeftSidebar;