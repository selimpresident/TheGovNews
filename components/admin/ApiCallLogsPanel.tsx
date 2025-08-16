import React, { useState } from 'react';
import { ApiCallLog, ApiServiceStatus } from '../../types';

const MOCK_SERVICES: ApiServiceStatus[] = [
    { id: 'gemini', name: 'Gemini', status: 'operational', lastSuccess: new Date(Date.now() - 1000 * 60 * 2).toISOString(), avgResponseTime: 120, uptime: 99.98 },
    { id: 'ucdp', name: 'UCDP', status: 'operational', lastSuccess: new Date(Date.now() - 1000 * 60 * 5).toISOString(), avgResponseTime: 250, uptime: 99.99 },
    { id: 'gdelt', name: 'GDELT', status: 'degraded', lastSuccess: new Date(Date.now() - 1000 * 60 * 15).toISOString(), avgResponseTime: 850, uptime: 99.50 },
    { id: 'worldbank', name: 'World Bank', status: 'operational', lastSuccess: new Date(Date.now() - 1000 * 60 * 3).toISOString(), avgResponseTime: 180, uptime: 99.99 },
    { id: 'oecd', name: 'OECD', status: 'operational', lastSuccess: new Date(Date.now() - 1000 * 60 * 10).toISOString(), avgResponseTime: 310, uptime: 99.97 },
    { id: 'noaa', name: 'NOAA', status: 'offline', lastSuccess: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), avgResponseTime: 1500, uptime: 98.20 },
];

const MOCK_LOGS: ApiCallLog[] = Array.from({ length: 50 }, (_, i) => ({
    id: `log_${i}`,
    timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24).toISOString(),
    serviceName: MOCK_SERVICES[Math.floor(Math.random() * MOCK_SERVICES.length)].name,
    endpoint: `/v1/data/${['countries', 'indicators', 'events'][Math.floor(Math.random()*3)]}`,
    status: [200, 200, 200, 200, 404, 500][Math.floor(Math.random() * 6)],
    latency: Math.floor(Math.random() * 800) + 50,
}));

const ApiCallLogsPanel: React.FC = () => {
    const [logs] = useState(MOCK_LOGS.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));

    return (
        <div className="h-full flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">API Call Logs</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Review recent API calls and their statuses.</p>
            </div>
            <div className="overflow-y-auto flex-grow">
                 <table className="min-w-full">
                    <thead className="sticky top-0 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Endpoint</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Latency</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {logs.map(log => (
                             <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">{log.serviceName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500 dark:text-slate-400">{log.endpoint}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                     <span className={`font-semibold text-sm ${log.status >= 500 ? 'text-red-500' : log.status >= 400 ? 'text-yellow-500' : 'text-green-500'}`}>
                                        {log.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{log.latency}ms</td>
                             </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    );
};

export default ApiCallLogsPanel;