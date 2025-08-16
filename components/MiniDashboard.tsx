import React from 'react';
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

const DataBox: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
    <div className="bg-slate-50/50 dark:bg-slate-800/50 p-4 rounded-lg flex items-center gap-4 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
        <div className="bg-slate-200/70 dark:bg-slate-700/70 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
    </div>
);

const MiniDashboard: React.FC<MiniDashboardProps> = ({ population, gdp, latestEventDate }) => {
    const formatGdp = (value: number | null) => {
        if (value === null) return 'Loading...';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }).format(value);
    };

    const formatPopulation = (value: number | null) => {
        if (value === null) return 'Loading...';
        return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Loading...';
        return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <DataBox 
                icon={<UsersIcon className="h-6 w-6 text-slate-600 dark:text-slate-300" />}
                label={indicatorNames['SP.POP.TOTL']}
                value={formatPopulation(population)}
            />
            <DataBox 
                icon={<ChartBarIcon className="h-6 w-6 text-slate-600 dark:text-slate-300" />}
                label={indicatorNames['NY.GDP.MKTP.CD']}
                value={formatGdp(gdp)}
            />
            <DataBox 
                icon={<ClockIcon className="h-6 w-6 text-slate-600 dark:text-slate-300" />}
                label={indicatorNames['latestEvent']}
                value={formatDate(latestEventDate)}
            />
        </div>
    );
};

export default MiniDashboard;