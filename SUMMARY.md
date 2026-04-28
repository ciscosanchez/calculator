# Armstrong Pricing Tool - Project Summary

**Date:** April 20, 2026  
**Status:** Planning & Design Complete ✅  
**Next Phase:** Implementation

---

## 📋 What We've Accomplished

### 1. Deep Dive Analysis ✅

**Analyzed 4 HTML Calculators:**
- Final Mile Delivery Calculator
- Hotel FF&E Installation Calculator
- Pallet Handling Calculator
- Warehouse Storage Calculator

**Key Findings:**
- All calculators are standalone HTML with embedded JavaScript
- Consistent Armstrong branding and color scheme
- Real-time calculation with no external dependencies
- Common labor rate: $23.76/hr (but not tied to cost matrices)
- Inconsistent terminology across calculators
- No multi-location support
- No business type (commercial vs residential) distinction

**Analyzed 2 Excel Cost Matrices:**
- **Employee Cost Matrix**: Detailed breakdown of fully-loaded labor costs
  - Project Manager: $44.46/hr (with health insurance)
  - Installer: $44.46/hr
  - Coordinator: $32.07/hr
  - General Labor: $32.07/hr
  - Includes FICA, benefits, health insurance, PTO, etc.

- **Warehouse Cost Matrix**: Location-specific facility costs
  - 4226 Surles Ct: 83,943 sq ft @ $1.47/sq ft/month
  - 4227 Surles Ct: 123,604 sq ft @ $1.12/sq ft/month
  - Includes rent, TICAM, utilities, equipment, labor

### 2. Comprehensive Architecture Design ✅

**Document Created:** `ARCHITECTURE.md` (14KB)

**Technology Stack Defined:**
- **Frontend:** Next.js 14+ (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes (serverless)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js with JWT
- **State:** React Context + Custom Hooks
- **Forms:** React Hook Form + Zod validation
- **PDF Export:** React-PDF or Puppeteer
- **Deployment:** Self-hosted colo with Docker/PM2

**Database Schema Designed:**
- Multi-tenant architecture (row-level isolation by `tenantId`)
- 15+ tables covering:
  - Tenant/Location hierarchy
  - User management with 3-tier roles
  - Cost templates and overrides
  - Quote management with history
  - Integration configs (NetSuite, Mobile API)
  - Comprehensive audit logging

**API Architecture:**
- RESTful endpoints for all operations
- 30+ API routes defined
- NetSuite CRM integration design
- Mobile API with API key authentication
- Rate limiting and security measures

**Role-Based Access Control:**
1. **Super Admin** - Edit critical fields (labor rates, benefits packages)
2. **Admin** - Edit most fields (location costs, overrides)
3. **User** - View-only, can save quotes and export

### 3. Wireframes Created ✅

**5 Interactive HTML Wireframes:**

1. **01-dashboard.html** - Main dashboard
   - Stats overview (quotes, margin, revenue, acceptance rate)
   - Quick access to all 4 calculators
   - Recent quotes list
   - Sidebar navigation

2. **02-calculator-final-mile.html** - Final Mile Calculator
   - Business type toggle (Commercial/Residential)
   - Location selector
   - Two-column layout (inputs left, results right)
   - Real-time stats display
   - Cost breakdown
   - Verdict box with margin analysis
   - Save/Export/Share actions

3. **03-quotes-list.html** - Quote Management
   - Advanced filtering (search, status, service, location)
   - Sortable table with all quotes
   - Status badges (Draft, Sent, Accepted, Rejected, Expired)
   - Margin indicators (color-coded)
   - Quick actions per quote
   - Pagination

4. **04-cost-management.html** - Admin Cost Management
   - Tabbed interface (Labor, Equipment, Overhead, Facility)
   - Location selector for overrides
   - Super Admin field restrictions (gold border)
   - Override indicators (DEFAULT vs OVERRIDE badges)
   - Target margins by business type
   - Bulk save functionality

5. **05-margin-stepper.html** - Margin Scenario Builder ⭐ **NEW!**
   - Interactive sliders for all key variables
   - Quick scenario presets (Current, Conservative, Aggressive, Break-Even)
   - Real-time margin calculation display
   - What-if scenario analysis
   - Visual comparison chart
   - Save and apply scenarios to quotes

**Design System Documented:**
- Armstrong brand colors (Navy, Sky, Green, Red, Gold)
- Typography guidelines
- Component specifications
- Responsive layout principles

### 4. Standardization Framework ✅

**Common Terminology Defined:**
- "Fully-Loaded Labor Rate" (standardized)
- "Client Rate" (what you quote)
- "Break-Even Rate" (minimum viable)
- "Target Gross Margin" (desired profit %)
- "Overhead" (context-specific)

**Business Type Toggle:**
- Commercial (default) - higher complexity, elevator factors
- Residential - simpler calculations, lower margins
- Industrial (future)

**Service Categories:**
- Transportation Services (Final Mile)
- Installation Services (Hotel FF&E)
- Warehousing Services (Storage + Handling)
- Value-Added Services (future)

---

## 🎯 Requirements Captured

**Scale:**
- ✅ 100 Armstrong Partner companies
- ✅ Multiple locations per company
- ✅ Full data isolation between companies

**User Roles:**
- ✅ Super Admin (critical fields only)
- ✅ Admin (most fields, location-scoped)
- ✅ User (view-only, can save quotes)

**Business Types:**
- ✅ Commercial vs Residential calculations
- ✅ Different margins and complexity factors

**Integrations:**
- ✅ NetSuite CRM (export quotes, sync customers)
- ✅ Mobile API (RESTful with API keys)
- ✅ PDF export
- ✅ Quote sharing via link

**Infrastructure:**
- ✅ In-house colo deployment
- ✅ PostgreSQL primary + backup to different environment

**New Feature:**
- ✅ Margin Stepper/Scenario Builder for what-if analysis

---

## 📁 Files Created

```
/calculator (root directory)
│
├── ARCHITECTURE.md                    # Complete technical architecture (14KB)
├── SUMMARY.md                         # This file
│
├── calc_final_mile Complete.html      # Original HTML calculator
├── calc_hotel_installation Complete.html
├── calc_pallet_handling Complete.html
├── calc_warehouse_storage Complete.html
│
├── Employee Cost Matrix.xlsx          # Original cost data
├── Warehouse Cost Matrix.xlsx
├── DynamicPricing Final.pptx
│
└── /wireframes
    ├── README.md                      # Wireframes documentation
    ├── 01-dashboard.html
    ├── 02-calculator-final-mile.html
    ├── 03-quotes-list.html
    ├── 04-cost-management.html
    └── 05-margin-stepper.html
```

---

## 🚀 Next Steps (Implementation Roadmap)

### Phase 1: Foundation (Weeks 1-2)
- [ ] Initialize Next.js 14+ project with TypeScript
- [ ] Set up Prisma with PostgreSQL
- [ ] Create database schema and migrations
- [ ] Implement NextAuth.js authentication
- [ ] Build basic layout components (Header, Sidebar, Footer)
- [ ] Set up Tailwind CSS with Armstrong design tokens

### Phase 2: Core Calculators (Weeks 3-5)
- [ ] Port Final Mile calculator to React/TypeScript
- [ ] Port Hotel Installation calculator
- [ ] Port Pallet Handling calculator
- [ ] Port Warehouse Storage calculator
- [ ] Implement Margin Stepper/Scenario Builder
- [ ] Create shared calculation hooks
- [ ] Add location-based cost loading
- [ ] Implement business type toggle logic

### Phase 3: Quote Management (Week 4)
- [ ] Build quote CRUD operations
- [ ] Implement quote history tracking
- [ ] Create quote list with filtering
- [ ] Add PDF export functionality
- [ ] Build quote sharing (public links)
- [ ] Implement quote versioning

### Phase 4: Cost Management (Week 5)
- [ ] Build cost template management UI
- [ ] Implement location override system
- [ ] Create Super Admin field restrictions
- [ ] Add cost inheritance logic
- [ ] Build target margin configuration

### Phase 5: User Management (Week 6)
- [ ] Implement 3-tier role system
- [ ] Build user management UI (Admin)
- [ ] Create permission middleware
- [ ] Add audit logging for all actions
- [ ] Build location assignment for users

### Phase 6: Integrations (Week 6-7)
- [ ] NetSuite API connector
- [ ] Quote export to NetSuite as Sales Orders
- [ ] Customer sync from NetSuite
- [ ] Mobile API endpoints
- [ ] API key management
- [ ] Rate limiting implementation

### Phase 7: Deployment (Week 7-8)
- [ ] Docker containerization
- [ ] Set up PostgreSQL primary + backup
- [ ] Configure CI/CD pipeline (GitHub Actions)
- [ ] Deploy to colo infrastructure
- [ ] Set up monitoring (Sentry, logs)
- [ ] Configure backups and disaster recovery

### Phase 8: Testing & Launch (Week 8)
- [ ] End-to-end testing (Playwright)
- [ ] User acceptance testing (UAT)
- [ ] Performance testing
- [ ] Security audit
- [ ] Documentation for end users
- [ ] Training materials
- [ ] Go-live!

**Estimated Timeline:** 8 weeks to MVP

---

## 🔑 Key Features

### Multi-Tenancy
- 100+ partner companies supported
- Full data isolation (row-level by tenantId)
- Shared cost templates with location overrides
- Company branding customization (future)

### Real-Time Calculations
- Debounced input (500ms)
- Backend calculation for consistency
- Live margin analysis
- Color-coded verdict boxes (✓ ⚠ ✗)

### Margin Scenario Builder ⭐
- Interactive sliders for all variables
- Quick presets (Conservative, Aggressive, etc.)
- What-if scenario comparisons
- Visual charts and impact analysis
- Save and apply scenarios

### Role-Based Access
- Super Admin: Critical fields only
- Admin: Location-scoped management
- User: View-only + quote creation
- Field-level permissions
- Audit trail for all changes

### Business Type Support
- Commercial vs Residential calculations
- Different margin targets
- Conditional complexity factors
- Future: Industrial type

### Integrations
- NetSuite CRM (bidirectional sync)
- Mobile API (RESTful + API keys)
- PDF export (quotes)
- Public quote sharing

---

## 💰 Cost Data Integration

**From Excel to Database:**

The system will import cost data from the Excel matrices:

**Labor Costs:**
- Base wage + all benefits calculated
- FICA (Social Security + Medicare)
- FUTA + SUTA (unemployment)
- Workers' Comp (NC rate: 7.65%)
- Health insurance ($967.75/month company portion)
- 401K, PTO, bonuses, phone, computer
- **Result:** $30/hr base → $44.46/hr fully-loaded

**Facility Costs:**
- Location-specific rent + TICAM
- Utilities, maintenance, insurance
- Equipment (forklifts, trucks)
- Warehouse labor allocation
- **Result:** $1.12-1.47/sq ft/month depending on location

---

## 🎨 Design Highlights

**Armstrong Brand Colors:**
- Navy (#0D2B4E) - Primary
- Sky (#2B9ED4) - Accent
- Green (#1A7A4A) - Success
- Red (#C0392B) - Danger
- Gold (#E8A020) - Warning

**UI Patterns:**
- Clean card-based layouts
- Real-time feedback
- Color-coded indicators
- Intuitive navigation
- Mobile-responsive (future)

---

## 📊 Business Impact

**Benefits of the New System:**

1. **Standardization Across 100+ Companies**
   - Consistent terminology
   - Unified pricing methodology
   - Reduced training time

2. **Data-Driven Pricing**
   - Real cost data from matrices
   - Location-specific adjustments
   - Margin optimization

3. **Faster Quote Turnaround**
   - Real-time calculations
   - Saved templates
   - PDF export
   - Public sharing

4. **Better Decision Making**
   - What-if scenarios
   - Margin comparisons
   - Historical analysis
   - Audit trail

5. **Operational Efficiency**
   - Centralized cost management
   - Automated NetSuite sync
   - Mobile access
   - Reduced errors

---

## 🔐 Security & Compliance

- Encryption at rest (PostgreSQL TDE)
- Encryption in transit (TLS 1.3)
- Row-level tenant isolation
- Comprehensive audit logging
- Role-based access control
- CSRF protection
- Rate limiting
- SQL injection prevention (Prisma ORM)

---

## 📈 Scalability

- Multi-tenant architecture supports 1000+ companies
- PostgreSQL connection pooling
- Horizontal scaling via load balancer
- Caching layer (Redis optional)
- CDN for static assets
- Database replication for high availability

---

## 🎓 What You've Learned

Through this planning process, we've:

1. ✅ Analyzed existing calculators and identified patterns
2. ✅ Designed a scalable multi-tenant architecture
3. ✅ Created a comprehensive database schema
4. ✅ Planned RESTful API endpoints
5. ✅ Designed role-based access control
6. ✅ Created interactive wireframes
7. ✅ Integrated real cost data from Excel matrices
8. ✅ Added margin scenario builder for what-if analysis
9. ✅ Planned NetSuite and mobile integrations
10. ✅ Designed deployment architecture

---

## 🤝 Ready to Build!

You now have:
- ✅ Complete technical architecture
- ✅ Database schema with relationships
- ✅ API endpoint design
- ✅ Interactive wireframes (5 pages)
- ✅ Cost data integration plan
- ✅ Security considerations
- ✅ Deployment strategy
- ✅ 8-week implementation roadmap

**Next Action:** Start Phase 1 - Foundation (Next.js setup, database, auth)

Or if you'd like, I can:
- Generate the Prisma schema file
- Create a starter Next.js project structure
- Build the first calculator component
- Set up the database migrations
- Create the cost template seeders

**What would you like to tackle first?** 🚀
