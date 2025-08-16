import React from 'react';
import { Portal, PortalAlert } from '../../types';
import { CountryMappings } from '../../services/countryDataService';
import { timeAgo } from '../../utils/time';
import { BellIcon, GlobeAltIcon } from '../Icons';

interface PortalRightSidebarProps {
  portal: Portal;
  alerts: PortalAlert[];
  countryMappings: CountryMappings;
  setView: (view: { name: string; context?: any }) => void;
}

const AlertItem: React.FC<{ alert: PortalAlert }> = ({ alert }) => {
    const severityClasses = {
        high: 'border-l-analyst-orange',
        medium: 'border-l-yellow-500',
        low: 'border-l-analyst-accent'
    };
    return (
        <div className={`pl-3 border-l-4 ${severityClasses[alert.severity]}`}>
            <p className="text-sm font-semibold text-analyst-text-primary">{alert.title}</p>
            <p className="text-xs text-analyst-text-secondary">{timeAgo(alert.timestamp, 'en')}</p>
        </div>
    );
};

const ActiveCountryItem: React.FC<{ countryName: string; countryMappings: CountryMappings; setView: (view: { name: string; context?: any }) => void; }> = ({ countryName, countryMappings, setView }) => {
    const englishName = countryMappings.turkishToEnglish.get(countryName);
    const flagUrl = countryMappings.turkishToFlagUrl.get(countryName);

    const handleClick = () => {
        setView({ name: 'country', context: { countryName } });
    };

    if (!englishName || !flagUrl) return null;

    return (
        <button onClick={handleClick} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-analyst-item-hover transition-colors">
            <img src={flagUrl} alt={englishName} className="w-7 h-auto rounded-sm" />
            <span className="text-sm font-medium text-analyst-text-primary">{englishName}</span>
        </button>
    );
};


const PortalRightSidebar: React.FC<PortalRightSidebarProps> = ({ portal, alerts, countryMappings, setView }) => {
  return (
    <div className="h-screen sticky top-0 flex flex-col p-4 pl-0">
      <div className="bg-analyst-sidebar/50 backdrop-blur-xl border border-white/10 dark:border-analyst-border/50 shadow-2xl rounded-xl flex flex-col h-full">
        {/* Active Countries */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-analyst-text-secondary uppercase tracking-wider mb-2">Active Countries</h3>
          <div className="space-y-1">
            {portal.countries.map(countryName => (
                <ActiveCountryItem key={countryName} countryName={countryName} countryMappings={countryMappings} setView={setView}/>
            ))}
          </div>
        </div>

        {/* Mini-Map placeholder */}
        <div className="px-4 py-2">
            <div className="aspect-video w-full bg-analyst-input rounded-lg flex items-center justify-center border border-analyst-border">
                <GlobeAltIcon className="w-10 h-10 text-analyst-text-secondary opacity-50"/>
            </div>
        </div>
        
        <div className="mx-4 my-2 border-t border-analyst-border/50"></div>

        {/* Alerts */}
        <div className="p-4 flex-grow overflow-y-auto">
            <h3 className="text-sm font-semibold text-analyst-text-secondary uppercase tracking-wider mb-3">Live Alerts</h3>
            <div className="space-y-4">
                 {alerts.map(alert => <AlertItem key={alert.id} alert={alert} />)}
            </div>
        </div>

      </div>
    </div>
  );
};

export default PortalRightSidebar;