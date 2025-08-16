import React from 'react';
import { Article } from '../../types';
import TopicTag from '../TopicTag';
import { BookmarkIcon } from '../Icons';
import { timeAgo } from '../../utils/time';

interface NewsFeedItemProps {
  article: Article & { relevance_score?: number };
}

const NewsFeedItem: React.FC<NewsFeedItemProps> = ({ article }) => {
    
    const formatSourceName = (key: string): string => {
      if (!key.includes('.')) return key;
      const parts = key.split('.');
      // Assuming format like 'source.tr.tccb', we want to get 'TCCB' or similar
      const lastPart = parts[parts.length - 1];
      return lastPart.toUpperCase();
    };

    return (
        <article className="p-4 hover:bg-analyst-item-hover/50 transition-colors group">
            <div className="flex items-start gap-4">
                {/* Source Badge */}
                <div className="flex-shrink-0 text-center w-12">
                     <div className="w-10 h-10 mx-auto rounded-lg bg-analyst-input flex items-center justify-center">
                        <span className="text-xs font-bold text-analyst-text-secondary">{formatSourceName(article.source_name)}</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow">
                    <a href={article.canonical_url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-analyst-text-primary group-hover:text-analyst-accent transition-colors">
                        {article.title}
                    </a>
                    <p className="text-sm text-analyst-text-secondary mt-1 line-clamp-2">{article.summary_short}</p>
                    
                    {/* Meta & Tags */}
                    <div className="mt-3 flex items-center justify-between">
                         <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs text-analyst-text-secondary">{timeAgo(article.published_at, 'en')}</p>
                            <span className="text-analyst-border">•</span>
                            {article.topics.slice(0, 2).map(topic => <TopicTag key={topic} topic={topic} />)}
                        </div>
                        <div className="flex items-center gap-3">
                             {article.relevance_score && (
                                <span className="text-xs font-mono text-analyst-green">
                                    Relevance: {(article.relevance_score * 100).toFixed(0)}%
                                </span>
                             )}
                             <button className="p-1.5 rounded-full text-analyst-text-secondary hover:bg-analyst-input hover:text-analyst-accent">
                                <BookmarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default NewsFeedItem;