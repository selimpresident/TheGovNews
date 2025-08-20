import React, { useState, useEffect } from 'react';
import PanelContainer from '../components/common/PanelContainer';
import NewWorldBankPanel from '../components/panels/NewWorldBankPanel';
import NewNoaaPanel from '../components/panels/NewNoaaPanel';
import NewFactbookPanel from '../components/panels/NewFactbookPanel';
import NewGdeltInfoPanel from '../components/panels/NewGdeltInfoPanel';
import NewConflictInfoPanel from '../components/panels/NewConflictInfoPanel';
import NewNationalPressPanel from '../components/panels/NewNationalPressPanel';
import { Spinner } from '../components/Spinner';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '../components/Icons';

// Import services
// fetchAndBuildMappings kaldırıldı çünkü kullanılmıyor
import { /* fetchAndBuildMappings */ } from '../services/countryDataService';
import { fetchWorldBankData } from '../services/worldBankService';
import { fetchNoaaData } from '../services/noaaService';
import { fetchCountryProfileFactbook } from '../services/ciaFactbookService';
import { fetchGdeltArticles } from '../services/gdeltService';
import { fetchConflictEvents } from '../services/ucdp';
import { fetchNationalPress } from '../services/mockData';

interface NewCountryDetailPageProps {
  countryCode?: string;
  countryName?: string;
  setView?: (view: { name: string; context?: any }) => void;
}

const NewCountryDetailPage: React.FC<NewCountryDetailPageProps> = ({ countryCode, countryName: initialCountryName, setView }) => {
  const { t } = useTranslation();
  
  const [countryName, setCountryName] = useState<string>(initialCountryName || '');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [worldBankData, setWorldBankData] = useState<any[]>([]);
  const [worldBankLoading, setWorldBankLoading] = useState<boolean>(true);
  const [worldBankError, setWorldBankError] = useState<string | null>(null);
  
  const [noaaData, setNoaaData] = useState<any[]>([]);
  const [noaaLoading, setNoaaLoading] = useState<boolean>(true);
  const [noaaError, setNoaaError] = useState<string | null>(null);
  
  const [factbookData, setFactbookData] = useState<any>({});
  const [factbookLoading, setFactbookLoading] = useState<boolean>(true);
  const [factbookError, setFactbookError] = useState<string | null>(null);
  
  const [gdeltArticles, setGdeltArticles] = useState<any[]>([]);
  const [gdeltLoading, setGdeltLoading] = useState<boolean>(true);
  const [gdeltError, setGdeltError] = useState<string | null>(null);
  
  const [conflictData, setConflictData] = useState<any[]>([]);
  const [conflictLoading, setConflictLoading] = useState<boolean>(true);
  const [conflictError, setConflictError] = useState<string | null>(null);
  
  const [nationalPress, setNationalPress] = useState<any[]>([]);
  const [nationalPressLoading, setNationalPressLoading] = useState<boolean>(true);
  const [nationalPressError, setNationalPressError] = useState<string | null>(null);

  useEffect(() => {
    if (!countryCode && !countryName) {
      setError('Country information is required');
      setLoading(false);
      return;
    }

    const loadCountryData = async () => {
      try {
        setLoading(true);
        // Kullanıcı tarafından sağlanan ülke adını kullan veya mappings'den bul
        if (countryName) {
          setCountryName(countryName);
        } else if (countryCode) {
          // Eğer sadece kod varsa, kod bilgisini kullan
          // Not: fetchAndBuildMappings() çağrısı kaldırıldı çünkü sonucu kullanılmıyordu
          // Kod -> isim dönüşümü için ters arama yapılabilir
          // Bu örnekte basit tutuyoruz
          setCountryName(countryName || countryCode);
        }
        
        // Load all data in parallel
        if (countryCode) {
          loadWorldBankData(countryCode);
          loadNoaaData(countryCode);
          loadFactbookData(countryCode);
          loadGdeltArticles(countryCode);
          loadConflictData(countryCode);
          loadNationalPress(countryCode);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load country data');
        setLoading(false);
      }
    };

    loadCountryData();
  }, [countryCode, countryName]);

  const loadWorldBankData = async (code: string) => {
    try {
      setWorldBankLoading(true);
      const data = await fetchWorldBankData(code);
      setWorldBankData(data);
      setWorldBankLoading(false);
    } catch (err) {
      setWorldBankError('Failed to load economic data');
      setWorldBankLoading(false);
    }
  };

  const loadNoaaData = async (code: string) => {
    try {
      setNoaaLoading(true);
      const data = await fetchNoaaData(code);
      setNoaaData(data);
      setNoaaLoading(false);
    } catch (err) {
      setNoaaError('Failed to load climate data');
      setNoaaLoading(false);
    }
  };

  const loadFactbookData = async (code: string) => {
    try {
      setFactbookLoading(true);
      const data = await fetchCountryProfileFactbook(code.toLowerCase());
      setFactbookData(data);
      setFactbookLoading(false);
    } catch (err) {
      setFactbookError('Failed to load factbook data');
      setFactbookLoading(false);
    }
  };

  const loadGdeltArticles = async (code: string) => {
    try {
      setGdeltLoading(true);
      const data = await fetchGdeltArticles(code);
      setGdeltArticles(data);
      setGdeltLoading(false);
    } catch (err) {
      setGdeltError('Failed to load global media data');
      setGdeltLoading(false);
    }
  };

  const loadConflictData = async (code: string) => {
    try {
      setConflictLoading(true);
      const data = await fetchConflictEvents(code);
      setConflictData(data);
      setConflictLoading(false);
    } catch (err) {
      setConflictError('Failed to load conflict data');
      setConflictLoading(false);
    }
  };

  const loadNationalPress = async (code: string) => {
    try {
      setNationalPressLoading(true);
      const data = await fetchNationalPress(code);
      setNationalPress(data);
      setNationalPressLoading(false);
    } catch (err) {
      setNationalPressError('Failed to load national press data');
      setNationalPressLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-2">{t('Error')}</h2>
          <p className="text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      {setView && (
        <button
          onClick={() => setView({ name: 'landing' })}
          className="mb-6 flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-colors duration-200 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-lg hover:bg-white/90 dark:hover:bg-slate-800/90 shadow-sm hover:shadow-md"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="font-medium">{t('Back to Map')}</span>
        </button>
      )}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{countryName}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{t('Country information dashboard')}</p>
      </div>

      <div className="space-y-8">
        {/* Economic and Climate Data */}
        <PanelContainer layout="grid" size="md" title={t('Overview')}>
          <NewWorldBankPanel 
            data={worldBankData} 
            countryName={countryName} 
            loading={worldBankLoading} 
            error={worldBankError} 
            onRefresh={() => loadWorldBankData(countryCode || '')}
          />
          <NewNoaaPanel 
            data={noaaData} 
            countryName={countryName} 
            loading={noaaLoading} 
            error={noaaError} 
            onRefresh={() => loadNoaaData(countryCode || '')}
          />
        </PanelContainer>

        {/* Factbook Data */}
        <PanelContainer layout="stack" size="md" title={t('Country Profile')}>
          <NewFactbookPanel 
            data={factbookData} 
            countryName={countryName} 
            loading={factbookLoading} 
            error={factbookError} 
            onRefresh={() => loadFactbookData(countryCode || '')}
          />
        </PanelContainer>

        {/* News and Conflict Data */}
        <PanelContainer layout="grid" size="md" title={t('News & Security')}>
          <NewGdeltInfoPanel 
            articles={gdeltArticles} 
            countryName={countryName} 
            loading={gdeltLoading} 
            error={gdeltError} 
            onRefresh={() => loadGdeltArticles(countryCode || '')}
          />
          <NewConflictInfoPanel 
            events={conflictData} 
            countryName={countryName} 
            loading={conflictLoading} 
            error={conflictError} 
            onRefresh={() => loadConflictData(countryCode || '')}
          />
          <NewNationalPressPanel 
            articles={nationalPress} 
            countryName={countryName} 
            loading={nationalPressLoading} 
            error={nationalPressError} 
            onRefresh={() => loadNationalPress(countryCode || '')}
          />
        </PanelContainer>
      </div>
    </div>
  );
};

export default NewCountryDetailPage;