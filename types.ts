export type Topic = 'economy' | 'defense' | 'health' | 'environment' | 'diplomacy' | 'technology' | 'internal-security' | 'politics' | 'conflict';

export interface GdeltArticle {
  url: string;
  title: string;
  domain: string;
  seendate: string;
}

export interface Entity {
  type: 'PERSON' | 'ORG' | 'LOCATION' | 'EVENT' | 'MISC';
  text: string;
}

export interface AiAnalysisResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  score: number; // 0.0 to 1.0
  topics: string[];
}

export interface Article {
  article_id: string;
  source_id: string;
  source_name: string;
  title: string;
  published_at: string;
  fetched_at: string;
  language: string;
  authors: string[];
  body: string;
  summary_short: string;
  summary_ai?: string;
  ai_analysis?: AiAnalysisResult;
  entities: Entity[];
  topics: Topic[];
  canonical_url: string;
  bookmarked?: boolean;
}

export interface Source {
  id: string;
  name:string;
  url: string;
  continent: string;
}

export interface ConflictPoint {
  id: number;
  name: string;
  coordinates: [number, number]; // [lon, lat]
  fatalities: number;
  country: string;
  date: string;
  side_a: string;
  side_b: string;
  description: string;
}

export interface UcdpEvent {
  id: number;
  relid: string;
  year: number;
  active_year: boolean;
  code_status: string;
  type_of_violence: number;
  conflict_dset_id: string;
  conflict_new_id: number;
  conflict_name: string;
  dyad_dset_id: string;
  dyad_new_id: number;
  dyad_name: string;
  side_a_dset_id: string;
  side_a_new_id: number;
  side_a: string;
  side_b_dset_id: string;
  side_b_new_id: number;
  side_b: string;
  number_of_sources: number;
  source_article: string;
  source_office: string;
  source_date: string;
  source_headline: string;
  source_original: string;
  where_prec: number;
  where_coordinates: string;
  where_description: string;
  adm_1: string;
  adm_2: string;
  latitude: number;
  longitude: number;
  geom_wkt: string;
  priogrid_gid: number;
  country: string;
  country_id: number;
  region: string;
  event_clarity: number;
  date_prec: number;
  date_start: string;
  date_end: string;
  deaths_a: number;
  deaths_b: number;
  deaths_civilians: number;
  deaths_unknown: number;
  best: number;
  high: number;
  low: number;
  gwnoa: string;
  gwnob: string | null;
}

export interface Vessel {
  id: string;
  name: string;
  type: string;
  countryName: string;
  coordinates: [number, number];
}

export interface ExternalNewsSource {
  name: string;
  url: string;
}

export interface ExternalArticle {
  title: string;
  url: string;
  source: string;
  publishedDate: string;
  summary: string;
}

export interface FactbookProfile {
  [section_title: string]: { [key:string]: string };
}

export interface FactbookData {
  country_name: string;
  profile: FactbookProfile;
  error?: string;
}

export interface WorldBankIndicator {
  country: string;
  indicator: string;
  indicatorCode: string;
  year: string | null;
  value: number | null;
  message?: string;
}

export interface OecdIndicator {
    name: string;
    value: number | null;
    year: string | null;
    message?: string;
}

export interface NoaaRawData {
    date: string;
    datatype: 'TAVG' | 'PRCP' | string;
    station: string;
    attributes: string;
    value: number;
}

export interface NoaaIndicator {
    name: string;
    value: number | null;
    unit: '°C' | 'mm' | null;
    date: string | null;
    message?: string;
}

export interface ReliefWebUpdate {
    title: string;
    link: string;
    publishedDate: string;
    description: string;
    country: string;
    message?: string;
}

export interface PopulationDataPoint {
    age: string;
    male: number;
    female: number;
}

export interface PopulationPyramidData {
    country: string;
    year: number;
    totalPopulation: number;
    pyramid: PopulationDataPoint[];
    message?: string;
}

export interface OsmRoad {
    id: number;
    type: string;
    highway: string;
    geometry: { lat: number; lon: number }[];
}

export interface OsmData {
    country: string;
    data: OsmRoad[];
    message?: string;
}

export interface SocialMediaLinks {
  youtube: string | null;
  x: string | null;
  instagram: string | null;
}

export interface SocialPost {
  id: string;
  platform: 'X' | 'YouTube';
  author: string;
  text: string;
  url: string;
  published_at: string;
  htmlContent?: string;
  thumbnailUrl?: string;
}

export interface ApiKey {
  id: string;
  serviceName: string;
  keyName: string;
  keyValue: string;
  status: 'active' | 'revoked';
  createdAt: string;
  expiresAt: string | null;
  usage: {
    current: number;
    quota: number;
  };
  scopes: string[];
}

export interface ApiServiceStatus {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'offline';
  lastSuccess: string;
  avgResponseTime: number; // in ms
  uptime: number; // percentage
}

export interface ApiCallLog {
  id: string;
  timestamp: string;
  serviceName: string;
  endpoint: string;
  status: number; // HTTP status code
  latency: number; // in ms
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface AiSearchResult {
  summary: string;
  sources: GroundingChunk[];
}

export interface LegislativeInfo {
  ulke: string;
  yasama_organi: string;
  yasama_organi_sitesi: string | null;
  resmi_gazete: string;
  resmi_gazete_sitesi: string | null;
  greetings?: { [key: string]: string };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  imagePreview?: string;
}

export type AnalystMode = 'global' | 'country';

export interface Organization {
  ad_turkce: string;
  ad_ingilizce: string;
  kisaltma: string;
  resmi_web_sitesi: string;
  uyeler_bilgi: string;
  uyeler?: string[];
}

export interface OrganizationsData {
  birlesmis_milletler_sistemi: {
    ana_organlar: Organization[];
    fonlar_ve_programlar: Organization[];
    uzmanlik_kuruluslari: Organization[];
  };
  bolgesel_kurumlar: {
    avrupa: Organization[];
    asya_pasifik: Organization[];
  };
  diger_kuresel_kurumlar_ve_forumlar: Organization[];
}

export interface User {
  name: string;
  email: string;
}

// User Portal Types
export interface Portal {
    id: string;
    name: string;
    description: string;
    countries: string[]; // Array of country names (Turkish)
    topics: Topic[];
    isPublic: boolean;
    ownerId: string;
    collaboratorIds: string[];
    createdAt: string;
}

export interface PortalSummaryStats {
    newItems24h: number;
    breakingAlerts: number;
    topTopics: { topic: Topic; count: number }[];
    sentimentTrend: number;
    sourcesCount: number;
    unreadItems: number;
}

export interface PortalAlert {
    id: string;
    portalId: string;
    severity: 'high' | 'medium' | 'low';
    title: string;
    timestamp: string;
}