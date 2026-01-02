# Next Steps - Quick Action Guide

## 🚨 URGENT (Do Right Now - 5 minutes)

### Step 1: Restrict Firebase API Key

**Why:** Your Firebase API key is public in git history. This prevents abuse.

1. Open: https://console.cloud.google.com/
2. Select project: **together-os**
3. Go to: **APIs & Services → Credentials**
4. Edit: **Browser key (auto created by Firebase)**
5. Set **HTTP referrers**:
   ```
   http://localhost:3000/*
   https://localhost:3000/*
   ```
6. Set **API restrictions** to: **Identity Toolkit API** only
7. **Save**

✅ Done? Your API key is now restricted to your domains only.

---

### Step 2: Make GitHub Repo Private

1. Open: https://github.com/Rafael-Chavez/together-os/settings
2. Scroll to **Danger Zone**
3. Click **Change repository visibility → Make private**

✅ Done? Your code is now private.

---

## 📋 IMPORTANT (Do Today - 15 minutes)

### Step 3: Commit Security Fixes

Your local code is fixed but not committed yet.

```bash
# Review changes
git status

# Commit the security fix
git add src/config/firebase.js package.json
git commit -m "security: use environment variables for Firebase config"

# Push to GitHub
git push origin main
```

⚠️ **Note:** The old secrets are still in git history (commit fe23699). But with API key restricted + private repo, you're safe.

---

### Step 4: Clean Git History (Optional but Recommended)

**Option A: Delete & Recreate Repo** (Safest)

```bash
# 1. Delete repo on GitHub
# Go to: https://github.com/Rafael-Chavez/together-os/settings
# Scroll down → Delete this repository

# 2. Remove git history locally
rm -rf .git

# 3. Create fresh repo
git init
git add .
git commit -m "Initial commit - Together OS"

# 4. Create new private repo on GitHub
gh repo create together-os --private --source=. --push
```

**Option B: Keep Current Repo**

If you don't want to delete the repo, that's okay. With:
- ✅ Private repo
- ✅ Restricted API key

You're reasonably secure. The secrets are buried in history but protected.

---

## ✅ VERIFICATION (Do After Above Steps - 2 minutes)

### Step 5: Verify Configuration

```bash
# Install verification dependencies
npm install

# Run verification script
npm run verify
```

Expected output:
```
✅ All checks passed! Your configuration is secure.
```

If you see errors, check your `.env` file.

---

### Step 6: Test the App

```bash
# Start development server
npm start
```

1. App should open at http://localhost:3000
2. Sign in with your Firebase credentials
3. Create a task
4. Verify it saves to Supabase

If you get errors:
- Check `.env` file has correct values
- Check Firebase Console for auth errors
- Check Supabase SQL was run correctly

---

## 🔐 SECURITY CHECKLIST

Before you continue development:

- [ ] Firebase API key restricted to specific domains
- [ ] GitHub repo is private
- [ ] Security fixes committed to git
- [ ] `npm run verify` passes
- [ ] App runs successfully on localhost
- [ ] `.env` is NOT tracked by git (run: `git status`)

---

## 📚 Reference Docs

- **Security Details:** [SECURITY_SUMMARY.md](SECURITY_SUMMARY.md)
- **Git History Fix:** [SECURITY_FIX.md](SECURITY_FIX.md)
- **General Setup:** [SETUP.md](SETUP.md)
- **Quick Start:** [QUICKSTART.md](QUICKSTART.md)

---

## 🚀 After Security is Fixed

Once you've completed the steps above, you're ready to:

1. **Develop features** - Your foundation is secure
2. **Deploy to production** - Follow [DEPLOYMENT.md](DEPLOYMENT.md)
3. **Add your partner** - Share credentials securely (1Password, etc.)

---

## ❓ FAQ

**Q: Is my data safe with restricted API key?**
A: Yes. Even if someone finds the key in git history, it only works from your allowed domains.

**Q: Should I regenerate the Firebase API key?**
A: Not necessary if you restrict it properly. But if you're paranoid, you can create a new Firebase web app and get new credentials.

**Q: What about the Supabase key?**
A: Supabase anon keys are meant to be public. Security is handled by Row Level Security (RLS) policies, which are already set up in your schema.

**Q: Can I skip cleaning git history?**
A: If your repo is private + API key is restricted, you're reasonably safe. Cleaning history is an extra precaution.

---

**You're almost there!** Complete the urgent steps above and you'll have a secure, working household OS. 🏡
