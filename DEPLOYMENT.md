# Deployment Guide for Render

This guide will help you deploy your Dumb CRM application to Render.

## Prerequisites

1. GitHub repository with your code
2. Render account (free tier available)

## Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Configure:
   - **Name**: `dumb-crm-db`
   - **Plan**: Free
   - **Region**: Choose closest to your users
4. Click "Create Database"
5. **Copy the Internal Database URL** (you'll need this later)

## Step 2: Deploy Backend

1. Go to Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `dumb-crm-backend`
   - **Root Directory**: `/` (leave empty for root)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18
   - **Auto-Deploy**: Yes (for automatic redeployments)
4. Add Environment Variables:
   - **DATABASE_URL**: Paste the PostgreSQL URL from Step 1
   - **NODE_ENV**: `production`
5. Click "Create Web Service"

## Step 3: Deploy Frontend

1. Go to Render Dashboard → "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `dumb-crm-frontend`
   - **Root Directory**: `/frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variables:
   - **VITE_API_URL**: `https://dumb-crm-backend.onrender.com` (replace with your actual backend URL)
5. Click "Create Static Site"

## Step 4: Update Frontend Environment

After your backend is deployed:

1. Go to your backend service in Render Dashboard
2. Copy the URL (e.g., `https://dumb-crm-backend.onrender.com`)
3. Go to your frontend service settings
4. Update the **VITE_API_URL** environment variable with your backend URL
5. Redeploy the frontend

## Step 5: Test Your Deployment

1. Visit your frontend URL (e.g., `https://dumb-crm-frontend.onrender.com`)
2. Test the following features:
   - Dashboard loads with statistics
   - Can create/edit/delete customers
   - Can create/edit/delete contacts
   - Can create/edit/delete deals
   - Search functionality works

## Environment Variables Summary

### Backend
```
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

### Frontend
```
VITE_API_URL=https://your-backend-service.onrender.com
```

## Troubleshooting

### Database Tables Not Created
If you see errors like "table does not exist":
1. **Check Build Logs**: Look for Prisma generation and database push errors
2. **Manual Database Push**: In Render dashboard, go to your backend service → Shell
3. **Run Commands**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. **Redeploy**: Trigger a new deployment after manual database setup

### Backend Issues
- Check build logs for Prisma generation errors
- Ensure DATABASE_URL is correctly set
- Verify Node.js version is 18+
- Check that `prisma db push` runs successfully during build

### Frontend Issues
- Check that VITE_API_URL points to correct backend
- Verify build completes successfully
- Check browser console for API errors

### Database Issues
- Ensure PostgreSQL database is running
- Check connection string format
- Verify database has proper permissions
- Confirm tables are created (customers, contacts, deals)

## Free Tier Limitations

- **Backend**: Sleeps after 15 minutes of inactivity
- **Database**: 1GB storage limit
- **Frontend**: Unlimited static hosting

## Custom Domain (Optional)

1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records as instructed

## Monitoring

- Check service logs in Render Dashboard
- Monitor database usage
- Set up alerts for service downtime

Your CRM will be live at your frontend URL once deployed! 🚀
