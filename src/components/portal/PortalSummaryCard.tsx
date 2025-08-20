import React from 'react';

interface PortalSummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const PortalSummaryCard: React.FC<PortalSummaryCardProps> = ({ title, value, icon }) => {
  return (
    <div className="p-4 rounded-xl bg-modern-surface/50 backdrop-blur-xl border border-modern-border/30 shadow-modern cursor-pointer hover:border-modern-primary/50 hover:shadow-modern-lg hover:scale-105 transition-all duration-300 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-modern-primary/10 to-modern-secondary/10">
          {icon}
        </div>
        <div>
          <p className="text-xs text-modern-text-secondary uppercase tracking-wider font-medium">{title}</p>
          <p className="text-xl font-bold text-modern-text-primary">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default PortalSummaryCard;