# SSL/HTTPS Configuration for Armstrong Pricing Tool

## Overview
This document describes the SSL/HTTPS setup for the Armstrong Pricing Tool deployed on armstrong-vps (10.105.0.211).

## Architecture

```
Visitor → [HTTPS - Cloudflare SSL] → Cloudflare CDN → [HTTPS - Self-Signed] → Nginx → Node.js App (port 3001)
```

## SSL Certificate Details

### Type: Self-Signed Certificate
- **Location**: 
  - Certificate: `/etc/ssl/certs/appstage.goarmstrong.com.crt`
  - Private Key: `/etc/ssl/private/appstage.goarmstrong.com.key`
- **Valid From**: April 21, 2026
- **Valid Until**: April 18, 2036 (10 years)
- **Subject**: C=US, ST=Texas, L=Dallas, O=Armstrong, CN=appstage.goarmstrong.com
- **Key Type**: RSA 2048-bit

### Why Self-Signed?
The domain `appstage.goarmstrong.com` is proxied through Cloudflare, which prevents Let's Encrypt from directly accessing the server for certificate validation. A self-signed certificate is appropriate for this setup because:
1. Cloudflare terminates SSL for visitors (providing valid, trusted certificates)
2. Traffic between Cloudflare and the origin server is encrypted with the self-signed cert
3. This is a standard and secure configuration for Cloudflare-proxied sites

## Nginx Configuration

### File: `/etc/nginx/nginx.conf`

#### HTTPS Server Block (appstage.goarmstrong.com)
```nginx
server {
    listen 443 ssl http2;
    server_name appstage.goarmstrong.com;
    
    ssl_certificate /etc/ssl/certs/appstage.goarmstrong.com.crt;
    ssl_certificate_key /etc/ssl/private/appstage.goarmstrong.com.key;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### HTTP to HTTPS Redirect
```nginx
server {
    listen 80;
    server_name appstage.goarmstrong.com;
    return 301 https://$server_name$request_uri;
}
```

#### Direct IP Access
```nginx
server {
    listen 80 default_server;
    listen 443 ssl http2 default_server;
    server_name 10.105.0.211 _;
    
    ssl_certificate /etc/ssl/certs/appstage.goarmstrong.com.crt;
    ssl_certificate_key /etc/ssl/private/appstage.goarmstrong.com.key;
}
```

### SSL Configuration
```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
```

## Application Configuration

### Environment Variables (`.env.production`)
```bash
NEXTAUTH_URL="https://appstage.goarmstrong.com"
AUTH_TRUST_HOST=true
NODE_ENV="production"
```

### NextAuth.js
- Configured to use HTTPS
- Secure cookies enabled (__Host- and __Secure- prefixes)
- Redirects IP access to canonical domain

## Cloudflare Configuration

⚠️ **CRITICAL REQUIREMENT** ⚠️

For this setup to work properly, the Cloudflare SSL/TLS mode must be set correctly:

### Required Settings:
1. Go to Cloudflare Dashboard → SSL/TLS → Overview
2. Set SSL/TLS encryption mode to: **"Full"**
   - NOT "Flexible" (would create redirect loop)
   - "Full Strict" won't work with self-signed certificates

### DNS Settings:
- `appstage.goarmstrong.com` → A record → Cloudflare IPs (Proxied - Orange Cloud)
- This enables Cloudflare's CDN and DDoS protection

## Access URLs

### Primary (Recommended):
- **HTTPS**: https://appstage.goarmstrong.com ✅
- **HTTP**: http://appstage.goarmstrong.com (redirects to HTTPS)

### Direct IP Access:
- **HTTP**: http://10.105.0.211 (NextAuth redirects to canonical domain)
- **HTTPS**: https://10.105.0.211 (NextAuth redirects to canonical domain)

### Local/Internal:
- **Direct to App**: http://localhost:3001 (bypasses Nginx)

## Testing SSL

### Test from server:
```bash
curl -I -k https://localhost
curl -I https://appstage.goarmstrong.com
openssl x509 -in /etc/ssl/certs/appstage.goarmstrong.com.crt -noout -text
```

### Test from browser:
1. Visit https://appstage.goarmstrong.com
2. Check for valid Cloudflare SSL certificate
3. Verify redirect from HTTP to HTTPS works

## Troubleshooting

### Issue: "UntrustedHost" Error
**Solution**: Ensure `AUTH_TRUST_HOST=true` is set in `.env.production`

### Issue: Certificate Warnings in Browser
**Expected**: The self-signed certificate is only between Cloudflare and your server. Browsers see Cloudflare's valid certificate.

### Issue: Infinite Redirect Loop
**Solution**: Check Cloudflare SSL mode is set to "Full", not "Flexible"

### Issue: SSL Handshake Failure
**Solution**: Verify certificate files exist and have correct permissions:
```bash
sudo ls -la /etc/ssl/certs/appstage.goarmstrong.com.crt
sudo ls -la /etc/ssl/private/appstage.goarmstrong.com.key
```

## Maintenance

### Certificate Renewal
The self-signed certificate is valid for 10 years (until 2036). To regenerate:

```bash
sudo openssl req -x509 -nodes -days 3650 \
  -newkey rsa:2048 \
  -keyout /etc/ssl/private/appstage.goarmstrong.com.key \
  -out /etc/ssl/certs/appstage.goarmstrong.com.crt \
  -subj '/C=US/ST=Texas/L=Dallas/O=Armstrong/CN=appstage.goarmstrong.com'

sudo chmod 600 /etc/ssl/private/appstage.goarmstrong.com.key
sudo chmod 644 /etc/ssl/certs/appstage.goarmstrong.com.crt
sudo systemctl reload nginx
```

### Nginx Reload
After configuration changes:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo nginx -t
```

## Security Considerations

### What's Secure:
✅ TLS 1.2 and 1.3 only
✅ Strong cipher suites (ECDHE with AES-GCM)
✅ HTTPS enforced (HTTP redirects)
✅ Secure cookies (HttpOnly, Secure, SameSite)
✅ Cloudflare DDoS protection
✅ End-to-end encryption (visitor to server)

### Firewall:
- Port 443 (HTTPS): Open ✅
- Port 80 (HTTP): Open (redirects to HTTPS) ✅
- Port 3001: Internal only ✅

## Alternative: Cloudflare Origin Certificate

If you gain access to the Cloudflare dashboard, you can use a Cloudflare Origin Certificate instead:

1. Cloudflare Dashboard → SSL/TLS → Origin Server
2. Create Certificate (15-year validity)
3. Download certificate and private key
4. Replace self-signed certificate with Cloudflare Origin Certificate
5. Set Cloudflare SSL mode to "Full Strict"

This provides the same security but with a Cloudflare-signed certificate.

## Summary

The current setup provides:
- ✅ Full HTTPS encryption (visitor to server)
- ✅ Valid SSL certificate for visitors (via Cloudflare)
- ✅ Secure cookie handling
- ✅ HTTP to HTTPS redirection
- ✅ DDoS protection (via Cloudflare)
- ✅ Access via domain name and direct IP

**Status**: Production-ready, pending Cloudflare SSL mode verification

---
*Last Updated: April 21, 2026*
*Server: armstrong-vps (10.105.0.211)*
*Application: Armstrong Pricing Tool*
