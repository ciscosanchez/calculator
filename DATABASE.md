# Armstrong Pricing Tool - Database Documentation

## 📊 Database Overview

**Database**: PostgreSQL 10+  
**Schema Manager**: Prisma ORM  
**Connection**: TCP/IP (localhost:5432 or socket)  
**Character Set**: UTF-8  
**Timezone**: UTC  

---

## 🗄️ Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                          TENANT (Organization)                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ id: String (UUID)                                              │  │
│  │ name: String                                                   │  │
│  │ active: Boolean                                                │  │
│  │ createdAt: DateTime                                            │  │
│  │ updatedAt: DateTime                                            │  │
│  └────────────────────────────────────────────────────────────────┘  │
└────────────┬──────────────────┬───────────────────┬──────────────────┘
             │                  │                   │
             │ 1:N              │ 1:N               │ 1:N
             ▼                  ▼                   ▼
  ┌──────────────────┐  ┌──────────────┐  ┌─────────────────────┐
  │    LOCATION      │  │     USER     │  │   COST_TEMPLATE     │
  │──────────────────│  │──────────────│  │─────────────────────│
  │ id: String       │  │ id: String   │  │ id: String          │
  │ tenantId: FK     │  │ tenantId: FK │  │ tenantId: FK        │
  │ name: String     │  │ email: Unique│  │ category: String    │
  │ address: String  │  │ name: String │  │ name: String        │
  │ city: String     │  │ passwordHash │  │ rate: Float         │
  │ state: String    │  │ role: Enum   │  │ unit: String        │
  │ zipCode: String  │  │ active: Bool │  │ active: Boolean     │
  │ active: Boolean  │  │ createdAt    │  │ createdAt           │
  │ createdAt        │  │ updatedAt    │  │ updatedAt           │
  │ updatedAt        │  └──────┬───────┘  └─────────────────────┘
  └──────────────────┘         │
                               │ 1:N
                               ▼
                    ┌────────────────────┐
                    │       QUOTE        │
                    │────────────────────│
                    │ id: String         │
                    │ userId: FK         │
                    │ calculatorType     │
                    │ projectName        │
                    │ customerName       │
                    │ totalCost: Float   │
                    │ revenue: Float     │
                    │ margin: Float      │
                    │ status: Enum       │
                    │ createdAt          │
                    │ updatedAt          │
                    └──────┬─────────────┘
                           │ 1:N
                           ▼
                ┌───────────────────────────┐
                │    QUOTE_LINE_ITEM        │
                │───────────────────────────│
                │ id: String                │
                │ quoteId: FK               │
                │ description: String       │
                │ category: String          │
                │ quantity: Float           │
                │ unitCost: Float           │
                │ totalCost: Float          │
                │ createdAt                 │
                └───────────────────────────┘

  ┌──────────────────┐                   ┌─────────────────────┐
  │ COST_OVERRIDE    │                   │      ACCOUNT        │
  │──────────────────│                   │─────────────────────│
  │ id: String       │                   │ id: String          │
  │ templateId: FK   │◄──────────┐       │ userId: FK          │
  │ locationId: FK   │           │       │ type: String        │
  │ rate: Float      │           │       │ provider: String    │
  │ effectiveDate    │           │       │ access_token        │
  │ expiryDate       │           │       │ ...NextAuth fields  │
  │ createdBy: FK    │           │       └─────────────────────┘
  │ createdAt        │           │
  │ updatedAt        │           │       ┌─────────────────────┐
  └──────────────────┘           │       │      SESSION        │
                                 │       │─────────────────────│
                                 │       │ id: String          │
                                 └───────┤ sessionToken: Unique│
                                         │ userId: FK          │
                                         │ expires: DateTime   │
                                         └─────────────────────┘

                                         ┌─────────────────────┐
                                         │ VERIFICATION_TOKEN  │
                                         │─────────────────────│
                                         │ identifier: String  │
                                         │ token: String       │
                                         │ expires: DateTime   │
                                         └─────────────────────┘
```

---

## 📋 Table Schemas

### **Tenant** 
Multi-tenant organization (Armstrong partner or division)

| Column      | Type      | Constraints           | Description                    |
|-------------|-----------|-----------------------|--------------------------------|
| id          | String    | PK, Default: UUID     | Unique identifier              |
| name        | String    | NOT NULL              | Organization name              |
| active      | Boolean   | Default: true         | Account status                 |
| createdAt   | DateTime  | Default: now()        | Record creation timestamp      |
| updatedAt   | DateTime  | Auto-update           | Last modification timestamp    |

**Relationships**:
- Has many: `User`, `Location`, `CostTemplate`, `CostOverride`

**Indexes**:
- Primary: `id`
- Unique: `name` (optional, for domain uniqueness)

---

### **User**
System users (employees, partners)

| Column       | Type      | Constraints           | Description                    |
|--------------|-----------|-----------------------|--------------------------------|
| id           | String    | PK, Default: UUID     | Unique identifier              |
| email        | String    | UNIQUE, NOT NULL      | Login email                    |
| name         | String    | NOT NULL              | Full name                      |
| passwordHash | String    | NOT NULL              | bcrypt hashed password         |
| role         | Enum      | NOT NULL              | SUPER_ADMIN, ADMIN, USER       |
| tenantId     | String    | FK, NULL for God Mode | Tenant association             |
| active       | Boolean   | Default: true         | Account enabled/disabled       |
| createdAt    | DateTime  | Default: now()        | Record creation timestamp      |
| updatedAt    | DateTime  | Auto-update           | Last modification timestamp    |

**Relationships**:
- Belongs to: `Tenant` (nullable for SUPER_ADMIN)
- Has many: `Quote`, `Account`, `Session`

**Indexes**:
- Primary: `id`
- Unique: `email`
- Index: `tenantId` (for filtering)

**Enums**:
```typescript
enum Role {
  SUPER_ADMIN  // God mode - sees all tenants
  ADMIN        // Tenant admin - full access to tenant
  USER         // Regular user - limited access
}
```

---

### **Location**
Physical business locations (warehouses, offices)

| Column    | Type      | Constraints           | Description                    |
|-----------|-----------|-----------------------|--------------------------------|
| id        | String    | PK, Default: UUID     | Unique identifier              |
| tenantId  | String    | FK, NOT NULL          | Owning tenant                  |
| name      | String    | NOT NULL              | Location name                  |
| address   | String    | Optional              | Street address                 |
| city      | String    | Optional              | City                           |
| state     | String    | Optional              | State/Province                 |
| zipCode   | String    | Optional              | Postal code                    |
| active    | Boolean   | Default: true         | Location operational status    |
| createdAt | DateTime  | Default: now()        | Record creation timestamp      |
| updatedAt | DateTime  | Auto-update           | Last modification timestamp    |

**Relationships**:
- Belongs to: `Tenant`
- Has many: `CostOverride`

**Indexes**:
- Primary: `id`
- Index: `tenantId` (for filtering)
- Index: `(tenantId, name)` (for location lookup)

---

### **CostTemplate**
Base cost rates (labor, equipment, overhead)

| Column    | Type      | Constraints           | Description                    |
|-----------|-----------|-----------------------|--------------------------------|
| id        | String    | PK, Default: UUID     | Unique identifier              |
| tenantId  | String    | FK, NULL for global   | Tenant-specific or global      |
| category  | String    | NOT NULL              | LABOR, EQUIPMENT, OVERHEAD     |
| name      | String    | NOT NULL              | Rate name (e.g., "Driver")     |
| rate      | Float     | NOT NULL              | Cost per unit                  |
| unit      | String    | NOT NULL              | Unit of measure (/hr, /mile)   |
| active    | Boolean   | Default: true         | Template enabled/disabled      |
| createdAt | DateTime  | Default: now()        | Record creation timestamp      |
| updatedAt | DateTime  | Auto-update           | Last modification timestamp    |

**Relationships**:
- Belongs to: `Tenant` (nullable for global templates)
- Has many: `CostOverride`

**Indexes**:
- Primary: `id`
- Index: `tenantId` (for filtering)
- Index: `(category, name)` (for lookups)

**Categories**:
```typescript
enum CostCategory {
  LABOR      // Hourly labor rates
  EQUIPMENT  // Equipment/vehicle rates
  OVERHEAD   // Overhead allocations
}
```

---

### **CostOverride**
Location-specific cost overrides

| Column        | Type      | Constraints           | Description                    |
|---------------|-----------|-----------------------|--------------------------------|
| id            | String    | PK, Default: UUID     | Unique identifier              |
| templateId    | String    | FK, NOT NULL          | Base template                  |
| locationId    | String    | FK, NOT NULL          | Specific location              |
| rate          | Float     | NOT NULL              | Override rate                  |
| effectiveDate | DateTime  | NOT NULL              | Start date                     |
| expiryDate    | DateTime  | Optional              | End date (null = no expiry)    |
| createdBy     | String    | FK, NOT NULL          | User who created override      |
| createdAt     | DateTime  | Default: now()        | Record creation timestamp      |
| updatedAt     | DateTime  | Auto-update           | Last modification timestamp    |

**Relationships**:
- Belongs to: `CostTemplate`, `Location`, `User` (createdBy)

**Indexes**:
- Primary: `id`
- Unique: `(templateId, locationId)` (one override per template/location)
- Index: `effectiveDate` (for date range queries)

---

### **Quote**
Saved pricing calculations

| Column          | Type      | Constraints           | Description                    |
|-----------------|-----------|-----------------------|--------------------------------|
| id              | String    | PK, Default: UUID     | Unique identifier              |
| userId          | String    | FK, NOT NULL          | Creator                        |
| calculatorType  | String    | NOT NULL              | Calculator used                |
| projectName     | String    | Optional              | Customer project name          |
| customerName    | String    | Optional              | Customer name                  |
| totalCost       | Float     | NOT NULL              | Total cost                     |
| revenue         | Float     | NOT NULL              | Total revenue                  |
| margin          | Float     | NOT NULL              | Gross margin %                 |
| status          | Enum      | Default: DRAFT        | Quote status                   |
| createdAt       | DateTime  | Default: now()        | Record creation timestamp      |
| updatedAt       | DateTime  | Auto-update           | Last modification timestamp    |

**Relationships**:
- Belongs to: `User`
- Has many: `QuoteLineItem`

**Indexes**:
- Primary: `id`
- Index: `userId` (for user's quotes)
- Index: `status` (for filtering)
- Index: `createdAt` (for sorting)

**Enums**:
```typescript
enum QuoteStatus {
  DRAFT      // Work in progress
  SUBMITTED  // Sent to customer
  APPROVED   // Customer approved
  REJECTED   // Customer rejected
  EXPIRED    // Past validity date
}
```

**Calculator Types**:
- `FINAL_MILE`
- `INSTALLATION_SERVICES`
- `PALLET_HANDLING`
- `WAREHOUSE_STORAGE`

---

### **QuoteLineItem**
Individual line items in a quote

| Column      | Type      | Constraints           | Description                    |
|-------------|-----------|-----------------------|--------------------------------|
| id          | String    | PK, Default: UUID     | Unique identifier              |
| quoteId     | String    | FK, NOT NULL          | Parent quote                   |
| description | String    | NOT NULL              | Item description               |
| category    | String    | Optional              | Item category                  |
| quantity    | Float     | NOT NULL              | Quantity                       |
| unitCost    | Float     | NOT NULL              | Cost per unit                  |
| totalCost   | Float     | NOT NULL              | Line total (qty × unitCost)    |
| createdAt   | DateTime  | Default: now()        | Record creation timestamp      |

**Relationships**:
- Belongs to: `Quote`

**Indexes**:
- Primary: `id`
- Index: `quoteId` (for quote details)

---

### **Account** (NextAuth)
OAuth provider accounts (future)

| Column              | Type      | Constraints           | Description                    |
|---------------------|-----------|-----------------------|--------------------------------|
| id                  | String    | PK, Default: UUID     | Unique identifier              |
| userId              | String    | FK, NOT NULL          | Associated user                |
| type                | String    | NOT NULL              | Account type (oauth, email)    |
| provider            | String    | NOT NULL              | Provider (google, credentials) |
| providerAccountId   | String    | NOT NULL              | Provider's user ID             |
| refresh_token       | String    | Optional              | OAuth refresh token            |
| access_token        | String    | Optional              | OAuth access token             |
| expires_at          | Int       | Optional              | Token expiry (Unix timestamp)  |
| token_type          | String    | Optional              | Bearer, etc.                   |
| scope               | String    | Optional              | OAuth scopes                   |
| id_token            | String    | Optional              | JWT ID token                   |
| session_state       | String    | Optional              | OAuth session state            |

**Relationships**:
- Belongs to: `User`

**Indexes**:
- Primary: `id`
- Unique: `(provider, providerAccountId)`
- Index: `userId`

---

### **Session** (NextAuth)
Active user sessions

| Column        | Type      | Constraints           | Description                    |
|---------------|-----------|-----------------------|--------------------------------|
| id            | String    | PK, Default: UUID     | Unique identifier              |
| sessionToken  | String    | UNIQUE, NOT NULL      | Session cookie value           |
| userId        | String    | FK, NOT NULL          | Associated user                |
| expires       | DateTime  | NOT NULL              | Session expiry time            |

**Relationships**:
- Belongs to: `User`

**Indexes**:
- Primary: `id`
- Unique: `sessionToken`
- Index: `userId`
- Index: `expires` (for cleanup)

---

### **VerificationToken** (NextAuth)
Email verification & password reset tokens

| Column      | Type      | Constraints           | Description                    |
|-------------|-----------|-----------------------|--------------------------------|
| identifier  | String    | NOT NULL              | Email address                  |
| token       | String    | UNIQUE, NOT NULL      | Verification token             |
| expires     | DateTime  | NOT NULL              | Token expiry time              |

**Indexes**:
- Unique: `token`
- Unique: `(identifier, token)`

---

## 🔗 Relationship Summary

```
Tenant (1) ──── (N) User
Tenant (1) ──── (N) Location
Tenant (1) ──── (N) CostTemplate

User (1) ──── (N) Quote
User (1) ──── (N) Session
User (1) ──── (N) Account

Quote (1) ──── (N) QuoteLineItem

CostTemplate (1) ──── (N) CostOverride
Location (1) ──── (N) CostOverride
User (1) ──── (N) CostOverride (createdBy)
```

---

## 🔍 Common Queries

### Get User with Tenant
```sql
SELECT u.*, t.name as tenant_name
FROM "User" u
LEFT JOIN "Tenant" t ON u."tenantId" = t.id
WHERE u.email = 'admin@armstrong.com';
```

### Get All Quotes for a User
```sql
SELECT q.*, 
       COUNT(qli.id) as line_item_count
FROM "Quote" q
LEFT JOIN "QuoteLineItem" qli ON q.id = qli."quoteId"
WHERE q."userId" = 'user-id-here'
GROUP BY q.id
ORDER BY q."createdAt" DESC;
```

### Get Active Cost Templates for Tenant
```sql
SELECT *
FROM "CostTemplate"
WHERE ("tenantId" = 'tenant-id' OR "tenantId" IS NULL)
  AND active = true
ORDER BY category, name;
```

### Get Location with Overrides
```sql
SELECT l.*,
       ct.name as template_name,
       ct.rate as base_rate,
       co.rate as override_rate
FROM "Location" l
LEFT JOIN "CostOverride" co ON l.id = co."locationId"
LEFT JOIN "CostTemplate" ct ON co."templateId" = ct.id
WHERE l.id = 'location-id'
  AND (co."expiryDate" IS NULL OR co."expiryDate" > NOW());
```

---

## 🔒 Security Considerations

### Row-Level Security (Recommended)
```sql
-- Future enhancement: PostgreSQL RLS policies
CREATE POLICY tenant_isolation ON "Quote"
  USING ("userId" IN (
    SELECT id FROM "User" 
    WHERE "tenantId" = current_setting('app.current_tenant')::uuid
  ));
```

### Sensitive Data
- **passwordHash**: Never returned in API responses
- **Session tokens**: HttpOnly cookies only
- **Access tokens**: Encrypted in database (if using OAuth)

### Data Retention
- Sessions: Auto-expire after 30 days (configurable)
- Verification tokens: Delete after use or expiry
- Soft deletes: Set `active = false` instead of DELETE

---

## 📊 Database Migrations

### Migration History (Prisma)
```bash
# View migration status
npx prisma migrate status

# Create new migration
npx prisma migrate dev --name add_description

# Apply migrations in production
npx prisma migrate deploy
```

### Seeding
```bash
# Seed database with initial data
npm run db:seed
```

**Seed Data Includes**:
- 1 God Mode tenant (Armstrong Corporate)
- 2 Partner tenants (Atlanta, Dallas)
- 3 Users (SUPER_ADMIN, ADMIN, USER)
- 2 Locations
- 11 Cost templates (labor, equipment, overhead)

---

## 🔧 Maintenance

### Backups
```bash
# Backup database
pg_dump armstrong_pricing > backup-$(date +%Y%m%d).sql

# Restore database
psql armstrong_pricing < backup-20260420.sql
```

### Vacuum & Analyze
```sql
-- Periodic maintenance
VACUUM ANALYZE;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Performance Monitoring
```sql
-- Slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## 📈 Scaling Strategies

### Indexing Strategy
1. **Primary Keys**: All tables have UUID primary keys
2. **Foreign Keys**: Indexed automatically
3. **Lookup Fields**: email, sessionToken, calculatorType
4. **Date Ranges**: createdAt, effectiveDate, expires

### Partitioning (Future)
```sql
-- Partition quotes by year
CREATE TABLE quote_2026 PARTITION OF "Quote"
  FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');
```

### Read Replicas
- Primary: Write operations
- Replica: Read-heavy queries (reports, dashboards)

---

## 🧪 Test Data

### Sample Tenant
```json
{
  "id": "tenant-atlanta-001",
  "name": "Armstrong Atlanta",
  "active": true
}
```

### Sample User
```json
{
  "id": "user-admin-001",
  "email": "admin@armstrong.com",
  "name": "System Administrator",
  "role": "SUPER_ADMIN",
  "tenantId": null,
  "active": true
}
```

### Sample Quote
```json
{
  "id": "quote-001",
  "userId": "user-admin-001",
  "calculatorType": "FINAL_MILE",
  "projectName": "Downtown Delivery",
  "totalCost": 450.00,
  "revenue": 650.00,
  "margin": 30.77,
  "status": "DRAFT"
}
```

---

## 📝 Schema Version

**Current Version**: 1.0.0  
**Last Updated**: April 2026  
**Prisma Version**: 7.7.0  
**PostgreSQL**: 10.23+  

---

## 🔄 Future Enhancements

1. **Audit Trail**: Track all changes to quotes and costs
2. **Soft Deletes**: Add `deletedAt` timestamp instead of hard deletes
3. **Versioning**: Quote versioning for revision history
4. **Attachments**: File uploads for quotes (S3/local storage)
5. **Notifications**: User notification preferences
6. **Custom Fields**: Dynamic fields per calculator type

---

**Maintainer**: Armstrong IT Team  
**Contact**: it@goarmstrong.com
