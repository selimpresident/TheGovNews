import React, { useState, useMemo } from 'react';
import { SocialPost, SocialMediaLinks } from '../types';
import { Spinner } from './Spinner';
import { ChatBubbleLeftRightIcon, XIcon, YouTubeIcon, InstagramIcon, ExternalLinkIcon } from './Icons';
import { BasePanel } from './common/BasePanel';

type Tab = 'all' | 'X' | 'YouTube';

const PostItem: React.FC<{ post: SocialPost }> = ({ post }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    };

    const platformIcon = useMemo(() => {
        switch (post.platform) {
            case 'X': return <XIcon className="h-5 w-5 text-slate-800 dark:text-slate-200" />;
            case 'YouTube': return <YouTubeIcon className="h-5 w-5 text-red-600" />;
            default: return null;
        }
    }, [post.platform]);

    return (
        <div className="p-5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0 pt-1">{platformIcon}</div>
                <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-slate-800 dark:text-slate-100">{post.author}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">from {post.platform}</p>
                    </div>
                     <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{formatDate(post.published_at)}</p>

                    {post.platform === 'YouTube' && post.thumbnailUrl && (
                         <img src={post.thumbnailUrl} alt={post.text} className="rounded-lg border border-slate-200 dark:border-slate-700 my-3 max-w-sm w-full" />
                    )}
                     <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                        {post.platform === 'X' && post.htmlContent ? (
                             <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
                        ) : (
                            <p>{post.text}</p>
                        )}
                     </div>

                     <a href={post.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-500 hover:underline mt-3">
                        View on {post.platform}
                        <ExternalLinkIcon className="h-3 w-3" />
                    </a>
                </div>
            </div>
        </div>
    );
};


interface SocialMediaPanelProps {
    status: 'idle' | 'loading' | 'success' | 'error';
    posts: SocialPost[];
    links: SocialMediaLinks | null;
    countryName: string;
    loading?: boolean;
    error?: string;
    onRefresh?: () => void;
}

const SocialMediaPanel: React.FC<SocialMediaPanelProps> = ({ 
    status, 
    posts, 
    links, 
    countryName, 
    loading = status === 'loading',
    error = status === 'error' || !links ? `We could not find configured social media accounts for ${countryName}.` : undefined,
    onRefresh 
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('all');
    
    const filteredPosts = useMemo(() => {
        if (activeTab === 'all') return posts;
        return posts.filter(p => p.platform === activeTab);
    }, [posts, activeTab]);

    const hasPosts = posts.length > 0;

    return (
        <BasePanel
            title="Social Media Feed"
            subtitle={`Live updates from official social media accounts for ${countryName}.`}
            icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />}
            loading={loading}
            error={error}
            onRefresh={onRefresh}
            variant="glass"
            size="md"
        >
            {links && (
                <>
                    {links.instagram && (
                        <div className="mb-6">
                            <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                                <InstagramIcon className="h-4 w-4" />
                                View on Instagram
                            </a>
                        </div>
                    )}

                    <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                        <nav className="-mb-px flex space-x-6">
                            <button onClick={() => setActiveTab('all')} className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${activeTab === 'all' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>All</button>
                            {links.x && <button onClick={() => setActiveTab('X')} className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${activeTab === 'X' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>X</button>}
                            {links.youtube && <button onClick={() => setActiveTab('YouTube')} className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${activeTab === 'YouTube' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}>YouTube</button>}
                        </nav>
                    </div>
                    
                    {!hasPosts ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 dark:text-slate-400">No recent posts could be fetched.</p>
                            <div className="mt-4 flex justify-center gap-4">
                                {links.x && <a href={links.x} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-500 hover:underline transition-colors">View on X</a>}
                                {links.youtube && <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-500 hover:underline transition-colors">View on YouTube</a>}
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredPosts.map(post => <PostItem key={post.id} post={post} />)}
                        </div>
                    )}
                </>
            )}
        </BasePanel>
    );
};

export default SocialMediaPanel;