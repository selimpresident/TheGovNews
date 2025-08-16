import React, { useState, useMemo, useEffect } from 'react';
import { Article, Topic, Entity } from '../../types';
import { generateThematicAnalysis } from '../../services/geminiService';
import { LightBulbIcon, SparklesIcon, XCircleIcon, ChartBarIcon, UsersIcon } from '../Icons';
import { Spinner } from '../Spinner';

const ThematicSummary: React.FC<{ articles: Article[] }> = ({ articles }) => {
    const [summary, setSummary] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = () => {
        setIsLoading(true);
        setError(null);
        generateThematicAnalysis(articles)
            .then(setSummary)
            .catch(err => {
                console.error("Thematic analysis failed:", err);
                setError("Failed to generate analysis.");
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div className="p-4 rounded-xl bg-analyst-sidebar/50 border border-analyst-border/50">
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-analyst-text-primary flex items-center gap-2">
                    <LightBulbIcon className="w-5 h-5 text-analyst-orange" />
                    Thematic Summary
                </h4>
                <button 
                    onClick={handleGenerate} 
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md bg-analyst-input hover:bg-analyst-item-hover text-analyst-text-primary disabled:opacity-50"
                >
                    {isLoading ? <Spinner /> : <SparklesIcon className="w-4 h-4 text-analyst-purple" />}
                    <span>{isLoading ? 'Generating...' : 'Generate Analysis'}</span>
                </button>
            </div>
            <div className="border-t border-analyst-border/50 pt-3">
                {error && <p className="text-sm text-red-500">{error}</p>}
                {!summary && !isLoading && <p className="text-sm text-analyst-text-secondary">Click "Generate Analysis" to identify key themes across the articles in your feed.</p>}
                {summary && <div className="text-sm text-analyst-text-primary whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: summary.replace(/###\s/g, '<strong>').replace(/(\r\n|\n|\r)/gm, '$1</strong><br/>') }} />}
            </div>
        </div>
    );
};

const TopicDistributionChart: React.FC<{ articles: Article[] }> = ({ articles }) => {
    const topicDistribution = useMemo(() => {
        const counts = articles.flatMap(a => a.topics).reduce((acc, topic) => {
            acc[topic] = (acc[topic] || 0) + 1;
            return acc;
        }, {} as Record<Topic, number>);
        
        return Object.entries(counts)
            .map(([topic, count]) => ({ topic: topic as Topic, count }))
            .sort((a, b) => b.count - a.count);
    }, [articles]);

    const maxCount = Math.max(...topicDistribution.map(t => t.count), 0);

    return (
        <div className="p-4 rounded-xl bg-analyst-sidebar/50 border border-analyst-border/50">
            <h4 className="font-semibold text-analyst-text-primary flex items-center gap-2 mb-3">
                <ChartBarIcon className="w-5 h-5 text-analyst-green" />
                Topic Distribution
            </h4>
            <div className="space-y-2">
                {topicDistribution.length > 0 ? topicDistribution.map(({ topic, count }) => (
                    <div key={topic} className="grid grid-cols-4 items-center gap-2 text-sm">
                        <span className="col-span-1 text-analyst-text-secondary capitalize truncate">{topic.replace('-', ' ')}</span>
                        <div className="col-span-3 bg-analyst-input rounded-full h-5">
                            <div 
                                className="bg-analyst-green/80 h-5 rounded-full flex items-center justify-end px-2"
                                style={{ width: `${Math.max((count / maxCount) * 100, 5)}%` }}
                            >
                                <span className="text-xs font-bold text-white">{count}</span>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-sm text-analyst-text-secondary">No topics found in the current feed.</p>}
            </div>
        </div>
    );
};

const EntityCloud: React.FC<{ articles: Article[] }> = ({ articles }) => {
     const entityCloud = useMemo(() => {
        const counts = articles.flatMap(a => a.entities).reduce((acc, entity) => {
            const key = entity.text.toLowerCase();
            if (!acc[key]) {
                acc[key] = { text: entity.text, count: 0, type: entity.type };
            }
            acc[key].count++;
            return acc;
        }, {} as Record<string, { text: string, count: number, type: Entity['type'] }>);

        return Object.values(counts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 30); // Show top 30 entities
    }, [articles]);

    const minMax = useMemo(() => {
        const counts = entityCloud.map(e => e.count);
        return { min: Math.min(...counts, 1), max: Math.max(...counts, 1) };
    }, [entityCloud]);

    const getFontSize = (count: number) => {
        if (minMax.max === minMax.min) return 14;
        const sizeRange = 20; // 12px to 32px
        const percent = (count - minMax.min) / (minMax.max - minMax.min);
        return 12 + Math.round(percent * sizeRange);
    };

     const typeColors: Record<Entity['type'], string> = {
        PERSON: 'text-analyst-accent',
        ORG: 'text-analyst-green',
        LOCATION: 'text-analyst-purple',
        EVENT: 'text-analyst-orange',
        MISC: 'text-analyst-text-secondary',
    };

    return (
         <div className="p-4 rounded-xl bg-analyst-sidebar/50 border border-analyst-border/50">
            <h4 className="font-semibold text-analyst-text-primary flex items-center gap-2 mb-3">
                <UsersIcon className="w-5 h-5 text-analyst-purple" />
                Key Entities
            </h4>
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center items-center">
                 {entityCloud.length > 0 ? entityCloud.map(entity => (
                    <span 
                        key={entity.text} 
                        className={`font-semibold ${typeColors[entity.type]}`}
                        style={{ fontSize: `${getFontSize(entity.count)}px`}}
                    >
                        {entity.text}
                    </span>
                 )) : <p className="text-sm text-analyst-text-secondary">No entities found in the current feed.</p>}
            </div>
        </div>
    );
};

const AnalysisPanel: React.FC<{ articles: Article[] }> = ({ articles }) => {
  return (
    <div className="space-y-6">
        <ThematicSummary articles={articles} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopicDistributionChart articles={articles} />
            <EntityCloud articles={articles} />
        </div>
    </div>
  );
};

export default AnalysisPanel;
