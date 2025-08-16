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
            <div className="p-5 border-b border-slate-200 dark:border-analyst-border flex-shrink-0">
                <h2 className="text-lg font-bold text-slate-900 dark:text-analyst-text-primary">Configuration</h2>
                <p className="text-sm text-slate-500 dark:text-analyst-text-secondary">Adjust service settings and notification preferences.</p>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
                <div className="space-y-4">
                    {MOCK_SERVICES.map(service => {
                        const config = configs[service.id];
                        const status = saveStatus[service.id] || 'idle';
                        return (
                            <div key={service.id} className="border border-slate-200 dark:border-analyst-border rounded-lg">
                                <button onClick={() => setOpenService(openService === service.id ? null : service.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-analyst-item-hover rounded-lg transition-colors">
                                    <h4 className="font-bold text-slate-800 dark:text-analyst-text-primary">{service.name} Settings</h4>
                                    <ChevronRightIcon className={`h-5 w-5 text-slate-500 dark:text-analyst-text-secondary transition-transform ${openService === service.id ? 'rotate-90' : ''}`} />
                                </button>
                                {openService === service.id && config && (
                                    <div className="p-6 border-t border-slate-200 dark:border-analyst-border grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-600 dark:text-analyst-text-secondary mb-3">Configuration</h5>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-analyst-text-primary">Timeout (ms)</label>
                                                    <input type="number" value={config.timeout} onChange={e => handleChange(service.id, 'timeout', parseInt(e.target.value))} className="mt-1 block w-full text-sm rounded-md border-slate-300 dark:border-analyst-border bg-white dark:bg-analyst-input text-slate-900 dark:text-analyst-text-primary shadow-sm focus:border-analyst-accent focus:ring-analyst-accent" />
                                                </div>
                                                 <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-analyst-text-primary">Retries</label>
                                                    <input type="number" value={config.retries} onChange={e => handleChange(service.id, 'retries', parseInt(e.target.value))} className="mt-1 block w-full text-sm rounded-md border-slate-300 dark:border-analyst-border bg-white dark:bg-analyst-input text-slate-900 dark:text-analyst-text-primary shadow-sm focus:border-analyst-accent focus:ring-analyst-accent" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-semibold text-slate-600 dark:text-analyst-text-secondary mb-3">Notifications</h5>
                                            <div className="space-y-3">
                                                <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-analyst-input/50 rounded-md cursor-pointer">
                                                    <span className="text-sm text-slate-700 dark:text-analyst-text-primary">Email</span>
                                                    <input type="checkbox" checked={config.email} onChange={e => handleChange(service.id, 'email', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-analyst-accent focus:ring-analyst-accent" />
                                                </label>
                                                <label className="flex items-center justify-between p-3 bg-slate-50 dark:bg-analyst-input/50 rounded-md cursor-pointer">
                                                    <span className="text-sm text-slate-700 dark:text-analyst-text-primary">Slack</span>
                                                    <input type="checkbox" checked={config.slack} onChange={e => handleChange(service.id, 'slack', e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-analyst-accent focus:ring-analyst-accent" />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 flex justify-end pt-4 border-t border-slate-200 dark:border-analyst-border mt-2">
                                            <button onClick={() => handleSave(service.id)} disabled={status !== 'idle'} className="px-4 py-2 w-32 rounded-lg bg-analyst-accent text-white text-sm font-semibold hover:bg-analyst-accent/90 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">
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