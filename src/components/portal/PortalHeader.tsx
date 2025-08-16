import React from 'react';
import { Portal } from '../../types';
import { timeAgo } from '../../utils/time';
import { PencilIcon, BellIcon, ShareIcon, ArrowsPointingOutIcon } from '../Icons';
import { Tooltip } from 'react-tooltip';


interface PortalHeaderProps {
  portal: Portal;
  onToggleFocusMode: () => void;
  onEditPortal: () => void;
}

interface ActionButtonProps {
  children: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, tooltip, onClick }) => (
  <button 
    onClick={onClick}
    className="h-9 w-9 flex items-center justify-center rounded-lg bg-analyst-sidebar/50 hover:bg-analyst-item-hover text-analyst-text-secondary hover:text-analyst-text-primary transition-colors"
    data-tooltip-id="portal-header-tooltip"
    data-tooltip-content={tooltip}
  >
    {children}
  </button>
);

const CollaboratorAvatar: React.FC<{ email: string }> = ({ email }) => {
    const initial = email.charAt(0).toUpperCase();
    return (
        <div 
            className="w-8 h-8 rounded-full bg-analyst-purple text-white flex items-center justify-center text-sm font-bold border-2 border-analyst-sidebar -ml-2"
            data-tooltip-id="portal-header-tooltip"
            data-tooltip-content={email}
        >
            {initial}
        </div>
    )
}


const PortalHeader: React.FC<PortalHeaderProps> = ({ portal, onToggleFocusMode, onEditPortal }) => {
  return (
    <>
    <div className="sticky top-0 z-20 flex-shrink-0">
         <div className="flex items-center justify-between p-4 bg-analyst-sidebar/50 backdrop-blur-xl border border-white/10 dark:border-analyst-border/50 shadow-2xl rounded-xl">
            {/* Left Side */}
            <div className="flex items-center gap-4">
                 <div className="flex -space-x-2">
                    {portal.collaboratorEmails.slice(0, 3).map(email => <CollaboratorAvatar key={email} email={email} />)}
                     {portal.collaboratorEmails.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-analyst-input text-analyst-text-secondary flex items-center justify-center text-xs font-bold border-2 border-analyst-sidebar -ml-2">
                            +{portal.collaboratorEmails.length - 3}
                        </div>
                     )}
                </div>
                <div>
                    <h1 className="text-xl font-bold text-analyst-text-primary">{portal.name}</h1>
                    <p className="text-xs text-analyst-text-secondary">
                        Last updated: {timeAgo(portal.lastUpdatedAt, 'en')}
                    </p>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2">
                <ActionButton tooltip="Edit Portal" onClick={onEditPortal}>
                    <PencilIcon className="w-5 h-5" />
                </ActionButton>
                 <ActionButton tooltip="Subscribe to Alerts">
                    <BellIcon className="w-5 h-5" />
                </ActionButton>
                <ActionButton tooltip="Share Portal">
                    <ShareIcon className="w-5 h-5" />
                </ActionButton>
                
                <div className="w-px h-6 bg-analyst-border/50 mx-1"></div>

                <ActionButton tooltip="Export as PDF">
                    <span className="text-xs font-bold">PDF</span>
                </ActionButton>
                <ActionButton tooltip="Export as CSV">
                     <span className="text-xs font-bold">CSV</span>
                </ActionButton>

                 <div className="w-px h-6 bg-analyst-border/50 mx-1"></div>

                 <ActionButton tooltip="Toggle Focus Mode" onClick={onToggleFocusMode}>
                    <ArrowsPointingOutIcon className="w-5 h-5" />
                </ActionButton>
            </div>
        </div>
    </div>
    <Tooltip id="portal-header-tooltip" className="!bg-analyst-input !text-analyst-text-primary !text-xs" />
    </>
  );
};

export default PortalHeader;