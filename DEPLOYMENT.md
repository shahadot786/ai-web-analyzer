# Deployment Guide

Complete guide for deploying AI Web Analyzer to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Backend Deployment](#backend-deployment)
- [Frontend Deployment](#frontend-deployment)
- [Database Setup (Optional)](#database-setup-optional)
- [SSL/HTTPS Configuration](#sslhttps-configuration)
- [Monitoring & Logging](#monitoring--logging)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+ and npm
- A server or cloud platform (AWS, DigitalOcean, Heroku, Vercel, etc.)
- Domain name (optional but recommended)
- Google Gemini API key
- SSL certificate (for HTTPS)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/ai-web-analyzer.git
cd ai-web-analyzer
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install
npm run build

# Frontend
cd ../frontend
npm install
npm run build
```

## Backend Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create Heroku App**:
   ```bash
   cd backend
   heroku create ai-web-analyzer-api
   ```

4. **Set Environment Variables**:
   ```bash
   heroku config:set GEMINI_API_KEY=your_api_key_here
   heroku config:set NODE_ENV=production
   heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
   ```

5. **Deploy**:
   ```bash
   git push heroku main
   ```

### Option 2: Deploy to DigitalOcean/AWS

1. **Create a Droplet/EC2 Instance**:
   - Ubuntu 22.04 LTS
   - At least 2GB RAM
   - SSH access enabled

2. **Connect via SSH**:
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Node.js**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2** (Process Manager):
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone and Setup**:
   ```bash
   git clone https://github.com/yourusername/ai-web-analyzer.git
   cd ai-web-analyzer/backend
   npm install
   npm run build
   ```

6. **Create Environment File**:
   ```bash
   nano .env
   ```
   
   Add:
   ```env
   PORT=3001
   GEMINI_API_KEY=your_api_key_here
   CORS_ORIGIN=https://your-frontend-domain.com
   NODE_ENV=production
   ```

7. **Start with PM2**:
   ```bash
   pm2 start dist/server.js --name ai-web-analyzer-api
   pm2 save
   pm2 startup
   ```

8. **Configure Nginx** (Reverse Proxy):
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/ai-web-analyzer-api
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /ws {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "Upgrade";
           proxy_set_header Host $host;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/ai-web-analyzer-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Frontend Deployment

### Option 1: Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd frontend
   vercel --prod
   ```

4. **Set Environment Variables** (in Vercel Dashboard):
   - `VITE_API_URL`: Your backend API URL

### Option 2: Deploy to Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build**:
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Option 3: Self-Host with Nginx

1. **Build Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Copy to Server**:
   ```bash
   scp -r dist/* root@your-server-ip:/var/www/ai-web-analyzer
   ```

3. **Configure Nginx**:
   ```bash
   sudo nano /etc/nginx/sites-available/ai-web-analyzer
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/ai-web-analyzer;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable:
   ```bash
   sudo ln -s /etc/nginx/sites-available/ai-web-analyzer /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## SSL/HTTPS Configuration

### Using Let's Encrypt (Free)

1. **Install Certbot**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Get Certificate**:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   sudo certbot --nginx -d api.yourdomain.com
   ```

3. **Auto-Renewal**:
   ```bash
   sudo certbot renew --dry-run
   ```

## Database Setup (Optional)

For production, replace in-memory storage with a database:

### Using MongoDB

1. **Install MongoDB**:
   ```bash
   sudo apt install mongodb
   ```

2. **Update Backend**:
   - Install mongoose: `npm install mongoose`
   - Create models for scrape results
   - Update routes to use database

### Using PostgreSQL

1. **Install PostgreSQL**:
   ```bash
   sudo apt install postgresql postgresql-contrib
   ```

2. **Create Database**:
   ```bash
   sudo -u postgres createdb ai_web_analyzer
   ```

3. **Update Backend**:
   - Install pg: `npm install pg`
   - Create schema and migrations
   - Update services to use database

## Monitoring & Logging

### PM2 Monitoring

```bash
# View logs
pm2 logs ai-web-analyzer-api

# Monitor resources
pm2 monit

# View status
pm2 status
```

### Setup Log Rotation

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Application Monitoring

Consider using:
- **Sentry** for error tracking
- **New Relic** for performance monitoring
- **LogRocket** for session replay

## Performance Optimization

### 1. Enable Gzip Compression

In Nginx config:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### 2. Cache Static Assets

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Rate Limiting

Already implemented in the backend. Adjust as needed in `server.ts`.

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] API key not exposed in frontend
- [ ] Regular security updates
- [ ] Firewall configured
- [ ] SSH key authentication only

## Troubleshooting

### Backend Not Starting

```bash
# Check logs
pm2 logs ai-web-analyzer-api

# Check if port is in use
sudo lsof -i :3001

# Restart service
pm2 restart ai-web-analyzer-api
```

### Frontend Build Errors

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install
npm run build
```

### WebSocket Connection Issues

- Ensure Nginx is configured for WebSocket upgrade
- Check firewall allows WebSocket connections
- Verify CORS settings include WebSocket origin

### Playwright/Puppeteer Issues

```bash
# Install dependencies
npx playwright install-deps chromium
```

## Backup Strategy

### Automated Backups

```bash
# Create backup script
nano /home/backup.sh
```

Add:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf /backups/ai-web-analyzer-$DATE.tar.gz /var/www/ai-web-analyzer
# If using database, add database dump here
```

Make executable and add to cron:
```bash
chmod +x /home/backup.sh
crontab -e
# Add: 0 2 * * * /home/backup.sh
```

## Scaling Considerations

### Horizontal Scaling

- Use load balancer (Nginx, HAProxy)
- Deploy multiple backend instances
- Use Redis for session management
- Implement database connection pooling

### Vertical Scaling

- Increase server resources (RAM, CPU)
- Optimize database queries
- Implement caching (Redis)
- Use CDN for static assets

## Support

For deployment issues:
- Check logs first
- Review environment variables
- Verify all dependencies installed
- Consult documentation
- Open GitHub issue if needed

---

**Congratulations!** Your AI Web Analyzer is now deployed and ready for production use! 🎉
