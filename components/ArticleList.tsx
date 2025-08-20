import React, { memo, useCallback } from 'react';
import { Article } from '../types';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  onArticleSelect: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
}

const ArticleList: React.FC<ArticleListProps> = memo(({ articles, onArticleSelect, onToggleBookmark }) => {
  const handleArticleSelect = useCallback((article: Article) => {
    onArticleSelect(article);
  }, [onArticleSelect]);

  if (articles.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">No Articles Found</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Please try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {articles.map(article => (
          <ArticleCard
            key={article.article_id}
            article={article}
            onSelect={() => handleArticleSelect(article)}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>
    </div>
  );
});

ArticleList.displayName = 'ArticleList';

export default ArticleList;