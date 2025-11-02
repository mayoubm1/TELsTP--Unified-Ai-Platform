# TELsTP OmniCognitor - Complete Deployment Guide

**Unified AI Platform - Full Stack Deployment**

This guide will walk you through deploying both the frontend and backend of the TELsTP OmniCognitor platform.

---

## 🎯 Overview

- **Frontend**: React + Vite → Deployed on Vercel
- **Backend**: Supabase Edge Functions → Deployed on Supabase
- **Database**: PostgreSQL → Hosted on Supabase
- **Cost**: $0 (100% Free)

---

## 📋 Prerequisites

Before you begin, ensure you have:

1. ✅ Node.js 18+ installed
2. ✅ Git installed
3. ✅ GitHub account
4. ✅ Vercel account (free)
5. ✅ Supabase account (free)
6. ✅ Access to both repositories:
   - Frontend: `mayoubm1/Digital-Telstp-Unified-Registry_FEM23`
   - Backend: `mayoubm1/TELsTP--Unified-Ai-Platform`

---

## 🔧 Part 1: Backend Deployment (Supabase)

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

You'll be prompted for an access token. Get it from:
- Go to: https://app.supabase.com/account/tokens
- Click "Generate new token"
- Copy and paste the token

### Step 3: Link Your Project

```bash
cd backend
supabase link --project-ref vrfyjirddfdnwuffzqhb
```

### Step 4: Set Up Database Schema

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to https://app.supabase.com
2. Select your project (vrfyjirddfdnwuffzqhb)
3. Navigate to: SQL Editor
4. Click "New query"
5. Copy the contents of `supabase/migrations/001_initial_schema.sql`
6. Paste into the SQL editor
7. Click "Run"
8. Verify tables are created: Go to Table Editor

**Option B: Using CLI**

```bash
cd backend
supabase db push
```

### Step 5: Deploy Edge Function

```bash
cd backend
supabase functions deploy api --project-ref vrfyjirddfdnwuffzqhb
```

### Step 6: Verify Backend Deployment

Test the API endpoints:

```bash
# Health check
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/health

# API info
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/info

# Statistics
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/stats

# List platforms
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/platforms

# List workspaces
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/workspaces
```

Expected responses should show:
- Health: `{"success":true,...}`
- Stats: Shows user, platform, workspace counts
- Platforms: List of 8 pre-loaded AI platforms
- Workspaces: Sample workspaces

✅ **Backend deployment complete!**

---

## 🎨 Part 2: Frontend Deployment (Vercel)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Deploy to Vercel

```bash
cd frontend
vercel
```

You'll be asked:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (first time) or Yes (updating)
- **Project name?** → Press enter (uses repo name) or enter custom name
- **Directory?** → Press enter (current directory)
- **Override settings?** → No

Vercel will:
1. Build your project
2. Deploy to a preview URL
3. Show you the deployment URL

### Step 4: Deploy to Production

```bash
cd frontend
vercel --prod
```

This deploys to your production domain.

### Step 5: Verify Frontend Deployment

Open the provided URL in your browser. You should see:
- TELsTP OmniCognitor dashboard
- Statistics showing numbers (users, platforms, workspaces, etc.)
- List of AI platforms (ChatGPT, Claude, Gemini, etc.)
- Active workspaces section

✅ **Frontend deployment complete!**

---

## 🔐 Part 3: Environment Variables

### Vercel Environment Variables

If deployment doesn't work correctly, verify environment variables:

1. Go to: https://vercel.com
2. Select your project
3. Go to: Settings → Environment Variables
4. Add these variables:

```
VITE_SUPABASE_URL = https://vrfyjirddfdnwuffzqhb.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZnlqaXJkZGZkbnd1ZmZ6cWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDYwNjMsImV4cCI6MjA3NTQ4MjA2M30.glgJwI2yIqUFG8ZtWJk2esxGdXw6nFp5eQ8aANbRAvE
VITE_API_URL = https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api
```

5. Redeploy: `vercel --prod`

---

## 🔄 Part 4: Continuous Deployment (Optional)

### Automatic Deployment from GitHub

1. Go to Vercel dashboard
2. Click "New Project"
3. Import from GitHub: `mayoubm1/Digital-Telstp-Unified-Registry_FEM23`
4. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables (same as above)
6. Click "Deploy"

Now, every push to the `main` branch will automatically deploy!

---

## 📊 Part 5: Testing & Verification

### Test Backend API

```bash
# Health check
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/health

# Get statistics
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/stats

# List users
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/users

# List platforms
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/platforms

# List workspaces
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/workspaces
```

### Test Frontend

Open your Vercel URL and verify:
- ✅ Dashboard loads without errors
- ✅ Statistics show numbers (not zeros)
- ✅ Platforms grid displays 8 AI platforms
- ✅ Workspaces section shows sample workspaces
- ✅ No console errors
- ✅ Auto-refresh works (check after 30 seconds)

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: API returns 404**
```bash
# Redeploy function
cd backend
supabase functions deploy api --project-ref vrfyjirddfdnwuffzqhb
```

**Problem: Database tables not found**
```bash
# Re-run migration
# Go to Supabase Dashboard → SQL Editor
# Run the migration SQL again
```

**Problem: CORS errors**
- The API already has CORS enabled
- Check if you're using HTTPS (not HTTP)
- Verify API URL is correct

### Frontend Issues

**Problem: Shows zeros for all statistics**
- Check browser console for errors
- Verify API URL in environment variables
- Test backend API directly with curl

**Problem: Build fails on Vercel**
```bash
# Test build locally
cd frontend
npm run build

# Check for errors
# Fix any TypeScript or build errors
```

**Problem: Environment variables not loading**
- Verify variables are set in Vercel dashboard
- Redeploy after adding variables
- Check `vercel.json` has correct values

---

## 🎉 Success Checklist

### Backend ✅
- [ ] Supabase CLI installed
- [ ] Logged into Supabase
- [ ] Database schema deployed (5 tables created)
- [ ] Edge function deployed
- [ ] API health check passes
- [ ] All endpoints return data

### Frontend ✅
- [ ] Vercel CLI installed
- [ ] Logged into Vercel
- [ ] Frontend deployed successfully
- [ ] Environment variables configured
- [ ] Dashboard loads correctly
- [ ] Data displays from API
- [ ] No console errors

---

## 📱 Accessing Your Deployed App

### Production URLs

**Frontend (Vercel)**
```
https://your-project-name.vercel.app
```

**Backend API (Supabase)**
```
https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api
```

**Supabase Dashboard**
```
https://app.supabase.com/project/vrfyjirddfdnwuffzqhb
```

**Vercel Dashboard**
```
https://vercel.com/dashboard
```

---

## 🔄 Updating Your Deployment

### Update Backend

```bash
cd backend
# Make your changes
git add .
git commit -m "Update API"
git push origin main

# Deploy to Supabase
supabase functions deploy api --project-ref vrfyjirddfdnwuffzqhb
```

### Update Frontend

```bash
cd frontend
# Make your changes
git add .
git commit -m "Update UI"
git push origin main

# Deploy to Vercel
vercel --prod
```

Or if you set up GitHub integration, just push to main:
```bash
git push origin main
# Vercel will auto-deploy!
```

---

## 💰 Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Supabase | Free Tier | $0/month |
| Vercel | Hobby | $0/month |
| Database | Supabase PostgreSQL | $0/month |
| Edge Functions | Supabase | $0/month |
| CDN | Vercel Edge | $0/month |
| **Total** | | **$0/month** |

### Free Tier Limits

**Supabase Free Tier:**
- 500MB database storage
- 5GB bandwidth
- 2GB file storage
- 500K Edge Function invocations/month

**Vercel Hobby Tier:**
- Unlimited deployments
- 100GB bandwidth
- Automatic HTTPS
- Custom domains

---

## 📞 Support

### Resources
- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: 
  - Frontend: https://github.com/mayoubm1/Digital-Telstp-Unified-Registry_FEM23/issues
  - Backend: https://github.com/mayoubm1/TELsTP--Unified-Ai-Platform/issues

### Need Help?
- Check browser console for errors
- Check Vercel build logs
- Check Supabase function logs
- Test API endpoints with curl

---

## 🎯 Next Steps

After successful deployment:

1. **Custom Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Configure DNS records
   - Enable automatic HTTPS

2. **Monitoring**
   - Set up Vercel Analytics
   - Monitor Supabase logs
   - Track API usage

3. **Features**
   - Add authentication
   - Implement user registration
   - Add more AI platform integrations
   - Build conversation interface

4. **Optimization**
   - Add caching
   - Optimize images
   - Enable compression
   - Set up CDN

---

**Deployment Guide Created By:** MMAC - Manus Mission Accomplished  
**Last Updated:** 2025  
**Status:** ✅ Production Ready  
**Total Cost:** $0 (100% Free)

---

Good luck with your deployment! 🚀
