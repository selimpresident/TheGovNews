# Security Guidelines

## Environment Variables

This project uses environment variables to manage sensitive configuration data like API keys. Follow these guidelines to maintain security:

### Required Environment Variables

1. **VITE_GEMINI_API_KEY**: Your Google Gemini AI API key
   - Get your API key from: https://makersuite.google.com/app/apikey
   - Never commit this key to version control
   - Use `.env.local` for local development

### Setup Instructions

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual API key in `.env.local`:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

3. Never commit `.env.local` to git (it's already in .gitignore)

### Security Best Practices

- ✅ Use environment variables for all sensitive data
- ✅ Keep `.env.local` in .gitignore
- ✅ Use different API keys for development and production
- ✅ Regularly rotate API keys
- ❌ Never hardcode API keys in source code
- ❌ Never commit `.env.local` or similar files
- ❌ Never share API keys in chat, email, or documentation

### Production Deployment

For production deployments, set environment variables through your hosting platform's configuration panel, not through `.env` files.

### Reporting Security Issues

If you discover a security vulnerability, please report it privately to the maintainers.