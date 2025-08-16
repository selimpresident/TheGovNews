import React, { useState, useMemo } from 'react';
import type { CountryMappings } from '../../services/countryDataService';
import { Organization } from '../../types';
import { CloseIcon, SearchIcon, ExternalLinkIcon, BuildingLibraryIcon } from './Icons';

interface OrganizationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  countryMappings: CountryMappings;
  onSelectCountry: (countryName: string) => void;
}


const OrgItem: React.FC<{ org: Organization, countryMappings: CountryMappings, onSelectCountry: (name: string) => void }> = ({ org, countryMappings, onSelectCountry }) => {
    return (
        <div className="bg-white dark:bg-analyst-sidebar rounded-lg border border-slate-200 dark:border-analyst-border p-4 transition-shadow hover:shadow-lg">
            <div className="flex justify-between items-start gap-4">
                 <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-analyst-input">
                       <BuildingLibraryIcon className="w-6 h-6 text-slate-500 dark:text-analyst-text-secondary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-analyst-text-primary">{org.ad_ingilizce}</h4>
                        <p className="text-sm text-slate-500 dark:text-analyst-text-secondary">{org.kisaltma}</p>
                    </div>
                </div>
                <a href={org.resmi_web_sitesi} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-analyst-item-hover flex-shrink-0" title="Visit official website">
                    <ExternalLinkIcon className="w-4 h-4 text-slate-500 dark:text-analyst-text-primary" />
                </a>
            </div>
            {org.uyeler && org.uyeler.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-analyst-border">
                    <div className="flex flex-wrap gap-1.5">
                        {org.uyeler.map(memberName => {
                            const englishName = countryMappings.turkishToEnglish.get(memberName);
                            const flagUrl = countryMappings.turkishToFlagUrl.get(memberName);
                            if (!englishName || !flagUrl) return null;
                            
                            return (
                                <button key={memberName} onClick={() => onSelectCountry(memberName)} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 dark:bg-analyst-input hover:bg-slate-200 dark:hover:bg-analyst-item-hover transition-colors" title={englishName}>
                                    <img src={flagUrl} className="w-4 h-auto rounded-sm" alt={`Flag of ${englishName}`} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

const Section: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => {
    const childrenArray = React.Children.toArray(children).filter(Boolean);
    if (childrenArray.length === 0) return null;

    return (
        <section>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-analyst-text-primary px-2 mb-3">{title}</h3>
            <div className="grid grid-cols-1 gap-3">
                {childrenArray}
            </div>
        </section>
    );
}

const OrganizationsPanel: React.FC<OrganizationsPanelProps> = ({ isOpen, onClose, countryMappings, onSelectCountry }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { organizationsData } = countryMappings;

    const filteredData = useMemo(() => {
        if (!organizationsData) return null;
        if (!searchTerm) return organizationsData;
        const lowerSearch = searchTerm.toLowerCase();

        const filterOrgs = (orgs: Organization[]) => orgs.filter(org => 
            org.ad_ingilizce.toLowerCase().includes(lowerSearch) ||
            org.kisaltma.toLowerCase().includes(lowerSearch) ||
            org.uyeler?.some(member => (countryMappings.turkishToEnglish.get(member) || member).toLowerCase().includes(lowerSearch))
        );
        
        return {
            birlesmis_milletler_sistemi: {
                ana_organlar: filterOrgs(organizationsData.birlesmis_milletler_sistemi.ana_organlar),
                fonlar_ve_programlar: filterOrgs(organizationsData.birlesmis_milletler_sistemi.fonlar_ve_programlar),
                uzmanlik_kuruluslari: filterOrgs(organizationsData.birlesmis_milletler_sistemi.uzmanlik_kuruluslari),
            },
            bolgesel_kurumlar: {
                avrupa: filterOrgs(organizationsData.bolgesel_kurumlar.avrupa),
                asya_pasifik: filterOrgs(organizationsData.bolgesel_kurumlar.asya_pasifik),
            },
            diger_kuresel_kurumlar_ve_forumlar: filterOrgs(organizationsData.diger_kuresel_kurumlar_ve_forumlar),
        };
    }, [searchTerm, organizationsData, countryMappings]);


    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            <aside className={`fixed top-0 left-0 h-full w-full max-w-md bg-slate-100 dark:bg-analyst-sidebar z-40 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <header className="p-4 border-b border-slate-200 dark:border-analyst-border flex justify-between items-center flex-shrink-0">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-analyst-text-primary">Organizations</h2>
                        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-analyst-item-hover">
                            <CloseIcon className="w-6 h-6 text-slate-500 dark:text-analyst-text-secondary" />
                        </button>
                    </header>
                    <div className="p-4 flex-shrink-0 border-b border-slate-200 dark:border-analyst-border">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={'Search organizations or members...'}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-white dark:bg-analyst-input border border-slate-300 dark:border-analyst-border rounded-lg py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-analyst-text-primary placeholder:text-analyst-text-secondary focus:outline-none focus:ring-2 focus:ring-analyst-accent"
                            />
                            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-analyst-text-secondary" />
                        </div>
                    </div>
                    {filteredData && (
                        <div className="overflow-y-auto p-4 space-y-4">
                            <Section title="United Nations System">
                                {filteredData.birlesmis_milletler_sistemi.ana_organlar.map(org => <OrgItem key={org.kisaltma} org={org} countryMappings={countryMappings} onSelectCountry={onSelectCountry}/>)}
                                {filteredData.birlesmis_milletler_sistemi.fonlar_ve_programlar.map(org => <OrgItem key={org.kisaltma} org={org} countryMappings={countryMappings} onSelectCountry={onSelectCountry}/>)}
                                {filteredData.birlesmis_milletler_sistemi.uzmanlik_kuruluslari.map(org => <OrgItem key={org.kisaltma} org={org} countryMappings={countryMappings} onSelectCountry={onSelectCountry}/>)}
                            </Section>
                             <Section title="Regional Organizations">
                                {filteredData.bolgesel_kurumlar.avrupa.map(org => <OrgItem key={org.kisaltma} org={org} countryMappings={countryMappings} onSelectCountry={onSelectCountry}/>)}
                                {filteredData.bolgesel_kurumlar.asya_pasifik.map(org => <OrgItem key={org.kisaltma} org={org} countryMappings={countryMappings} onSelectCountry={onSelectCountry}/>)}
                            </Section>
                            <Section title="Other Global Forums">
                                {filteredData.diger_kuresel_kurumlar_ve_forumlar.map(org => <OrgItem key={org.kisaltma} org={org} countryMappings={countryMappings} onSelectCountry={onSelectCountry}/>)}
                            </Section>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default OrganizationsPanel;