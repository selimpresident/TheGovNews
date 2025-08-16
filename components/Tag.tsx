
import React from 'react';
import { Entity } from '../types';

interface TagProps {
  type: Entity['type'];
  text: string;
}

const Tag: React.FC<TagProps> = ({ type, text }) => {
  const typeColors: Record<Entity['type'], string> = {
    PERSON: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    ORG: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    LOCATION: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    EVENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    MISC: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[type]}`}>
      {text}
    </span>
  );
};

export default Tag;
