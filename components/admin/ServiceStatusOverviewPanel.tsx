import React, { useState } from 'react';
import { ApiServiceStatus } from '../../types';

const MOCK_SERVICES: ApiServiceStatus[] = [
    { id: 'gemini', name: 'Gemini', status: 'operational', lastSuccess: new Date(Date.now() - 1000 * 60 * 2).toISOString(), avgResponseTime: 120, uptime: 99.98 },
    { id: 'ucdp', name: 'UCDP', status: 'operational', lastSuccess: new Date(Date.now() - 1000 * 60 * 5).toISOString(), avgResponseTime: 250, uptime: 99.99 },
    { id: 'gdelt', name: 'GDELT', status: 'degraded', lastSuccess: new Date(Date.now() - 1000 * 60 * 15).toISOString(), avgResponseTime: 850, uptime: 99.50 },
    { id: 'worldbank', name: 'World Bank', status: 'operational', lastSuccess: new Date(Date.now() - 1000 * 60 * 3).toISOString(), avgResponseTime: 180, uptime: 99.99 },
    { id: 'oecd', name: 'OECD', status: 'operational', lastSuccess: new Date(Date.now() - 1000 * 60 * 10).toISOString(), avgResponseTime: 310, uptime: 99.97 },
    { id: 'noaa', name: 'NOAA', status: 'offline', lastSuccess: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), avgResponseTime: 1500, uptime: 98.20 },
];

const ServiceStatusOverviewPanel: React.FC = () => {
    const [services] = useState(MOCK_SERVICES);

    const statusStyles: Record<string, { bg: string, text: string, dot: string }> = {
        operational: { bg: 'bg-green-100 dark:bg-green-500/10', text: 'text-green-800 dark:text-green-400', dot: 'bg-green-500' },
        degraded: { bg: 'bg-yellow-100 dark:bg-yellow-500/10', text: 'text-yellow-800 dark:text-yellow-400', dot: 'bg-yellow-500' },
        offline: { bg: 'bg-red-100 dark:bg-red-500/10', text: 'text-red-800 dark:text-red-400', dot: 'bg-red-500' },
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Service Monitoring</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Real-time status of all integrated third-party services.</p>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(service => {
                        const style = statusStyles[service.status];
                        return (
                            <div key={service.id} className={`p-5 rounded-lg border border-slate-200 dark:border-slate-800 ${style.bg}`}>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{service.name}</h3>
                                    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
                                        <span className={`h-2 w-2 rounded-full ${style.dot}`}></span>
                                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex justify-between">
                                        <span>Avg. Response:</span>
                                        <span className="font-medium text-slate-800 dark:text-slate-100">{service.avgResponseTime}ms</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Uptime (30d):</span>
                                        <span className="font-medium text-slate-800 dark:text-slate-100">{service.uptime.toFixed(2)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Last Success:</span>
                                        <span className="font-medium text-slate-800 dark:text-slate-100">{new Date(service.lastSuccess).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ServiceStatusOverviewPanel;
