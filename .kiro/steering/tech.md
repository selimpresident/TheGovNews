# Technology Stack

## Frontend Framework
- **React 18.3.1** with TypeScript
- **Vite** as build tool and dev server
- **TailwindCSS** for styling with custom design system

## Mobile Development
- **Capacitor 7.4.2** for cross-platform mobile deployment
- Native Android and iOS app generation

## Internationalization
- **react-i18next** for multi-language support
- **i18next-browser-languagedetector** for automatic language detection
- **i18next-http-backend** for dynamic translation loading

## AI Integration
- **Google Gemini AI** (@google/genai) for content analysis and chat functionality
- Environment-based API key configuration

## Data Visualization
- **react-simple-maps** for interactive world maps
- **react-tooltip** for enhanced UI interactions

## Development Tools
- **TypeScript 5.8.2** with strict type checking enabled
- **ESNext** module system with bundler resolution
- Path aliases configured (`@/*` maps to project root)

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Mobile Development
```bash
npm run build:android    # Build and sync for Android
npm run open:android     # Open Android project in Android Studio
npm run build:ios        # Build and sync for iOS  
npm run open:ios         # Open iOS project in Xcode
```

## Environment Configuration
- Uses Vite's `loadEnv` for environment variable management
- API keys configured via `.env.local` file
- Environment variables exposed to client via `define` in vite.config.ts