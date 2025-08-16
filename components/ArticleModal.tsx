import React, { useEffect, useRef, useState } from 'react';
import { Article, AiAnalysisResult } from '../types';
import Tag from './Tag';
import TopicTag from './TopicTag';
import { BookmarkFilledIcon, BookmarkIcon, ExternalLinkIcon, CloseIcon, BeakerIcon, SparklesIcon } from './Icons';
import { summarizeArticle, analyzeTextSentimentAndTopics } from '../services/geminiService';
import { Spinner } from './Spinner';

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleBookmark: (articleId: string) => void;
  onSetAiSummary: (summary: string) => void;
  onSetAiAnalysis: (analysis: AiAnalysisResult) => void;
}

const formatSourceName = (key: string): string => {
    if (!key.includes('.')) return key;
    const parts = key.split('.');
    return parts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};

const getSourceLogoInitial = (sourceName: string) => {
    const parts = sourceName.split(' - ')[1]?.split(' ') || sourceName.split(' ');
    if (parts.length > 1) {
        return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
    }
    return sourceName.substring(0, 2).toUpperCase();
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, isOpen, onClose, onToggleBookmark, onSetAiSummary, onSetAiAnalysis }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleGenerateSummary = async () => {
    if (!article || !article.body) return;
    setIsSummarizing(true);
    try {
      const summary = await summarizeArticle(article.body);
      onSetAiSummary(summary);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      alert("Sorry, we couldn't generate a summary for this article at the moment.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleGenerateAnalysis = async () => {
    if (!article || !article.body) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeTextSentimentAndTopics(article.body);
      onSetAiAnalysis(analysis);
    } catch (error) {
      console.error("Failed to generate analysis:", error);
      alert("Sorry, we couldn't analyze this article at the moment.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen || !article) return null;
  
  const formattedSourceName = formatSourceName(article.source_name);

  return (
    <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-title"
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between flex-shrink-0">
          <h2 id="article-title" className="text-xl font-bold text-slate-900 dark:text-slate-100 truncate pr-4" title={article.title}>{article.title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0" aria-label="Close">
            <CloseIcon className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          </button>
        </header>
        <main className="p-6 md:p-8 overflow-y-auto flex-grow prose prose-slate dark:prose-invert max-w-none">
            <div className="flex items-center gap-3 my-6 not-prose">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {getSourceLogoInitial(formattedSourceName)}
                </div>
                <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{formattedSourceName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Published on {new Date(article.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            <div className="leading-relaxed">
                <h3 className="font-bold mb-2 text-slate-800 dark:text-slate-100">Article</h3>
                <p className="whitespace-pre-wrap">{article.body}</p>
            </div>
            
            <div className="not-prose mt-8">
              <h3 className="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">AI Summary</h3>
              {isSummarizing ? (
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Spinner />
                  <span>Generating summary...</span>
                </div>
              ) : article.summary_ai ? (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{article.summary_ai}</p>
                </div>
              ) : (
                <button onClick={handleGenerateSummary} disabled={isSummarizing} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed">
                  <BeakerIcon className="h-5 w-5" />
                  <span>Generate AI Summary</span>
                </button>
              )}
            </div>
            
            <div className="not-prose mt-8">
              <h3 className="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">AI Analysis</h3>
              {isAnalyzing ? (
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Spinner />
                  <span>Analyzing sentiment and topics...</span>
                </div>
              ) : article.ai_analysis ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Sentiment: {article.ai_analysis.sentiment}</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{ (article.ai_analysis.score * 100).toFixed(0) }%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          article.ai_analysis.score > 0.6 ? 'bg-green-500' : article.ai_analysis.score < 0.4 ? 'bg-red-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${article.ai_analysis.score * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Detected Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {article.ai_analysis.topics.map((topic, index) => (
                        <span key={index} className="bg-slate-100 text-slate-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-slate-700 dark:text-slate-300">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                 <button onClick={handleGenerateAnalysis} disabled={isAnalyzing} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed">
                    <SparklesIcon className="h-5 w-5" />
                    <span>Analyze Sentiment & Topics</span>
                </button>
              )}
            </div>

            <div className="not-prose mt-8">
                <h3 className="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Entities</h3>
                <div className="flex flex-wrap gap-2">
                    {article.entities.length > 0 ? 
                     article.entities.map((entity, index) => <Tag key={index} type={entity.type} text={entity.text} />) :
                     <p className="text-sm text-slate-500 dark:text-slate-400">No entities found.</p>
                    }
                </div>
            </div>

            <div className="not-prose mt-8">
                <h3 className="font-semibold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2">
                    {article.topics && article.topics.length > 0 ? 
                     article.topics.map((topic, index) => <TopicTag key={index} topic={topic} />) :
                     <p className="text-sm text-slate-500 dark:text-slate-400">No topics found.</p>
                    }
                </div>
            </div>
        </main>
        <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center gap-3 flex-shrink-0 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
            <a href={article.canonical_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-500 hover:underline">
                View Original Source
                <ExternalLinkIcon className="h-4 w-4" />
            </a>
            <button
                onClick={() => onToggleBookmark(article.article_id)}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md transition-colors text-slate-700 dark:text-slate-200 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                aria-label="Bookmark Article"
            >
                {article.bookmarked ? <BookmarkFilledIcon className="h-5 w-5 text-blue-600 dark:text-blue-500" /> : <BookmarkIcon className="h-5 w-5" />}
                <span>{article.bookmarked ? 'Saved' : 'Save'}</span>
            </button>
        </footer>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ArticleModal;