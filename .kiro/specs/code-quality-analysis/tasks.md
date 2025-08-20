# Implementation Plan

- [x] 1. Security hardening and environment configuration



  - Create environment configuration service with type-safe access to API keys
  - Remove hardcoded API key from geminiService.ts and use environment variables
  - Add runtime validation for required environment variables at application startup



  - _Requirements: 1.4, 5.1_

- [x] 2. Type safety enhancement foundation



  - Replace all `[key: string]: any` declarations in types.ts with specific interface definitions
  - Create proper TypeScript interfaces for FactbookData, WorldBankIndicator, and other data models
  - Add runtime type validation utilities for API response validation



  - _Requirements: 1.2, 2.2_

- [x] 3. Centralized error handling system



  - Create ApiError class with status codes and structured error information
  - Implement centralized error boundary component for React error catching
  - Add error interceptor service for consistent API error handling across all services



  - _Requirements: 1.3, 5.3_

- [ ] 4. State management refactoring for CountryDetailPage
  - Create unified data state reducer to replace 20+ individual useState hooks
  - Implement DataSourceState interface for consistent loading/error/data patterns
  - Refactor CountryDetailPage to use useReducer instead of multiple useState calls
  - _Requirements: 2.1, 3.1, 4.2_

- [ ] 5. Performance optimization with memoization
  - Add React.memo to ArticleCard, ArticleList, and other frequently re-rendering components
  - Implement useMemo for expensive computations in CountryDetailPage dashboardData
  - Add useCallback for event handlers passed as props to child components
  - _Requirements: 3.1, 3.2_

- [ ] 6. Component decomposition and reusability
  - Create generic DataPanel component for consistent data display patterns
  - Extract useAsyncData custom hook for standardized async data fetching
  - Break down CountryDetailPage into smaller focused components (DataSourceManager, CountryHeader, etc.)
  - _Requirements: 2.3, 4.1_

- [ ] 7. API service standardization
  - Create base API service with consistent error handling and response formatting
  - Refactor all service files to use the base service and follow consistent patterns
  - Add request deduplication and basic caching mechanisms to prevent duplicate API calls
  - _Requirements: 1.1, 3.3, 5.2_

- [ ] 8. Input validation and security hardening
  - Add input sanitization for search queries and user inputs
  - Implement API response validation to ensure data integrity
  - Add XSS protection for dynamic content rendering
  - _Requirements: 1.3, 5.1, 5.4_

- [ ] 9. Testing infrastructure setup
  - Configure Jest and React Testing Library for component testing
  - Create test utilities for mocking API services and async operations
  - Write unit tests for critical components (App, CountryDetailPage, custom hooks)
  - _Requirements: 2.4, 4.3_

- [ ] 10. Code organization and file structure improvements
  - Reorganize components into logical directories (common/, country/, ui/)
  - Create constants file for magic numbers and configuration values
  - Standardize import/export patterns across all files
  - _Requirements: 2.2, 4.3_

- [ ] 11. Performance monitoring and optimization
  - Add React DevTools Profiler integration for performance monitoring
  - Implement code splitting for large components using React.lazy
  - Optimize bundle size by analyzing and removing unused dependencies
  - _Requirements: 3.2, 3.4_

- [ ] 12. Accessibility and user experience improvements
  - Add proper ARIA labels and keyboard navigation support
  - Implement loading states and error messages for better user feedback
  - Add focus management for modal components and interactive elements
  - _Requirements: 5.4_

- [ ] 13. Development tooling and code quality
  - Configure ESLint with TypeScript rules and React best practices
  - Set up Prettier for consistent code formatting
  - Add pre-commit hooks for code quality enforcement
  - _Requirements: 5.2_

- [ ] 14. Integration testing and validation
  - Create integration tests for complete user workflows (country selection, data loading)
  - Test error scenarios and recovery mechanisms
  - Validate that all refactored components maintain existing functionality
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_