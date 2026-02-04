# Skills & Technology Stack

## Core Philosophy
**"Robust, Reliable, Reactive"**
We utilize a vetted stack that balances developer velocity with enterprise-grade security and performance.

## Frontend (The "Face" of the Operation)
- **Core**: `React 19` (TypeScript)
- **Build Tool**: `Vite` (Fast HMR, optimized bundling)
- **Styling**:
    - `Tailwind CSS v4`: Utility-first for valid design tokens.
    - `clsx` / `tailwind-merge`: For dynamic class logic.
    - `Lucide React`: Consistent, lightweight iconography.
- **State & Data**:
    - `React Context`: Global application state (Theme, Auth).
    - `TanStack Query` (Recommended addition): For efficient server-state caching and synchronization.
- **Forms**: `React Hook Form` + `Zod` (Schema validation).
- **Animations**: `Framer Motion` (Premium "Wow" factor).

## Backend (The "Brain")
- **Runtime**: `Node.js` (LTS)
- **Framework**: `Express.js` (adapted for Serverless).
- **Language**: `TypeScript` (Strict mode enabled).
- **Database**: `MongoDB` + `Mongoose`.
- **Validation**: `Joi` or `Zod` (Strict payload auditing).
- **PDF Processing**: `pdf-parse` (Legacy support for old docs).

## DevOps & Infrastructure
- **Host**: `Vercel` (Frontend Edge + Serverless Functions).
- **Version Control**: Git / GitHub.
- **CI/CD**: Vercel Git Integrations.
- **Monitoring**: Vercel Analytics / Speed Insights.

## Strategic Skills Required (Agent Roles)
1.  **Strict Typings**: No `any`. All interfaces must be defined in `src/types`.
2.  **Semantic HTML**: Proper use of `<main>`, `<section>`, `<article>` for accessibility.
3.  **Error Handling**: Centralized error middleware. No silent failures. Console logs are for dev only; production uses structured logging.
4.  **Secrets Management**: strict usage of `.env` files. No hardcoded keys.
