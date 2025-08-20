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
        <div className="min-h-screen bg-gradient-to-br from-modern-light to-modern-surface-light dark:from-modern-dark dark:to-modern-darker text-modern-text-primary-light dark:text-modern-text-primary transition-all duration-300">
            {/* Header */}
            <header className="bg-modern-lighter/90 dark:bg-modern-surface/90 border-b border-modern-border-light-theme/30 dark:border-modern-border/50 sticky top-0 z-30 backdrop-blur-xl shadow-modern transition-all duration-300">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4 group">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-modern-primary to-modern-secondary shadow-modern-lg group-hover:shadow-modern-glow transition-all duration-300">
                                <ShieldCheckIcon className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-modern-primary to-modern-secondary bg-clip-text text-transparent tracking-tight">
                                Admin Panel
                            </h1>
                        </div>
                        <button onClick={() => setView({ name: 'landing' })} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-modern-primary to-modern-secondary text-white hover:scale-105 hover:shadow-modern-glow transition-all duration-300 shadow-modern">
                            <ArrowLeftIcon className="h-4 w-4" />
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
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-300 ${
                                    activeView === item.id
                                        ? 'bg-gradient-to-r from-modern-primary to-modern-secondary text-white shadow-modern-lg scale-105'
                                        : 'text-modern-text-secondary-light dark:text-modern-text-secondary hover:bg-modern-surface-light/50 dark:hover:bg-modern-surface/50 hover:scale-102'
                                }`}
                            >
                                {React.cloneElement(item.icon, { className: `h-5 w-5 ${activeView === item.id ? 'text-white' : 'text-modern-text-secondary-light dark:text-modern-text-secondary'}` })}
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
                
                {/* Main Content */}
                <main className="flex-1 bg-modern-lighter/80 dark:bg-modern-surface/80 rounded-2xl border border-modern-border-light-theme/30 dark:border-modern-border/50 shadow-modern-lg backdrop-blur-xl overflow-hidden min-h-[calc(100vh-10rem)] transition-all duration-300">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;