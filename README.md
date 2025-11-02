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
- ✅ Complete database schema with migrations

### Database Schema

The platform includes the following tables:
- **users** - User accounts and profiles
- **platforms** - AI platforms (ChatGPT, Claude, Gemini, etc.)
- **workspaces** - User workspaces for organizing conversations
- **conversations** - Chat conversations with AI platforms
- **messages** - Individual messages in conversations

### API Endpoints

```
GET  /functions/v1/api/health          # Health check
GET  /functions/v1/api/info            # API information
GET  /functions/v1/api/stats           # Database statistics
GET  /functions/v1/api/users           # List users
POST /functions/v1/api/users           # Create user
GET  /functions/v1/api/platforms       # List AI platforms
POST /functions/v1/api/platforms       # Create platform
GET  /functions/v1/api/workspaces      # List workspaces
POST /functions/v1/api/workspaces      # Create workspace
GET  /functions/v1/api/conversations   # List conversations
POST /functions/v1/api/conversations   # Create conversation
GET  /functions/v1/api/messages        # List messages
POST /functions/v1/api/messages        # Create message
```

### Base URL

```
https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api
```

---

## Deployment Instructions

### Prerequisites

1. Supabase CLI installed
2. Supabase project created (already done)
3. Access to your Supabase project

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

You'll be prompted to enter your access token. Get it from:
https://app.supabase.com/account/tokens

### Step 3: Link to Your Project

```bash
supabase link --project-ref vrfyjirddfdnwuffzqhb
```

### Step 4: Run Database Migrations

```bash
# Apply migrations to set up database schema
supabase db push
```

Or manually execute the migration SQL:
1. Go to https://app.supabase.com
2. Select your project
3. Go to SQL Editor
4. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
5. Run the query

### Step 5: Deploy Edge Function

```bash
# Deploy the API function
supabase functions deploy api --project-ref vrfyjirddfdnwuffzqhb
```

### Step 6: Verify Deployment

```bash
# Test health endpoint
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/health

# Test stats endpoint
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/stats

# Test platforms endpoint
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/platforms
```

---

## Environment Variables

The Edge Function automatically uses these environment variables (no configuration needed):
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

These are automatically available in the Edge Function environment.

---

## Testing Locally

### Start Local Supabase

```bash
supabase start
```

### Serve Functions Locally

```bash
supabase functions serve api
```

### Test Local Endpoint

```bash
curl http://localhost:54321/functions/v1/api/health
```

---

## Database Management

### View Tables

Go to https://app.supabase.com → Your Project → Table Editor

### Run SQL Queries

Go to https://app.supabase.com → Your Project → SQL Editor

### Common Queries

```sql
-- Check user count
SELECT COUNT(*) FROM users;

-- List all platforms
SELECT * FROM platforms;

-- Get workspace statistics
SELECT 
  w.name,
  COUNT(DISTINCT c.id) as conversations,
  COUNT(DISTINCT m.id) as messages
FROM workspaces w
LEFT JOIN conversations c ON c.workspace_id = w.id
LEFT JOIN messages m ON m.conversation_id = c.id
GROUP BY w.id, w.name;
```

---

## Monitoring

View logs and metrics in Supabase dashboard:
1. Go to https://app.supabase.com
2. Select your project
3. Go to Functions → api
4. View logs, invocations, and performance metrics

---

## Cost

- **Monthly Cost:** $0
- **Billing Required:** No
- **Credit Card:** Not required (free tier)
- **Scaling:** Automatic, unlimited (within free tier limits)

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

## Troubleshooting

### Function Not Responding

```bash
# Check function logs
supabase functions logs api

# Redeploy function
supabase functions deploy api --project-ref vrfyjirddfdnwuffzqhb
```

### Database Connection Issues

```bash
# Check database status
supabase db status

# Reset database (WARNING: Deletes all data)
supabase db reset
```

### CORS Issues

The API is configured with permissive CORS headers. If you still face issues:
1. Check browser console for specific error
2. Verify API URL is correct
3. Ensure you're using HTTPS, not HTTP

---

## API Usage Examples

### Get Statistics

```bash
curl https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/stats
```

### Create User

```bash
curl -X POST https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "newuser",
    "full_name": "New User"
  }'
```

### Create Workspace

```bash
curl -X POST https://vrfyjirddfdnwuffzqhb.supabase.co/functions/v1/api/workspaces \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "name": "My Workspace",
    "description": "My personal workspace",
    "is_public": false
  }'
```

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/mayoubm1/TELsTP--Unified-Ai-Platform/issues
- Email: support@telstp.com

---

## License

MIT

---

**Deployed By:** MMAC - Manus Mission Accomplished  
**Infrastructure:** Supabase Edge Functions (100% Free)  
**Status:** ✅ Production Ready
