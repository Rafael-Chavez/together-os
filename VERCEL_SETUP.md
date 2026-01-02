# Vercel Deployment Setup

## 🚨 Current Issue: Firebase Error on Vercel

**Error:** `Firebase: Error (auth/invalid-api-key)`

**Cause:** Environment variables from `.env` are NOT automatically deployed to Vercel. You must add them manually in the Vercel dashboard.

---

## ✅ Fix: Add Environment Variables to Vercel

### Step 1: Go to Vercel Project Settings

1. Open: https://vercel.com/dashboard
2. Select your project: **together-os**
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

---

### Step 2: Add All Environment Variables

Add each of these variables **one by one**:

#### Firebase Configuration

| Variable Name | Value |
|--------------|-------|
| `REACT_APP_FIREBASE_API_KEY` | `AIzaSyBcmwHcLM-qDyCSUG7maxkzL_5h9krVTMQ` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | `together-os.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | `together-os` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | `together-os.firebasestorage.app` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | `735147881260` |
| `REACT_APP_FIREBASE_APP_ID` | `1:735147881260:web:685284d5afd635bebf3289` |

#### Supabase Configuration

| Variable Name | Value |
|--------------|-------|
| `REACT_APP_SUPABASE_URL` | `https://omsosezhyriejuvyiyrr.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tc29zZXpoeXJpZWp1dnlpeXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NzQwNjAsImV4cCI6MjA1MTM1MDA2MH0.VOpQsRI6XLRwommEth0NUA_IlM-iJMd` |

#### Household Configuration

| Variable Name | Value |
|--------------|-------|
| `REACT_APP_HOUSEHOLD_ID` | `household_wolfe_2024` |

---

### Step 3: Set Environment for All Deployments

For each variable, make sure to select:
- ✅ **Production**
- ✅ **Preview**
- ✅ **Development**

Or just select **"All"** to apply to all environments.

---

### Step 4: Trigger a New Deployment

After adding all variables, you need to redeploy:

**Option A: Redeploy from Vercel Dashboard**
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **Redeploy**
4. Check ✅ **Use existing Build Cache** (faster)
5. Click **Redeploy**

**Option B: Push a New Commit**
```bash
# Make a small change (e.g., add a comment)
git commit --allow-empty -m "trigger vercel rebuild with env vars"
git push
```

**Option C: Use Vercel CLI**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

### Step 5: Verify Deployment

1. Wait 2-3 minutes for deployment to complete
2. Open your Vercel URL (e.g., `https://together-os.vercel.app`)
3. Open browser DevTools (F12)
4. Check Console - should see no Firebase errors
5. You should see the login screen

---

## 🔐 Security: Restrict Firebase API Key

Since your app is now public on Vercel, you MUST restrict the Firebase API key:

### Update Firebase API Key Restrictions

1. Go to: https://console.cloud.google.com/
2. Select project: **together-os**
3. Navigate to: **APIs & Services → Credentials**
4. Edit: **Browser key (auto created by Firebase)**
5. Under **Application restrictions**:
   - Select: **HTTP referrers (web sites)**
   - Add these domains:
     ```
     http://localhost:3000/*
     https://localhost:3000/*
     https://together-os.vercel.app/*
     https://*.vercel.app/*
     ```
6. Under **API restrictions**:
   - Select: **Restrict key**
   - Enable only: **Identity Toolkit API**
7. Click **Save**

**Replace `together-os.vercel.app` with your actual Vercel domain!**

---

## 📋 Vercel Deployment Checklist

- [ ] Added all 9 environment variables to Vercel
- [ ] Selected "Production", "Preview", and "Development" for each
- [ ] Triggered a new deployment
- [ ] Verified app loads without Firebase errors
- [ ] Restricted Firebase API key to Vercel domain
- [ ] Tested login with Firebase credentials
- [ ] Verified Supabase connection works

---

## 🔍 Troubleshooting Vercel Deployment

### Still Getting `auth/invalid-api-key`?

**Check:**
1. All 9 environment variables are added (count them!)
2. Variable names are **exact** (including `REACT_APP_` prefix)
3. No extra spaces in values
4. You redeployed AFTER adding variables

**Verify environment variables are loaded:**
1. Go to Vercel deployment
2. Click **"..."** → **View Function Logs**
3. Check for any env var related errors

### Login works but data doesn't save?

**Check:**
1. Supabase database schema was run (see `supabase-schema.sql`)
2. RLS policies are enabled
3. Users table exists
4. `REACT_APP_HOUSEHOLD_ID` is set correctly

### Realtime updates not working?

**Check:**
1. Supabase Replication is enabled for your tables
2. Both users have same `HOUSEHOLD_ID`
3. Check browser console for subscription errors

---

## 🎯 Quick Copy-Paste for Vercel

If you want to add variables via Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link to your project
vercel link

# Add environment variables (run each command)
vercel env add REACT_APP_FIREBASE_API_KEY
# Paste: AIzaSyBcmwHcLM-qDyCSUG7maxkzL_5h9krVTMQ
# Select: Production, Preview, Development

vercel env add REACT_APP_FIREBASE_AUTH_DOMAIN
# Paste: together-os.firebaseapp.com

vercel env add REACT_APP_FIREBASE_PROJECT_ID
# Paste: together-os

vercel env add REACT_APP_FIREBASE_STORAGE_BUCKET
# Paste: together-os.firebasestorage.app

vercel env add REACT_APP_FIREBASE_MESSAGING_SENDER_ID
# Paste: 735147881260

vercel env add REACT_APP_FIREBASE_APP_ID
# Paste: 1:735147881260:web:685284d5afd635bebf3289

vercel env add REACT_APP_SUPABASE_URL
# Paste: https://omsosezhyriejuvyiyrr.supabase.co

vercel env add REACT_APP_SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tc29zZXpoeXJpZWp1dnlpeXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NzQwNjAsImV4cCI6MjA1MTM1MDA2MH0.VOpQsRI6XLRwommEth0NUA_IlM-iJMd

vercel env add REACT_APP_HOUSEHOLD_ID
# Paste: household_wolfe_2024

# Deploy with new environment variables
vercel --prod
```

---

## 🌐 Custom Domain (Optional)

Once everything works, you can add a custom domain:

1. Go to Vercel project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `together.yourdomain.com`)
4. Follow DNS setup instructions
5. Don't forget to add your domain to Firebase API restrictions!

---

## 📊 Environment Variables Summary

**Total variables needed:** 9

**Firebase:** 6 variables
**Supabase:** 2 variables
**Household:** 1 variable

**All must start with:** `REACT_APP_`

---

After adding the environment variables and redeploying, your Vercel app should work perfectly! 🚀
