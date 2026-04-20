# Armstrong Pricing Tool - Production Checklist

## ✅ Pre-Deployment Checklist

### 1. Security
- [ ] Change all default passwords (admin@armstrong.com, manager@location1.com, user@location1.com)
- [ ] Generate strong NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Update .env.production with secure credentials
- [ ] Remove or secure any test accounts
- [ ] Set up database user with limited privileges
- [ ] Enable SSL/HTTPS
- [ ] Configure CORS if needed

### 2. Database
- [ ] Set up production PostgreSQL database
- [ ] Run migrations: `npm run db:push`
- [ ] Seed initial data: `npm run db:seed`
- [ ] Configure automated backups
- [ ] Set up connection pooling
- [ ] Test database connectivity

### 3. Environment
- [ ] Set NODE_ENV=production
- [ ] Configure NEXTAUTH_URL with production domain
- [ ] Update DATABASE_URL with production credentials
- [ ] Verify all environment variables are set
- [ ] Test with production .env file locally

### 4. Application
- [ ] Run production build: `npm run build`
- [ ] Test production build locally: `npm start`
- [ ] Verify all calculators work correctly
- [ ] Test authentication flow
- [ ] Test god mode vs admin vs user permissions
- [ ] Check responsive design on mobile/tablet
- [ ] Test all navigation links

### 5. Deployment Platform
- [ ] Choose deployment method (Vercel, VPS, Docker, etc.)
- [ ] Set up domain name and DNS
- [ ] Configure CI/CD if applicable
- [ ] Set up monitoring/alerting
- [ ] Configure log aggregation
- [ ] Set up error tracking (Sentry, etc.)

### 6. Post-Deployment
- [ ] Verify app is accessible at production URL
- [ ] Test login with all user roles
- [ ] Create first production admin user
- [ ] Set up regular database backups
- [ ] Document admin procedures
- [ ] Train initial users
- [ ] Set up support process

---

## 🚀 Quick Deployment Commands

### Vercel
```bash
npm install -g vercel
vercel login
vercel  # Follow prompts
```

### VPS (Ubuntu)
```bash
# On server
git clone YOUR_REPO
cd armstrong-pricing-tool
npm install
npm run build
npm run db:push
npm run db:seed
pm2 start npm --name "armstrong-pricing" -- start
```

---

## 🔐 Initial User Setup

After deployment, immediately:

1. **Login as God Mode**
   ```
   Email: admin@armstrong.com
   Password: admin123
   ```

2. **Change God Mode Password**
   - Go to profile settings (future feature)
   - Or update via database:
   ```bash
   npm run hash-password YOUR_NEW_PASSWORD
   # Copy the hash and update in database
   ```

3. **Create Production Tenants**
   - Create real tenants for each partner
   - Assign locations to tenants
   - Create admin users for each tenant

4. **Delete Test Data**
   - Remove test users
   - Remove sample quotes (if any)
   - Keep cost templates

---

## 📊 Monitoring Endpoints

### Health Check
- URL: `https://your-domain.com/api/health` (to be implemented)
- Expected: 200 OK

### Database Check
```bash
# Test database connectivity
psql $DATABASE_URL
```

---

## 🆘 Rollback Plan

If deployment fails:

1. **Vercel**: Use dashboard to rollback to previous deployment
2. **VPS**: 
   ```bash
   cd armstrong-pricing-tool
   git checkout PREVIOUS_COMMIT
   npm install
   npm run build
   pm2 restart armstrong-pricing
   ```

---

## 📞 Support Contacts

- **Technical Issues**: [Your IT Contact]
- **Database Issues**: [Your DBA Contact]
- **User Access**: [Your Admin Contact]

---

## 🎯 Success Criteria

Deployment is successful when:
- ✅ App is accessible via HTTPS
- ✅ All users can login
- ✅ All calculators produce correct results
- ✅ Database is backed up
- ✅ Monitoring is active
- ✅ God mode user can see all tenants
- ✅ Regular users are scoped to their tenant

---

## 📝 Post-Launch Tasks

Within first week:
- [ ] Monitor error logs daily
- [ ] Collect user feedback
- [ ] Document any issues
- [ ] Plan first update/patch
- [ ] Review security logs
- [ ] Verify backup restoration process

---

**Ready to deploy? Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions!**
