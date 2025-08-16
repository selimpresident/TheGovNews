import React, { useState, useCallback, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { CountryMappings } from '../../services/countryDataService';
import { fetchConflictEvents } from '../../services/ucdp';
import { fetchGdeltArticles } from '../../services/gdeltService';
import { newsSourcesData } from '../../data/newsSources';
import { fetchCountryProfileFactbook, slugify } from '../../services/ciaFactbookService';
import { fetchWorldBankData } from '../../services/worldBankService';
import { fetchOecdData } from '../../services/oecdService';
import { fetchNoaaData } from '../../services/noaaService';
import { fetchReliefWebUpdates } from '../../services/reliefWebService';
import { fetchPopulationPyramidData } from '../../services/populationPyramidService';
import { fetchCountryRoads } from '../../services/openstreetmapService';
import { fetchAllSocialMedia } from '../../services/socialMediaService';
import { socialMediaData } from '../../data/socialMediaData';
import { 
    BeakerIcon, CheckCircleIcon, XCircleIcon, ChevronRightIcon,
} from './ui/Icons';
import { Spinner } from './Spinner';

interface SystemStatusPanelProps {
    countryMappings: CountryMappings;
}

type Status = 'pending' | 'running' | 'success' | 'failure';
interface TestState {
    id: string; // "country-serviceId"
    country: string;
    sourceId: string;
    sourceName: string;
    status: Status;
    details: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ countryMappings }) => {
    const [tests, setTests] = useState<TestState[]>([]);
    const [runningServices, setRunningServices] = useState<Set<string>>(new Set());
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    
    const dataSources = useMemo(() => [
        { id: 'sourceUcdp', name: 'UCDP Conflict Data', testFn: (countryName: string) => fetchConflictEvents(countryMappings.turkishToUcdpName.get(countryName)) },
        { id: 'sourceGdelt', name: 'GDELT Media Watch', testFn: (countryName: string) => fetchGdeltArticles(countryMappings.turkishToEnglish.get(countryName)) },
        { id: 'sourceNationalPress', name: 'Gemini National Press', testFn: async (countryName: string) => {
            if (!newsSourcesData[countryName]) return { message: "No news sources defined" };
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Find 1 recent news article about ${countryName}.`});
            return response.text ? [{title: response.text.substring(0,100)}] : [];
        }},
        { id: 'sourceFactbook', name: 'CIA World Factbook', testFn: (countryName: string) => fetchCountryProfileFactbook(slugify(countryMappings.turkishToEnglish.get(countryName) || '')) },
        { id: 'sourceWorldBank', name: 'World Bank Indicators', testFn: (countryName: string) => fetchWorldBankData(countryMappings.turkishToCca3.get(countryName)) },
        { id: 'sourceOecd', name: 'OECD Economic Data', testFn: (countryName: string) => fetchOecdData(countryMappings.turkishToCca3.get(countryName)) },
        { id: 'sourceNoaa', name: 'NOAA Climate Data', testFn: (countryName: string) => fetchNoaaData(countryMappings.turkishToCca2.get(countryName)) },
        { id: 'sourceReliefWeb', name: 'ReliefWeb Updates', testFn: (countryName: string) => fetchReliefWebUpdates(countryMappings.turkishToCca3.get(countryName), countryName) },
        { id: 'sourcePopulationPyramid', name: 'Population Pyramid', testFn: (countryName: string) => fetchPopulationPyramidData(countryMappings.turkishToEnglish.get(countryName)) },
        { id: 'sourceOsm', name: 'OpenStreetMap Roads', testFn: (countryName: string) => fetchCountryRoads(countryMappings.turkishToEnglish.get(countryName)) },
        { id: 'sourceSocialMedia', name: 'Social Media Feeds', testFn: (countryName: string) => socialMediaData[countryName] ? fetchAllSocialMedia(socialMediaData[countryName]) : Promise.resolve({ message: "No social media accounts defined" }) },
    ], [countryMappings]);

    const handleStartServiceTest = useCallback(async (serviceId: string) => {
        const service = dataSources.find(ds => ds.id === serviceId);
        if (!service) return;
        
        setRunningServices(prev => new Set(prev).add(serviceId));
        setOpenAccordion(serviceId);

        const allCountries = countryMappings.allCountries.map(c => c.name);
        
        const initialServiceTests: TestState[] = allCountries.map(country => ({
            id: `${country}-${serviceId}`,
            country: countryMappings.turkishToEnglish.get(country) || country,
            sourceId: serviceId,
            sourceName: service.name,
            status: 'pending',
            details: '',
        }));

        setTests(prev => [...prev.filter(t => t.sourceId !== serviceId), ...initialServiceTests]);

        for (const countryName of allCountries) {
            const englishCountryName = countryMappings.turkishToEnglish.get(countryName) || countryName;
            const testId = `${englishCountryName}-${serviceId}`;
            setTests(prev => prev.map(t => t.id.startsWith(englishCountryName) && t.sourceId === serviceId ? { ...t, status: 'running' } : t));

            try {
                const result: any = await service.testFn(countryName);
                let status: Status = 'success';
                let details = '';
                
                 if (typeof result === 'object' && !Array.isArray(result) && result !== null) {
                    if (result.error) throw new Error(String(result.error));
                    if (result.message) {
                        const hasData = result.data?.length > 0 || result.pyramid?.length > 0 || (result.profile && Object.keys(result.profile).length > 0);
                        if (!hasData) details = result.message;
                    }
                    if (Array.isArray(result.data)) details = `Fetched ${result.data.length} items.`;
                    else if(result.data?.length > 0) details = `Fetched ${result.data.length} items.`;
                    else if (details === '') details = 'Success';

                } else if (Array.isArray(result)) {
                    if (result.length > 0 && result[0]?.message && (result[0]?.value === null || result[0]?.title === '')) {
                       throw new Error(result[0].message);
                    }
                    details = `Fetched ${result.length} items.`;
                } else {
                    details = 'Success';
                }

                setTests(prev => prev.map(t => t.id.startsWith(englishCountryName) && t.sourceId === serviceId ? { ...t, status, details } : t));
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                setTests(prev => prev.map(t => t.id.startsWith(englishCountryName) && t.sourceId === serviceId ? { ...t, status: 'failure', details: errorMessage } : t));
            }
            await delay(100); 
        }
        
        setRunningServices(prev => {
            const newSet = new Set(prev);
            newSet.delete(serviceId);
            return newSet;
        });

    }, [countryMappings, dataSources]);

    const getStatusIndicator = (status: Status, context: 'overall' | 'details' = 'details') => {
        switch (status) {
            case 'running': return <div className="flex items-center gap-2"><Spinner /> <span className={`text-xs ${context === 'overall' ? 'font-semibold' : ''} text-slate-500 dark:text-slate-400`}>Running</span></div>;
            case 'success': return <div className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5 text-green-500" /> <span className={`text-xs ${context === 'overall' ? 'font-semibold' : ''} text-green-600 dark:text-green-500`}>Success</span></div>;
            case 'failure': return <div className="flex items-center gap-2"><XCircleIcon className="h-5 w-5 text-red-500" /> <span className={`text-xs ${context === 'overall' ? 'font-semibold' : ''} text-red-600 dark:text-red-500`}>Failure</span></div>;
            case 'pending':
            default:
                return <span className="text-xs text-slate-400 dark:text-slate-500">Pending</span>;
        }
    };
    
    const getServiceOverallStatus = (serviceId: string): Status => {
        const serviceTests = tests.filter(t => t.sourceId === serviceId);
        if (runningServices.has(serviceId) || serviceTests.some(t => t.status === 'running')) {
            return 'running';
        }
        if (serviceTests.length === 0) {
            return 'pending';
        }
        if (serviceTests.some(t => t.status === 'failure')) {
            return 'failure';
        }
        if (serviceTests.every(t => t.status === 'success' || (t.status === 'pending' && t.details === ''))) {
            return 'success';
        }
        return 'pending';
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">System Health & Integration Tests</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Run integration tests for each data source against all supported countries.</p>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
                <div className="space-y-4">
                    {dataSources.map(service => {
                        const serviceTests = tests.filter(t => t.sourceId === service.id);
                        const overallStatus = getServiceOverallStatus(service.id);
                        const isRunning = runningServices.has(service.id);

                        return (
                            <div key={service.id} className="border border-slate-200 dark:border-slate-700/80 rounded-lg">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-24">{getStatusIndicator(overallStatus, 'overall')}</div>
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">{service.name}</h3>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => handleStartServiceTest(service.id)}
                                            disabled={isRunning}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-slate-300 dark:border-slate-600 shadow-sm"
                                        >
                                            <BeakerIcon className="h-4 w-4" />
                                            Run Test
                                        </button>
                                         <button onClick={() => setOpenAccordion(openAccordion === service.id ? null : service.id)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                                            <ChevronRightIcon className={`h-5 w-5 text-slate-500 dark:text-slate-400 transition-transform ${openAccordion === service.id ? 'rotate-90' : ''}`} />
                                        </button>
                                    </div>
                                </div>
                                 {openAccordion === service.id && (
                                    <div className="border-t border-slate-200 dark:border-slate-700/80">
                                        {serviceTests.length > 0 ? (
                                            <div className="overflow-x-auto max-h-[400px]">
                                                <table className="min-w-full">
                                                    <thead className="bg-slate-100/50 dark:bg-slate-800/50 sticky top-0 backdrop-blur-sm">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Country</th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Details</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700/80">
                                                       {serviceTests.map(test => (
                                                           <tr key={test.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{test.country}</td>
                                                                <td className="px-4 py-3 whitespace-nowrap text-sm">{getStatusIndicator(test.status)}</td>
                                                                <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate" title={test.details}>{test.details}</td>
                                                           </tr>
                                                       ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                                                No tests have been run yet for this service.
                                            </div>
                                        )}
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

export default SystemStatusPanel;