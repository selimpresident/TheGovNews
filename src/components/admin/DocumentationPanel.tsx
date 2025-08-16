import React, { useState } from 'react';
import { ChevronRightIcon } from '../Icons';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onToggle }) => (
  <div className="border border-slate-200 dark:border-analyst-border rounded-lg">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 text-left font-semibold text-slate-800 dark:text-analyst-text-primary hover:bg-slate-50 dark:hover:bg-analyst-item-hover rounded-lg transition-colors"
      aria-expanded={isOpen}
    >
      <span>{title}</span>
      <ChevronRightIcon className={`h-5 w-5 text-slate-500 dark:text-analyst-text-secondary transition-transform ${isOpen ? 'rotate-90' : ''}`} />
    </button>
    {isOpen && (
      <div className="p-6 border-t border-slate-200 dark:border-analyst-border prose prose-slate dark:prose-invert max-w-none">
        {children}
      </div>
    )}
  </div>
);

const DocumentationPanel: React.FC = () => {
    const [openSection, setOpenSection] = useState<string | null>('overview');

    const handleToggle = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    const sections = [
        { id: 'overview', title: '1. Application Architecture & Overview' },
        { id: 'admin-guide', title: '2. Admin Panel Guide' },
        { id: 'services', title: '3. Integrated Services' },
        { id: 'setup', title: '4. Service Setup & Testing' },
        { id: 'security', title: '5. Security & Best Practices' },
        { id: 'faq', title: '6. Frequently Asked Questions (FAQ)' },
    ];
    
    const serviceDetails = [
        { id: 'gemini', title: 'Gemini API' },
        { id: 'ucdp', title: 'Uppsala Conflict Data Program (UCDP)' },
        { id: 'gdelt', title: 'GDELT Project' },
        { id: 'factbook', title: 'CIA World Factbook' },
        { id: 'worldbank', title: 'World Bank Open Data' },
        { id: 'oecd', title: 'OECD Economic Outlook' },
        { id: 'noaa', title: 'NOAA Climate Data' },
        { id: 'reliefweb', title: 'ReliefWeb' },
        { id: 'populationpyramid', title: 'PopulationPyramid.net' },
        { id: 'openstreetmap', title: 'OpenStreetMap (Overpass API)' },
        { id: 'socialmedia', title: 'Social Media Feeds' },
    ];

    const content: Record<string, React.ReactNode> = {
        overview: (
            <>
                <h4>1.1. Purpose</h4>
                <p><strong>TheGovNews</strong> is an intelligent aggregator for official government news and related global data. It provides users with a reliable, searchable, and filterable feed of public information, enriched with contextual intelligence from various global sources.</p>
                <h4>1.2. Data Tiers</h4>
                <p>The application architecture is based on a three-tiered data approach:</p>
                <ul>
                    <li><strong>Official:</strong> Direct news from government ministries.</li>
                    <li><strong>Intelligence:</strong> Contextual data from sources like conflict databases (UCDP), global media (GDELT), and AI-driven analysis (Gemini).</li>
                    <li><strong>Data:</strong> Foundational statistical data covering demographics, economics, and infrastructure from sources like the World Bank and CIA Factbook.</li>
                </ul>
                <h4>1.3. Data Flow</h4>
                <p>This is a client-side application. User interactions on the frontend trigger calls to various data service modules. These modules fetch data from third-party APIs. To bypass browser CORS (Cross-Origin Resource Sharing) limitations, requests are routed through a CORS proxy. In a production environment, this flow would be managed by a secure backend server.</p>
                <pre><code>User Interaction → Frontend Component → Service Module → CORS Proxy → External API → Data Display</code></pre>
            </>
        ),
        'admin-guide': (
            <>
                <p>The Admin Panel is the central hub for managing and monitoring the application's data integrations.</p>
                <ul>
                    <li><strong>API Key Management:</strong> Add, edit, and revoke API keys for services that require authentication. Keys are the credentials needed to access data.</li>
                    <li><strong>Service Monitoring:</strong> View the real-time operational status, uptime, and average response time of all integrated third-party services.</li>
                    <li><strong>API Call Logs:</strong> A real-time log of outgoing API requests. Essential for debugging integration issues and monitoring usage.</li>
                    <li><strong>Configuration:</strong> Adjust core settings for each service, such as request timeouts, retry attempts, and notification preferences for service failures.</li>
                    <li><strong>Integration Tests:</strong> Run automated tests for each data source against all supported countries to proactively identify issues with API keys, endpoint changes, or data availability.</li>
                    <li><strong>Documentation:</strong> You are here! This section provides all necessary information to manage and understand the application.</li>
                </ul>
            </>
        ),
        services: (
            <>
                {serviceDetails.map(service => (
                    <div key={service.id} className="mt-4">
                        <h5>{service.title}</h5>
                        {
                            {
                                gemini: <>
                                    <p><strong>Purpose:</strong> AI-powered text summarization, sentiment analysis, and structured data extraction (e.g., finding national press articles).</p>
                                    <p><strong>Data Provided:</strong> Natural language summaries, sentiment scores, topics, and JSON arrays of news articles.</p>
                                    <p><strong>API Access:</strong> <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer">Google AI Studio</a></p>
                                </>,
                                ucdp: <>
                                    <p><strong>Purpose:</strong> Provides academic, high-quality data on organized violence and conflict events worldwide.</p>
                                    <p><strong>Data Provided:</strong> Geolocated conflict events with dates, actors, and fatality counts.</p>
                                    <p><strong>API Access:</strong> Public API, no key required. <a href="https://ucdp.uu.se/api" target="_blank" rel="noopener noreferrer">UCDP API Documentation</a></p>
                                </>,
                                gdelt: <>
                                    <p><strong>Purpose:</strong> Monitors global news media to provide a broad overview of events, trends, and media attention.</p>
                                    <p><strong>Data Provided:</strong> Lists of articles from global sources mentioning a specific country or topic.</p>
                                    <p><strong>API Access:</strong> Public API, no key required. <a href="https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/" target="_blank" rel="noopener noreferrer">GDELT DOC 2.0 API</a></p>
                                </>,
                                factbook: <>
                                    <p><strong>Purpose:</strong> Provides standardized, foundational intelligence on countries, produced by the CIA.</p>
                                    <p><strong>Data Provided:</strong> Detailed profiles covering geography, government, economy, and more.</p>
                                    <p><strong>API Access:</strong> No official API. Data is acquired via web scraping the public website. This method is fragile and may break if the website structure changes.</p>
                                </>,
                                worldbank: <>
                                    <p><strong>Purpose:</strong> Provides free and open access to global development data.</p>
                                    <p><strong>Data Provided:</strong> Key economic indicators like GDP, population, inflation, and unemployment.</p>
                                    <p><strong>API Access:</strong> Public API, no key required. <a href="https://datahelpdesk.worldbank.org/knowledgebase/topics/125589-api" target="_blank" rel="noopener noreferrer">World Bank API</a></p>
                                </>,
                                oecd: <>
                                    <p><strong>Purpose:</strong> Provides high-quality, comparable economic statistics and forecasts, primarily for member countries.</p>
                                    <p><strong>Data Provided:</strong> GDP growth, unemployment rates, inflation (CPI), and short-term interest rates.</p>
                                    <p><strong>API Access:</strong> Public API, no key required. Uses SDMX-JSON standard. <a href="https://data.oecd.org/api/" target="_blank" rel="noopener noreferrer">OECD API</a></p>
                                </>,
                                noaa: <>
                                    <p><strong>Purpose:</strong> Provides historical and current climate data from a global network of weather stations.</p>
                                    <p><strong>Data Provided:</strong> Daily average temperature and precipitation data.</p>
                                    <p><strong>API Access:</strong> Requires a free API token. <a href="https://www.ncdc.noaa.gov/cdo-web/token" target="_blank" rel="noopener noreferrer">Request a NOAA Token</a></p>
                                </>,
                                reliefweb: <>
                                    <p><strong>Purpose:</strong> A humanitarian information service by the UN Office for the Coordination of Humanitarian Affairs (OCHA).</p>
                                    <p><strong>Data Provided:</strong> Timely reports, maps, and updates on humanitarian crises and disasters.</p>
                                    <p><strong>API Access:</strong> Public RSS feeds, no key required.</p>
                                </>,
                                populationpyramid: <>
                                    <p><strong>Purpose:</strong> Provides demographic data visualizations.</p>
                                    <p><strong>Data Provided:</strong> Population breakdown by age group and gender for a given year.</p>
                                    <p><strong>API Access:</strong> Public, unofficial API. No key required.</p>
                                </>,
                                openstreetmap: <>
                                    <p><strong>Purpose:</strong> A collaborative, open-source map of the world.</p>
                                    <p><strong>Data Provided:</strong> Highly detailed geographic data. We query for major road networks (motorways, primary roads, etc.).</p>
                                    <p><strong>API Access:</strong> Public API via the Overpass endpoint. No key required, but subject to rate limits. <a href="https://wiki.openstreetmap.org/wiki/Overpass_API" target="_blank" rel="noopener noreferrer">Overpass API</a></p>
                                </>,
                                socialmedia: <>
                                    <p><strong>Purpose:</strong> Fetches recent posts from official government social media accounts without using official APIs.</p>
                                    <p><strong>Data Provided:</strong> Posts, images, and links from X (formerly Twitter) and YouTube.</p>
                                    <p><strong>API Access:</strong> Uses public, unofficial RSS gateways like Nitter (for X) and YouTube's native RSS functionality.</p>
                                </>
                            }[service.id]
                        }
                    </div>
                ))}
            </>
        ),
        setup: (
            <>
                <h4>4.1. Adding a New API Key</h4>
                <ol>
                    <li>Navigate to the <strong>API Key Management</strong> panel.</li>
                    <li>Click the "Add New Key" button.</li>
                    <li>Fill in the details:
                        <ul>
                            <li><strong>Key Name:</strong> A descriptive name for your key (e.g., "Primary Gemini Key").</li>
                            <li><strong>Service:</strong> Select the service this key is for from the dropdown.</li>
                            <li><strong>API Key:</strong> Paste the actual key value obtained from the service provider.</li>
                            <li><strong>Permissions / Scopes:</strong> Add the permissions this key has (e.g., `generateContent`). Press Enter after each scope.</li>
                        </ul>
                    </li>
                    <li>Click "Save Changes".</li>
                </ol>
                <h4>4.2. Testing Service Integrations</h4>
                <ol>
                    <li>Navigate to the <strong>Integration Tests</strong> panel.</li>
                    <li>Find the service you want to test and click the "Run Test" button.</li>
                    <li>The test will run against all supported countries. You can expand the accordion to see the status for each country.
                        <ul>
                            <li><strong className="text-green-500">Success:</strong> The API call was successful and returned data.</li>
                            <li><strong className="text-red-500">Failure:</strong> The API call failed. The details column will provide an error message (e.g., "Invalid API Key", "404 Not Found", "Request timed out").</li>
                        </ul>
                    </li>
                </ol>
                 <h4>4.3. Common Errors & Solutions</h4>
                <ul>
                    <li><strong>"Invalid API Key" or 401/403 Error:</strong> The key is likely incorrect, expired, or lacks the necessary permissions. Verify the key with the service provider and update it in the Key Management panel.</li>
                    <li><strong>"Not Found" or 404 Error:</strong> The specific data for a country may not exist (e.g., OECD data for a non-member country), or the API endpoint may have changed.</li>
                    <li><strong>"Request Timed Out":</strong> The service is slow to respond. You can try increasing the timeout value in the <strong>Configuration</strong> panel.</li>
                </ul>
            </>
        ),
        security: (
             <>
                <h4>5.1. API Key Security</h4>
                <p><strong>CRITICAL:</strong> In a production environment, API keys must never be stored in client-side code. This demo application simulates a secure setup by referencing <code>process.env.API_KEY</code>, which implies keys are loaded from a secure server environment.</p>
                <p>Recommended production strategy:</p>
                <ol>
                    <li>Create a backend service (e.g., Node.js, Python) that acts as a proxy between the frontend and the external APIs.</li>
                    <li>Store API keys on the backend server using environment variables or a dedicated secrets management service (e.g., AWS Secrets Manager, HashiCorp Vault).</li>
                    <li>The frontend makes requests to your backend, which then securely attaches the necessary API keys and forwards the request to the external service.</li>
                </ol>
                 <h4>5.2. Access Control</h4>
                <p>The Admin Panel should be protected by a robust authentication and authorization system. Only trusted administrators should have access to manage API keys and configurations.</p>
            </>
        ),
        faq: (
            <>
                <h4>Q: Why is a service shown as "degraded" or "offline" in the Service Monitoring panel?</h4>
                <p>A: This indicates that our automated health checks are detecting slow response times or failures from the third-party service's API. The issue is likely on their end. You can check their official status page for more information.</p>
                <h4>Q: How do I add support for a new country?</h4>
                <p>A: Adding a new country is a multi-step process for developers, requiring updates to several configuration files, including <code>data/ministries.ts</code>, <code>data/socialMediaData.ts</code>, <code>application.json</code>, and the mappings in <code>services/countryDataService.ts</code> to ensure all data sources can correctly identify the country.</p>
                <h4>Q: Why are social media feeds sometimes empty?</h4>
                <p>A: We rely on public, unofficial RSS gateways like Nitter to fetch social media data. These services can sometimes be unreliable or go offline. If a feed is consistently empty, the service may be down, or the official account may have changed its username.</p>
            </>
        ),
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-analyst-border flex-shrink-0">
                <h2 className="text-lg font-bold text-slate-900 dark:text-analyst-text-primary">Documentation</h2>
                <p className="text-sm text-slate-500 dark:text-analyst-text-secondary">Application architecture and integrated services overview.</p>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
                <div className="space-y-4">
                    {sections.map(section => (
                         <AccordionItem
                            key={section.id}
                            title={section.title}
                            isOpen={openSection === section.id}
                            onToggle={() => handleToggle(section.id)}
                        >
                           {content[section.id]}
                        </AccordionItem>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DocumentationPanel;