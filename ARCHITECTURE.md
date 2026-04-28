# ARMSTRONG PRICING TOOL - COMPREHENSIVE TECHNICAL ARCHITECTURE

## Executive Summary

This document provides a complete technical architecture for the Armstrong Pricing Tool system, a multi-tenant SaaS platform serving 100+ Armstrong Partner companies with 4 specialized pricing calculators (Final Mile Delivery, Hotel FF&E Installation, Pallet Handling, Warehouse Storage). The system implements role-based access control (Super Admin, Admin, User), integrates with NetSuite CRM, and deploys to an in-house colo facility with PostgreSQL primary/backup architecture.

---

## KEY REQUIREMENTS SUMMARY

**Scale:**
- 100 Armstrong Partner companies
- Multiple locations per company
- Full data isolation between companies
- Shared cost templates with location-specific overrides

**User Roles:**
1. **Super Admin**: Edit critical fields (labor rates, benefits packages, system-wide defaults)
2. **Admin**: Edit most fields (location costs, overhead, equipment rates) - company/location scoped
3. **User**: Read-only access to calculators, can save quotes, export reports

**Services:**
1. Final Mile Delivery
2. Hotel FF&E Installation  
3. Pallet Handling
4. Warehouse Storage

**Business Types:**
- Commercial (default)
- Residential
- Industrial (future)

**Integrations:**
- NetSuite CRM (export quotes, sync customers)
- Mobile API (RESTful endpoints)
- PDF export
- Quote sharing via link

**Infrastructure:**
- In-house colo deployment
- PostgreSQL primary database
- PostgreSQL backup to different environment/location

---

## TECHNOLOGY STACK

```
Frontend:     Next.js 14+ (App Router) + TypeScript + Tailwind CSS
Backend:      Next.js API Routes (serverless functions)
Database:     PostgreSQL + Prisma ORM
Auth:         NextAuth.js
State:        React Context + Custom Hooks
Forms:        React Hook Form + Zod validation
PDF Export:   React-PDF or Puppeteer
API Client:   Fetch API with custom wrappers
Deployment:   Self-hosted (colo) with Docker/PM2
Monitoring:   Optional: Sentry, DataDog, Prometheus
```

---

## DATABASE SCHEMA OVERVIEW

### Core Tables

**Multi-Tenancy:**
- `Tenant` - Armstrong Partner companies (100+ tenants)
- `Location` - Physical locations per tenant
- `User` - Users with tenant + location scope
- `Session` - Authentication sessions

**Cost Management:**
- `CostTemplate` - Labor, equipment, facility cost templates
- `CostTemplateEntry` - Individual cost line items
- `CostOverride` - Location-specific cost overrides

**Quotes:**
- `Quote` - Saved pricing quotes
- `QuoteLineItem` - Quote breakdown
- `QuoteHistory` - Change tracking
- `QuoteExport` - PDF/CSV exports

**Integrations:**
- `IntegrationConfig` - NetSuite & API configurations
- `AuditLog` - Comprehensive audit trail
- `SystemConfig` - System-wide settings

### Data Isolation Strategy

**Row-Level Tenant Isolation:**
- Every query filters by `tenantId` first
- Middleware enforces tenant context on all API routes
- Foreign key constraints prevent cross-tenant data leakage
- Soft deletes for audit compliance

---

## API ARCHITECTURE

### Next.js API Routes Structure

```
/api
  /auth         - Login, logout, token refresh, email verification
  /quotes       - CRUD operations, calculate, export, share
  /calculators  - Service-specific calculation endpoints
  /costs        - Cost templates and overrides management
  /locations    - Location management
  /users        - User management
  /integrations - NetSuite sync, mobile API keys
  /admin        - Super admin functions (audit logs, system config)
```

### Key Endpoints

**Quote Management:**
- `GET /api/quotes` - List quotes with filtering
- `POST /api/quotes` - Create new quote
- `POST /api/quotes/[id]/calculate` - Recalculate pricing
- `POST /api/quotes/[id]/export` - Generate PDF/CSV
- `POST /api/quotes/[id]/share` - Create shareable link

**Calculators:**
- `POST /api/calculators/final-mile` - Calculate final mile pricing
- `POST /api/calculators/hotel-installation` - Calculate hotel FF&E
- `POST /api/calculators/pallet-handling` - Calculate pallet handling
- `POST /api/calculators/warehouse-storage` - Calculate warehouse storage

**Integration:**
- `POST /api/integrations/netsuite/sync` - Export quote to NetSuite
- `GET /api/integrations/netsuite/status` - Check sync status

---

## FRONTEND ARCHITECTURE

### App Router Structure

```
/app
  /(auth)                # Login, register, verify email
  /(dashboard)           # Main application
    /quotes              # Quote management
    /calculators         # 4 calculator pages
    /costs               # Cost management (Admin)
    /locations           # Location management (Admin)
    /users               # User management (Admin)
    /settings            # Account & integrations
  /quote/[token]         # Public share pages
```

### Component Organization

```
/components
  /ui                    # Atomic components (Button, Input, Card, etc.)
  /layout                # Header, Sidebar, Footer
  /forms                 # Quote forms, cost forms, etc.
  /calculators           # 4 calculator components
  /quotes                # Quote list, detail, breakdown
  /admin                 # Admin-only components
```

### State Management

**React Context + Custom Hooks:**
- `AuthContext` - User authentication state
- `QuoteContext` - Quote management state
- `CostContext` - Cost data state (cached)
- Custom hooks for API calls (`useQuotes`, `useCalculator`, `useCosts`)

### Real-Time Calculations

**Debounced Input → API Call → Live Results:**
- Users type inputs
- Debounced (500ms) to prevent excessive API calls
- Calculation runs on backend (consistent logic)
- Results update in real-time
- Verdict box shows margin status (✓ ⚠ ✗)

---

## ROLE-BASED ACCESS CONTROL

### Permission Matrix

| Permission | Super Admin | Admin | User |
|------------|-------------|-------|------|
| Manage tenants | ✓ | ✗ | ✗ |
| View audit logs | ✓ | ✗ | ✗ |
| Edit labor rates (critical) | ✓ | ✗ | ✗ |
| Edit cost templates | ✓ | ✓ | ✗ |
| Edit location costs | ✓ | ✓ | ✗ |
| Manage users | ✓ | ✓ (location only) | ✗ |
| Create quotes | ✓ | ✓ | ✓ |
| Edit quotes | ✓ | ✓ | ✓ (own only) |
| Export quotes | ✓ | ✓ | ✓ |
| Share quotes | ✓ | ✓ | ✓ |
| View calculators | ✓ | ✓ | ✓ |

### Implementation

**Middleware:**
- Route-level protection (`/admin/*` → Admin or Super Admin only)
- Field-level protection (UI conditionally renders based on role)
- API endpoint protection (NextAuth.js + custom RBAC middleware)

**Example:**
```typescript
// Super Admin only endpoint
export default withRoleCheck(["super_admin"])(async (req, res) => {
  // Handle request
});

// Admin or Super Admin
export default withRoleCheck(["super_admin", "admin"])(async (req, res) => {
  // Handle request
});
```

---

## BUSINESS LOGIC: COMMERCIAL VS RESIDENTIAL

### Calculation Differences

**Commercial:**
- Higher complexity factors (elevator multipliers, floor adjustments)
- Higher overhead allocations
- Union labor considerations (future)
- Higher insurance rates
- Typical margins: 20-25%

**Residential:**
- No elevator factors
- Lower overhead allocations
- Simpler scheduling
- Lower insurance rates
- Typical margins: 15-20%

### Implementation

**Conditional Logic in Calculators:**
```typescript
const calculateHotelInstallation = (inputs, businessType) => {
  let elevatorFactor = inputs.elevatorFactor;
  
  // Commercial uses full elevator factor
  if (businessType === "commercial") {
    elevatorFactor = inputs.elevatorFactor; // 1.0x to 2.0x
  }
  
  // Residential uses reduced factor
  if (businessType === "residential") {
    elevatorFactor = Math.min(inputs.elevatorFactor, 1.2); // Max 1.2x
  }
  
  const adjustedHours = rawHours * elevatorFactor;
  // ... rest of calculation
};
```

---

## INTEGRATIONS

### NetSuite CRM Integration

**Quote Export Flow:**
1. User creates quote in Armstrong tool
2. Admin clicks "Export to NetSuite"
3. System maps Armstrong quote → NetSuite Sales Order
4. API call to NetSuite REST API (OAuth 2.0)
5. NetSuite Sales Order ID saved to quote record
6. Bidirectional sync for status updates

**Customer Sync:**
- Periodic sync (nightly or on-demand)
- Fetch customers from NetSuite → Armstrong
- Autocomplete customer names in quote forms

**Webhooks (Optional):**
- NetSuite notifies Armstrong when Sales Order status changes
- Armstrong updates quote status automatically

### Mobile API

**RESTful Endpoints:**
- Same `/api/*` endpoints as web app
- API key authentication for mobile apps
- Rate limiting per API key
- Mobile-optimized responses (lightweight JSON)

**Authentication:**
```
Authorization: Bearer <api_key>
X-Tenant-ID: <tenant_id>
```

---

## DEPLOYMENT ARCHITECTURE

### Colo Infrastructure

**Server Setup:**
```
[Load Balancer]
      ↓
[App Server 1]  [App Server 2]  (PM2 or Docker)
      ↓
[PostgreSQL Primary]
      ↓ (Replication)
[PostgreSQL Standby] (Different location/environment)
```

**Application Server:**
- Next.js standalone build
- PM2 for process management (or Docker + Kubernetes)
- Nginx reverse proxy
- SSL/TLS termination

**Database:**
- PostgreSQL 14+ (primary)
- Streaming replication to standby
- Daily backups to S3-compatible storage
- Point-in-time recovery enabled

### CI/CD Pipeline

```
Git Push → GitHub Actions → Tests → Build → Deploy
   ↓
1. Run tests (Jest + Playwright)
2. Build Next.js app
3. Run database migrations (Prisma)
4. Deploy to staging
5. Smoke tests
6. Deploy to production (blue-green)
7. Health check
```

### Environment Variables

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/armstrong"
DATABASE_URL_BACKUP="postgresql://user:pass@backup-host:5432/armstrong"

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://pricing.armstrong.com"

# NetSuite
NETSUITE_ACCOUNT_ID="..."
NETSUITE_API_KEY="..."
NETSUITE_API_SECRET="..."

# Encryption
ENCRYPTION_KEY="..." # For encrypting sensitive data

# External Services
REDIS_URL="..." # Optional: for caching
SENTRY_DSN="..." # Optional: for error tracking
```

---

## SECURITY CONSIDERATIONS

### Authentication
- NextAuth.js with JWT strategy
- Bcrypt for password hashing (10 rounds)
- Optional MFA (TOTP via Authenticator app)
- Session expiry: 24 hours
- Refresh token rotation

### Data Encryption
- Encryption at rest (PostgreSQL TDE or LUKS)
- Encryption in transit (TLS 1.3)
- Sensitive fields encrypted in DB (API keys, secrets)
- AES-256-GCM for application-level encryption

### API Security
- CSRF tokens on all mutations
- Rate limiting (100 req/15min per IP)
- API key rotation for mobile clients
- SQL injection prevention (Prisma ORM)
- XSS protection (Content Security Policy headers)

### Tenant Isolation
- Row-level security via tenantId filtering
- Middleware enforces tenant context
- No direct SQL queries (Prisma only)
- Audit logs for all data access

---

## PERFORMANCE OPTIMIZATION

### Database
- Indexes on tenantId, status, createdAt
- Connection pooling (PgBouncer or Prisma pool)
- Query optimization (Prisma query insights)
- Materialized views for analytics (future)

### Caching
- Next.js static page generation where possible
- API response caching (Redis optional)
- Cost data caching (15-minute TTL)
- CDN for static assets

### Frontend
- Code splitting (dynamic imports)
- Image optimization (Next.js Image)
- Lazy loading for calculators
- Debounced calculations (500ms)

---

## MONITORING & OBSERVABILITY

### Application Logging
- Structured JSON logs (Winston or Pino)
- Log levels: error, warn, info, debug
- Centralized logging (ELK stack or cloud)

### Error Tracking
- Sentry for frontend errors
- Backend error notifications
- Slack/email alerts for critical errors

### Performance Monitoring
- Response time tracking
- Database query performance
- API endpoint latency
- Uptime monitoring (UptimeRobot or Pingdom)

### Database Monitoring
- pg_stat_statements for slow queries
- Connection pool metrics
- Replication lag monitoring
- Backup verification alerts

---

## DEVELOPMENT WORKFLOW

### Local Development
```bash
# Install dependencies
npm install

# Set up database
docker-compose up -d postgres
npm run db:migrate

# Seed data
npm run db:seed

# Start dev server
npm run dev
```

### Database Migrations
```bash
# Create migration
npm run prisma:migrate dev --name add_quote_table

# Apply migrations (production)
npm run prisma:migrate deploy

# Reset database (dev only)
npm run prisma:migrate reset
```

### Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## NEXT STEPS

1. **Wireframes** - Design UI/UX for all pages
2. **Database Setup** - Create Prisma schema, migrations, seeders
3. **Authentication** - Implement NextAuth.js + RBAC
4. **Core Calculators** - Port HTML calculators to React components
5. **Cost Management** - Admin UI for cost templates
6. **Quote System** - Create, save, export quotes
7. **NetSuite Integration** - Build API connector
8. **Mobile API** - RESTful endpoints with API key auth
9. **Deployment** - Colo setup, CI/CD pipeline
10. **Testing & Launch** - UAT, performance testing, go-live

---

## ESTIMATED TIMELINE

- **Phase 1: Foundation** (Weeks 1-2) - Next.js setup, auth, database
- **Phase 2: Core Features** (Weeks 3-5) - Calculators, quotes, cost management
- **Phase 3: Integrations** (Week 6) - NetSuite, mobile API, exports
- **Phase 4: Polish & Deploy** (Week 7-8) - Testing, deployment, monitoring

**Total: 8 weeks to MVP**

---

## TECHNICAL DEBT & FUTURE ENHANCEMENTS

**Potential Future Features:**
- Real-time collaboration (multiple users editing quote)
- Advanced analytics dashboard (margin trends, revenue forecasts)
- Quote approval workflows
- Dynamic pricing rules engine
- Integration with more CRMs (Salesforce, HubSpot)
- Mobile native apps (React Native)
- AI-powered quote optimization
- Multi-currency support
- Advanced reporting (BI dashboards)

---

## CONCLUSION

This architecture provides a scalable, secure, and maintainable foundation for the Armstrong Pricing Tool. The multi-tenant design supports 100+ partner companies with full data isolation, while the role-based access control ensures appropriate permissions. Integration with NetSuite and mobile API support make this a comprehensive solution for Armstrong's pricing needs.

The Next.js + PostgreSQL stack provides excellent developer experience, performance, and scalability. The in-house colo deployment gives Armstrong full control over data and infrastructure.

Ready to proceed to wireframes and implementation! 🚀
