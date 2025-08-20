import { Article, Source, Topic } from '../types';

const MOCK_SOURCES: Source[] = [
    // Asya
    { id: 'tr_tccb', name: 'source.tr.tccb', url: 'https://www.tccb.gov.tr/reklam-yok', continent: 'continent.asia' },
    { id: 'tr_icisleri', name: 'source.tr.icisleri', url: 'https://www.icisleri.gov.tr/reklam-yok', continent: 'continent.asia' },
    { id: 'tr_disisleri', name: 'source.tr.disisleri', url: 'https://www.mfa.gov.tr/reklam-yok', continent: 'continent.asia' },
    { id: 'tr_msb', name: 'source.tr.msb', url: 'https://www.msb.gov.tr/reklam-yok', continent: 'continent.asia' },
    { id: 'tr_ticaret', name: 'source.tr.ticaret', url: 'https://www.ticaret.gov.tr/reklam-yok', continent: 'continent.asia' },
    { id: 'de_bundesregierung', name: 'source.de.bundesregierung', url: 'https://www.bundesregierung.de/reklam-yok', continent: 'continent.europe' },
    { id: 'us_whitehouse', name: 'source.us.whitehouse', url: 'https://www.whitehouse.gov/reklam-yok', continent: 'continent.northAmerica' },
    { id: 'gb_gov', name: 'source.gb.gov', url: 'https://www.gov.uk/reklam-yok', continent: 'continent.europe' },
];


const MOCK_TOPICS: Topic[] = [
  'economy',
  'defense',
  'health',
  'environment',
  'diplomacy',
  'technology',
  'internal-security'
];

const MOCK_ARTICLES: Omit<Article, 'article_id' | 'fetched_at' | 'bookmarked'>[] = [
    {
      source_id: 'tr_tccb',
      source_name: 'source.tr.tccb',
      title: 'New Technology and Innovation Support Program Announced',
      published_at: '2024-07-21T10:00:00Z',
      language: 'tr',
      authors: ['Press and Public Relations Consultancy'],
      body: 'The Presidency announced that a new support program has been implemented to strengthen the domestic technology ecosystem. The program will offer financial incentives and mentorship support to startups and SMEs operating in the fields of artificial intelligence, cybersecurity, and biotechnology. The Minister of Industry and Technology stated that applications will begin in August.',
      summary_short: 'A new financial incentive and mentorship program focusing on artificial intelligence, cybersecurity, and biotechnology has been launched to strengthen the domestic technology ecosystem.',
      entities: [
        { type: 'ORG', text: 'Presidency' },
        { type: 'ORG', text: 'Ministry of Industry and Technology' },
        { type: 'MISC', text: 'Artificial Intelligence' },
        { type: 'MISC', text: 'Cybersecurity' },
      ],
      topics: ['technology', 'economy'],
      canonical_url: 'https://www.tccb.gov.tr/reklam-yok/haberler/1',
    },
    {
      source_id: 'tr_msb',
      source_name: 'source.tr.msb',
      title: '"Blue Homeland 2024" Exercise in the Eastern Mediterranean Successfully Completed',
      published_at: '2024-07-20T14:30:00Z',
      language: 'tr',
      authors: ['MSB Press'],
      body: 'The "Blue Homeland 2024" exercise, conducted in the Eastern Mediterranean as part of the planned activities of the Turkish Naval Forces, was successfully completed, achieving all its objectives. Numerous frigates, corvettes, submarines, and unmanned aerial vehicles participated in the exercise. The Minister of National Defense stated that the exercise contributed to peace and stability in the region and once again demonstrated the deterrence of the Turkish Armed Forces.',
      summary_short: 'The Blue Homeland 2024 exercise, carried out by the Turkish Naval Forces in the Eastern Mediterranean, successfully concluded with broad participation, achieving its goals.',
      entities: [
        { type: 'ORG', text: 'Turkish Naval Forces' },
        { type: 'LOCATION', text: 'Eastern Mediterranean' },
        { type: 'PERSON', text: 'Minister of Defense' },
        { type: 'EVENT', text: 'Blue Homeland 2024' },
      ],
      topics: ['defense', 'diplomacy'],
      canonical_url: 'https://www.msb.gov.tr/reklam-yok/haberler/2',
    },
     {
      source_id: 'us_whitehouse',
      source_name: 'source.us.whitehouse',
      title: 'President Announces New Clean Energy Initiative',
      published_at: '2024-07-22T15:00:00Z',
      language: 'en',
      authors: ['Press Office'],
      body: 'The President unveiled a comprehensive new initiative aimed at accelerating the nation\'s transition to clean energy. The plan includes significant investments in solar, wind, and green hydrogen technologies, as well as tax incentives for businesses and consumers who adopt renewable energy sources. The Secretary of Energy highlighted that the initiative is expected to create thousands of new jobs and substantially reduce carbon emissions over the next decade.',
      summary_short: 'A new federal initiative will boost clean energy through investments in solar, wind, and green hydrogen, offering tax incentives to accelerate the green transition and create jobs.',
      entities: [
        { type: 'PERSON', text: 'The President' },
        { type: 'ORG', text: 'Secretary of Energy' },
        { type: 'MISC', text: 'Clean Energy' },
        { type: 'LOCATION', text: 'United States' },
      ],
      topics: ['environment', 'economy'],
      canonical_url: 'https://www.whitehouse.gov/reklam-yok/briefing-room/1',
    },
    {
      source_id: 'gb_gov',
      source_name: 'source.gb.gov',
      title: 'Government Launches National AI Strategy',
      published_at: '2024-07-23T09:30:00Z',
      language: 'en',
      authors: ['Department for Science, Innovation and Technology'],
      body: 'The UK government has published its new National AI Strategy, setting out a 10-year plan to make Britain a global AI superpower. The strategy focuses on investing in long-term research, fostering a pro-innovation regulatory environment, and equipping the workforce with necessary AI skills. The Prime Minister stated that AI will be at the heart of the UK\'s future economy and public services.',
      summary_short: 'The UK has launched a 10-year National AI Strategy to become a global leader, focusing on research investment, innovation-friendly regulation, and workforce skills.',
      entities: [
        { type: 'LOCATION', text: 'UK' },
        { type: 'MISC', text: 'National AI Strategy' },
        { type: 'PERSON', text: 'The Prime Minister' },
        { type: 'ORG', text: 'Department for Science, Innovation and Technology' },
      ],
      topics: ['technology', 'economy'],
      canonical_url: 'https://www.gov.uk/reklam-yok/news/ai-strategy',
    },
    {
      source_id: 'tr_icisleri',
      source_name: 'source.tr.icisleri',
      title: 'Operation in 81 Provinces as Part of the Fight Against Cybercrime',
      published_at: '2024-07-22T08:00:00Z',
      language: 'tr',
      authors: ['EGM Cybercrime Department'],
      body: 'Simultaneous "CYBEREYE" operations were carried out in 81 provinces under the coordination of the General Directorate of Security\'s Cybercrime Department. Many suspects were detained in the operations against illegal betting, fraud, and unlawful access to information systems. The Minister of Interior emphasized that the determined fight for the security of the cyber homeland will continue.',
      summary_short: 'A major blow was dealt to cybercrime with the simultaneous "CYBEREYE" operations conducted by the EGM in 81 provinces.',
      entities: [
        { type: 'ORG', text: 'General Directorate of Security' },
        { type: 'PERSON', text: 'Minister of Interior' },
        { type: 'EVENT', text: 'CYBEREYE Operation' },
      ],
      topics: ['internal-security', 'technology'],
      canonical_url: 'https://www.icisleri.gov.tr/reklam-yok/haberler/4',
    },
     {
      source_id: 'tr_ticaret',
      source_name: 'source.tr.ticaret',
      title: 'June Export Figures Reached a Record Level',
      published_at: '2024-07-05T09:00:00Z',
      language: 'tr',
      authors: ['Ministry of Trade'],
      body: 'The Minister of Trade announced the foreign trade data for June at a press conference. Accordingly, exports in June increased by 18.5% compared to the same month of the previous year, reaching $23.4 billion, and were recorded as the highest June export value of all time. The automotive, chemical, and ready-to-wear sectors led the exports. The Minister stated that they are moving forward with firm steps towards achieving the year-end targets.',
      summary_short: 'June exports reached an all-time high of $23.4 billion, an 18.5% increase. The automotive and chemical sectors were the leaders.',
      entities: [
        { type: 'ORG', text: 'Ministry of Trade' },
        { type: 'MISC', text: 'Exports' },
        { type: 'ORG', text: 'Automotive Sector' },
      ],
      topics: ['economy'],
      canonical_url: 'https://www.ticaret.gov.tr/reklam-yok/haberler/5',
    },
    {
      source_id: 'de_bundesregierung',
      source_name: 'source.de.bundesregierung',
      title: 'Cabinet passes package of measures for the digitalization of administration',
      published_at: '2024-07-23T11:00:00Z',
      language: 'de',
      authors: ['Press and Information Office of the Federal Government'],
      body: 'The Federal Cabinet today passed a comprehensive package of measures to accelerate the digitalization of administration. The goal is to make the most important administrative services for citizens and companies available online by 2025. The Federal Minister of the Interior emphasized the need to make Germany a digital pioneer in Europe.',
      summary_short: 'The German cabinet has passed a package for the digitalization of administration to offer important services online by 2025 and position Germany as a digital pioneer.',
      entities: [
        { type: 'ORG', text: 'Federal Cabinet' },
        { type: 'PERSON', text: 'Federal Minister of the Interior' },
        { type: 'LOCATION', text: 'Germany' },
      ],
      topics: ['technology', 'internal-security', 'diplomacy'],
      canonical_url: 'https://www.bundesregierung.de/reklam-yok/news/digitalisierung',
    }
];

export const generateMockData = (): { articles: Article[], sources: Source[], topics: Topic[] } => {
  const articles: Article[] = MOCK_ARTICLES.map((article, index) => ({
    ...article,
    article_id: `sha256:${index + 1}`,
    fetched_at: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 5).toISOString(),
    bookmarked: Math.random() > 0.7,
  }));

  return { articles, sources: MOCK_SOURCES, topics: MOCK_TOPICS.sort() };
};

// Mock function to fetch national press data for a country
export const fetchNationalPress = async (countryCode: string): Promise<any[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data based on country code
  const mockPressData = [
    {
      title: `${countryCode} National News Agency`,
      url: `https://news.${countryCode.toLowerCase()}.gov`,
      description: `Official news agency of ${countryCode}`,
      language: 'en',
      type: 'government'
    },
    {
      title: `${countryCode} Daily News`,
      url: `https://daily.${countryCode.toLowerCase()}.news`,
      description: `Leading newspaper in ${countryCode}`,
      language: 'en',
      type: 'newspaper'
    },
    {
      title: `${countryCode} Public Broadcasting`,
      url: `https://media.${countryCode.toLowerCase()}.tv`,
      description: `Public broadcasting service of ${countryCode}`,
      language: 'en',
      type: 'broadcast'
    }
  ];
  
  return mockPressData;
};