# TELsTP OmniCognitor Backend - Supabase Edge Functions

**100% FREE. ZERO COST. NO BILLING REQUIRED.**

Deployed by: **MMAC - Manus Mission Accomplished**

---

## Overview

This is the backend API for TELsTP OmniCognitor, running as Supabase Edge Functions (serverless Deno runtime).

### Features

- ✅ Runs directly on Supabase infrastructure
- ✅ Zero cost (included in free tier)
- ✅ Auto-scaling, serverless
- ✅ Connected to PostgreSQL database
- ✅ CORS enabled
- ✅ REST API endpoints

### API Endpoints

```
GET  /functions/v1/api/health      # Health check
GET  /functions/v1/api/info        # API information
GET  /functions/v1/api/stats       # Database statistics
GET  /functions/v1/api/users       # List users
GET  /functions/v1/api/platforms   # List platforms
GET  /functions/v1/api/workspaces  # List workspaces
GET  /functions/v1/api/messages    # List messages
POST /functions/v1/api/users       # Create user
POST /functions/v1/api/workspaces  # Create workspace
POST /functions/v1/api/messages    # Create message
```

### Base URL

```
https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api
```

---

## Deployment

### Prerequisites

- Supabase CLI installed
- Supabase project created (already done)
- GitHub repository access

### Deploy to Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Deploy Edge Function
supabase functions deploy api --project-id vrfyjirddfdnwuffzqhb
```

### Environment Variables

The Edge Function automatically uses:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

These are automatically available in the Edge Function environment.

---

## Testing

### Health Check

```bash
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/health
```

### Get API Info

```bash
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/info
```

### Get Statistics

```bash
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/stats
```

---

## Cost

- **Monthly Cost:** $0
- **Billing Required:** No
- **Credit Card:** Not required
- **Scaling:** Automatic, unlimited

---

## Architecture

```
GitHub (Source Code)
    ↓
Supabase Edge Functions (Deno Runtime)
    ↓
PostgreSQL Database (Supabase)
```

---

## Monitoring

View logs in Supabase dashboard:
1. Go to https://app.supabase.com
2. Select your project
3. Go to Functions → api
4. View logs and invocations

---

## License

MIT

---

**Deployed By:** MMAC - Manus Mission Accomplished  
**Infrastructure:** Supabase Edge Functions (100% Free)  
**Status:** ✅ Production Ready

