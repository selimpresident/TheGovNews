import { UcdpEvent, ConflictPoint } from '../types';
import { getFromCache, setInCache } from '../utils/cache';

// This map is still used by countryDataService as the master list of supported countries.
export const countryNameMap: { [key: string]: string } = {
    'Türkiye': 'Turkey', 'Afganistan': 'Afghanistan', 'Azerbaycan': 'Azerbaijan', 'Bahreyn': 'Bahrain', 'Bangladeş': 'Bangladesh', 'Bhutan': 'Bhutan', 'Birleşik Arap Emirlikleri': 'United Arab Emirates', 'Brunei Sultanlığı': 'Brunei Darussalam', 'Çin Halk Cumhuriyeti': 'China', 'Doğu Timor (Timor-Leste)': 'Timor-Leste', 'Endonezya': 'Indonesia', 'Ermenistan': 'Armenia', 'Filipinler': 'Philippines', 'Filistin Devleti (BM gözlemci)': 'Israel', 'Gürcistan': 'Georgia', 'Hindistan': 'India', 'Irak': 'Iraq', 'İran': 'Iran (Islamic Republic of)', 'İsrail': 'Israel', 'Japonya': 'Japan', 'Kamboçya': 'Cambodia', 'Katar': 'Qatar', 'Kazakistan': 'Kazakhstan', 'Kırgızistan': 'Kyrgyzstan', 'Kuveyt': 'Kuwait', 'Kuzey Kore': 'North Korea', 'Güney Kore': 'South Korea', 'Laos': 'Laos', 'Lübnan': 'Lebanon', 'Maldivler': 'Maldives', 'Malezya': 'Malaysia', 'Moğolistan': 'Mongolia', 'Myanmar (Burma)': 'Myanmar (Burma)', 'Nepal': 'Nepal', 'Özbekistan': 'Uzbekistan', 'Pakistan': 'Pakistan', 'Singapur': 'Singapore', 'Sri Lanka': 'Sri Lanka', 'Suriye': 'Syria', 'Suudi Arabistan': 'Saudi Arabia', 'Tacikistan': 'Tajikistan', 'Tayland': 'Thailand', 'Türkmenistan': 'Turkmenistan', 'Umman': 'Oman', 'Ürdün': 'Jordan', 'Vietnam': 'Vietnam', 'Yemen': 'Yemen', 'Almanya': 'Germany', 'Andorra': 'Andorra', 'Arnavutluk': 'Albania', 'Avusturya': 'Austria', 'Belçika': 'Belgium', 'Beyaz Rusya (Belarus)': 'Belarus', 'Birleşik Krallık': 'United Kingdom', 'Bosna-Hersek': 'Bosnia-Herzegovina', 'Bulgaristan': 'Bulgaria', 'Çekya': 'Czechia', 'Danimarka': 'Denmark', 'Estonya': 'Estonia', 'Finlandiya': 'Finland', 'Fransa': 'France', 'Hollanda': 'Netherlands', 'Hırvatistan': 'Croatia', 'İrlanda': 'Ireland', 'İspanya': 'Spain', 'İsveç': 'Sweden', 'İsviçre': 'Switzerland', 'İtalya': 'Italy', 'İzlanda': 'Iceland', 'Karadağ': 'Montenegro', 'Kosova (kısmen tanınan)': 'Kosovo', 'Letonya': 'Latvia', 'Lihtenştayn': 'Liechtenstein', 'Litvanya': 'Lithuania', 'Lüksemburg': 'Luxembourg', 'Macaristan': 'Hungary', 'Malta': 'Malta', 'Moldova': 'Moldova', 'Monako': 'Monaco', 'Kuzey Makedonya': 'North Macedonia', 'Norveç': 'Norway', 'Polonya': 'Poland', 'Portekiz': 'Portugal', 'Romanya': 'Romania', 'Rusya': 'Russia (Soviet Union)', 'San Marino': 'San Marino', 'Sırbistan': 'Serbia', 'Slovakya': 'Slovakia', 'Slovenya': 'Slovenia', 'Ukrayna': 'Ukraine', 'Vatikan (BM gözlemci)': 'Vatican', 'Yunanistan': 'Greece', 'Amerika Birleşik Devletleri': 'United States of America', 'Antigua ve Barbuda': 'Antigua and Barbuda', 'Bahamalar': 'Bahamas', 'Barbados': 'Barbados', 'Belize': 'Belize', 'Kanada': 'Canada', 'Kostarika': 'Costa Rica', 'Küba': 'Cuba', 'Dominika': 'Dominica', 'Dominik Cumhuriyeti': 'Dominican Republic', 'El Salvador': 'El Salvador', 'Grenada': 'Grenada', 'Guatemala': 'Guatemala', 'Haiti': 'Haiti', 'Honduras': 'Honduras', 'Jamaika': 'Jamaica', 'Meksika': 'Mexico', 'Nikaragua': 'Nicaragua', 'Panama': 'Panama', 'Saint Kitts ve Nevis': 'St. Kitts and Nevis', 'Saint Lucia': 'St. Lucia', 'Saint Vincent ve Grenadinler': 'St. Vincent and the Grenadines', 'Trinidad ve Tobago': 'Trinidad and Tobago', 'Arjantin': 'Argentina', 'Bolivya': 'Bolivia', 'Brezilya': 'Brazil', 'Şili': 'Chile', 'Kolombiya': 'Colombia', 'Ekvador': 'Ecuador', 'Guyana': 'Guyana', 'Paraguay': 'Paraguay', 'Peru': 'Peru', 'Surinam': 'Suriname', 'Uruguay': 'Uruguay', 'Venezuela': 'Venezuela', 'Angola': 'Angola', 'Benin': 'Benin', 'Botsvana': 'Botswana', 'Burkina Faso': 'Burkina Faso', 'Burundi': 'Burundi', 'Cabo Verde': 'Cape Verde', 'Cezayir': 'Algeria', 'Cibuti': 'Djibouti', 'Çad': 'Chad', 'Demokratik Kongo Cumhuriyeti': 'DR Congo (Zaire)', 'Ekvator Ginesi': 'Equatorial Guinea', 'Eritre': 'Eritrea', 'Esvatini (Svaziland)': 'eSwatini (Swaziland)', 'Etiyopya': 'Ethiopia', 'Fas': 'Morocco', 'Fildişi Sahili': "Cote d'Ivoire", 'Gabon': 'Gabon', 'Gambiya': 'Gambia', 'Gana': 'Ghana', 'Gine': 'Guinea', 'Gine-Bissau': 'Guinea-Bissau', 'Güney Afrika': 'South Africa', 'Güney Sudan': 'South Sudan', 'Kamerun': 'Cameroon', 'Kenya': 'Kenya', 'Komorlar': 'Comoros', 'Kongo Cumhuriyeti': 'Congo', 'Lesotho': 'Lesotho', 'Liberya': 'Liberia', 'Libya': 'Libya', 'Madagaskar': 'Madagascar', 'Malavi': 'Malawi', 'Mali': 'Mali', 'Mısır': 'Egypt', 'Mauritius': 'Mauritius', 'Moritanya': 'Mauritania', 'Mozambik': 'Mozambique', 'Namibya': 'Namibia', 'Nijer': 'Niger', 'Nijerya': 'Nigeria', 'Orta Afrika Cumhuriyeti': 'Central African Republic', 'Ruanda': 'Rwanda', 'Sao Tome ve Principe': 'Sao Tome and Principe', 'Senegal': 'Senegal', 'Seyşeller': 'Seychelles', 'Sierra Leone': 'Sierra Leone', 'Somali': 'Somalia', 'Sudan': 'Sudan', 'Tanzanya': 'Tanzania', 'Togo': 'Togo', 'Tunus': 'Tunisia', 'Uganda': 'Uganda', 'Zambiya': 'Zambia', 'Zimbabve': 'Zimbabwe', 'Avustralya': 'Australia', 'Fiji': 'Fiji', 'Kiribati': 'Kiribati', 'Marshall Adaları': 'Marshall Islands', 'Mikronezya': 'Micronesia', 'Nauru': 'Nauru', 'Yeni Zelanda': 'New Zealand', 'Palau': 'Palau', 'Papua Yeni Gine': 'Papua New Guinea', 'Samoa': 'Samoa', 'Solomon Adaları': 'Solomon Islands', 'Tonga': 'Tonga', 'Tuvalu': 'Tuvalu', 'Vanuatu': 'Vanuatu',
};

const UCDP_API_BASE_URL = 'https://ucdpapi.pcr.uu.se/api/gedevents/23.1';
const CORS_PROXY_URL = 'https://api.allorigins.win/raw?url=';

export const fetchConflictEvents = async (ucdpCountryName: string): Promise<ConflictPoint[]> => {
    if (!ucdpCountryName) {
        console.warn('UCDP fetch called with no country name.');
        return [];
    }
    
    const cacheKey = `ucdp-${ucdpCountryName}`;
    const cachedData = getFromCache<ConflictPoint[]>(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    try {
        const params = new URLSearchParams({
            pagesize: '50', // Reduced from 100 to prevent timeouts
            Country: ucdpCountryName,
        });
        const targetUrl = `${UCDP_API_BASE_URL}?${params.toString()}`;
        const proxiedUrl = `${CORS_PROXY_URL}${encodeURIComponent(targetUrl)}`;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout

        const response = await fetch(proxiedUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`UCDP API request failed with status ${response.status}:`, errorText);
            throw new Error(`UCDP API request failed: ${response.statusText || response.status}`);
        }
        
        const data = await response.json();
        const events: UcdpEvent[] = data.Result;

        if (!events) {
            console.warn(`UCDP data for ${ucdpCountryName} is null or undefined.`, data);
            setInCache(cacheKey, []);
            return [];
        }

        const conflictPoints: ConflictPoint[] = events
            .filter(event => event.best > 0) // Only include events with fatalities
            .map((event): ConflictPoint => ({
                id: event.id,
                name: event.conflict_name,
                coordinates: [event.longitude, event.latitude],
                fatalities: event.best,
                country: event.country,
                date: event.date_start,
                side_a: event.side_a,
                side_b: event.side_b,
                description: event.where_description || 'No detailed description provided.',
            }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setInCache(cacheKey, conflictPoints);
        return conflictPoints;

    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            const errorMessage = 'The request to the conflict data service timed out.';
            console.error(`UCDP API request timed out for ${ucdpCountryName}.`);
            throw new Error(errorMessage);
        }
        console.error(`Failed to fetch UCDP data for ${ucdpCountryName}:`, error);
        throw error;
    }
};