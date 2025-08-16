
import { countryNameMap } from './ucdp';
import type { LegislativeInfo, OrganizationsData } from '../types';

export interface Country {
    name: {
        common: string;
        official: string;
        nativeName: Record<string, { official: string; common: string }>;
    };
    translations: Record<string, { official: string; common: string }>;
    flags: {
        png: string;
        svg: string;
        alt: string;
    };
    cca2: string;
    cca3: string;
    altSpellings: string[];
    latlng: [number, number];
}

export interface CountryMappings {
    turkishToFlagUrl: Map<string, string>;
    turkishToUcdpName: Map<string, string>;
    geoJsonNameToTurkish: Map<string, string>;
    allCountries: { name: string; flag: string }[];
    turkishToEnglish: Map<string, string>;
    turkishToCca3: Map<string, string>;
    turkishToCca2: Map<string, string>;
    turkishToLatLng: Map<string, [number, number]>;
    turkishToLegislativeInfo: Map<string, LegislativeInfo>;
    organizationsData: OrganizationsData;
}

const cache: { current: CountryMappings | null } = { current: null };

// Manual overrides for tricky mappings where API data and our data differ significantly
const manualUcdpOverrides: Record<string, string> = {
    'Rusya': 'Russia', // UCDP API might use 'Russia (Soviet Union)'
    'Demokratik Kongo Cumhuriyeti': 'DR Congo', // UCDP API might use 'DR Congo (Zaire)'
};

const manualGeoJsonOverrides: Record<string, string> = {
    'dem. rep. congo': 'Demokratik Kongo Cumhuriyeti',
    "côte d'ivoire": 'Fildişi Sahili',
    'dominican rep.': 'Dominik Cumhuriyeti',
    'central african rep.': 'Orta Afrika Cumhuriyeti',
    'eq. guinea': 'Ekvator Ginesi',
    's. sudan': 'Güney Sudan',
    'bosnia and herz.': 'Bosna-Hersek',
    'czechia': 'Çekya',
    'solomon is.': 'Solomon Adaları',
    'eswatini': 'Esvatini (Svaziland)',
    'united states': 'Amerika Birleşik Devletleri',
    'united states of america': 'Amerika Birleşik Devletleri',
    'united kingdom': 'Birleşik Krallık',
    'russian federation': 'Rusya',
    'palestine': 'Filistin Devleti (BM gözlemci)',
    'congo': 'Kongo Cumhuriyeti', 
    'timor-leste': 'Doğu Timor (Timor-Leste)',
    'somaliland': 'Somali',
};

export const fetchAndBuildMappings = async (): Promise<CountryMappings> => {
    if (cache.current) {
        return cache.current;
    }

    try {
        const [countriesResponse, appDataResponse] = await Promise.all([
            fetch('https://restcountries.com/v3.1/all?fields=name,translations,flags,cca2,cca3,altSpellings,latlng'),
            fetch('/application.json')
        ]);
        
        if (!countriesResponse.ok) {
            throw new Error(`RestCountries API failed with status ${countriesResponse.status}`);
        }
         if (!appDataResponse.ok) {
            throw new Error(`Failed to fetch application data: ${appDataResponse.status}`);
        }
        const allApiCountries: Country[] = await countriesResponse.json();
        const appData = await appDataResponse.json();

        const legislativeData: { ulkeler: LegislativeInfo[] } = appData;
        const organizationsData: OrganizationsData = {
            birlesmis_milletler_sistemi: appData.birlesmis_milletler_sistemi,
            bolgesel_kurumlar: appData.bolgesel_kurumlar,
            diger_kuresel_kurumlar_ve_forumlar: appData.diger_kuresel_kurumlar_ve_forumlar,
        };
        const turkishToLegislativeInfo = new Map<string, LegislativeInfo>(legislativeData.ulkeler.map((item: LegislativeInfo) => [item.ulke, item]));

        const turkishToFlagUrl = new Map<string, string>();
        const turkishToEnglish = new Map<string, string>();
        const turkishToCca3 = new Map<string, string>();
        const turkishToCca2 = new Map<string, string>();
        const turkishToLatLng = new Map<string, [number, number]>();
        const geoJsonNameToTurkish = new Map<string, string>(Object.entries(manualGeoJsonOverrides));

        const supportedTurkishCountries = Object.keys(countryNameMap);

        const matchedApiCountries = new Set<string>();

        supportedTurkishCountries.forEach(turkishName => {
            const ucdpEnglishName = (countryNameMap[turkishName] || '').split(' (')[0];
            const foundCountry = allApiCountries.find(c => 
                c.name.common.toLowerCase() === ucdpEnglishName.toLowerCase() ||
                c.name.official.toLowerCase() === ucdpEnglishName.toLowerCase() ||
                (c.translations.tur && c.translations.tur.common.toLowerCase() === turkishName.toLowerCase()) ||
                c.altSpellings.some(alt => alt.toLowerCase() === ucdpEnglishName.toLowerCase())
            );

            if (foundCountry && !matchedApiCountries.has(foundCountry.cca3)) {
                turkishToFlagUrl.set(turkishName, foundCountry.flags.svg);
                turkishToEnglish.set(turkishName, foundCountry.name.common);
                turkishToCca3.set(turkishName, foundCountry.cca3);
                turkishToCca2.set(turkishName, foundCountry.cca2);
                turkishToLatLng.set(turkishName, foundCountry.latlng);
                matchedApiCountries.add(foundCountry.cca3);
                
                const namesToMap = [
                    foundCountry.name.common,
                    