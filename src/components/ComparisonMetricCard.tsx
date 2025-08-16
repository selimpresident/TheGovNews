import React from 'react';
import { Spinner } from './Spinner';

interface ComparisonMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  isLoading: boolean;
  icon: React.ReactNode;
  iconBgColor?: string;
}

const ComparisonMetricCard: React.FC<ComparisonMetricCardProps> = ({ title, value, unit, isLoading, icon, iconBgColor = 'bg-slate-100 dark:bg-analyst-input' }) => {
  return (
    <div className="bg-white dark:bg-analyst-sidebar/50 p-4 rounded-lg border border-slate-200 dark:border-analyst-border shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg ${iconBgColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-analyst-text-secondary">{title}</p>
          {isLoading ? (
            <div className="h-7 w-20 bg-slate-200 dark:bg-analyst-input rounded animate-pulse mt-1"></div>
          ) : (
            <p className="text-2xl font-bold text-slate-900 dark:text-analyst-text-primary">
              {value} <span className="text-base font-medium text-slate-500">{unit}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonMetricCard;