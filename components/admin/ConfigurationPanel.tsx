import React, { useState, useEffect } from 'react';
import { ApiServiceStatus } from '../../types';
import { ChevronRightIcon, CheckCircleIcon } from '../../components/Icons';
import { Spinner } from '../Spinner';

const MOCK_SERVICES: ApiServiceStatus[] = [
    { id: 'gemini', name: 'Gemini', status: 'operational', lastSuccess: new Date(Date.now() - 1000 * 60 * 2).toISOString(), avgResponseTime: 120, uptime: 99.98 },
    { id: 'ucdp', name: 'UCDP', status: 'operational', lastSuccess: new Date(Date.now() - 1000 * 60 * 5).toISOString(), avgResponseTime: 250, uptime: 99.99 },
    { id: 'gdelt', name: 'GDELT', status: 'degraded', lastSuccess: new Date(Date.now() - 1000 * 60 * 15).toISOString(), avgResponseTime: 850, uptime: 99.50 },
    { id: 'worldbank', name: 'World Bank', status: 'operational', lastSuccess: new Date(Date.now() - 1000 * 60 * 3).toISOString(), avgResponseTime: 180, uptime: 99.99 },
];

type Configs = Record<string, { timeout: number; retries: number; email: boolean; slack: boolean }>;
type SaveStatus = 'idle' | 'saving' | 'success';

const ConfigurationPanel: React.FC = () => {
    const [openService, setOpenService] = useState<string | null>(null);
    const [configs, setConfigs] = useState<Configs>({
        gemini: { timeout: 5000, retries: 3, email: true, slack: false },
        ucdp: { timeout: 8000, retries: 2, email: true, slack: true },
        gdelt: { timeout: 10000, retries: 4, email: false, slack: true },
        worldbank: { timeout: 6000, retries: 3, email: true, slack: false },
    });
    const [saveStatus, setSaveStatus] = useState<Record<string, SaveStatus>>({});

    const handleChange = (serviceId: string, field: string, value: string | number | boolean) => {
        setConfigs(prev => ({
            ...prev,
            [serviceId]: {
                ...prev[serviceId],
                [field]: value
            }
        }));
    };
    
    const handleSave = (serviceId: string) => {
        setSaveStatus(prev => ({ ...prev, [serviceId]: 'saving' }));
        setTimeout(() => {
            setSaveStatus(prev => ({ ...prev, [serviceId]: 'success' }));
            setTimeout(() => {
                setSaveStatus(prev => ({ ...prev, [serviceId]: 'idle' }));
            }, 2000);
        }, 1000);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Configuration</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Adjust service settings and notification preferences.</p>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
                <div className="space-y-4">
                    {MOCK_SERVICES.map(service => {
                        const config = configs[service.id];
                        const status = saveStatus[service.id] || 'idle';
                        return (
                            <div key={service.id} className="border border-slate-200 dark:border-slate-700 rounded-lg">
                                <button onClick={() => setOpenService(openService === service.id ? null : service.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{service.name} Settings</h4>
                                    <ChevronRightIcon className={`h-5 w-5 text-slate-500 dark:text-slate-400 transition-transform ${openService === service.id ? 'rotate-90' : ''}`} />
                                </button>
                                {openService === service.id && config && (
                                    <div className="p-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">Configuration</h5>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Timeout (ms)</label>
                                                    <input type="number" value={config.timeout} onChange={e => handleChange(service.id, 'timeout', parseInt(e.target.value))} className="mt-1 block w-full text-sm rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                                </div>
                                                 <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Retries</label>
                                                    <input type="number" value={config.retries} onChange={e => handleChange(service.id, 'retries', parseInt(e.target.value))} className="mt-1 block w-full text-sm rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">Notifications</h5>
                                            <div className="space-y-3">
                                                <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md cursor-pointer">
                                                    <span className="text-sm text-slate-700 dark:text-slate-200">Email</span>
                                                    <input type="checkbox" checked={config.email} onChange={e => handleChange(service.id, 'email', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                                </label>
                                                <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md cursor-pointer">
                                                    <span className="text-sm text-slate-700 dark:text-slate-200">Slack</span>
                                                    <input type="checkbox" checked={config.slack} onChange={e => handleChange(service.id, 'slack', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700 mt-2">
                                            <button onClick={() => handleSave(service.id)} disabled={status !== 'idle'} className="px-4 py-2 w-32 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">
                                                 {status === 'idle' && 'Save Changes'}
                                                 {status === 'saving' && <Spinner />}
                                                 {status === 'success' && <div className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5"/> Saved</div>}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ConfigurationPanel;