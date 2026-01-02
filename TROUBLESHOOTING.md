# Troubleshooting Guide

## Firebase: Error (auth/invalid-api-key)

**Error message:**
```
FirebaseError: Firebase: Error (auth/invalid-api-key)
```

**Cause:**
Environment variables from `.env` are not being loaded by the React app.

**Solution:**

### Step 1: Stop the Development Server

Press `Ctrl+C` in the terminal running `npm start`

### Step 2: Clear React Cache

```bash
# Delete build artifacts and cache
rm -rf build node_modules/.cache
```

### Step 3: Restart the Development Server

```bash
npm start
```

**Why this happens:**
- Create React App only loads `.env` variables at startup
- If you change `.env` while the server is running, it won't pick up the changes
- You must restart the server after any `.env` changes

---

## Environment Variables Not Loading

**Check if .env is being read:**

```bash
# On Windows (PowerShell)
$env:REACT_APP_FIREBASE_API_KEY

# On Windows (Git Bash / MinGW)
echo $REACT_APP_FIREBASE_API_KEY

# On Mac/Linux
echo $REACT_APP_FIREBASE_API_KEY
```

**If empty:**
1. Verify `.env` file exists in project root (not in `src/`)
2. Verify variable names start with `REACT_APP_`
3. Restart the dev server

---

## Supabase Connection Errors

**Error:** `Failed to fetch` or timeout errors

**Check:**

1. **Verify Supabase URL and key:**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Settings → API
   - Copy the correct values

2. **Verify database schema is set up:**
   - SQL Editor → Run `supabase-schema.sql`
   - Check Tables to see if they exist

3. **Check RLS policies:**
   - If you can't read/write data, RLS policies might be blocking you
   - The schema file includes policies, make sure they're enabled

---

## Firebase Authentication Errors

### Error: `auth/user-not-found`

**Solution:**
Create user accounts in Firebase:
1. Go to Firebase Console → Authentication
2. Click "Add user"
3. Enter email and password
4. Create exactly 2 users (one for each person)

### Error: `auth/wrong-password`

**Solution:**
Reset the password in Firebase Console or use correct credentials.

### Error: `auth/too-many-requests`

**Solution:**
Firebase rate-limited you. Wait 15-30 minutes or reset in Firebase Console.

---

## Module Not Found Errors

**Error:** `Module not found: Can't resolve 'firebase'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## Blank Screen / White Screen

**Check browser console:**
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests

**Common causes:**
- Environment variables not loaded → Restart server
- Firebase config invalid → Check `.env` values
- JavaScript syntax error → Check console

---

## Realtime Updates Not Working

**If changes don't sync between users:**

1. **Check Supabase Realtime is enabled:**
   - Supabase Dashboard → Database → Replication
   - Enable for: `tasks`, `obligations`, `notes`, `check_ins`

2. **Check browser console for subscription errors:**
   - Open DevTools → Console
   - Look for Supabase subscription errors

3. **Verify both users have same HOUSEHOLD_ID:**
   - Check `.env` file
   - Should be identical on both devices

---

## Cannot Read Properties of Null

**Error:** `Cannot read properties of null (reading 'id')`

**Cause:**
User profile not loaded from Supabase.

**Check:**
1. User exists in Supabase `users` table
2. `household_id` matches `REACT_APP_HOUSEHOLD_ID`
3. Firebase UID is synced correctly

**Fix:**
Sign out and sign back in to re-sync user to Supabase.

---

## Build Errors

### Error: `process is not defined`

**Cause:**
Environment variables not embedded in build.

**Solution:**
Verify all variables start with `REACT_APP_` prefix.

### Error: `Failed to compile`

**Check:**
1. Syntax errors in code
2. Missing imports
3. Typos in component names

---

## Database Errors

### Error: `relation "tasks" does not exist`

**Solution:**
Run the database schema:
1. Open Supabase SQL Editor
2. Paste entire contents of `supabase-schema.sql`
3. Click "Run"

### Error: `new row violates row-level security policy`

**Solution:**
RLS policies are blocking you. Check:
1. User is in `users` table
2. `household_id` matches environment variable
3. RLS policies are set up (included in schema)

---

## API Key Errors After Deployment

**Error:** API key works locally but not in production

**Cause:**
Firebase API key is restricted to specific domains.

**Solution:**
1. Go to Google Cloud Console
2. APIs & Services → Credentials
3. Edit API key
4. Add production domain to HTTP referrers

---

## Quick Diagnostic Commands

```bash
# Check if dependencies are installed
npm list react firebase @supabase/supabase-js

# Verify .env file exists
ls -la .env

# Check .env contents (safe - doesn't expose full keys)
grep "REACT_APP_" .env | cut -d'=' -f1

# Run verification script
npm run verify

# Clear all caches and restart
rm -rf node_modules/.cache build
npm start
```

---

## Still Having Issues?

1. **Check Firebase Console:**
   - Authentication → Users tab
   - Look for error messages

2. **Check Supabase Logs:**
   - Dashboard → Logs
   - Filter by error level

3. **Check Browser DevTools:**
   - Console tab for JavaScript errors
   - Network tab for failed requests

4. **Verify Configuration:**
   ```bash
   npm run verify
   ```

---

## Common Gotchas

| Issue | Solution |
|-------|----------|
| Changed `.env` but not working | **Restart dev server** |
| Works locally, not in production | Add domain to Firebase API restrictions |
| Realtime not working | Enable Supabase Replication on tables |
| Data not saving | Check RLS policies and HOUSEHOLD_ID |
| Blank login screen | Check Firebase config in `.env` |

---

## Emergency Reset

If everything is broken and you want to start fresh:

```bash
# 1. Backup .env
cp .env .env.backup

# 2. Delete everything
rm -rf node_modules build .cache

# 3. Reinstall
npm install

# 4. Verify config
npm run verify

# 5. Start fresh
npm start
```

---

**Most issues are solved by restarting the dev server after `.env` changes!**
