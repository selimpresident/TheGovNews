// Define time constants for clarity
const aMinute = 60 * 1000;
const anHour = 60 * aMinute;
const aDay = 24 * anHour;
const aWeek = 7 * aDay;

/**
 * Formats a date string into a relative time phrase (e.g., "5h ago").
 * Falls back to a standard date format for older dates.
 * @param dateString - The ISO date string to format.
 * @param lang - The current language locale.
 * @returns A formatted relative or absolute time string.
 */
export const timeAgo = (dateString: string, lang: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < aMinute) {
    return 'just now';
  }
  if (diff < anHour) {
    const minutes = Math.floor(diff / aMinute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (diff < aDay) {
    const hours = Math.floor(diff / anHour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (diff < aWeek) {
    const days = Math.floor(diff / aDay);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  // Fallback for dates older than a week
  return new Intl.DateTimeFormat(lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Formats a date string into a localized, absolute date (e.g., "July 26, 2024").
 * @param dateString - The ISO date string to format.
 * @param lang - The current language locale (optional, browser default used if not provided).
 * @param options - Optional Intl.DateTimeFormatOptions to customize the output.
 * @returns A formatted date string.
 */
export const formatDate = (dateString: string, lang?: string, options?: Intl.DateTimeFormatOptions): string => {
    if (!dateString) return '';
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    try {
        return new Date(dateString).toLocaleDateString(lang, { ...defaultOptions, ...options });
    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString;
    }
};