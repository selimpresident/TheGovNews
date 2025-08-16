import React from 'react';
import { Entity } from '../types';

interface TagProps {
  type: Entity['type'];
  text: string;
}

const Tag: React.FC<TagProps> = ({ type, text }) => {
  const typeColors: Record<Entity['type'], string> = {
    PERSON: 'bg-blue-100 text-blue-800 dark:bg-analyst-accent/10 dark:text-analyst-accent',
    ORG: 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400',
    LOCATION: 'bg-purple-100 text-purple-800 dark:bg-purple-500/10 dark:text-purple-400',
    EVENT: 'bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400',
    MISC: 'bg-slate-100 text-slate-800 dark:bg-analyst-input dark:text-analyst-text-secondary',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[type]}`}>
      {text}
    </span>
  );
};

export default Tag;