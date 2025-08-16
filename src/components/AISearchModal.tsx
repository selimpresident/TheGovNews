import React from 'react';
import { Spinner } from './ui/Spinner';
import { AiSearchResult } from '../types';
import { ExternalLinkIcon, CloseIcon } from './ui/Icons';

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  result: AiSearchResult | null;
  error: string | null;
}

const AISearchModal: React.FC<AISearchModalProps> = ({ isOpen, onClose, isLoading, result, error }) => {
  if (!isOpen) {
    return null;
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 min-h-[200px]">
          <Spinner />
          <p className="mt-4 text-slate-500 dark:text-slate-400">Searching with AI...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8 min-h-[200px]">
          <p className="text-red-600 dark:text-red-500">AI Search Error</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{error}</p>
        </div>
      );
    }

    if (result) {
      return (
        <div>
          <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-200">{result.summary}</p>
          {result.sources && result.sources.length > 0 && (
            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">Sources</h4>
              <ul className="space-y-2">
                {result.sources.map((source, index) => (
                  source.web && source.web.uri && (
                    <li key={index}>
                      <a
                        href={source.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-sm text-blue-600 dark:text-blue-500 hover:underline"
                        title={source.web.uri}
                      >
                        <ExternalLinkIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span className="truncate">{source.web.title || source.web.uri}</span>
                      </a>
                    </li>
                  )
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-search-title"
    >
      <div
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between flex-shrink-0">
          <h2 id="ai-search-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">AI Search Result</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Close">
            <CloseIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </button>
        </header>
        <main className="p-6 md:p-8 overflow-y-auto flex-grow">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AISearchModal;