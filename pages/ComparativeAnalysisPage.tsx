import React, { useState, useEffect, useCallback } from 'react';
import { CountryMappings } from '../services/countryDataService';
import { fetchWorldBankData } from '../services/worldBankService';
import { fetchConflictEvents } from '../services/ucdp';
import { fetchGdeltArticles } from '../services/gdeltService';
import { WorldBankIndicator, UcdpEvent, GdeltArticle } from '../types';
import { ArrowLeftIcon, PlusIcon, XCircleIcon, ChartBarIcon, FireIcon, ClockIcon } from '../components/Icons';
import ComparisonMetricCard from '../components/ComparisonMetricCard';
import CountrySelectorModal from '../components/CountrySelectorModal';

interface ComparisonData {
    worldBank?: WorldBankIndicator[];
    ucdp?: UcdpEvent[];
    gdelt?: GdeltArticle[];
}

interface ComparativeAnalysisPageProps {
    setView: (view: { name: string; context?: any }) => void;
    countryMappings: CountryMappings;
}

const ComparativeAnalysisPage: React.FC<ComparativeAnalysisPageProps> = ({ setView, countryMappings }) => {
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [comparisonData, setComparisonData] = useState<Record<string, ComparisonData>>({});
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchCountryData = useCallback(async (countryName: string): Promise<ComparisonData> => {
        setLoadingStates(prev => ({ ...prev, [countryName]: true }));
        try {
            const cca3 = countryMappings.turkishToCca3.get(countryName);
            const ucdpName = countryMappings.turkishToUcdpName.get(countryName);
            const englishName = countryMappings.turkishToEnglish.get(countryName);

            const [worldBank, ucdp, gdelt] = await Promise.all([
                cca3 ? fetchWorldBankData(cca3) : Promise.resolve(undefined),
                ucdpName ? fetchConflictEvents(ucdpName) : Promise.resolve(undefined),
                englishName ? fetchGdeltArticles(englishName) : Promise.resolve(undefined)
            ]);

            return { worldBank, ucdp, gdelt };
        } catch (error) {
            console.error(`Failed to fetch data for ${countryName}`, error);
            return {}; // Return empty object on error
        } finally {
            setLoadingStates(prev => ({ ...prev, [countryName]: false }));
        }
    }, [countryMappings]);

    useEffect(() => {
        if (selectedCountries.length > 0) {
            selectedCountries.forEach(countryName => {
                if (!comparisonData[countryName]) {
                    fetchCountryData(countryName).then(data => {
                        setComparisonData(prev => ({ ...prev, [countryName]: data }));
                    });
                }
            });
        }
    }, [selectedCountries, comparisonData, fetchCountryData]);

    const handleSelectCountry = (countryName: string) => {
        if (selectedCountries.length < 4 && !selectedCountries.includes(countryName)) {
            setSelectedCountries(prev => [...prev, countryName]);
        }
        setIsModalOpen(false);
    };

    const handleRemoveCountry = (countryName: string) => {
        setSelectedCountries(prev => prev.filter(c => c !== countryName));
        setComparisonData(prev => {
            const newData = { ...prev };
            delete newData[countryName];
            return newData;
        });
    };

    const formatGdp = (data: WorldBankIndicator[] | undefined) => {
        const gdpData = data?.find(d => d.indicatorCode === 'NY.GDP.MKTP.CD');
        if (!gdpData || gdpData.value === null) return 'N/A';
        return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(gdpData.value);
    };

    const getConflictCount = (data: UcdpEvent[] | undefined) => {
        if (!data) return 'N/A';
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return data.filter(e => new Date(e.date_start) > thirtyDaysAgo).length.toString();
    };

    const getNegativeNewsRatio = (data: GdeltArticle[] | undefined) => {
        // Placeholder as Gemini sentiment analysis is not implemented here yet
        if (!data || data.length === 0) return 'N/A';
        // Simple heuristic: count articles with negative-sounding keywords
        const negativeKeywords = ['protest', 'crisis', 'attack', 'conflict', 'disaster', 'sanctions'];
        const negativeCount = data.filter(article => negativeKeywords.some(kw => article.title.toLowerCase().includes(kw))).length;
        return `${((negativeCount / data.length) * 100).toFixed(0)}%`;
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
            <header className="bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 backdrop-blur-md">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                Comparative Analysis
                            </h1>
                        </div>
                        <button onClick={() => setView({ name: 'landing' })} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <ArrowLeftIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                            <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">Back to Map</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {selectedCountries.map(countryName => (
                        <div key={countryName} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 relative">
                            <button onClick={() => handleRemoveCountry(countryName)} className="absolute -top-2 -right-2 bg-slate-600 hover:bg-slate-700 text-white rounded-full p-0.5 z-10">
                                <XCircleIcon className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3 mb-4">
                                <img src={countryMappings.turkishToFlagUrl.get(countryName)} alt="" className="w-8 h-auto rounded-sm shadow-md" />
                                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{countryMappings.turkishToEnglish.get(countryName)}</h3>
                            </div>
                            <div className="space-y-3">
                                <ComparisonMetricCard 
                                    title="GDP (USD)"
                                    value={formatGdp(comparisonData[countryName]?.worldBank)}
                                    isLoading={loadingStates[countryName] ?? false}
                                    icon={<ChartBarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                                    iconBgColor="bg-blue-100 dark:bg-blue-500/10"
                                />
                                <ComparisonMetricCard 
                                    title="Conflicts (Last 30d)"
                                    value={getConflictCount(comparisonData[countryName]?.ucdp)}
                                    isLoading={loadingStates[countryName] ?? false}
                                    icon={<FireIcon className="w-5 h-5 text-red-600 dark:text-red-400" />}
                                    iconBgColor="bg-red-100 dark:bg-red-500/10"
                                />
                                <ComparisonMetricCard 
                                    title="Media Sentiment"
                                    value={getNegativeNewsRatio(comparisonData[countryName]?.gdelt)}
                                    unit="Negative"
                                    isLoading={loadingStates[countryName] ?? false}
                                    icon={<ClockIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                                    iconBgColor="bg-amber-100 dark:bg-amber-500/10"
                                />
                            </div>
                        </div>
                    ))}

                    {selectedCountries.length < 4 && (
                        <button onClick={() => setIsModalOpen(true)} className="flex flex-col items-center justify-center min-h-[20rem] bg-slate-200/50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-blue-500 hover:text-blue-500 transition-colors">
                            <PlusIcon className="w-8 h-8" />
                            <span className="mt-2 font-semibold">Add Country</span>
                        </button>
                    )}
                </div>
            </div>

            <CountrySelectorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectCountry={handleSelectCountry}
                countries={countryMappings.allCountries.filter(c => !selectedCountries.includes(c.name))}
                countryMappings={countryMappings}
            />
        </div>
    );
};

export default ComparativeAnalysisPage;
