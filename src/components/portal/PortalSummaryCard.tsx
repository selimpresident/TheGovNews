import React from 'react';

interface PortalSummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const PortalSummaryCard: React.FC<PortalSummaryCardProps> = ({ title, value, icon }) => {
  return (
    <div className="p-4 rounded-xl bg-analyst-sidebar/50 backdrop-blur-xl border border-white/10 dark:border-analyst-border/50 shadow-lg cursor-pointer hover:border-analyst-accent/50 transition-all">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-xs text-analyst-text-secondary uppercase tracking-wider">{title}</p>
          <p className="text-xl font-bold text-analyst-text-primary">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default PortalSummaryCard;