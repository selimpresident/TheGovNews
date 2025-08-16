import { App } from '@capacitor/app';

export function setupAndroidBackHandler(customBackAction?: () => boolean) {
  // Only register on Android platform
  if (window.navigator.userAgent.indexOf('Android') === -1) return;
  
  App.addListener('backButton', ({ canGoBack }) => {
    // If custom back action is provided and it returns true, exit early
    if (customBackAction && customBackAction()) {
      return;
    }
    
    // If we can go back in history, do so
    if (canGoBack) {
      window.history.back();
    } else {
      // Otherwise, minimize the app
      App.minimizeApp();
    }
  });
}