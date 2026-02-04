# boots2suits Architecture Strategy

> [!IMPORTANT]
> **Deployment Target**: Vercel (Serverless)
> **Primary User Base**: Veterans (High accessibility & trust requirements)
> **Security Level**: High (PII & Military Service Records)

## 1. System Overview
The application follows a **Modern Monorepo** structure, optimized for Vercel's edge network and serverless functions. We will transition the traditional Express server into a Vercel-compatible Serverless API reference architecture.

### High-Level Diagram
```mermaid
graph TD
    User[Veteran / Employer] --> CDN[Vercel Edge Network]
    CDN --> FE[Frontend (React/Vite SPA)]
    CDN --> API[Serverless Functions (/api/*)]
    API --> Auth[Auth Middleware (JWT/RBAC)]
    Auth --> DB[(MongoDB Atlas)]
    API --> Ext[External Services (PDF Parsing, Email)]
```

## 2. Component Architecture

### Frontend (Client-Side)
- **Framework**: React 19 + Vite
- **State Management**: Context API (Auth, User Profile) + React Query (Server State)
- **Styling**: Tailwind CSS v4 (Design System)
- **Routing**: React Router v7 (Client-side routing)
- **Security**:
    - HttpOnly Cookies for JWT storage (No LocalStorage for tokens).
    - XSS Sanitization for user inputs.

### Backend (Serverless API)
- **Runtime**: Node.js (Vercel Serverless Functions).
- **Structure**:
    - The existing `express` app will be wrapped or refactored to export a handler compatible with Vercel.
    - **Optimization**: Cold start reduction via efficient database connection pooling.
- **API Design**: RESTful standard with strict validation (Zod/Joi).

### Database (Data Layer)
- **Primary DB**: MongoDB Atlas (Multi-cloud, auto-scaling).
- **ODM**: Mongoose with strict schemas.
- **Security**:
    - VPC Peering (if applicable) or IP Whitelisting for Vercel IPs.
    - Encryption at Rest (MongoDB default).
    - Field-level encryption for sensitive military IDs (SSN/Service Numbers if collected - *Plan to avoid collecting SSN unless legally necessary*).

## 3. Security Protocols (The "Fort Knox" Standard)
As a platform for veterans, trust is paramount.

1.  **Authentication & Authorization**:
    - **JWT (JSON Web Tokens)**: Short-lived access tokens, long-lived refresh tokens.
    - **RBAC (Role-Based Access Control)**:
        - `VETERAN`: Can view jobs, apply, build persona.
        - `EMPLOYER`: Can post jobs, view applicants.
        - `ADMIN`: Full system oversight.
2.  **Input Validation**:
    - Strict server-side validation using Zod schemas for all API endpoints.
    - Prevent NoSQL Injection and Parameter Pollution.
3.  **Data Protection**:
    - Helmet.js for HTTP headers (CSP, HSTS).
    - Rate Limiting (upstash/ratelimit) to prevent DDoS/Brute Force on login.
4.  **Compliance**:
    - GDPR/CCPA readiness (Right to be forgotten implementation).

## 4. Vercel Deployment Strategy
- **Configuration (`vercel.json`)**:
    - Rewrites to handle SPA routing (`source: /((?!api/.*).*)`, `destination: /index.html`).
    - API routes pointing to serverless functions.
- **CI/CD**:
    - Automated builds on push to `main`.
    - Preview deployments for Pull Requests.
    - Environment Variable checks before build.

## 5. Critical Workflows
- **Resume Translation**:
    - Secure file upload -> Buffer -> Text Extraction -> AI Processing -> Cleanup -> Response.
    - Files are **never** stored permanently on disk (in-memory processing) or are immediately deleted after processing to ensure privacy.
