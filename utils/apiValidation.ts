/**
 * API Response Validation Utilities
 * Provides validation for external API responses
 */

import { 
  ValidationResult, 
  validateExternalArticle, 
  validateGdeltArticle,
  validateUcdpEvent,
  validateWorldBankIndicator,
  safeJsonParse,
  validateArray
} from './typeValidation';

/**
 * Validate Gemini API response for national press articles
 */
export function validateGeminiPressResponse(responseText: string): ValidationResult<any[]> {
  return safeJsonParse(responseText, (parsed) => {
    if (!Array.isArray(parsed)) {
      return { isValid: false, errors: ['Expected array of articles'] };
    }
    return validateArray(parsed, validateExternalArticle);
  });
}

/**
 * Validate GDELT API response
 */
export function validateGdeltResponse(responseText: string): ValidationResult<{ articles: any[] }> {
  return safeJsonParse(responseText, (parsed) => {
    if (typeof parsed !== 'object' || parsed === null) {
      return { isValid: false, errors: ['Expected object with articles array'] };
    }
    
    const obj = parsed as Record<string, unknown>;
    if (!Array.isArray(obj.articles)) {
      return { isValid: false, errors: ['Expected articles array'] };
    }
    
    const articlesResult = validateArray(obj.articles, validateGdeltArticle);
    if (!articlesResult.isValid) {
      return { isValid: false, errors: articlesResult.errors };
    }
    
    return { 
      isValid: true, 
      data: { articles: articlesResult.data! },
      errors: [] 
    };
  });
}

/**
 * Validate UCDP API response
 */
export function validateUcdpResponse(responseText: string): ValidationResult<{ Result: any[] }> {
  return safeJsonParse(responseText, (parsed) => {
    if (typeof parsed !== 'object' || parsed === null) {
      return { isValid: false, errors: ['Expected object with Result array'] };
    }
    
    const obj = parsed as Record<string, unknown>;
    if (!Array.isArray(obj.Result)) {
      return { isValid: false, errors: ['Expected Result array'] };
    }
    
    const eventsResult = validateArray(obj.Result, validateUcdpEvent);
    if (!eventsResult.isValid) {
      return { isValid: false, errors: eventsResult.errors };
    }
    
    return { 
      isValid: true, 
      data: { Result: eventsResult.data! },
      errors: [] 
    };
  });
}

/**
 * Validate World Bank API response
 */
export function validateWorldBankResponse(responseText: string): ValidationResult<any[][]> {
  return safeJsonParse(responseText, (parsed) => {
    if (!Array.isArray(parsed) || parsed.length < 2) {
      return { isValid: false, errors: ['Expected array with metadata and data'] };
    }
    
    const [metadata, data] = parsed;
    if (!Array.isArray(data)) {
      return { isValid: false, errors: ['Expected data to be array'] };
    }
    
    const indicatorsResult = validateArray(data, validateWorldBankIndicator);
    if (!indicatorsResult.isValid) {
      return { isValid: false, errors: indicatorsResult.errors };
    }
    
    return { 
      isValid: true, 
      data: [metadata, indicatorsResult.data!],
      errors: [] 
    };
  });
}

/**
 * Validate REST Countries API response
 */
export function validateRestCountriesResponse(responseText: string): ValidationResult<any[]> {
  return safeJsonParse(responseText, (parsed) => {
    if (!Array.isArray(parsed)) {
      return { isValid: false, errors: ['Expected array of countries'] };
    }
    
    // Basic validation for country objects
    for (let i = 0; i < parsed.length; i++) {
      const country = parsed[i];
      if (typeof country !== 'object' || country === null) {
        return { isValid: false, errors: [`Country ${i} is not an object`] };
      }
      
      const countryObj = country as Record<string, unknown>;
      if (typeof countryObj.name !== 'object' || countryObj.name === null) {
        return { isValid: false, errors: [`Country ${i} missing name object`] };
      }
    }
    
    return { isValid: true, data: parsed, errors: [] };
  });
}

/**
 * Validate Relief Web API response
 */
export function validateReliefWebResponse(responseText: string): ValidationResult<{ data: any[] }> {
  return safeJsonParse(responseText, (parsed) => {
    if (typeof parsed !== 'object' || parsed === null) {
      return { isValid: false, errors: ['Expected object with data array'] };
    }
    
    const obj = parsed as Record<string, unknown>;
    if (!Array.isArray(obj.data)) {
      return { isValid: false, errors: ['Expected data array'] };
    }
    
    // Basic validation for relief web items
    for (let i = 0; i < obj.data.length; i++) {
      const item = obj.data[i];
      if (typeof item !== 'object' || item === null) {
        return { isValid: false, errors: [`Item ${i} is not an object`] };
      }
    }
    
    return { isValid: true, data: obj as { data: any[] }, errors: [] };
  });
}

/**
 * Generic fetch with validation
 */
export async function fetchWithValidation<T>(
  url: string,
  validator: (responseText: string) => ValidationResult<T>,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const responseText = await response.text();
    const validationResult = validator(responseText);
    
    if (!validationResult.isValid) {
      throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
    }
    
    return validationResult.data!;
  } catch (error) {
    console.error(`Fetch with validation failed for ${url}:`, error);
    throw error;
  }
}