import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, SparklesIcon, XCircleIcon } from '../Icons';
import { Article } from '../../types';
import { generatePortalBriefing } from '../../services/geminiService';
import { Spinner } from '../Spinner';

interface AIBriefPanelProps {
    articles: Article[];
}

const AIBriefPanel: React.FC<AIBriefPanelProps> = ({ articles }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [briefing, setBriefing] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (articles.length > 0) {
            setIsLoading(true);
            setError(null);
            generatePortalBriefing(articles)
                .then(setBriefing)
                .catch(err => {
                    console.error("AI Briefing failed:", err);
                    setError("Failed to generate AI briefing. Please try again later.");
                })
                .finally(() => setIsLoading(false));
        } else {
            setBriefing("Not enough data for a briefing. Add countries or topics to your portal.");
            setIsLoading(false);
            setError(null);
        }
    }, [articles]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center gap-3 text-sm text-analyst-text-secondary">
                    <Spinner />
                    <span>Generating briefing from {articles.length} articles...</span>
                </div>
            )
        }
        if (error) {
            return (
                <div className="flex items-center gap-3 text-sm text-red-500">
                    <XCircleIcon className="w-5 h-5" />
                   <span>{error}</span>
                </div>
            )
        }
        return (
            <div className="space-y-4">
                <div className="text-sm text-analyst-text-primary whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: briefing?.replace(/\*/g, '') || '' }}></div>
                 <div className="flex items-center justify-end text-xs text-analyst-text-secondary">
                    <button className="font-semibold hover:text-analyst-text-primary">Regenerate</button>
                </div>
            </div>
        )
    };

    return (
        <div className="rounded-xl bg-analyst-sidebar/50 backdrop-blur-xl border border-white/10 dark:border-analyst-border/50 shadow-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    <SparklesIcon className="w-5 h-5 text-analyst-purple" />
                    <h3 className="font-semibold text-analyst-text-primary">AI Briefing / 24h Snapshot</h3>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-analyst-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 pt-0">
                    <div className="border-t border-analyst-border/50 pt-4">
                        {renderContent()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIBriefPanel;