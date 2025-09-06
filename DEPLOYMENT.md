# Deployment Guide for Render

This guide will help you deploy your Dumb CRM application to Render using the included `render.yaml` configuration.

## Prerequisites

1. GitHub repository with your code
2. Render account (free tier available)
3. All code pushed to your repository

## 🚀 One-Click Deployment with render.yaml

The easiest way to deploy is using the included `render.yaml` configuration file:

### Step 1: Connect Repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click "Apply" to deploy all services

This will automatically create:
- ✅ PostgreSQL database
- ✅ Backend web service
- ✅ Frontend static site
- ✅ All environment variables
- ✅ Proper service connections

## 📋 Manual Deployment (Alternative)

If you prefer manual setup or need to customize the deployment:

### Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Configure:
   - **Name**: `dumb-crm-db`
   - **Plan**: Free
   - **Region**: Choose closest to your users (Frankfurt recommended)
4. Click "Create Database"
5. **Copy the Internal Database URL** (you'll need this later)

### Step 2: Deploy Backend

1. Go to Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `dumb-crm`
   - **Root Directory**: `/` (leave empty for root)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run deploy:build`
   - **Start Command**: `npm start`
   - **Node Version**: 18
   - **Auto-Deploy**: Yes (for automatic redeployments)
   - **Region**: Frankfurt (or your preferred region)
4. Add Environment Variables:
   - **DATABASE_URL**: Paste the PostgreSQL URL from Step 1
   - **NODE_ENV**: `production`
   - **JWT_SECRET**: (Render will auto-generate this)
5. Click "Create Web Service"

### Step 3: Deploy Frontend

1. Go to Render Dashboard → "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `dumb-crm-frontend`
   - **Root Directory**: `/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Region**: Frankfurt (or your preferred region)
4. Add Environment Variables:
   - **VITE_API_URL**: `https://dumb-crm.onrender.com` (replace with your actual backend URL)
5. Click "Create Static Site"

## 🔧 Environment Variables

### Backend Environment Variables
```
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
JWT_SECRET=auto-generated-by-render
```

### Frontend Environment Variables
```
VITE_API_URL=https://your-backend-service.onrender.com
```

## 🧪 Testing Your Deployment

After deployment, test the following features:

### 1. Health Check
- Visit: `https://your-backend.onrender.com/health`
- Should return: `{"status":"ok","timestamp":"...","uptime":...}`

### 2. API Information
- Visit: `https://your-backend.onrender.com/`
- Should return API information with available endpoints

### 3. Frontend Application
- Visit: `https://your-frontend.onrender.com/`
- Should show the login page
- Test login with default admin credentials:
  - **Email**: `admin@dumbcrm.com`
  - **Password**: `admin123`

### 4. Full CRM Functionality
- ✅ Dashboard loads with statistics
- ✅ Can create/edit/delete customers
- ✅ Can create/edit/delete contacts
- ✅ Can create/edit/delete deals
- ✅ Search functionality works
- ✅ User management (admin only)
- ✅ Authentication and logout

## 🔍 Troubleshooting

### Common Issues

#### Database Tables Not Created
**Symptoms**: API returns 500 errors, database connection issues
**Solution**: 
1. Check backend build logs for Prisma generation
2. Look for "Database tables created" messages in start logs
3. Redeploy if necessary - tables are created on first startup

#### CORS Errors
**Symptoms**: Frontend can't connect to backend, CORS policy errors
**Solution**:
1. Verify `VITE_API_URL` points to correct backend URL
2. Check backend CORS configuration in `main.js`
3. Ensure both services are in the same region

#### Authentication Issues
**Symptoms**: Login fails, infinite redirects, "Internet not available"
**Solution**:
1. Check JWT_SECRET is set in backend environment
2. Verify cookie settings in production
3. Clear browser cache and cookies
4. Check for rate limiting (wait 15-60 minutes if blocked)

#### Frontend Routing Issues
**Symptoms**: 404 errors on page refresh, routes not working
**Solution**:
1. Verify `_redirects` file is in `frontend/public/`
2. Check static site configuration
3. Ensure all routes are properly configured

### Backend Issues
- **Build Failures**: Check Node.js version (18+), npm install logs
- **Start Failures**: Verify DATABASE_URL format, check Prisma generation
- **Runtime Errors**: Check application logs, verify environment variables

### Frontend Issues
- **Build Failures**: Check Vite configuration, dependency installation
- **Runtime Errors**: Check browser console, verify API URL
- **Styling Issues**: Verify Tailwind CSS build, check for missing dependencies

### Database Issues
- **Connection Errors**: Verify DATABASE_URL format and credentials
- **Permission Errors**: Check database user permissions
- **Schema Issues**: Verify Prisma migrations are applied

## 📊 Monitoring and Maintenance

### Health Monitoring
- **Backend Health**: `https://your-backend.onrender.com/health`
- **Render Dashboard**: Monitor service status and logs
- **Database Usage**: Check storage and connection limits

### Logs and Debugging
- **Backend Logs**: Available in Render Dashboard → Your Service → Logs
- **Frontend Logs**: Check browser developer console
- **Database Logs**: Available in Render Dashboard → Database → Logs

### Performance Optimization
- **Free Tier Limits**: Backend sleeps after 15 minutes of inactivity
- **Database Limits**: 1GB storage on free tier
- **CDN**: Frontend is automatically served via CDN

## 🔄 Updates and Redeployment

### Automatic Updates
- **Auto-Deploy**: Enabled by default - pushes to main branch trigger redeployment
- **Manual Deploy**: Available in Render Dashboard → Deploy → Deploy Latest Commit

### Environment Variable Updates
1. Go to service settings in Render Dashboard
2. Update environment variables
3. Redeploy the service

### Database Migrations
- **Automatic**: Migrations run during deployment via `deploy:build` script
- **Manual**: Not available on free tier (use paid plan for shell access)

## 🆓 Free Tier Limitations

### Backend Service
- **Sleep**: After 15 minutes of inactivity
- **Cold Start**: ~30 seconds to wake up
- **Build Time**: Limited to 90 minutes
- **Logs**: 7 days retention

### Database
- **Storage**: 1GB limit
- **Connections**: 20 concurrent connections
- **Backups**: 7 days retention

### Frontend
- **Bandwidth**: 100GB/month
- **Build Time**: 90 minutes
- **Custom Domains**: Supported

## 🎯 Production Recommendations

### For Production Use
1. **Upgrade to Paid Plan**: For better performance and reliability
2. **Custom Domain**: Set up your own domain
3. **SSL Certificate**: Automatically provided by Render
4. **Monitoring**: Set up alerts for downtime
5. **Backups**: Regular database backups
6. **Security**: Change default admin password immediately

### Scaling Considerations
- **Database**: Consider managed PostgreSQL for high traffic
- **Caching**: Add Redis for session storage and caching
- **CDN**: Frontend is already served via global CDN
- **Load Balancing**: Available on paid plans

## 🆘 Support

### Render Support
- **Documentation**: [Render Docs](https://render.com/docs)
- **Community**: [Render Community](https://community.render.com)
- **Status**: [Render Status](https://status.render.com)

### Application Support
- **Issues**: Create GitHub issues for bugs
- **Features**: Submit feature requests via GitHub
- **Documentation**: Check this README and code comments

---

**Your CRM will be live and accessible once deployed! 🚀**

**Live URLs:**
- **Frontend**: `https://your-frontend.onrender.com`
- **Backend API**: `https://your-backend.onrender.com`
- **Health Check**: `https://your-backend.onrender.com/health`