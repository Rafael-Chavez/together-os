# Together OS - Complete Setup Guide

Follow these steps to get your household operating system running.

## Prerequisites

- Node.js 16+ installed
- A Firebase account
- A Supabase account

---

## Step 1: Clone and Install

```bash
cd together-os
npm install
```

---

## Step 2: Firebase Setup (Authentication)

### Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it (e.g., "Together-Household")
4. Disable Google Analytics (not needed)
5. Click "Create project"

### Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click "Email/Password" under Sign-in providers
4. Enable it and click "Save"

### Create Two User Accounts

1. Go to the "Users" tab in Authentication
2. Click "Add user"
3. Enter email and password for Person 1
4. Click "Add user" again
5. Enter email and password for Person 2

**Important**: Only these two accounts should exist. This is a private system.

### Get Firebase Config

1. Click the gear icon next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon (`</>`)
5. Register your app (name it anything)
6. Copy the `firebaseConfig` object values

---

## Step 3: Supabase Setup (Database)

### Create Supabase Project

1. Go to https://supabase.com/
2. Click "New project"
3. Choose your organization
4. Name it (e.g., "together-household")
5. Create a strong database password (save it!)
6. Choose a region close to you
7. Click "Create new project"

### Run Database Schema

1. Wait for your project to finish setting up
2. Click "SQL Editor" in the left sidebar
3. Click "New query"
4. Open the file `supabase-schema.sql` from this repo
5. Copy and paste the entire contents into the query editor
6. Click "Run"

You should see "Success. No rows returned" - this means your tables are created.

### Get Supabase Credentials

1. Click the gear icon (Project Settings) in the bottom left
2. Click "API" in the settings menu
3. Copy:
   - Project URL (under "Project URL")
   - anon public key (under "Project API keys")

---

## Step 4: Environment Configuration

### Create .env File

```bash
cp .env.example .env
```

### Fill in Your Credentials

Open `.env` and replace all placeholder values:

```env
# Firebase Configuration (from Step 2)
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123

# Supabase Configuration (from Step 3)
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGc...

# Household ID (make this unique)
REACT_APP_HOUSEHOLD_ID=household_yournames_2024
```

**For Household ID**: Choose anything unique. Examples:
- `household_alex_jordan_2024`
- `household_apartment_5b`
- `household_smiths`

This ID connects both user accounts to the same data.

---

## Step 5: Run the App

```bash
npm start
```

The app will open at `http://localhost:3000`.

### Test It

1. Sign in with Person 1's email/password
2. Create a task
3. Sign out
4. Sign in with Person 2's email/password
5. You should see the same task

---

## Step 6: Deploy (Optional)

### Vercel (Recommended)

1. Push your code to GitHub (make sure `.env` is in `.gitignore`!)
2. Go to https://vercel.com/
3. Import your repository
4. Add environment variables in Vercel settings
5. Deploy

### Netlify

1. Push your code to GitHub
2. Go to https://netlify.com/
3. New site from Git
4. Add environment variables in build settings
5. Deploy

**Important**: Never commit your `.env` file. Add secrets in your hosting platform's dashboard.

---

## Troubleshooting

### "Permission denied" errors in Supabase

Make sure you ran the full schema SQL, including the RLS policies section.

### "Firebase: Error (auth/user-not-found)"

Double-check the email/password you created in Firebase Authentication.

### Tasks/notes not showing up

Verify both users have the same `REACT_APP_HOUSEHOLD_ID` in their `.env`.

### Realtime updates not working

Check your Supabase project isn't paused (free tier pauses after 7 days of inactivity).

---

## Security Notes

- Never share your `.env` file
- The `HOUSEHOLD_ID` is your shared secret—keep it private
- Use strong passwords for Firebase accounts
- Supabase RLS policies ensure data isolation
- This is a two-person system—don't share login credentials outside your household

---

## Next Steps

- Customize the UI colors in `src/index.css`
- Add your own categories to obligations
- Adjust recurring task patterns
- Make it yours!

---

## Need Help?

Check the main README.md for architecture details and design decisions.
