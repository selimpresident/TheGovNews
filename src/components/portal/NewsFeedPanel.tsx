import React, { useState, useMemo } from 'react';
import { Article } from '../../types';
import { SearchIcon, ChevronDownIcon, FilterIcon } from '../Icons';
import NewsFeedItem from './NewsFeedItem';

interface NewsFeedPanelProps {
  feed: Article[];
}

const NewsFeedPanel: React.FC<NewsFeedPanelProps> = ({ feed }) => {
    const [view, setView] = useState<'list' | 'timeline'>('list');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredFeed = useMemo(() => {
        if (!searchTerm) return feed;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return feed.filter(article => 
            article.title.toLowerCase().includes(lowerCaseSearch) ||
            article.summary_short.toLowerCase().includes(lowerCaseSearch)
        );
    }, [feed, searchTerm]);

    return (
        <div className="rounded-xl bg-analyst-sidebar/50 backdrop-blur-xl border border-white/10 dark:border-analyst-border/50 shadow-lg">
            {/* Panel Header & Filters */}
            <div className="p-4 border-b border-analyst-border/50 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-analyst-text-primary">Unified News Feed</h3>
                     <div className="flex items-center gap-2">
                        <button className="h-8 px-3 text-xs font-semibold rounded-md bg-analyst-input hover:bg-analyst-item-hover">List</button>
                        <button className="h-8 px-3 text-xs font-semibold rounded-md text-analyst-text-secondary hover:bg-analyst-item-hover">Timeline</button>
                    </div>
                </div>

                {/* Filter Bar */}
                 <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-analyst-text-secondary" />
                        <input 
                            type="text" 
                            placeholder="Search feed..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-9 bg-analyst-input border-analyst-border rounded-lg pl-9 pr-3 text-sm focus:ring-2 focus:ring-analyst-accent/50 focus:outline-none" 
                        />
                    </div>
                    <button className="h-9 px-3 flex items-center gap-2 text-sm bg-analyst-input border-analyst-border rounded-lg hover:bg-analyst-item-hover">
                       Topics <ChevronDownIcon className="w-4 h-4" />
                    </button>
                    <button className="h-9 px-3 flex items-center gap-2 text-sm bg-analyst-input border-analyst-border rounded-lg hover:bg-analyst-item-hover">
                       Sources <ChevronDownIcon className="w-4 h-4" />
                    </button>
                     <button className="h-9 w-9 flex-shrink-0 flex items-center justify-center text-sm bg-analyst-input border-analyst-border rounded-lg hover:bg-analyst-item-hover">
                       <FilterIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Feed Content */}
            <div>
                {filteredFeed.length > 0 ? (
                    <div className="divide-y divide-analyst-border/50">
                        {filteredFeed.map(article => <NewsFeedItem key={article.article_id} article={article} />)}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <p className="text-sm text-analyst-text-secondary">No articles match your criteria.</p>
                        <p className="text-xs text-analyst-text-secondary mt-1">Try adjusting your portal's settings or your search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsFeedPanel;