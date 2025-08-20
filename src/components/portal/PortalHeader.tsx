import React from 'react';
import { Portal } from '../../types';
import { timeAgo } from '../../utils/time';
import { PencilIcon, BellIcon, ShareIcon, ArrowsPointingOutIcon, Bars3Icon } from '../Icons';
import { Tooltip } from 'react-tooltip';
import { useIsMobile } from '../../utils/responsive';


interface PortalHeaderProps {
  portal: Portal;
  onToggleFocusMode: () => void;
  onEditPortal: () => void;
  onToggleSidebar?: () => void;
}

interface ActionButtonProps {
  children: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, tooltip, onClick }) => (
  <button 
    onClick={onClick}
    className="h-9 w-9 flex items-center justify-center rounded-lg bg-modern-surface/50 hover:bg-gradient-to-br hover:from-modern-primary/20 hover:to-modern-secondary/20 text-modern-text-secondary hover:text-modern-text-primary hover:scale-110 transition-all duration-300 shadow-modern"
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
            className="w-8 h-8 rounded-full bg-gradient-to-br from-modern-secondary to-modern-accent text-white flex items-center justify-center text-sm font-bold border-2 border-modern-surface shadow-modern -ml-2 hover:scale-110 transition-all duration-300"
            data-tooltip-id="portal-header-tooltip"
            data-tooltip-content={email}
        >
            {initial}
        </div>
    )
}


const PortalHeader: React.FC<PortalHeaderProps> = ({ portal, onToggleFocusMode, onEditPortal, onToggleSidebar }) => {
  const isMobile = useIsMobile();
  
  return (
    <>
    <div className="sticky top-0 z-20 flex-shrink-0">
         <div className="flex items-center justify-between p-3 md:p-4 bg-modern-surface/50 backdrop-blur-xl border border-modern-border/30 shadow-modern-lg rounded-xl transition-all duration-300">
            {/* Left Side */}
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                {/* Mobile Menu Button */}
                {isMobile && onToggleSidebar && (
                  <ActionButton tooltip="Open Menu" onClick={onToggleSidebar}>
                    <Bars3Icon className="w-5 h-5" />
                  </ActionButton>
                )}
                
                 <div className="flex -space-x-2">
                    {portal.collaboratorEmails.slice(0, isMobile ? 2 : 3).map(email => <CollaboratorAvatar key={email} email={email} />)}
                     {portal.collaboratorEmails.length > (isMobile ? 2 : 3) && (
                        <div className="w-8 h-8 rounded-full bg-modern-surface text-modern-text-secondary flex items-center justify-center text-xs font-bold border-2 border-modern-border shadow-modern -ml-2">
                            +{portal.collaboratorEmails.length - (isMobile ? 2 : 3)}
                        </div>
                     )}
                </div>
                <div className="min-w-0 flex-1">
                    <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold bg-gradient-to-r from-modern-text-primary to-modern-primary bg-clip-text text-transparent truncate`}>{portal.name}</h1>
                    <p className="text-xs text-modern-text-secondary truncate">
                        Last updated: {timeAgo(portal.lastUpdatedAt, 'en')}
                    </p>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                {/* Primary Actions - Always Visible */}
                <ActionButton tooltip="Edit Portal" onClick={onEditPortal}>
                    <PencilIcon className="w-4 h-4 md:w-5 md:h-5" />
                </ActionButton>
                
                {!isMobile && (
                  <>
                    <ActionButton tooltip="Subscribe to Alerts">
                        <BellIcon className="w-5 h-5" />
                    </ActionButton>
                    <ActionButton tooltip="Share Portal">
                        <ShareIcon className="w-5 h-5" />
                    </ActionButton>
                    
                    <div className="w-px h-6 bg-modern-border/50 mx-1"></div>

                    <ActionButton tooltip="Export as PDF">
                        <span className="text-xs font-bold">PDF</span>
                    </ActionButton>
                    <ActionButton tooltip="Export as CSV">
                         <span className="text-xs font-bold">CSV</span>
                    </ActionButton>

                     <div className="w-px h-6 bg-modern-border/50 mx-1"></div>
                  </>
                )}

                 <ActionButton tooltip="Toggle Focus Mode" onClick={onToggleFocusMode}>
                    <ArrowsPointingOutIcon className="w-4 h-4 md:w-5 md:h-5" />
                </ActionButton>
            </div>
        </div>
    </div>
    <Tooltip id="portal-header-tooltip" className="!bg-modern-surface !text-modern-text-primary !text-xs !border !border-modern-border/30 !shadow-modern" />
    </>
  );
};

export default PortalHeader;