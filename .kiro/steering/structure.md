# Project Structure

## Root Level Organization
- **Dual structure**: Both root-level and `src/` folder contain similar structures for flexibility
- **Configuration files**: TypeScript, Vite, Tailwind, and Capacitor configs at root
- **Environment files**: `.env.example`, `.env.local` for API key management

## Core Directories

### `/components`
React components organized by functionality:
- **UI Components**: Modal, Spinner, Icons, Logo, Tag, etc.
- **Feature Components**: ArticleCard, ChatInterface, CountrySidebar, etc.
- **Layout Components**: Header, LeftSidebar, RightSidebar
- **Data Panels**: NoaaPanel, OecdPanel, PopulationPyramidPanel, etc.
- **Admin Components**: Located in `/components/admin/` subfolder

### `/pages`
Top-level page components representing different application views:
- `LandingPage.tsx` - Main entry point
- `CountryDetailPage.tsx` - Country-specific analysis
- `ComparativeAnalysisPage.tsx` - Cross-country comparisons
- `AdminPanel.tsx` - Administrative interface
- `AIAnalystPage.tsx` - AI chat interface

### `/services`
External API integrations and data services:
- **Data Sources**: `worldBankService.ts`, `oecdService.ts`, `noaaService.ts`
- **AI Services**: `geminiService.ts` for Google AI integration
- **Mock Data**: `mockData.ts` for development
- **Configuration**: `environmentConfig.ts` for API setup

### `/contexts`
React Context providers for global state:
- `AuthContext.tsx` - User authentication
- `ThemeContext.tsx` - Dark/light mode
- `LanguageContext.tsx` - Internationalization

### `/types`
TypeScript type definitions:
- `types.ts` - Core application types
- `/types/enhanced.ts` - Extended type definitions

### `/utils`
Utility functions and helpers:
- `apiValidation.ts` - API response validation
- `typeValidation.ts` - Runtime type checking
- `cache.ts` - Caching mechanisms
- `imageUtils.ts` - Image processing
- `time.ts` - Date/time utilities

### `/locales`
Internationalization files:
- `en.json`, `ko.json`, `tr.json` - Translation files
- `config.ts` - i18n configuration
- `translations.ts` - Translation utilities

### `/data`
Static data files:
- `conflicts.ts` - Conflict data
- `ministries.ts` - Government ministry information
- `socialMediaData.ts` - Social media configurations

## Mobile Platform Directories
- `/android` - Android-specific Capacitor configuration
- `/ios` - iOS-specific Capacitor configuration

## Naming Conventions
- **Components**: PascalCase (e.g., `ArticleCard.tsx`)
- **Services**: camelCase with Service suffix (e.g., `worldBankService.ts`)
- **Types**: PascalCase interfaces (e.g., `Article`, `Source`)
- **Utilities**: camelCase (e.g., `apiValidation.ts`)
- **Pages**: PascalCase with Page suffix (e.g., `LandingPage.tsx`)