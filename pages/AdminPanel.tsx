import React, { useState } from 'react';
import { CountryMappings } from '../services/countryDataService';
import { 
    ShieldCheckIcon, 
    ArrowLeftIcon, 
    KeyIcon, 
    ServerIcon, 
    DocumentMagnifyingGlassIcon, 
    WrenchScrewdriverIcon, 
    BeakerIcon,
    DocumentTextIcon
} from '../components/Icons';

import ApiKeyManagementPanel from '../components/admin/ApiKeyManagementPanel';
import ServiceStatusOverviewPanel from '../components/admin/ServiceStatusOverviewPanel';
import ApiCallLogsPanel from '../components/admin/ApiCallLogsPanel';
import ConfigurationPanel from '../components/admin/ConfigurationPanel';
import SystemStatusPanel from '../components/SystemStatusPanel';
import DocumentationPanel from '../components/admin/DocumentationPanel';

interface AdminPanelProps {
    setView: (view: { name: string; context?: any }) => void;
    countryMappings: CountryMappings;
}

type AdminView = 'keys' | 'status' | 'logs' | 'config' | 'health' | 'documentation';

const AdminPanel: React.FC<AdminPanelProps> = ({ setView, countryMappings }) => {
    const [activeView, setActiveView] = useState<AdminView>('status');

    const navigationItems = [
        { id: 'keys', name: 'API Key Management', icon: <KeyIcon className="h-5 w-5" /> },
        { id: 'status', name: 'Service Monitoring', icon: <ServerIcon className="h-5 w-5" /> },
        { id: 'logs', name: 'API Call Logs', icon: <DocumentMagnifyingGlassIcon className="h-5 w-5" /> },
        { id: 'config', name: 'Configuration', icon: <WrenchScrewdriverIcon className="h-5 w-5" /> },
        { id: 'health', name: 'Integration Tests', icon: <BeakerIcon className="h-5 w-5" /> },
        { id: 'documentation', name: 'Documentation', icon: <DocumentTextIcon className="h-5 w-5" /> },
    ];
    
    const renderContent = () => {
        switch (activeView) {
            case 'keys': return <ApiKeyManagementPanel />;
            case 'status': return <ServiceStatusOverviewPanel />;
            case 'logs': return <ApiCallLogsPanel />;
            case 'config': return <ConfigurationPanel />;
            case 'health': return <SystemStatusPanel countryMappings={countryMappings} />;
            case 'documentation': return <DocumentationPanel />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            {/* Header */}
            <header className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 backdrop-blur-md">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <ShieldCheckIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                Admin Panel
                            </h1>
                        </div>
                        <button 
                            onClick={() => setView({ name: 'landing' })} 
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-modern-surface/50 hover:bg-gradient-to-br hover:from-modern-primary/20 hover:to-modern-secondary/20 border border-modern-border/30 text-modern-text-secondary hover:text-modern-text-primary transition-all duration-300 hover:scale-105 shadow-modern"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                            <span className="font-semibold text-sm">Back to Map</span>
                        </button>
                    </div>
                </div>
            </header>
            
            <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8 flex items-start gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-64 sticky top-24 flex-shrink-0">
                    <nav className="space-y-2">
                        {navigationItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id as AdminView)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                                    activeView === item.id
                                        ? 'bg-blue-600 text-white shadow'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                                }`}
                            >
                                {React.cloneElement(item.icon, { className: `h-5 w-5 ${activeView === item.id ? 'text-white' : 'text-slate-500 dark:text-slate-500'}` })}
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
                
                {/* Main Content */}
                <main className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[calc(100vh-10rem)]">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;