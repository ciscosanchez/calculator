# Armstrong Pricing Tool - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ database
- Domain name (optional, for production)

---

## 📦 Deployment Options

### Option 1: Vercel (Recommended for Quick Deploy)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Add PostgreSQL Database**
   - In Vercel dashboard, go to "Storage" → "Create Database" → "Postgres"
   - Copy the connection string
   - Update your environment variables

---

### Option 2: VPS/Self-Hosted (Full Control)

#### Server Requirements
- Ubuntu 22.04 LTS (recommended)
- 2GB RAM minimum
- 20GB disk space
- Nginx or Apache

#### Step 1: Set up PostgreSQL

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE armstrong_pricing;
CREATE USER armstrong_user WITH PASSWORD 'your-strong-password';
GRANT ALL PRIVILEGES ON DATABASE armstrong_pricing TO armstrong_user;
\q
```

#### Step 2: Install Node.js and PM2

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2
```

#### Step 3: Deploy Application

```bash
# Clone your repository
cd /var/www
git clone YOUR_REPO_URL armstrong-pricing-tool
cd armstrong-pricing-tool

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.production
nano .env.production  # Edit with your production values

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "armstrong-pricing" -- start
pm2 save
pm2 startup  # Follow the instructions
```

#### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/armstrong-pricing
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/armstrong-pricing /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 5: Enable SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔐 Environment Variables

Create a `.env.production` file with these variables:

```bash
# Database
DATABASE_URL="postgresql://armstrong_user:your-password@localhost:5432/armstrong_pricing?schema=public"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-very-long-random-secret-here"  # Generate with: openssl rand -base64 32

# Node Environment
NODE_ENV="production"
```

---

## 🌱 Initialize Production Database

After deployment:

```bash
# Run migrations
npm run db:push

# Seed the database
npm run db:seed
```

This will create:
- **God Mode User**: admin@armstrong.com / admin123
- **Admin User**: manager@location1.com / password123
- **Regular User**: user@location1.com / password123
- **Sample tenants and locations**
- **Cost templates**

⚠️ **IMPORTANT**: Change these default passwords immediately after first login!

---

## 👤 User Management

### Creating New Users

1. **God Mode (SUPER_ADMIN)**
   - Can see all tenants/locations
   - Full access to cost management
   - Can create new tenants and users

2. **Admin**
   - Limited to their tenant
   - Can manage quotes and costs for their locations
   - Cannot create new tenants

3. **User**
   - Limited to their tenant
   - Can create and view quotes
   - Read-only access to costs

### Adding a New User (via PostgreSQL)

```sql
-- 1. Hash password using bcrypt (use online tool or Node.js)
-- 2. Insert user
INSERT INTO "User" (
  id, email, name, "passwordHash", role, "tenantId", active, "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid(),
  'newuser@example.com',
  'New User Name',
  '$2a$10$...', -- Hashed password
  'USER',       -- or 'ADMIN' or 'SUPER_ADMIN'
  'tenant-id-here',
  true,
  NOW(),
  NOW()
);
```

---

## 🔧 Maintenance

### Backup Database

```bash
# Daily backup
pg_dump armstrong_pricing > backup-$(date +%Y%m%d).sql

# Restore backup
psql armstrong_pricing < backup-20260420.sql
```

### Update Application

```bash
cd /var/www/armstrong-pricing-tool
git pull origin main
npm install
npm run build
pm2 restart armstrong-pricing
```

### View Logs

```bash
# PM2 logs
pm2 logs armstrong-pricing

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Set strong `NEXTAUTH_SECRET`
- [ ] Enable SSL/HTTPS
- [ ] Configure firewall (UFW)
- [ ] Set up regular database backups
- [ ] Disable root PostgreSQL login
- [ ] Keep Node.js and dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting (optional)
- [ ] Set up monitoring (optional)

---

## 📊 Monitoring (Optional)

### Simple Uptime Monitoring

```bash
# Create a systemd service for health checks
sudo nano /etc/systemd/system/armstrong-healthcheck.service
```

Add monitoring tools like:
- UptimeRobot (free)
- Datadog
- New Relic
- PM2 Plus

---

## 🐛 Troubleshooting

### App won't start
```bash
pm2 logs armstrong-pricing  # Check logs
npm run build  # Rebuild
pm2 restart armstrong-pricing
```

### Database connection errors
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U armstrong_user -d armstrong_pricing
```

### Port already in use
```bash
# Find process using port 3000
sudo lsof -i :3000
kill -9 PID
```

---

## 📞 Support

For issues:
1. Check logs: `pm2 logs armstrong-pricing`
2. Verify environment variables
3. Check database connectivity
4. Restart services: `pm2 restart all`

---

## 🎉 You're Ready!

Your Armstrong Pricing Tool is now deployed and ready for production use!

Access: https://your-domain.com
Login with your god mode credentials to get started.
