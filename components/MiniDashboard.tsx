import React, { memo, useMemo } from 'react';
import { UsersIcon, ChartBarIcon, ClockIcon } from './Icons';

interface MiniDashboardProps {
    population: number | null;
    gdp: number | null;
    latestEventDate: string | null;
}

const indicatorNames: Record<string, string> = {
    'SP.POP.TOTL': 'Total Population',
    'NY.GDP.MKTP.CD': 'Total GDP (USD)',
    'latestEvent': 'Latest Conflict Event'
};

const DataBox: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = memo(({ icon, label, value }) => (
    <div className="bg-slate-50/50 dark:bg-slate-800/50 p-2 rounded flex items-center gap-2 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
        <div className="bg-slate-200/70 dark:bg-slate-700/70 p-1.5 rounded">
            {icon}
        </div>
        <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
    </div>
));

DataBox.displayName = 'DataBox';

const MiniDashboard: React.FC<MiniDashboardProps> = memo(({ population, gdp, latestEventDate }) => {
    const formattedGdp = useMemo(() => {
        if (gdp === null) return 'Loading...';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }).format(gdp);
    }, [gdp]);

    const formattedPopulation = useMemo(() => {
        if (population === null) return 'Loading...';
        return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(population);
    }, [population]);

    const formattedDate = useMemo(() => {
        if (!latestEventDate) return 'Loading...';
        return new Date(latestEventDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    }, [latestEventDate]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <DataBox 
                icon={<UsersIcon className="h-4 w-4 text-slate-600 dark:text-slate-300" />}
                label="Population"
                value={formattedPopulation}
            />
            <DataBox 
                icon={<ChartBarIcon className="h-4 w-4 text-slate-600 dark:text-slate-300" />}
                label="GDP"
                value={formattedGdp}
            />
            <DataBox 
                icon={<ClockIcon className="h-4 w-4 text-slate-600 dark:text-slate-300" />}
                label="Latest Event"
                value={formattedDate}
            />
        </div>
    );
});

MiniDashboard.displayName = 'MiniDashboard';

export default MiniDashboard;