import React from 'react';
import { Article } from '../types';
import ArticleCard from './ArticleCard';

interface ArticleListProps {
  articles: Article[];
  onArticleSelect: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, onArticleSelect, onToggleBookmark }) => {
  if (articles.length === 0) {
    return (
      <div className="text-center p-16">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-analyst-text-primary">No Articles Found</h3>
        <p className="mt-2 text-slate-500 dark:text-analyst-text-secondary">Please try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 dark:divide-analyst-border">
      {articles.map(article => (
        <ArticleCard
          key={article.article_id}
          article={article}
          onSelect={() => onArticleSelect(article)}
          onToggleBookmark={onToggleBookmark}
        />
      ))}
    </div>
  );
};

export default ArticleList;