# TheGovNews – Government News Aggregator

English | [Türkçe](README_tr.md)

An open-source, intelligent aggregator for official government news sources. It fetches, enriches, and presents reliable, searchable, and filterable public information in a modern, responsive UI.

## Features
- Official sources aggregation (ministries, agencies) with enriched context
- Multi-language UI with i18next and auto language detection
- Interactive world map (react-simple-maps) for country exploration
- Panels for World Bank, NOAA, OECD, ReliefWeb and more
- Mobile-first, responsive design with Tailwind CSS
- Capacitor support to package the web app for iOS and Android

## Tech Stack
- React 18, TypeScript, Vite 6
- Tailwind CSS (custom themes, animations)
- i18next, i18next-browser-languagedetector, i18next-http-backend
- react-simple-maps, react-tooltip
- Capacitor (Android/iOS)

## Getting Started
Prerequisites: Node.js 18+ and npm.

1) Clone and install
```bash
git clone <your-fork-or-repo-url>
cd Devlet
npm install
```

2) Environment variables (see SECURITY.md)
```bash
cp .env.example .env.local
# Edit .env.local
VITE_GEMINI_API_KEY=your_actual_api_key
```

3) Development
```bash
npm run dev
```

4) Build and preview
```bash
npm run build
npm run preview
```

## Mobile (Capacitor)
Android:
```bash
npm run build:android
npm run open:android
```

iOS (requires macOS + Xcode):
```bash
npm run build:ios
npm run open:ios
```

## Localization
- Translations live under `locales/` and `public/locales/`
- Add a new `<lang>.json`, then update i18n configuration if needed
- Contributions for translations are welcome

## Contributing
We welcome issues, discussions, and PRs!
- Fork the repo, create a feature branch (feat/your-feature)
- Follow linting/formatting: `npm run lint` and `npm run lint:fix`, `npm run format`
- Keep PRs focused and include screenshots for UI changes

## Security
Please read the security guidelines: see SECURITY.md.

## License
License to be defined by the project owner. If you plan to contribute, please open an issue to discuss the license choice.