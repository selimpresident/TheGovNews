import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import './i18n';
import { Spinner } from './components/Spinner';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-slate-100 dark:bg-analyst-dark-bg">
        <Spinner />
      </div>
    }>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </React.Suspense>
  </React.StrictMode>
);
