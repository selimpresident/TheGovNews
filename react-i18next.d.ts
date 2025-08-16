// This declaration file fixes a module resolution error caused by an empty .d.ts file.
// It provides minimal type definitions for the parts of react-i18next used in the app.
declare module 'react-i18next' {
  // Basic type for the t function
  type TFunction = (key: string, options?: object) => string;

  // Basic type for the i18n object
  interface I18n {
    changeLanguage: (lang: string) => Promise<TFunction>;
    language: string;
  }

  // Type for the useTranslation hook's return value
  interface UseTranslationResponse {
    t: TFunction;
    i18n: I18n;
  }

  // Declaration for the useTranslation hook
  export function useTranslation(ns?: string | string[], options?: object): UseTranslationResponse;

  // Declaration for initReactI18next
  export const initReactI18next: {
    type: '3rdParty';
    init: (i18next: any) => void;
  };
}
