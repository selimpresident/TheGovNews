import React from 'react';
import { Topic } from '../types';

interface TopicTagProps {
  topic: Topic;
}

const TopicTag: React.FC<TopicTagProps> = ({ topic }) => {
  const topicColors: Record<Topic, string> = {
    'economy': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'defense': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    'health': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'environment': 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
    'diplomacy': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
    'technology': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    'internal-security': 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
    'politics': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    'conflict': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  };

  const colorClass = topicColors[topic] || topicColors['internal-security'];

  const formatTopicName = (topic: Topic) => {
    return topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
      {formatTopicName(topic)}
    </span>
  );
};

export default TopicTag;