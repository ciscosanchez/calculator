# Armstrong Pricing Tool

A modern, multi-tenant pricing calculator system built for logistics and installation services. Features real-time cost calculations, multi-location management, and role-based access control.

![Armstrong Pricing Tool](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)

---

## ✨ Features

### 🧮 Four Powerful Calculators

1. **Final Mile Delivery**
   - Route-based cost calculations
   - Crew size and labor rate management
   - Fuel and truck operating costs
   - Real-time margin analysis

2. **Installation Services** (Flexible)
   - Hotel/Hospitality installations
   - Data Center rack installations
   - Corporate office setups
   - Healthcare equipment
   - Education facilities
   - Retail fixtures
   - Dynamic unit labeling per project type

3. **Pallet Handling & Storage**
   - Handling time calculations
   - Storage duration pricing
   - Equipment cost tracking
   - Per-pallet cost breakdown

4. **Warehouse Storage**
   - Square footage-based pricing
   - Pallet management costs
   - Special handling options (climate control, security)
   - Monthly cost projections

### 🔐 Authentication & Security

- **Email/Password Authentication** via NextAuth
- **Role-Based Access Control**:
  - **God Mode (SUPER_ADMIN)**: Full system access, sees all tenants
  - **Admin**: Manages their tenant's quotes and costs
  - **User**: Creates quotes, read-only cost access
- **Multi-Tenant Architecture**: Each partner operates independently

### 📊 Cost Management

- Centralized labor rate templates
- Equipment cost tracking
- Overhead allocations
- Location-specific overrides (future)
- Template-based cost configuration

### 💼 Quote Management

- Save calculations as quotes
- Track quote history
- Filter by status, calculator type
- Export capabilities (future)

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, React Server Components)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **Validation**: Zod

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone YOUR_REPO_URL
cd armstrong-pricing-tool

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Set up database
createdb armstrong_pricing

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed

# Start development server
npm run dev
```

Visit http://localhost:3000 and log in with:
- **God Mode**: admin@armstrong.com / admin123
- **Admin**: manager@location1.com / password123
- **User**: user@location1.com / password123

---

## 📁 Project Structure

```
armstrong-pricing-tool/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── auth/                 # NextAuth endpoints
│   ├── calculators/              # Calculator pages
│   │   ├── final-mile/
│   │   ├── installation-services/
│   │   ├── pallet-handling/
│   │   └── warehouse-storage/
│   ├── dashboard/                # Main dashboard
│   ├── quotes/                   # Quote management
│   ├── costs/                    # Cost management
│   └── login/                    # Login page
├── components/                   # React components
│   ├── layout/                   # Layout components
│   └── ui/                       # UI components
├── lib/                          # Utility functions
├── prisma/                       # Database schema & migrations
│   ├── schema.prisma
│   └── seed.ts
├── auth.ts                       # NextAuth configuration
├── middleware.ts                 # Route protection
└── types/                        # TypeScript types

```

---

## 🎯 Key Features Explained

### Multi-Tenant Architecture

Each partner (tenant) operates independently:
- Separate data isolation
- Location-based access control
- Tenant-specific cost overrides

### Real-Time Calculations

All calculators provide instant feedback:
- Live margin percentages
- Break-even analysis
- Target rate recommendations
- Color-coded profitability indicators

### Flexible Installation Calculator

Unlike static calculators, the Installation Services calculator adapts to different project types:
- Automatic unit label changes (rooms → racks → workstations)
- Project-specific default values
- Industry-appropriate labor rates
- Easy to extend with new project types

---

## 🔧 Configuration

### Database Schema

The app uses Prisma with PostgreSQL. Key models:

- **Tenant**: Partners/organizations
- **Location**: Physical locations per tenant
- **User**: System users with roles
- **CostTemplate**: Base cost configurations
- **CostOverride**: Location-specific costs
- **Quote**: Saved pricing calculations
- **QuoteLineItem**: Individual quote items

### Environment Variables

Required variables in `.env`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/armstrong_pricing"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
```

---

## 📝 Development

### Running Tests

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### Database Management

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio
```

---

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions including:
- Vercel deployment
- VPS/self-hosted setup
- Database configuration
- SSL setup
- User management

---

## 🔐 Security Best Practices

1. **Change default passwords** immediately after first login
2. Use **strong NEXTAUTH_SECRET** (generate with `openssl rand -base64 32`)
3. Enable **HTTPS in production**
4. Set up **regular database backups**
5. Keep **dependencies updated**
6. Use **environment variables** for all secrets

---

## 📊 Database Seed Data

The seed script creates:

**Tenants:**
- Armstrong Corporate (God Mode)
- Armstrong Atlanta
- Armstrong Dallas

**Users:**
- admin@armstrong.com (SUPER_ADMIN - God Mode)
- manager@location1.com (ADMIN)
- user@location1.com (USER)

**Cost Templates:**
- Labor rates (Driver, Warehouse Worker, Specialist, Supervisor)
- Equipment costs (Fuel, Truck, Forklift, Pallet Jack)
- Overhead allocations (Final Mile, Installation, Warehouse)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

Proprietary - Armstrong Logistics

---

## 🆘 Support

For technical support or questions:
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for common issues
- Review logs with `pm2 logs armstrong-pricing`
- Contact your system administrator

---

## 🎉 Credits

Built with ❤️ for Armstrong Logistics using modern web technologies.

- **Framework**: Next.js by Vercel
- **Database**: PostgreSQL with Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
