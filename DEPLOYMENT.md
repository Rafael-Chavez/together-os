# Deployment Guide

Deploy Together OS to production so you can access it from anywhere.

---

## Option 1: Vercel (Recommended)

### Why Vercel?
- Free tier is generous
- Automatic HTTPS
- Easy environment variable management
- Fast deploys
- Great for React apps

### Steps

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create together-os --private --source=. --push
```

2. **Deploy to Vercel**

- Go to https://vercel.com/
- Sign in with GitHub
- Click "New Project"
- Import your `together-os` repository
- Configure:
  - Framework: Create React App
  - Root Directory: `./`
  - Build Command: `npm run build`
  - Output Directory: `build`

3. **Add Environment Variables**

In Vercel project settings → Environment Variables, add:

```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY
REACT_APP_HOUSEHOLD_ID
```

4. **Deploy**

Click "Deploy" and wait ~2 minutes.

You'll get a URL like `together-os.vercel.app`.

---

## Option 2: Netlify

### Steps

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**

- Go to https://netlify.com/
- Click "New site from Git"
- Choose GitHub → Select your repo
- Configure:
  - Build command: `npm run build`
  - Publish directory: `build`

3. **Add Environment Variables**

Site settings → Build & deploy → Environment → Environment variables

Add all `REACT_APP_*` variables.

4. **Deploy**

Netlify will build and deploy automatically.

---

## Option 3: Firebase Hosting

### Why Firebase Hosting?
You're already using Firebase for auth, so it's a natural fit.

### Steps

1. **Install Firebase CLI**

```bash
npm install -g firebase-tools
```

2. **Login to Firebase**

```bash
firebase login
```

3. **Initialize Firebase Hosting**

```bash
firebase init hosting
```

- Choose your Firebase project
- Public directory: `build`
- Single-page app: `Yes`
- GitHub deploys: `No` (or Yes if you want auto-deploy)

4. **Build and Deploy**

```bash
npm run build
firebase deploy --only hosting
```

Your app will be at `https://your-project-id.web.app`

---

## Security Checklist

Before deploying:

- [ ] `.env` is in `.gitignore`
- [ ] No secrets committed to git
- [ ] Environment variables set in hosting platform
- [ ] Firebase Authentication domain whitelist updated
- [ ] Supabase RLS policies are enabled
- [ ] Only two user accounts exist in Firebase

---

## Post-Deployment Setup

### 1. Update Firebase Auth Domain

In Firebase Console → Authentication → Settings → Authorized domains:

Add your production URL (e.g., `together-os.vercel.app`)

### 2. Test Both Accounts

- Sign in with Person 1's account
- Create a task
- Sign out
- Sign in with Person 2's account
- Verify you see the same task
- Test realtime updates (open in two browsers)

### 3. Add to Home Screen (Mobile)

**iOS:**
1. Open in Safari
2. Tap Share button
3. Tap "Add to Home Screen"
4. Name it "Together"

**Android:**
1. Open in Chrome
2. Tap menu (three dots)
3. Tap "Add to Home screen"
4. Name it "Together"

Now it feels like a native app!

---

## Custom Domain (Optional)

### Vercel

1. Buy domain (Namecheap, Google Domains, etc.)
2. In Vercel → Settings → Domains
3. Add your domain
4. Update DNS records as instructed

### Netlify

1. Buy domain
2. In Netlify → Domain settings → Add custom domain
3. Update DNS or use Netlify DNS

---

## Monitoring & Maintenance

### Supabase Free Tier Limits

- Database pauses after 7 days of inactivity
- To keep it active, just use the app once per week
- Or upgrade to Pro ($25/mo) for always-on

### Firebase Free Tier Limits

- 10k auth operations/month (way more than you need)
- If you somehow exceed, upgrade to Blaze (pay-as-you-go)

### Vercel Free Tier Limits

- 100GB bandwidth/month (plenty for two users)
- Unlimited deployments

---

## Backup Strategy

### Database Backups (Supabase)

1. Go to Supabase → Database → Backups
2. Free tier: Daily backups for 7 days
3. Download a backup before making schema changes

### Manual Export

```sql
-- Run in Supabase SQL editor
COPY (SELECT * FROM tasks) TO '/tmp/tasks_backup.csv' WITH CSV HEADER;
COPY (SELECT * FROM obligations) TO '/tmp/obligations_backup.csv' WITH CSV HEADER;
COPY (SELECT * FROM notes) TO '/tmp/notes_backup.csv' WITH CSV HEADER;
COPY (SELECT * FROM check_ins) TO '/tmp/checkins_backup.csv' WITH CSV HEADER;
```

---

## Updating the App

### With Vercel/Netlify (Git-based)

```bash
# Make your changes
git add .
git commit -m "Update feature X"
git push
```

Auto-deploys in ~2 minutes.

### With Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

---

## Troubleshooting Deployment

### "Module not found" errors

Clear build cache:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment variables not working

- Verify they're prefixed with `REACT_APP_`
- Rebuild after adding env vars
- Check spelling (case-sensitive!)

### Firebase auth errors in production

- Add production URL to Firebase authorized domains
- Check CORS settings in Firebase

### Supabase connection errors

- Verify `REACT_APP_SUPABASE_URL` is correct
- Check RLS policies are enabled
- Ensure project isn't paused

---

## Performance Optimization (Optional)

### Enable Compression

Vercel and Netlify do this automatically.

### Cache Static Assets

Also automatic with modern hosts.

### Lazy Load Components

```jsx
import React, { lazy, Suspense } from 'react';

const Tasks = lazy(() => import('./components/Tasks/Tasks'));

function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Tasks />
    </Suspense>
  );
}
```

Only implement if you notice slow loads (unlikely for this app).

---

## Cost Estimate

**Completely free for two users:**

- Firebase Auth: Free tier (10k/month)
- Supabase: Free tier (500MB database, plenty)
- Vercel/Netlify: Free tier (100GB bandwidth)

**Total: $0/month** ✨

Upgrade only if you exceed limits (very unlikely for household use).

---

You're live! Share the URL with your partner and enjoy your household OS.
