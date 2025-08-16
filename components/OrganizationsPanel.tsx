import React, { useState, useMemo } from 'react';
import type { CountryMappings } from '../services/countryDataService';
import { Organization } from '../types';
import { CloseIcon, SearchIcon, ChevronRightIcon, ExternalLinkIcon } from './Icons';

interface OrganizationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  countryMappings: CountryMappings;
  onSelectCountry: (countryName: string) => void;
}

const Accordion: React.FC<{ title: string, children: React.ReactNode, count: number }> = ({ title, children, count }) => {
    const [isOpen, setIsOpen] = useState(true);
    if (count === 0) return null;
    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-2 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-700/50">
                <h3 className="font-bold text-slate-800 dark:text-slate-200">{title}</h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{count}</span>
                    <ChevronRightIcon className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </div>
            </button>
            {isOpen && <div className="mt-2 space-y-2 pl-2">{children}</div>}
        </div>
    );
};

const OrgItem: React.FC<{ org: Organization, countryMappings: CountryMappings, onSelectCountry: (name: string) => void }> = ({ org, countryMappings, onSelectCountry }) => {
    return (
        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">{org.ad_ingilizce}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{org.kisaltma}</p>
                </div>
                <a href={org.resmi_web_sitesi} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                    <ExternalLinkIcon className="w-4 h-4 text-slate-500" />
                </a>
            </div>
            {org.uyeler && org.uyeler.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">Members:</p>
                    <div className="flex flex-wrap gap-2">
                        {org.uyeler.map(memberName => {
                            const englishName = countryMappings.turkishToEnglish.get(memberName);
                            const flagUrl = countryMappings.turkishToFlagUrl.get(memberName);
                            if (!englishName || !flagUrl) return null;
                            
                            return (
                                <button key={memberName} onClick={() => onSelectCountry(memberName)} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-600/50 transition-colors">
                                    <img src={flagUrl} className="w-4 h-auto rounded-sm" alt="" />
                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{englishName}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
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
            <aside className={`fixed top-0 left-0 h-full w-full max-w-md bg-slate-100 dark:bg-slate-900 z-40 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <header className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center flex-shrink-0">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Organizations</h2>
                        <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                            <CloseIcon className="w-6 h-6 text-slate-500" />
                        </button>
                    </header>
                    <div className="p-4 flex-shrink-0 border-b border-slate-200 dark:border-slate-800">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={'Search organizations or members...'}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                    {filteredData && (
                        <div className="overflow-y-auto p-4 space-y-4">
                            <Accordion title="United Nations System" count={filteredData.birlesmis_milletler_sistemi.ana_organlar.length + filteredData.birlesmis_milletler_sistemi.fonlar_ve_programlar.length + filteredData.birlesmis_milletler_sistemi.uzmanlik_kuruluslari.length}>
                                {filteredData.birlesmis_milletler_sistemi.ana_organlar.map(org => <OrgItem key={org.kisaltma} org={org} countryMappings={countryMappings} onSelectCountry={onSelectCountry}/>)}
                                {filteredData.birlesmis_milletler_sistemi.fonlar_ve_programlar.map(org => <OrgItem key={org.kisaltma} org={org} countryMappings={countryMappings} onSelectCountry={onSelectCountry}/>)}
                                {filteredData.birlesmis_milletler_sistemi.uzmanlik_kuruluslari.map(org => <OrgItem key={org.kisaltma} org={org} countryMappings={countryMappings} onSelectCountry={onSelectCountry}/>)}
                            </Accordion>
                            <Accordion title="Regional Organizations" count={filteredData.bolgesel_kurumlar.avrupa.length + filteredData.bolgesel_kurumlar.asya_pasifik.length}>
                                {filteredData.bolgesel_kurumlar.avrupa.map(org => <OrgItem key={org.kisaltma} org={org} countryMappings={countryMappings} onSelectCountry={onSelectCountry}/>)}
                                {filteredData.bolgesel_kurumlar.asya_pasifik.map(org => <OrgItem key={org.kisaltma} org={org} countryMappings={countryMappings} onSelectCountry={onSelectCountry}/>)}
                            </Accordion>
                            <Accordion title="Other Global Forums" count={filteredData.diger_kuresel_kurumlar_ve_forumlar.length}>
                                {filteredData.diger_kuresel_kurumlar_ve_forumlar.map(org => <OrgItem key={org.kisaltma} org={org} countryMappings={countryMappings} onSelectCountry={onSelectCountry}/>)}
                            </Accordion>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default OrganizationsPanel;