# Armstrong Pricing Tool - System Architecture

## 🏗️ System Overview

The Armstrong Pricing Tool is a modern, multi-tenant SaaS application built for logistics and installation service pricing. It provides real-time cost calculations, margin analysis, and quote management across multiple business units.

### Architecture Style
- **Frontend**: React-based SPA with Server-Side Rendering
- **Backend**: Next.js API Routes (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Session-based with NextAuth.js
- **Deployment**: PM2 + Nginx on Rocky Linux 8

---

## 📊 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │    Mobile    │  │    Tablet    │          │
│  │  (Desktop)   │  │   (Safari)   │  │   (iPad)     │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                  │
│                            │                                      │
│                   HTTPS (Port 80/443)                            │
└────────────────────────────┴────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NGINX REVERSE PROXY                         │
│                     (Port 80 → Port 3001)                        │
│  - SSL Termination (future)                                      │
│  - Load Balancing (future)                                       │
│  - Static Asset Caching                                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER (Next.js)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    PRESENTATION LAYER                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │   │
│  │  │Dashboard │  │Calculator│  │  Quotes  │  │  Costs  │ │   │
│  │  │   Pages  │  │  Pages   │  │   Page   │  │  Page   │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │   │
│  │       React Components (Client + Server)                 │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────┴───────────────────────────────┐   │
│  │                    MIDDLEWARE LAYER                       │   │
│  │  ┌────────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │ Authentication │  │ Authorization│  │  Session Mgmt│ │   │
│  │  │   (NextAuth)   │  │  (Role Check)│  │   (Cookies)  │ │   │
│  │  └────────────────┘  └──────────────┘  └──────────────┘ │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────┴───────────────────────────────┐   │
│  │                    API ROUTE LAYER                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   /api/auth  │  │ /api/quotes  │  │  /api/costs  │   │   │
│  │  │   (NextAuth) │  │   (CRUD)     │  │   (CRUD)     │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └──────────────────────────┬───────────────────────────────┘   │
│                             │                                    │
│  ┌──────────────────────────┴───────────────────────────────┐   │
│  │                   BUSINESS LOGIC LAYER                    │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │  Calculator  │  │ Quote Logic  │  │  Cost Logic  │   │   │
│  │  │   Services   │  │  Validation  │  │  Templates   │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  └──────────────────────────┬───────────────────────────────┘   │
└────────────────────────────┬┴────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
│                        (Prisma ORM)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Models    │  │  Migrations  │  │   Queries    │          │
│  │   (Schema)   │  │   (History)  │  │ (Generated)  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (PostgreSQL)                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Tables: User, Tenant, Location, CostTemplate,           │   │
│  │          Quote, QuoteLineItem, CostOverride              │   │
│  │                                                           │   │
│  │  Features: ACID Transactions, Row-Level Security (future)│   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌──────────┐                                    ┌──────────────┐
│  User    │                                    │   NextAuth   │
│  Browser │                                    │  Middleware  │
└────┬─────┘                                    └──────┬───────┘
     │                                                 │
     │  1. GET /dashboard                             │
     ├───────────────────────────────────────────────►│
     │                                                 │
     │                     2. Check Session            │
     │                        (No Session Found)       │
     │                                                 │
     │  3. Redirect to /login                         │
     │◄───────────────────────────────────────────────┤
     │                                                 │
     │  4. POST /api/auth/signin                      │
     │     { email, password }                        │
     ├───────────────────────────────────────────────►│
     │                                                 │
     │                     5. Hash Password            │
     │                     6. Query Database           │
     │                     7. Verify Credentials       │
     │                                                 │
     │  8. Set Session Cookie                         │
     │     Set-Cookie: authjs.session-token=...       │
     │◄───────────────────────────────────────────────┤
     │                                                 │
     │  9. Redirect to /dashboard                     │
     │◄───────────────────────────────────────────────┤
     │                                                 │
     │  10. GET /dashboard                            │
     │      Cookie: authjs.session-token=...          │
     ├───────────────────────────────────────────────►│
     │                                                 │
     │                     11. Verify Session          │
     │                     12. Load User + Tenant      │
     │                                                 │
     │  13. Render Dashboard (200 OK)                 │
     │◄───────────────────────────────────────────────┤
     │                                                 │
```

---

## 🧮 Calculator Flow (Final Mile Example)

```
┌──────────┐         ┌─────────────┐         ┌──────────────┐
│  User    │         │  Calculator │         │   Database   │
│  Browser │         │  Component  │         │  (Costs)     │
└────┬─────┘         └──────┬──────┘         └──────┬───────┘
     │                      │                        │
     │  1. Load Calculator  │                        │
     ├─────────────────────►│                        │
     │                      │                        │
     │                      │  2. Fetch Cost Templates│
     │                      ├───────────────────────►│
     │                      │                        │
     │                      │  3. Return Labor/Equip │
     │                      │◄───────────────────────┤
     │                      │                        │
     │  4. Display Form     │                        │
     │  (Pre-filled rates)  │                        │
     │◄─────────────────────┤                        │
     │                      │                        │
     │  5. User Changes:    │                        │
     │     - Miles: 50      │                        │
     │     - Crew: 2        │                        │
     ├─────────────────────►│                        │
     │                      │                        │
     │                      │  6. Calculate (Client) │
     │                      │     totalCost = (miles │
     │                      │       × fuelRate) +    │
     │                      │     (hours × crewSize  │
     │                      │       × laborRate)     │
     │                      │                        │
     │  7. Update Results   │                        │
     │     Instantly        │                        │
     │◄─────────────────────┤                        │
     │                      │                        │
     │  8. User Clicks      │                        │
     │     "Save Quote"     │                        │
     ├─────────────────────►│                        │
     │                      │                        │
     │                      │  9. POST /api/quotes   │
     │                      ├───────────────────────►│
     │                      │                        │
     │                      │  10. INSERT Quote      │
     │                      │◄───────────────────────┤
     │                      │                        │
     │  11. Success Toast   │                        │
     │◄─────────────────────┤                        │
     │                      │                        │
```

---

## 🗄️ Database Schema Overview

```
┌─────────────────┐
│     Tenant      │
│─────────────────│
│ id              │──┐
│ name            │  │
│ createdAt       │  │
└─────────────────┘  │
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌─────────────┐  ┌──────────┐  ┌─────────────┐
│   Location  │  │   User   │  │ CostTemplate│
│─────────────│  │──────────│  │─────────────│
│ id          │  │ id       │  │ id          │
│ tenantId    │  │ tenantId │  │ tenantId    │
│ name        │  │ email    │  │ category    │
│ address     │  │ password │  │ name        │
└─────────────┘  │ role     │  │ rate        │
                 └────┬─────┘  └─────────────┘
                      │
                      │
                      ▼
              ┌───────────────┐
              │     Quote     │
              │───────────────│
              │ id            │
              │ userId        │
              │ calculatorType│
              │ totalCost     │
              │ status        │
              └───────┬───────┘
                      │
                      │
                      ▼
              ┌───────────────────┐
              │  QuoteLineItem    │
              │───────────────────│
              │ id                │
              │ quoteId           │
              │ description       │
              │ quantity          │
              │ unitCost          │
              │ totalCost         │
              └───────────────────┘
```

---

## 🎭 Multi-Tenant Architecture

### Tenant Isolation Strategy

**Row-Level Filtering**:
- Every query includes `tenantId` filter (except God Mode)
- Enforced at application layer via Prisma middleware (future)
- God Mode users bypass tenant filtering

**Access Control Levels**:

```
┌─────────────────────────────────────────────────────────────┐
│                      SUPER_ADMIN (God Mode)                  │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐               │
│  │  Tenant A │  │  Tenant B │  │  Tenant C │  ...          │
│  │  All Data │  │  All Data │  │  All Data │               │
│  └───────────┘  └───────────┘  └───────────┘               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                          ADMIN Role                          │
│  ┌───────────────────────────────────────────┐              │
│  │             Tenant A Only                 │              │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐│              │
│  │  │Location 1│  │Location 2│  │Location 3││              │
│  │  └──────────┘  └──────────┘  └──────────┘│              │
│  └───────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                          USER Role                           │
│  ┌─────────────────────────────────────┐                    │
│  │         Tenant A Only               │                    │
│  │  ┌────────────────────────┐         │                    │
│  │  │    Location 1 Only     │         │                    │
│  │  │  (Read-Only on Costs)  │         │                    │
│  │  └────────────────────────┘         │                    │
│  └─────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 State Management

### Client-Side State

**React State (useState)**:
- Calculator inputs and results
- Form data
- UI state (modals, dropdowns)

**Session State (NextAuth)**:
- User information
- Tenant affiliation
- Permissions

### Server-Side State

**Database**:
- Persistent data (users, quotes, costs)
- Transaction history
- Configuration

**Session Store**:
- Active sessions (database-backed via NextAuth)
- CSRF tokens
- Remember-me tokens

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION SERVER                         │
│                   (Rocky Linux 8 VPS)                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Nginx (Port 80)                                     │   │
│  │  - Reverse Proxy                                     │   │
│  │  - Static Asset Serving                              │   │
│  │  - Request Routing                                   │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                        │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  PM2 Process Manager                                 │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  armstrong-pricing (Port 3001)                 │  │   │
│  │  │  - Next.js Production Server                   │  │   │
│  │  │  - Auto-restart on crash                       │  │   │
│  │  │  - Log management                              │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                        │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  PostgreSQL (Port 5432)                              │   │
│  │  - armstrong_pricing database                        │   │
│  │  - Local connections only                            │   │
│  │  - Automated backups (manual setup)                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Technology Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js 22
- **Framework**: Next.js API Routes
- **ORM**: Prisma 7
- **Authentication**: NextAuth.js 5

### Database
- **RDBMS**: PostgreSQL 10+
- **Connection**: Prisma Client
- **Migrations**: Prisma Migrate

### Infrastructure
- **Process Manager**: PM2
- **Web Server**: Nginx
- **OS**: Rocky Linux 8
- **Version Control**: Git + GitHub

---

## 🔒 Security Architecture

### Authentication
- **Method**: Credentials Provider (email/password)
- **Password Hashing**: bcrypt (10 rounds)
- **Session Storage**: Database-backed sessions
- **Cookie Security**: HttpOnly, SameSite=Lax

### Authorization
- **Role-Based Access Control (RBAC)**:
  - SUPER_ADMIN: Full system access
  - ADMIN: Tenant-level access
  - USER: Location-level, read-only costs

### Data Protection
- **SQL Injection**: Prevented via Prisma (parameterized queries)
- **XSS**: React auto-escapes output
- **CSRF**: NextAuth built-in protection
- **Environment Variables**: Secrets stored in .env (not in repo)

---

## 📈 Scalability Considerations

### Current Capacity
- **Single server**: Handles ~1000 concurrent users
- **Database**: Can scale to millions of records
- **Calculations**: Client-side (no backend load)

### Future Scaling Options
1. **Horizontal Scaling**: Add more Next.js instances behind load balancer
2. **Database Replication**: Read replicas for queries
3. **CDN**: Static assets via CloudFront/Cloudflare
4. **Caching**: Redis for sessions and frequent queries
5. **Microservices**: Extract calculators to separate services

---

## 🔧 Configuration Management

### Environment Variables
```bash
DATABASE_URL          # PostgreSQL connection string
NEXTAUTH_URL          # App public URL
NEXTAUTH_SECRET       # Session encryption key
AUTH_TRUST_HOST       # Trust proxy headers
NODE_ENV              # production|development
PORT                  # App port (default 3000)
```

### Feature Flags (Future)
- Quote approval workflows
- Advanced reporting
- Custom calculator types
- Location-specific cost overrides

---

## 📊 Monitoring & Observability

### Current Setup
- **Logs**: PM2 log management (`pm2 logs`)
- **Status**: PM2 monitoring (`pm2 list`)
- **Nginx**: Access/error logs in `/var/log/nginx/`

### Recommended Additions
- **APM**: New Relic or Datadog
- **Error Tracking**: Sentry
- **Uptime Monitoring**: UptimeRobot
- **Database Monitoring**: pg_stat_statements

---

## 🧪 Testing Strategy (Future)

### Unit Tests
- Calculator logic
- Utility functions
- Data validation

### Integration Tests
- API endpoints
- Database operations
- Authentication flows

### E2E Tests
- User journeys (Playwright/Cypress)
- Calculator workflows
- Quote creation

---

## 📝 API Design Principles

### REST Conventions
- **GET**: Retrieve resources
- **POST**: Create resources
- **PATCH**: Update resources
- **DELETE**: Remove resources

### Response Format
```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

### Error Handling
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "User not authenticated"
  }
}
```

---

## 🔄 Development Workflow

```
Local Dev → Commit → Push to GitHub → Deploy to VPS

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ npm run dev  │────►│  git commit  │────►│   git push   │
│ (Port 3000)  │     │  (with msg)  │     │   to GitHub  │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                         ┌──────────────────┐
                                         │  SSH to VPS      │
                                         │  git pull        │
                                         │  npm run build   │
                                         │  pm2 restart     │
                                         └──────────────────┘
```

---

## 📚 Key Design Decisions

1. **Why Next.js?**
   - Server-side rendering for SEO
   - API routes eliminate separate backend
   - React Server Components for performance

2. **Why PostgreSQL?**
   - ACID compliance for financial data
   - Rich query capabilities
   - Proven reliability

3. **Why Prisma?**
   - Type-safe database queries
   - Automatic migrations
   - Excellent TypeScript integration

4. **Why Client-Side Calculations?**
   - Instant feedback (no network delay)
   - Reduced server load
   - Better user experience

5. **Why Session-Based Auth?**
   - More secure than JWT for web apps
   - Easier to revoke sessions
   - No token expiry management

---

## 🎯 Future Architecture Enhancements

### Phase 2
- Real-time collaboration (WebSockets)
- Advanced reporting dashboard
- PDF export functionality
- Email notifications

### Phase 3
- Mobile app (React Native)
- API for third-party integrations
- Advanced analytics (data warehouse)
- Multi-region deployment

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Maintainer**: Armstrong IT Team
