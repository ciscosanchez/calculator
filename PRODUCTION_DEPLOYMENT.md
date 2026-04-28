# Armstrong Pricing Tool - Production Deployment Guide

**The Right Way: Enterprise-Grade Production Deployment**

This guide covers a production-grade deployment with security, monitoring, backups, and high availability.

**Timeline:** 2-3 days for proper setup  
**Monthly Cost:** ~$25/month  
**Difficulty:** Intermediate to Advanced

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Infrastructure Setup](#phase-1-infrastructure-setup)
3. [Phase 2: Database Setup](#phase-2-database-setup)
4. [Phase 3: Application Deployment](#phase-3-application-deployment)
5. [Phase 4: Nginx Reverse Proxy](#phase-4-nginx-reverse-proxy)
6. [Phase 5: SSL/HTTPS](#phase-5-ssl-https)
7. [Phase 6: Monitoring & Logging](#phase-6-monitoring--logging)
8. [Phase 7: Security Hardening](#phase-7-security-hardening)
9. [Phase 8: Final Checks](#phase-8-final-checks)
10. [Deployment Checklist](#deployment-checklist)
11. [Maintenance & Operations](#maintenance--operations)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You'll Need

- **VPS/Cloud Server**
  - Recommended: DigitalOcean, Linode, or AWS Lightsail
  - Minimum: 2 CPU cores, 4GB RAM, 50GB SSD
  - OS: Ubuntu 22.04 LTS
  
- **Domain Name**
  - Example: `pricing.yourdomain.com`
  - DNS configured to point to your server IP
  
- **Access**
  - SSH access to your server
  - Root or sudo privileges
  - GitHub access to the repository
  
- **Skills Required**
  - Basic Linux command line
  - Understanding of SSH
  - Basic networking knowledge
  
### Estimated Costs

| Item | Cost | Frequency |
|------|------|-----------|
| VPS (4GB RAM) | $24 | Monthly |
| Domain Name | $12 | Yearly |
| SSL Certificate | FREE | - |
| Monitoring | FREE | - |
| **Total** | **~$25/month** | - |

---

## Phase 1: Infrastructure Setup

**Time Required:** 1-2 hours  
**Day:** 1

### Step 1.1: Provision Your Server

#### Using DigitalOcean (Recommended)

1. Sign up at [digitalocean.com](https://www.digitalocean.com)
2. Create a new Droplet:
   - **Image:** Ubuntu 22.04 LTS
   - **Plan:** Basic ($24/month)
   - **CPU:** 2 vCPUs, 4GB RAM, 80GB SSD
   - **Datacenter:** Choose closest to your users
   - **Authentication:** SSH keys (add your public key)
3. Note your droplet's IP address

#### Alternative: Linode, AWS Lightsail, Hetzner

Similar process - choose Ubuntu 22.04 with 4GB RAM.

### Step 1.2: Initial Server Access

```bash
# SSH into your server as root
ssh root@YOUR_SERVER_IP
```

### Step 1.3: Create Non-Root User

```bash
# Update system packages
apt update && apt upgrade -y

# Create a dedicated user for the application
adduser armstrong

# Add user to sudo group
usermod -aG sudo armstrong

# Switch to new user
su - armstrong
```

### Step 1.4: Set Up SSH Key Authentication

```bash
# On the server (as armstrong user)
mkdir ~/.ssh
chmod 700 ~/.ssh

# On your LOCAL machine, copy your SSH key to the server
ssh-copy-id armstrong@YOUR_SERVER_IP

# Test SSH key login from your local machine
ssh armstrong@YOUR_SERVER_IP

# If successful, disable root login and password authentication
sudo nano /etc/ssh/sshd_config
```

**Edit `/etc/ssh/sshd_config`:**
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

```bash
# Restart SSH service
sudo systemctl restart sshd
```

### Step 1.5: Configure Firewall

```bash
# Install and configure UFW (Uncomplicated Firewall)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Enable firewall
sudo ufw enable

# Verify status
sudo ufw status verbose
```

**Expected output:**
```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

## Phase 2: Database Setup

**Time Required:** 1-2 hours  
**Day:** 1

### Step 2.1: Install PostgreSQL 16

```bash
# Add PostgreSQL official repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Import repository signing key
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update package list
sudo apt update

# Install PostgreSQL 16
sudo apt install postgresql-16 postgresql-contrib-16 -y

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
sudo systemctl status postgresql
```

### Step 2.2: Create Production Database

```bash
# Switch to postgres user
sudo -u postgres psql
```

**In PostgreSQL shell:**
```sql
-- Create production database
CREATE DATABASE armstrong_pricing_prod;

-- Create application user with strong password
CREATE USER armstrong_app WITH PASSWORD 'CHANGE_THIS_TO_STRONG_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE armstrong_pricing_prod TO armstrong_app;

-- Connect to the database
\c armstrong_pricing_prod

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO armstrong_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO armstrong_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO armstrong_app;

-- Verify user and database
\l
\du

-- Exit PostgreSQL
\q
```

**💡 Tip:** Generate a strong password using:
```bash
openssl rand -base64 32
```

### Step 2.3: Configure PostgreSQL for Production

```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/16/main/postgresql.conf
```

**Add/modify these settings:**
```conf
# Memory settings (for 4GB RAM server)
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 4MB

# Checkpoint settings
checkpoint_completion_target = 0.9
wal_buffers = 16MB

# Query planner
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200

# Connection settings
max_connections = 100
```

```bash
# Restart PostgreSQL to apply changes
sudo systemctl restart postgresql
```

### Step 2.4: Set Up Automated Backups

```bash
# Create backup directory
sudo mkdir -p /var/backups/postgresql
sudo chown postgres:postgres /var/backups/postgresql

# Create backup script
sudo nano /usr/local/bin/backup-database.sh
```

**Backup script content:**
```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/postgresql"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DATABASE="armstrong_pricing_prod"
RETENTION_DAYS=30

# Create backup
echo "Starting backup at $TIMESTAMP"
sudo -u postgres pg_dump $DATABASE | gzip > $BACKUP_DIR/armstrong_$TIMESTAMP.sql.gz

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully"
    
    # Delete backups older than retention period
    find $BACKUP_DIR -name "armstrong_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "Old backups cleaned up (retention: $RETENTION_DAYS days)"
else
    echo "Backup failed!"
    exit 1
fi

# Optional: Upload to S3 for offsite backup
# aws s3 cp $BACKUP_DIR/armstrong_$TIMESTAMP.sql.gz s3://your-bucket/backups/

# Optional: Send notification
# curl -X POST https://your-webhook-url -d "Database backup completed"
```

```bash
# Make script executable
sudo chmod +x /usr/local/bin/backup-database.sh

# Test the backup script
sudo /usr/local/bin/backup-database.sh

# Verify backup was created
ls -lh /var/backups/postgresql/

# Add to crontab (daily backups at 2 AM)
sudo crontab -e
```

**Add to crontab:**
```
0 2 * * * /usr/local/bin/backup-database.sh >> /var/log/postgresql-backup.log 2>&1
```

### Step 2.5: Test Database Connectivity

```bash
# Test connection
psql -U armstrong_app -d armstrong_pricing_prod -h localhost

# If it asks for password, that's good!
# Enter the password you set earlier

# Run a test query
SELECT version();

# Exit
\q
```

---

## Phase 3: Application Deployment

**Time Required:** 2-3 hours  
**Day:** 1-2

### Step 3.1: Install Node.js 20 LTS

```bash
# Install Node.js 20 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x or higher

# Install build tools (needed for some npm packages)
sudo apt install -y build-essential
```

### Step 3.2: Install PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 --version
```

### Step 3.3: Deploy Application Code

```bash
# Create application directory
sudo mkdir -p /var/www/armstrong-pricing-tool
sudo chown armstrong:armstrong /var/www/armstrong-pricing-tool

# Navigate to directory
cd /var/www/armstrong-pricing-tool

# Clone repository from GitHub
git clone https://github.com/ciscosanchez/calculator.git .

# Install dependencies
npm ci --production=false

# Verify package installation
npm list --depth=0
```

### Step 3.4: Configure Environment Variables

```bash
# Create production environment file
cp .env.example .env.production

# Edit with production values
nano .env.production
```

**Production `.env.production` file:**
```bash
# Database Configuration
DATABASE_URL="postgresql://armstrong_app:YOUR_DB_PASSWORD@localhost:5432/armstrong_pricing_prod?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="https://pricing.yourdomain.com"
NEXTAUTH_SECRET="GENERATE_A_STRONG_SECRET_HERE"

# Node Environment
NODE_ENV="production"

# Optional: Error Tracking (Sentry)
# SENTRY_DSN="your-sentry-dsn-here"

# Optional: Email Configuration (for future notifications)
# SMTP_HOST="smtp.example.com"
# SMTP_PORT="587"
# SMTP_USER="notifications@yourdomain.com"
# SMTP_PASSWORD="your-smtp-password"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 3.5: Build Application

```bash
# Build for production
npm run build

# Verify build completed successfully
ls -la .next/
```

### Step 3.6: Initialize Database

```bash
# Run Prisma migrations
npm run db:push

# Seed initial data (creates default users and cost templates)
npm run db:seed

# Verify data was seeded
psql -U armstrong_app -d armstrong_pricing_prod -h localhost -c "SELECT email, role FROM \"User\";"
```

**Default users created:**
- God Mode: `admin@armstrong.com` / `admin123`
- Admin: `manager@location1.com` / `password123`
- User: `user@location1.com` / `password123`

**⚠️ IMPORTANT:** Change these passwords immediately after deployment!

### Step 3.7: Configure PM2

```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

**PM2 ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'armstrong-pricing',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/armstrong-pricing-tool',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 2,  // Use 2 instances for load balancing
    exec_mode: 'cluster',
    max_memory_restart: '500M',
    error_file: '/var/log/armstrong/error.log',
    out_file: '/var/log/armstrong/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000
  }]
}
```

### Step 3.8: Start Application with PM2

```bash
# Create log directory
sudo mkdir -p /var/log/armstrong
sudo chown armstrong:armstrong /var/log/armstrong

# Start application
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs armstrong-pricing --lines 50

# Save PM2 configuration
pm2 save

# Generate and run startup script
pm2 startup systemd
# Copy and run the command it outputs

# Example output:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u armstrong --hp /home/armstrong
```

### Step 3.9: Verify Application is Running

```bash
# Test local access
curl http://localhost:3000

# Should return HTML content

# Check if port 3000 is listening
sudo lsof -i :3000
```

---

## Phase 4: Nginx Reverse Proxy

**Time Required:** 1 hour  
**Day:** 2

### Step 4.1: Install Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify Nginx is running
sudo systemctl status nginx

# Test by visiting http://YOUR_SERVER_IP
# Should see "Welcome to nginx!" page
```

### Step 4.2: Configure Nginx for Armstrong Pricing Tool

```bash
# Create Nginx configuration file
sudo nano /etc/nginx/sites-available/armstrong-pricing
```

**Nginx configuration:**
```nginx
# Upstream backend servers
upstream armstrong_backend {
    least_conn;
    server localhost:3000;
}

# Rate limiting zones
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;

# HTTP server (will redirect to HTTPS after SSL setup)
server {
    listen 80;
    listen [::]:80;
    server_name pricing.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Logging
    access_log /var/log/nginx/armstrong_access.log;
    error_log /var/log/nginx/armstrong_error.log;

    # Client body size limit
    client_max_body_size 10M;

    # Rate limiting on login endpoint
    location /api/auth {
        limit_req zone=login_limit burst=3 nodelay;
        limit_req_status 429;
        
        proxy_pass http://armstrong_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # Rate limiting on API endpoints
    location /api {
        limit_req zone=api_limit burst=20 nodelay;
        limit_req_status 429;
        
        proxy_pass http://armstrong_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # Static files with caching
    location /_next/static {
        proxy_pass http://armstrong_backend;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable, max-age=31536000";
        access_log off;
    }

    # Next.js data files
    location /_next/data {
        proxy_pass http://armstrong_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # All other requests
    location / {
        proxy_pass http://armstrong_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # Health check endpoint (if implemented)
    location /api/health {
        proxy_pass http://armstrong_backend;
        access_log off;
    }
}
```

### Step 4.3: Enable the Site

```bash
# Create symbolic link to enable the site
sudo ln -s /etc/nginx/sites-available/armstrong-pricing /etc/nginx/sites-enabled/

# Remove default Nginx site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Should see:
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

### Step 4.4: Verify Nginx Configuration

```bash
# Test accessing your application through Nginx
curl -I http://YOUR_SERVER_IP

# Should return 200 OK with X-Frame-Options header

# If you have DNS configured:
curl -I http://pricing.yourdomain.com
```

---

## Phase 5: SSL/HTTPS

**Time Required:** 30 minutes  
**Day:** 2

### Step 5.1: Install Certbot

```bash
# Install Certbot and Nginx plugin
sudo apt install certbot python3-certbot-nginx -y
```

### Step 5.2: Obtain SSL Certificate

**Prerequisites:**
- Domain name must be pointed to your server IP (A record)
- Port 80 and 443 must be open in firewall

```bash
# Verify DNS is pointing to your server
dig pricing.yourdomain.com +short
# Should return your server IP

# Obtain SSL certificate
sudo certbot --nginx -d pricing.yourdomain.com

# Follow the prompts:
# 1. Enter email address for renewal notifications
# 2. Agree to Terms of Service (yes)
# 3. Share email with EFF (optional)
# 4. Choose redirect option: 2 (Redirect HTTP to HTTPS)
```

**Certbot will automatically:**
- Verify domain ownership
- Obtain certificate from Let's Encrypt
- Configure Nginx for HTTPS
- Set up HTTP → HTTPS redirect
- Configure auto-renewal

### Step 5.3: Verify SSL Configuration

```bash
# Test HTTPS
curl -I https://pricing.yourdomain.com

# Should return 200 OK with SSL headers

# Test SSL rating at:
# https://www.ssllabs.com/ssltest/analyze.html?d=pricing.yourdomain.com
```

### Step 5.4: Configure Auto-Renewal

```bash
# Test auto-renewal process (dry run)
sudo certbot renew --dry-run

# Should see: "Congratulations, all simulated renewals succeeded"

# Certbot automatically creates a systemd timer
# Verify it's active
sudo systemctl status certbot.timer

# Manual renewal command (if ever needed)
# sudo certbot renew
```

### Step 5.5: Strengthen SSL Security

```bash
# Edit Nginx SSL configuration
sudo nano /etc/nginx/sites-available/armstrong-pricing
```

**Add after the server block:**
```nginx
# SSL configuration (added by Certbot, but we'll strengthen it)
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_stapling on;
ssl_stapling_verify on;

# HSTS (optional but recommended)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

```bash
# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## Phase 6: Monitoring & Logging

**Time Required:** 1-2 hours  
**Day:** 2-3

### Step 6.1: Configure Log Rotation

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/armstrong-pricing
```

**Log rotation config:**
```
/var/log/armstrong/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    create 0640 armstrong armstrong
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}

/var/log/nginx/armstrong_*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    missingok
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

```bash
# Test logrotate configuration
sudo logrotate -d /etc/logrotate.d/armstrong-pricing
```

### Step 6.2: Install System Monitoring (htop)

```bash
# Install htop for interactive process monitoring
sudo apt install htop -y

# Run htop
htop

# Press F10 to exit
```

### Step 6.3: Install Netdata (Optional but Recommended)

Netdata provides real-time performance monitoring.

```bash
# Install Netdata
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# During installation:
# - Anonymous statistics: Your choice
# - Accept default settings

# Netdata runs on port 19999
# Access at: http://YOUR_SERVER_IP:19999

# Secure Netdata (bind to localhost only)
sudo nano /etc/netdata/netdata.conf
```

**Find and modify:**
```conf
[web]
    bind to = localhost
```

```bash
# Restart Netdata
sudo systemctl restart netdata

# Now you can only access Netdata via SSH tunnel:
# ssh -L 19999:localhost:19999 armstrong@YOUR_SERVER_IP
# Then visit: http://localhost:19999
```

### Step 6.4: Set Up Uptime Monitoring

Sign up for a free monitoring service:

**UptimeRobot** (Recommended - Free)
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Sign up for free account
3. Add new monitor:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Armstrong Pricing Tool
   - **URL:** `https://pricing.yourdomain.com`
   - **Monitoring Interval:** 5 minutes
4. Set up alerts:
   - Email notification when down
   - Email notification when back up

**Alternative:** Pingdom, StatusCake, or Freshping

### Step 6.5: PM2 Monitoring

```bash
# View PM2 processes
pm2 status

# View real-time logs
pm2 logs armstrong-pricing

# View last 100 lines
pm2 logs armstrong-pricing --lines 100

# Monitor resources
pm2 monit

# Generate PM2 web dashboard (optional)
pm2 web
# Access at http://YOUR_SERVER_IP:9615
```

### Step 6.6: Create Monitoring Dashboard Script

```bash
# Create dashboard script
nano ~/monitor.sh
```

**Monitoring script:**
```bash
#!/bin/bash

echo "=== Armstrong Pricing Tool - System Status ==="
echo ""

echo "1. Application Status (PM2)"
pm2 status

echo ""
echo "2. Nginx Status"
sudo systemctl status nginx --no-pager | head -10

echo ""
echo "3. PostgreSQL Status"
sudo systemctl status postgresql --no-pager | head -10

echo ""
echo "4. Disk Usage"
df -h /

echo ""
echo "5. Memory Usage"
free -h

echo ""
echo "6. CPU Load"
uptime

echo ""
echo "7. Recent Application Logs (last 10 lines)"
pm2 logs armstrong-pricing --lines 10 --nostream

echo ""
echo "8. Recent Nginx Errors (last 5 lines)"
sudo tail -5 /var/log/nginx/armstrong_error.log

echo ""
echo "=== End of Status Report ==="
```

```bash
# Make executable
chmod +x ~/monitor.sh

# Run it
~/monitor.sh
```

---

## Phase 7: Security Hardening

**Time Required:** 1-2 hours  
**Day:** 3

### Step 7.1: Install and Configure Fail2Ban

Fail2Ban prevents brute-force attacks by banning IPs with multiple failed login attempts.

```bash
# Install Fail2Ban
sudo apt install fail2ban -y

# Create custom configuration
sudo nano /etc/fail2ban/jail.local
```

**Fail2Ban configuration:**
```ini
[DEFAULT]
# Ban for 1 hour
bantime = 3600
# Check for 3 failures within 10 minutes
findtime = 600
maxretry = 3
# Your email for ban notifications
destemail = admin@yourdomain.com
sendername = Fail2Ban
mta = sendmail
# Ban action (ban and send email)
action = %(action_mwl)s

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/armstrong_error.log

[nginx-noscript]
enabled = true
port = http,https
filter = nginx-noscript
logpath = /var/log/nginx/armstrong_access.log
maxretry = 6

[nginx-badbots]
enabled = true
port = http,https
filter = nginx-badbots
logpath = /var/log/nginx/armstrong_access.log
maxretry = 2

[nginx-noproxy]
enabled = true
port = http,https
filter = nginx-noproxy
logpath = /var/log/nginx/armstrong_access.log
maxretry = 2
```

```bash
# Start and enable Fail2Ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Check status
sudo fail2ban-client status

# Check specific jail
sudo fail2ban-client status sshd
```

### Step 7.2: Configure Automatic Security Updates

```bash
# Install unattended-upgrades
sudo apt install unattended-upgrades apt-listchanges -y

# Configure automatic updates
sudo dpkg-reconfigure -plow unattended-upgrades
# Select "Yes"

# Edit configuration for more control
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

**Recommended settings:**
```
// Automatically upgrade packages from security updates
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};

// Send email on errors
Unattended-Upgrade::Mail "admin@yourdomain.com";
Unattended-Upgrade::MailReport "on-change";

// Automatically reboot if needed
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "03:00";
```

### Step 7.3: Harden PostgreSQL

```bash
# Edit PostgreSQL authentication
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

**Ensure these settings:**
```
# Only allow local connections
local   all             postgres                                peer
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
```

```bash
# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Step 7.4: Change Default Application Passwords

**Method 1: Via Web Interface (After deployment)**
1. Login with default credentials
2. Navigate to profile/settings
3. Change password

**Method 2: Via Database**
```bash
# Generate new password hash
cd /var/www/armstrong-pricing-tool
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YOUR_NEW_PASSWORD', 10))"

# Update in database
psql -U armstrong_app -d armstrong_pricing_prod -h localhost

-- Update god mode password
UPDATE "User" 
SET "passwordHash" = '$2a$10$NEW_HASH_HERE'
WHERE email = 'admin@armstrong.com';

-- Repeat for other users
\q
```

### Step 7.5: Set Up Server Hardening

```bash
# Disable unnecessary services
sudo systemctl disable bluetooth.service
sudo systemctl disable cups.service

# Set proper file permissions
sudo chmod 700 /home/armstrong
sudo chmod 600 /var/www/armstrong-pricing-tool/.env.production

# Create swap file (if not already present)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Phase 8: Final Checks

**Time Required:** 30 minutes  
**Day:** 3

### Step 8.1: Verify All Services

```bash
# Check all services are running
sudo systemctl status postgresql --no-pager
sudo systemctl status nginx --no-pager
pm2 status

# Check listening ports
sudo netstat -tulpn | grep LISTEN

# Expected output should show:
# :80 (nginx)
# :443 (nginx)
# :3000 (node)
# :5432 (postgres)
```

### Step 8.2: Test Application Functionality

```bash
# Test HTTPS access
curl -I https://pricing.yourdomain.com
# Should return: HTTP/2 200

# Test login redirect
curl -L https://pricing.yourdomain.com/dashboard
# Should redirect to login

# Test API health (if implemented)
curl https://pricing.yourdomain.com/api/health
```

### Step 8.3: Test Database Backup

```bash
# Run backup manually
sudo /usr/local/bin/backup-database.sh

# Verify backup exists
ls -lh /var/backups/postgresql/

# Test restoration process
# Create test database
sudo -u postgres psql -c "CREATE DATABASE armstrong_test;"

# Restore backup to test database
gunzip -c /var/backups/postgresql/armstrong_*.sql.gz | sudo -u postgres psql armstrong_test

# Verify data
sudo -u postgres psql armstrong_test -c "SELECT COUNT(*) FROM \"User\";"

# Drop test database
sudo -u postgres psql -c "DROP DATABASE armstrong_test;"
```

### Step 8.4: Verify SSL/HTTPS

```bash
# Test SSL certificate
openssl s_client -connect pricing.yourdomain.com:443 -servername pricing.yourdomain.com < /dev/null

# Should show certificate details

# Test SSL grade at:
# https://www.ssllabs.com/ssltest/
# Target: A or A+ rating
```

### Step 8.5: Security Scan

```bash
# Install Lynis security auditing tool
sudo apt install lynis -y

# Run security audit
sudo lynis audit system

# Review suggestions and implement critical ones
```

### Step 8.6: Performance Test

```bash
# Install Apache Bench for load testing
sudo apt install apache2-utils -y

# Run basic load test (100 requests, 10 concurrent)
ab -n 100 -c 10 https://pricing.yourdomain.com/

# Review results:
# - Requests per second
# - Time per request
# - Failed requests (should be 0)
```

---

## Deployment Checklist

Print and check off each item as you complete it.

### Infrastructure ✓
- [ ] VPS provisioned (4GB RAM, 50GB SSD)
- [ ] Ubuntu 22.04 LTS installed
- [ ] Non-root user created (armstrong)
- [ ] SSH key authentication enabled
- [ ] Password authentication disabled
- [ ] Root login disabled
- [ ] UFW firewall configured
- [ ] Ports 22, 80, 443 open
- [ ] Domain DNS configured

### Database ✓
- [ ] PostgreSQL 16 installed
- [ ] Production database created
- [ ] Application user created with strong password
- [ ] Database privileges granted
- [ ] PostgreSQL tuned for production
- [ ] Automated daily backups configured
- [ ] Backup tested and verified
- [ ] Backup restoration tested

### Application ✓
- [ ] Node.js 20 LTS installed
- [ ] PM2 process manager installed
- [ ] Code cloned from GitHub
- [ ] Dependencies installed
- [ ] .env.production configured
- [ ] NEXTAUTH_SECRET generated (32+ characters)
- [ ] Database URL configured
- [ ] NEXTAUTH_URL set to production domain
- [ ] Production build successful
- [ ] Database migrated (db:push)
- [ ] Database seeded
- [ ] PM2 ecosystem configured
- [ ] Application started with PM2
- [ ] Cluster mode enabled (2 instances)
- [ ] PM2 startup script enabled
- [ ] Application accessible on localhost:3000

### Web Server ✓
- [ ] Nginx installed
- [ ] Reverse proxy configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Nginx configuration tested
- [ ] Application accessible via Nginx
- [ ] Default site disabled

### SSL/HTTPS ✓
- [ ] Certbot installed
- [ ] SSL certificate obtained
- [ ] HTTPS working
- [ ] HTTP → HTTPS redirect enabled
- [ ] SSL certificate auto-renewal configured
- [ ] Auto-renewal tested (dry run)
- [ ] SSL strength verified (A/A+ rating)
- [ ] HSTS header configured

### Security ✓
- [ ] All default passwords changed
- [ ] God mode password changed
- [ ] Admin user passwords changed
- [ ] Regular user passwords changed
- [ ] Fail2Ban installed and configured
- [ ] Automatic security updates enabled
- [ ] PostgreSQL hardened
- [ ] File permissions set correctly
- [ ] Swap file configured
- [ ] Lynis security audit completed

### Monitoring ✓
- [ ] PM2 monitoring active
- [ ] Log rotation configured
- [ ] Htop installed
- [ ] Netdata installed (optional)
- [ ] Uptime monitoring configured (UptimeRobot)
- [ ] Alert email configured
- [ ] Monitoring dashboard script created
- [ ] Log locations documented

### Testing ✓
- [ ] Application accessible via HTTPS
- [ ] Login works with all user roles
- [ ] All 4 calculators functional
- [ ] Quote creation tested
- [ ] Quote editing tested
- [ ] Quote deletion tested
- [ ] Pagination works
- [ ] Business type toggle works
- [ ] God mode sees all tenants
- [ ] Admin scoped to tenant
- [ ] User scoped to tenant
- [ ] Database backup verified
- [ ] Backup restoration tested
- [ ] Load test completed
- [ ] No errors in logs

### Documentation ✓
- [ ] Admin credentials documented (securely)
- [ ] Database credentials documented
- [ ] Backup location documented
- [ ] Deployment process documented
- [ ] Update procedure documented
- [ ] Rollback procedure documented
- [ ] Support contacts defined
- [ ] Monitoring URLs noted

---

## Maintenance & Operations

### Daily Tasks

```bash
# Check application status
pm2 status

# Check for errors in logs
pm2 logs armstrong-pricing --lines 50 --err

# Check Nginx errors
sudo tail -50 /var/log/nginx/armstrong_error.log

# Check system resources
htop
```

### Weekly Tasks

```bash
# Review backup logs
cat /var/log/postgresql-backup.log

# Check disk usage
df -h

# Review Fail2Ban bans
sudo fail2ban-client status sshd

# Check for security updates
sudo apt update
sudo apt list --upgradable
```

### Monthly Tasks

```bash
# Review full application logs
pm2 logs armstrong-pricing --lines 1000

# Rotate logs manually if needed
pm2 flush

# Check SSL certificate expiry
sudo certbot certificates

# Review uptime statistics
# Check UptimeRobot dashboard

# Review database size
sudo -u postgres psql armstrong_pricing_prod -c "\dt+"
```

### Updating the Application

```bash
# Navigate to application directory
cd /var/www/armstrong-pricing-tool

# Pull latest changes
git pull origin main

# Install any new dependencies
npm ci --production=false

# Run database migrations (if any)
npm run db:push

# Rebuild application
npm run build

# Restart PM2
pm2 restart armstrong-pricing

# Check for errors
pm2 logs armstrong-pricing --lines 50
```

### Scaling Up

**If you need more performance:**

1. **Upgrade VPS**
   - Increase to 8GB RAM
   - Add more CPU cores
   - Increase PM2 instances

2. **Add Database Connection Pooling**
   - Configure Prisma connection pool
   - Consider PgBouncer

3. **Enable Caching**
   - Add Redis for session storage
   - Configure Nginx caching
   - Enable Next.js incremental static regeneration

4. **Add Load Balancer**
   - Set up multiple application servers
   - Configure Nginx load balancing
   - Consider managed load balancer

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs armstrong-pricing

# Common issues:
# - Database connection failed → Check DATABASE_URL
# - Port already in use → Check with: sudo lsof -i :3000
# - Build failed → Check build logs: npm run build

# Restart application
pm2 restart armstrong-pricing

# If still not working, rebuild
cd /var/www/armstrong-pricing-tool
npm run build
pm2 restart armstrong-pricing
```

### Database Connection Errors

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test database connection
psql -U armstrong_app -d armstrong_pricing_prod -h localhost

# Check connection string in .env.production
cat .env.production | grep DATABASE_URL

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Nginx Errors

```bash
# Check Nginx configuration
sudo nginx -t

# Check Nginx error logs
sudo tail -100 /var/log/nginx/armstrong_error.log

# Check if Nginx is running
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx

# If port 80/443 is blocked
sudo ufw allow http
sudo ufw allow https
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew --force-renewal

# Check auto-renewal
sudo systemctl status certbot.timer

# Enable auto-renewal if disabled
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### High CPU/Memory Usage

```bash
# Check resource usage
htop

# Check PM2 memory
pm2 status

# If memory is high, restart PM2 instances
pm2 restart armstrong-pricing

# Check for memory leaks in logs
pm2 logs armstrong-pricing | grep -i "memory\|heap"

# Consider upgrading server or optimizing queries
```

### Backup Failed

```bash
# Check backup logs
cat /var/log/postgresql-backup.log

# Check backup directory permissions
ls -la /var/backups/postgresql/

# Test backup manually
sudo /usr/local/bin/backup-database.sh

# Check disk space
df -h

# If disk full, clean old logs
sudo journalctl --vacuum-time=7d
```

### Application Running Slow

```bash
# Check database queries
# Enable PostgreSQL slow query log
sudo nano /etc/postgresql/16/main/postgresql.conf
# Add: log_min_duration_statement = 1000  # Log queries over 1 second

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check slow queries
sudo tail -100 /var/log/postgresql/postgresql-16-main.log

# Optimize database
sudo -u postgres vacuumdb --analyze armstrong_pricing_prod

# Check Nginx access log for slow requests
sudo tail -100 /var/log/nginx/armstrong_access.log
```

---

## Rollback Procedure

If deployment fails or breaks production:

```bash
# Option 1: Rollback to previous git commit
cd /var/www/armstrong-pricing-tool
git log --oneline  # Find last working commit
git checkout COMMIT_HASH
npm ci
npm run build
pm2 restart armstrong-pricing

# Option 2: Restore database from backup
# Stop application
pm2 stop armstrong-pricing

# Restore database
sudo -u postgres psql -d armstrong_pricing_prod < /var/backups/postgresql/BACKUP_FILE.sql

# Restart application
pm2 start armstrong-pricing

# Option 3: Full system restore (last resort)
# Restore server from VPS snapshot
# Re-run deployment from Phase 3
```

---

## Cost Breakdown

### Monthly Costs

| Service | Plan | Cost |
|---------|------|------|
| DigitalOcean Droplet | 4GB RAM, 2 vCPU | $24/month |
| Domain Name | .com TLD | ~$1/month ($12/year) |
| SSL Certificate | Let's Encrypt | FREE |
| Uptime Monitoring | UptimeRobot Free | FREE |
| **Total** | | **~$25/month** |

### Optional Add-ons

| Service | Purpose | Cost |
|---------|---------|------|
| Managed PostgreSQL | Offload DB management | +$15/month |
| CloudFlare Pro | CDN + DDoS protection | +$20/month |
| Sentry | Error tracking | FREE tier available |
| S3 Storage | Offsite backups | ~$1-5/month |
| Professional Monitoring | Datadog, New Relic | $15-100/month |

---

## Support & Resources

### Official Documentation
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- NextAuth: https://next-auth.js.org
- PostgreSQL: https://www.postgresql.org/docs

### Community Support
- Next.js Discord: https://discord.gg/nextjs
- Stack Overflow: Tag questions with `nextjs`, `prisma`, `postgresql`

### Server Management
- DigitalOcean Tutorials: https://www.digitalocean.com/community/tutorials
- Ubuntu Documentation: https://help.ubuntu.com
- Nginx Documentation: https://nginx.org/en/docs

---

## Conclusion

**Congratulations!** 🎉

You now have a production-grade deployment of the Armstrong Pricing Tool with:

✅ **Security**: SSL/HTTPS, Fail2Ban, automatic updates, hardened configuration  
✅ **Reliability**: Automated backups, PM2 process management, cluster mode  
✅ **Monitoring**: Uptime monitoring, log rotation, performance tracking  
✅ **Scalability**: Nginx reverse proxy, connection pooling, ready to scale  
✅ **Maintainability**: Clear documentation, update procedures, rollback plan  

Your application is now ready for business-critical use!

**Next Steps:**
1. Change all default passwords immediately
2. Set up regular monitoring checks
3. Document your admin procedures
4. Train your users
5. Set up a support process

**Remember:**
- Check logs daily for the first week
- Monitor uptime and performance
- Keep security updates current
- Test your backups monthly

Good luck with your deployment! 🚀
