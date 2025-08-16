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
      <div className="bg-analyst-sidebar/50 backdrop-blur-xl border border-white/10 dark:border-analyst-border/50 shadow-2xl rounded-xl flex flex-col h-full">
        {/* User Profile Section */}
        {currentUser && (
          <div className="p-4 flex items-center gap-3 border-b border-analyst-border/50">
            <div className="w-10 h-10 rounded-full bg-analyst-accent flex items-center justify-center font-bold text-white">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-sm text-analyst-text-primary">{currentUser.name}</p>
              <p className="text-xs text-analyst-text-secondary">{currentUser.email}</p>
            </div>
          </div>
        )}

        {/* Portal List */}
        <nav className="flex-grow p-2 overflow-y-auto">
          <p className="px-2 pb-2 text-xs font-semibold text-analyst-text-secondary uppercase tracking-wider">My Portals</p>
          <ul className="space-y-1">
            {portals.map(portal => (
              <li key={portal.id} className="group relative">
                <button
                  onClick={() => onSelectPortal(portal.id)}
                  className={`w-full text-left pr-8 px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedPortalId === portal.id
                      ? 'bg-analyst-item-active text-analyst-text-primary font-semibold'
                      : 'text-analyst-text-secondary hover:bg-analyst-item-hover hover:text-analyst-text-primary'
                  }`}
                >
                  {portal.name}
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDeletePortal(portal); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-analyst-text-secondary opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all"
                    title="Delete Portal"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions Section */}
        <div className="p-4 border-t border-analyst-border/50 space-y-2">
          <button 
            onClick={onCreatePortal}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-analyst-accent/10 text-analyst-accent text-sm font-semibold hover:bg-analyst-accent/20 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            New Portal
          </button>
           <button 
            onClick={() => setView({ name: 'landing' })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-analyst-input/50 text-analyst-text-secondary text-sm font-semibold hover:bg-analyst-item-hover hover:text-analyst-text-primary transition-colors"
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