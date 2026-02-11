# Security Checklist & Audit

## Overview

This document outlines the security measures implemented in the PinkBeam application and serves as a reference for ongoing security maintenance.

**Last Updated:** 2026-02-10  
**Application:** PinkBeam Website & Platform  
**Framework:** Next.js 15 with App Router

---

## 1. Security Headers

### Implemented Headers (via `next.config.ts`)

| Header | Value | Status |
|--------|-------|--------|
| Content-Security-Policy | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https: wss:; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests` | ✅ Configured |
| X-Frame-Options | `SAMEORIGIN` | ✅ Configured |
| X-Content-Type-Options | `nosniff` | ✅ Configured |
| Referrer-Policy | `strict-origin-when-cross-origin` | ✅ Configured |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` | ✅ Configured |
| Permissions-Policy | `camera=(), microphone=(), geolocation=()` | ✅ Configured |
| Cross-Origin-Opener-Policy | `same-origin` | ✅ Configured |
| Cross-Origin-Resource-Policy | `same-site` | ✅ Configured |

### Notes
- CSP allows `unsafe-inline` for scripts/styles which is necessary for the current architecture but should be reviewed if stricter CSP is needed
- HSTS preload is enabled for production
- Frame ancestors limited to self to prevent clickjacking

---

## 2. Input Validation

### API Routes with Zod Validation

| Route | Validation Schema | Status |
|-------|-------------------|--------|
| `/api/quotes` | `quoteSchema` | ✅ Validated |
| `/api/tickets` | `ticketCreateSchema` | ✅ Validated |
| `/api/support-tickets` | `createTicketSchema` | ✅ Validated |
| `/api/invoices` | `createInvoiceSchema` | ✅ Validated |
| `/api/projects` | `createProjectSchema` | ✅ Validated |
| `/api/files/upload` | File type & size validation | ✅ Validated |
| `/api/search` | Query parameter validation | ✅ Validated |

### File Upload Validation
- **Max Size:** 50 MB (`MAX_FILE_SIZE`)
- **Allowed Types:**
  - Images: jpeg, png, gif, webp, avif, svg
  - Documents: pdf, doc, docx, xls, xlsx
  - Archives: zip
  - Text: plain, csv, markdown

### Notes
- All API POST/PUT routes should validate input with Zod
- Query parameters should be sanitized before use in database queries
- Prisma provides SQL injection protection

---

## 3. Rate Limiting

### Configuration

| Setting | Value | Status |
|---------|-------|--------|
| Window | 60 seconds | ✅ Configured |
| Max Requests | 120 per IP | ✅ Configured |
| Scope | API routes only (production) | ✅ Configured |

### Implementation
- In-memory rate limiting via middleware.ts
- Rate limit headers returned in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
  - `Retry-After` (on 429)

### Notes
- Rate limiting is in-memory only (no Redis)
- Limits apply to production environment only
- E2E tests are exempt when `E2E_TEST=true`

---

## 4. Authentication & Authorization

### Authentication Flow
- Supabase Auth for session management
- Middleware (`middleware.ts`) validates sessions
- Protected routes redirect to `/sign-in` if not authenticated

### Protected Routes
- `/agents/dashboard/*`
- `/web/dashboard/*`
- `/labs/dashboard/*`
- `/solutions/dashboard/*`
- `/dashboard/platform/*`

### Authorization
- Role-based access control (RBAC) via Prisma User model
- Admin-only routes should check role explicitly
- User ID passed to API routes via `x-user-id` header

### Notes
- Auth pages redirect authenticated users to dashboard
- CSRF protection via same-site cookies (handled by Supabase)

---

## 5. XSS Prevention

### Implemented Measures
1. **React Escape:** JSX automatically escapes values
2. **CSP:** `unsafe-inline` allowed but should be reviewed
3. **Input Sanitization:** Zod validation on all inputs

### Areas to Review
- Email templates (HTML generation)
- Blog content rendering (if user-generated)
- File preview components

---

## 6. CSRF Protection

### Implementation
- SameSite cookies enforced by Supabase
- No custom CSRF tokens implemented (relies on modern cookie security)

### Notes
- Ensure all state-changing operations use POST/PUT/DELETE
- Add CSRF tokens for sensitive operations if needed

---

## 7. SQL Injection Prevention

### Implementation
- **Prisma ORM:** Parameterized queries prevent SQL injection
- **No Raw Queries:** Avoid raw SQL where possible
- **Input Validation:** Zod schemas validate all inputs

### Notes
- If raw queries are needed, use parameterized queries exclusively

---

## 8. Security Dependencies

### Known Secure Dependencies
- Next.js 15.x (latest)
- React 19.x
- Prisma (ORM with injection protection)
- Zod (input validation)
- Supabase (authentication)

### Recommendations
- Run `npm audit` regularly
- Keep dependencies updated
- Consider Dependabot or Snyk for automated alerts (out of scope)

---

## 9. File Upload Security

### Implemented Measures
- File type validation against whitelist
- File size limits (50MB max)
- Storage in isolated buckets (Supabase Storage)
- Sanitized file names (replace special characters)

### Bucket Structure
- `attachments` - General attachments
- `deliverables` - Client deliverables
- `public-assets` - Public static assets

### Notes
- File uploads require `uploadedById`
- Versioning supported for file updates

---

## 10. Webhook Security

### Implemented Measures
- Signature verification for Stripe, GitHub, Clerk
- Event idempotency checking
- Payload size validation
- Event logging to database

### Verification Methods
- **Stripe:** HMAC-SHA256 signature
- **GitHub:** HMAC-SHA256 signature
- **Clerk:** Svix signature verification

---

## 11. Environment Variables

### Required Secrets (DO NOT COMMIT)
```
DATABASE_URL
SUPABASE_SERVICE_ROLE_KEY
STRIPE_WEBHOOK_SECRET
GITHUB_WEBHOOK_SECRET
CLERK_WEBHOOK_SECRET
RESEND_API_KEY
```

### Public Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL
```

### Notes
- `.env.local` is in `.gitignore`
- `.env.example` documents required variables

---

## 12. Security Checklist for New Features

When adding new features, verify:

- [ ] Input validation with Zod schemas
- [ ] Authentication checks for protected routes
- [ ] Authorization checks for role-based access
- [ ] Rate limiting for API endpoints
- [ ] XSS prevention for dynamic content
- [ ] CSRF tokens for sensitive forms (if needed)
- [ ] File upload validation (type, size)
- [ ] Error messages don't leak sensitive info
- [ ] Logging for security events
- [ ] No secrets in client-side code

---

## 13. Known Limitations

1. **Rate Limiting:** In-memory only (no Redis) - won't scale across multiple instances
2. **CSP:** `unsafe-inline` allowed for scripts - could be stricter
3. **CSRF:** Relies on SameSite cookies - no explicit tokens
4. **File Uploads:** Max 50MB - larger files may need streaming/chunking
5. **Session Management:** Supabase default settings - review for production

---

## 14. Security Contacts

For security issues:
1. Do not open public issues
2. Email: security@pinkbeam.io (placeholder)
3. Include detailed description and reproduction steps

---

## 15. Audit Log

| Date | Auditor | Changes |
|------|---------|---------|
| 2026-02-10 | Subagent | Initial security audit, headers configured, validation added, rate limiting verified |

---

*This document should be reviewed and updated quarterly or after significant security-related changes.*
