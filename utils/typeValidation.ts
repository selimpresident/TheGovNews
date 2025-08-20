/**
 * Runtime Type Validation Utilities
 * Provides runtime validation for API responses and user inputs
 */

import { 
  Article, 
  Source, 
  UcdpEvent, 
  GdeltArticle, 
  ExternalArticle, 
  FactbookData, 
  WorldBankIndicator,
  OecdIndicator,
  NoaaIndicator,
  ReliefWebUpdate,
  PopulationPyramidData,
  OsmData,
  SocialPost,
  AiAnalysisResult
} from '../types';

/**
 * Base validation result interface
 */
export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors: string[];
}

/**
 * Validation error class for better error handling
 */
export class ValidationError extends Error {
  constructor(
    public field: string,
    public expectedType: string,
    public receivedValue: unknown
  ) {
    super(`Validation failed for field '${field}': expected ${expectedType}, received ${typeof receivedValue}`);
    this.name = 'ValidationError';
  }
}

/**
 * Generic type guard creator
 */
export function createTypeGuard<T>(
  validator: (obj: unknown) => obj is T
): (obj: unknown) => ValidationResult<T> {
  return (obj: unknown): ValidationResult<T> => {
    try {
      if (validator(obj)) {
        return { isValid: true, data: obj, errors: [] };
      }
      return { isValid: false, errors: ['Type validation failed'] };
    } catch (error) {
      return { 
        isValid: false, 
        errors: [error instanceof Error ? error.message : 'Unknown validation error'] 
      };
    }
  };
}

/**
 * Utility functions for common validations
 */
export const isString = (value: unknown): value is string => 
  typeof value === 'string';

export const isNumber = (value: unknown): value is number => 
  typeof value === 'number' && !isNaN(value);

export const isBoolean = (value: unknown): value is boolean => 
  typeof value === 'boolean';

export const isArray = (value: unknown): value is unknown[] => 
  Array.isArray(value);

export const isObject = (value: unknown): value is Record<string, unknown> => 
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const isOptionalString = (value: unknown): value is string | undefined => 
  value === undefined || isString(value);

export const isOptionalNumber = (value: unknown): value is number | undefined => 
  value === undefined || isNumber(value);

/**
 * Article validation
 */
export function isArticle(obj: unknown): obj is Article {
  if (!isObject(obj)) return false;
  
  const required = [
    'article_id', 'source_id', 'source_name', 'title', 
    'published_at', 'fetched_at', 'language', 'body', 'summary_short', 'canonical_url'
  ];
  
  for (const field of required) {
    if (!isString(obj[field])) {
      throw new ValidationError(field, 'string', obj[field]);
    }
  }
  
  if (!isArray(obj.authors) || !obj.authors.every(isString)) {
    throw new ValidationError('authors', 'string[]', obj.authors);
  }
  
  if (!isArray(obj.entities)) {
    throw new ValidationError('entities', 'Entity[]', obj.entities);
  }
  
  if (!isArray(obj.topics)) {
    throw new ValidationError('topics', 'Topic[]', obj.topics);
  }
  
  return true;
}

/**
 * Source validation
 */
export function isSource(obj: unknown): obj is Source {
  if (!isObject(obj)) return false;
  
  const required = ['id', 'name', 'url', 'continent'];
  for (const field of required) {
    if (!isString(obj[field])) {
      throw new ValidationError(field, 'string', obj[field]);
    }
  }
  
  return true;
}

/**
 * UCDP Event validation
 */
export function isUcdpEvent(obj: unknown): obj is UcdpEvent {
  if (!isObject(obj)) return false;
  
  const requiredNumbers = ['id', 'year', 'latitude', 'longitude'];
  for (const field of requiredNumbers) {
    if (!isNumber(obj[field])) {
      throw new ValidationError(field, 'number', obj[field]);
    }
  }
  
  const requiredStrings = ['country', 'side_a', 'side_b'];
  for (const field of requiredStrings) {
    if (!isString(obj[field])) {
      throw new ValidationError(field, 'string', obj[field]);
    }
  }
  
  return true;
}

/**
 * GDELT Article validation
 */
export function isGdeltArticle(obj: unknown): obj is GdeltArticle {
  if (!isObject(obj)) return false;
  
  const required = ['url', 'title', 'domain', 'seendate'];
  for (const field of required) {
    if (!isString(obj[field])) {
      throw new ValidationError(field, 'string', obj[field]);
    }
  }
  
  return true;
}

/**
 * External Article validation
 */
export function isExternalArticle(obj: unknown): obj is ExternalArticle {
  if (!isObject(obj)) return false;
  
  const required = ['title', 'url', 'source', 'publishedDate', 'summary'];
  for (const field of required) {
    if (!isString(obj[field])) {
      throw new ValidationError(field, 'string', obj[field]);
    }
  }
  
  return true;
}

/**
 * World Bank Indicator validation
 */
export function isWorldBankIndicator(obj: unknown): obj is WorldBankIndicator {
  if (!isObject(obj)) return false;
  
  const requiredStrings = ['country', 'indicator', 'indicatorCode'];
  for (const field of requiredStrings) {
    if (!isString(obj[field])) {
      throw new ValidationError(field, 'string', obj[field]);
    }
  }
  
  if (!isOptionalString(obj.year)) {
    throw new ValidationError('year', 'string | null', obj.year);
  }
  
  if (!isOptionalNumber(obj.value)) {
    throw new ValidationError('value', 'number | null', obj.value);
  }
  
  return true;
}

/**
 * AI Analysis Result validation
 */
export function isAiAnalysisResult(obj: unknown): obj is AiAnalysisResult {
  if (!isObject(obj)) return false;
  
  const validSentiments = ['Positive', 'Negative', 'Neutral'];
  if (!isString(obj.sentiment) || !validSentiments.includes(obj.sentiment)) {
    throw new ValidationError('sentiment', 'Positive | Negative | Neutral', obj.sentiment);
  }
  
  if (!isNumber(obj.score) || obj.score < 0 || obj.score > 1) {
    throw new ValidationError('score', 'number (0-1)', obj.score);
  }
  
  if (!isArray(obj.topics) || !obj.topics.every(isString)) {
    throw new ValidationError('topics', 'string[]', obj.topics);
  }
  
  return true;
}

/**
 * Create validators for each type
 */
export const validateArticle = createTypeGuard(isArticle);
export const validateSource = createTypeGuard(isSource);
export const validateUcdpEvent = createTypeGuard(isUcdpEvent);
export const validateGdeltArticle = createTypeGuard(isGdeltArticle);
export const validateExternalArticle = createTypeGuard(isExternalArticle);
export const validateWorldBankIndicator = createTypeGuard(isWorldBankIndicator);
export const validateAiAnalysisResult = createTypeGuard(isAiAnalysisResult);

/**
 * Validate array of items
 */
export function validateArray<T>(
  items: unknown[],
  validator: (obj: unknown) => ValidationResult<T>
): ValidationResult<T[]> {
  const validatedItems: T[] = [];
  const errors: string[] = [];
  
  for (let i = 0; i < items.length; i++) {
    const result = validator(items[i]);
    if (result.isValid && result.data) {
      validatedItems.push(result.data);
    } else {
      errors.push(`Item ${i}: ${result.errors.join(', ')}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    data: errors.length === 0 ? validatedItems : undefined,
    errors
  };
}

/**
 * Safe JSON parsing with validation
 */
export function safeJsonParse<T>(
  jsonString: string,
  validator: (obj: unknown) => ValidationResult<T>
): ValidationResult<T> {
  try {
    const parsed = JSON.parse(jsonString);
    return validator(parsed);
  } catch (error) {
    return {
      isValid: false,
      errors: [`JSON parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

/**
 * API Response wrapper validation
 */
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

export function isApiResponse<T>(
  obj: unknown,
  dataValidator: (data: unknown) => ValidationResult<T>
): obj is ApiResponse<T> {
  if (!isObject(obj)) return false;
  
  if (!isString(obj.status) || !['success', 'error'].includes(obj.status)) {
    throw new ValidationError('status', 'success | error', obj.status);
  }
  
  if (!isString(obj.timestamp)) {
    throw new ValidationError('timestamp', 'string', obj.timestamp);
  }
  
  if (obj.status === 'success') {
    const dataResult = dataValidator(obj.data);
    if (!dataResult.isValid) {
      throw new ValidationError('data', 'valid data object', obj.data);
    }
  }
  
  return true;
}