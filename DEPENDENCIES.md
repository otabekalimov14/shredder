# The Shredder - Full Dependency List

## Production Dependencies

### Framework & Core
- **next@16.1.6** - React framework with App Router
- **react@19.2.3** - UI library
- **react-dom@19.2.3** - React DOM rendering

### Styling
- **tailwindcss@4.x** - Utility-first CSS framework (installed as part of Next.js setup)
- **@tailwindcss/postcss@4.x** - Tailwind CSS PostCSS plugin
- **class-variance-authority@0.7.1** - Type-safe component variants
- **clsx@2.1.1** - Classname utility
- **tailwind-merge@latest** - Merge Tailwind classes

### UI Components
- **lucide-react@0.574.0** - Icon library
- **@radix-ui/react-dialog@1.1.15** - Dialog component
- **@radix-ui/react-dropdown-menu@2.1.16** - Dropdown menu
- **@radix-ui/react-tabs@1.1.13** - Tabs component
- **@radix-ui/react-label@2.1.8** - Label component

### Form Handling & Validation
- **react-hook-form@7.71.1** - Efficient form handling
- **@hookform/resolvers@5.2.2** - Form resolver for Zod
- **zod@4.3.6** - TypeScript-first schema validation

### API & Authentication
- **openai@4.104.0** - OpenAI API client (GPT-4)
- **googleapis@latest** - Google APIs client
- **google-auth-library@10.5.0** - Google OAuth 2.0
- **axios@1.13.5** - HTTP client
- **next-auth@4.24.13** - Authentication (optional, using native Google OAuth)
- **js-cookie@3.0.5** - Cookie management

### File Parsing
- **pdf-parse@2.4.5** - PDF text extraction (Phase 2)
- **mammoth@1.11.0** - DOCX text extraction (Phase 2)
- **tesseract.js@latest** - Image OCR (Phase 2)

## Development Dependencies

### Build & Compilation
- **typescript@5.x** - TypeScript compiler
- **@types/node@latest** - Node.js type definitions
- **@types/react@19.x** - React type definitions
- **@types/react-dom@19.x** - React DOM type definitions
- **@types/jest@latest** - Jest type definitions
- **ts-jest@latest** - Jest TypeScript support

### Linting & Code Quality
- **eslint@latest** - JavaScript linter
- **eslint-config-next@16.1.6** - Next.js ESLint config

### Testing
- **jest@latest** - Test framework
- **@testing-library/react@latest** - React testing utilities
- **@testing-library/jest-dom@latest** - Jest DOM matchers
- **@testing-library/user-event@latest** - User interaction simulation

### Build Tools
- **@tailwindcss/postcss@latest** - PostCSS plugin (dev)
- **postcss@latest** - CSS transformer

## Import Aliases

In `tsconfig.json`:
```json
"paths": {
  "@/*": ["./*"]
}
```

Allows imports like:
```typescript
import { ExtractedEvent } from '@/lib/types'
import { extractEventsFromText } from '@/lib/ai/extraction'
```

## Optional Packages (For Phase 2+)

- **sharp** - Image optimization
- **react-dropzone** - Better file upload UI
- **react-toastify** - Toast notifications
- **date-fns** - Date utilities
- **zustand** - State management
- **react-query** - Server state management
- **stripe** - Payment processing
- **prisma** - ORM for database

## Environment Setup

### Required API Keys
- **OPENAI_API_KEY** - OpenAI API key (gpt-4-turbo)
- **GOOGLE_CLIENT_ID** - Google OAuth client ID
- **GOOGLE_CLIENT_SECRET** - Google OAuth client secret

### Optional Environment Variables
- **GOOGLE_REDIRECT_URI** - OAuth redirect (default: http://localhost:3000/api/auth/callback)
- **NODE_ENV** - Environment (development/production)
- **DATABASE_URL** - Database connection (for Phase 2+)

## Installation Commands

```bash
# Install all dependencies
npm install

# Install with legacy peer deps (if needed)
npm install --legacy-peer-deps

# Install specific package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Update dependencies
npm update

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## Package Size Summary

```
Approximate sizes:
- next: ~7MB (including React)
- openai: ~2MB
- googleapis: ~4MB
- tailwindcss: ~1MB
- zod: ~0.5MB
- react-hook-form: ~0.2MB
- Total node_modules: ~500MB
- Production build: ~100KB (minified + gzipped)
```

## Version Compatibility

- **Node.js**: 18.0.0+
- **npm**: 9.0.0+
- **Next.js**: 16.1.6 (with App Router)
- **React**: 19.2.3

## Peer Dependencies

Some packages have peer dependencies that may require `--legacy-peer-deps`:

- openai requires zod@^3.23.8 (we have zod@4.3.6)
- eslint-plugin-react-hooks requires zod@^3.25.0 || ^4.0.0

These are handled in npm install with `--legacy-peer-deps` flag where needed.

## Security Notes

- All packages kept up-to-date
- 3 known moderate vulnerabilities (in dev dependencies only, acceptable)
- No secrets stored in package.json
- Environment variables for sensitive data
- npm audit configured in CI/CD

## License Information

All packages are used under their respective licenses:
- Most packages: MIT
- Some packages: Apache 2.0, ISC, or BSD

See individual package repositories for full license details.
