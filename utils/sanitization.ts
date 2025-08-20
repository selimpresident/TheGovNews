/**
 * Input Sanitization Utilities
 * Provides XSS protection and input validation
 */

/**
 * HTML entity encoding map
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

/**
 * Escape HTML entities to prevent XSS
 */
export function escapeHtml(text: string): string {
  if (typeof text !== 'string') {
    return String(text);
  }
  
  return text.replace(/[&<>"'`=/]/g, (match) => HTML_ENTITIES[match] || match);
}

/**
 * Sanitize search query input
 */
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== 'string') {
    return '';
  }
  
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 500); // Limit length
}

/**
 * Sanitize URL input
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    return '';
  }
  
  // Allow only http, https, and mailto protocols
  const allowedProtocols = /^(https?|mailto):/i;
  const trimmedUrl = url.trim();
  
  if (!trimmedUrl) {
    return '';
  }
  
  // If no protocol, assume https
  if (!trimmedUrl.includes('://')) {
    return `https://${trimmedUrl}`;
  }
  
  // Check if protocol is allowed
  if (!allowedProtocols.test(trimmedUrl)) {
    return '';
  }
  
  return trimmedUrl;
}

/**
 * Sanitize filename for safe file operations
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== 'string') {
    return '';
  }
  
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace unsafe characters
    .replace(/^\.+/, '') // Remove leading dots
    .replace(/\.+$/, '') // Remove trailing dots
    .substring(0, 255); // Limit length
}

/**
 * Validate and sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim().toLowerCase();
  
  if (!emailRegex.test(trimmedEmail)) {
    return '';
  }
  
  return trimmedEmail;
}

/**
 * Remove potentially dangerous content from user-generated text
 */
export function sanitizeUserContent(content: string): string {
  if (typeof content !== 'string') {
    return '';
  }
  
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 10000); // Limit length
}

/**
 * Validate and sanitize country name input
 */
export function sanitizeCountryName(countryName: string): string {
  if (typeof countryName !== 'string') {
    return '';
  }
  
  return countryName
    .trim()
    .replace(/[^a-zA-ZÀ-ÿ\s-]/g, '') // Allow letters, accented characters, spaces, and hyphens
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 100); // Limit length
}

/**
 * Sanitize API key (mask for logging)
 */
export function maskApiKey(apiKey: string): string {
  if (typeof apiKey !== 'string' || apiKey.length < 8) {
    return '[INVALID_KEY]';
  }
  
  const start = apiKey.substring(0, 4);
  const end = apiKey.substring(apiKey.length - 4);
  const middle = '*'.repeat(Math.max(0, apiKey.length - 8));
  
  return `${start}${middle}${end}`;
}

/**
 * Content Security Policy helpers
 */
export const CSP_DIRECTIVES = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
  styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  imgSrc: ["'self'", "data:", "https:", "blob:"],
  connectSrc: ["'self'", "https://api.worldbank.org", "https://generativelanguage.googleapis.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"],
  frameSrc: ["'none'"]
};

/**
 * Generate CSP header string
 */
export function generateCSPHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => {
      const kebabCase = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${kebabCase} ${sources.join(' ')}`;
    })
    .join('; ');
}

/**
 * Validate input against common injection patterns
 */
export function detectInjectionAttempt(input: string): boolean {
  if (typeof input !== 'string') {
    return false;
  }
  
  const injectionPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /vbscript:/i,
    /data:text\/html/i
  ];
  
  return injectionPatterns.some(pattern => pattern.test(input));
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }
  
  getRemainingRequests(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    const now = Date.now();
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxRequests - validRequests.length);
  }
  
  getResetTime(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    if (requests.length === 0) {
      return 0;
    }
    
    const oldestRequest = Math.min(...requests);
    return oldestRequest + this.windowMs;
  }
  
  clear(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

/**
 * Global rate limiter instance
 */
export const globalRateLimiter = new RateLimiter();

/**
 * Sanitization middleware for API requests
 */
export function sanitizeApiRequest(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Apply appropriate sanitization based on field name
      if (key.toLowerCase().includes('email')) {
        sanitized[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('url')) {
        sanitized[key] = sanitizeUrl(value);
      } else if (key.toLowerCase().includes('search') || key.toLowerCase().includes('query')) {
        sanitized[key] = sanitizeSearchQuery(value);
      } else if (key.toLowerCase().includes('country')) {
        sanitized[key] = sanitizeCountryName(value);
      } else {
        sanitized[key] = sanitizeUserContent(value);
      }
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeApiRequest(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}