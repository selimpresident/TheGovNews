// A heuristic approach to determine map scale for different countries.
// This ensures that both very large and very small countries are visible.
// A lower scale value means zoomed out, a higher value means zoomed in.
export const getOptimalScale = (geo: any): number => {
    const DEFAULT_SCALE = 800;
    if (!geo || !geo.properties || !geo.properties.name) {
        return DEFAULT_SCALE;
    }
    
    const countryName = geo.properties.name;

    // A map of specific scales for countries that don't fit well with defaults.
    const specificScales: Record<string, number> = {
        // Very large countries (zoom out)
        'Russia': 200,
        'Canada': 250,
        'China': 350,
        'United States of America': 350,
        'Brazil': 350,
        'Australia': 350,
        'India': 450,
        'Argentina': 400,
        'Kazakhstan': 400,
        'Algeria': 450,
        'Greenland': 300,
        'Dem. Rep. Congo': 500,

        // Elongated or fragmented countries
        'Chile': 300,
        'Norway': 400,
        'Sweden': 400,
        'Finland': 500,
        'Japan': 500,
        'Indonesia': 350,
        'Philippines': 600,
        'New Zealand': 600,
        'Vietnam': 550,
        'Italy': 800,
        'Malaysia': 700,
        
        // Very small countries (zoom in a lot)
        'Singapore': 30000,
        'Malta': 40000,
        'Maldives': 5000,
        'Bahrain': 15000,
        'Andorra': 50000,
        'Liechtenstein': 80000,
        'Monaco': 200000,
        'San Marino': 100000,
        'Vatican City': 500000,
        'Luxembourg': 15000,
        'Qatar': 7000,
        'Brunei Darussalam': 8000,
        'Mauritius': 10000,
        'Comoros': 8000,
        'Trinidad and Tobago': 10000,
        'Barbados': 20000,
        'Cyprus': 10000,
        'Jamaica': 8000,
        
        // Mid-size countries that needed slight adjustments
        'France': 1000,
        'Spain': 900,
        'Germany': 1000,
        'United Kingdom': 1000,
        'Poland': 900,
        'Ukraine': 800,
        'Turkey': 1100,
    };

    return specificScales[countryName] || DEFAULT_SCALE;
};
