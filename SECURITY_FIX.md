# Security Fix - Remove Committed Secrets

## Problem
Firebase credentials were committed to git history (commit fe23699) and pushed to GitHub.

## Solution Options

### Option 1: Rewrite Git History (Recommended if repo is private or just created)

**WARNING: This rewrites history. Only do this if:**
- The repo is private, OR
- You just created it and no one else has cloned it

```bash
# 1. Install BFG Repo Cleaner (faster than git-filter-branch)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# OR use git-filter-branch (built-in, slower):

# 2. Create a backup first
cd ..
cp -r together-os together-os-backup

# 3. Remove the file from history
cd together-os
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch src/config/firebase.js" \
  --prune-empty --tag-name-filter cat -- --all

# 4. Clean up
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. Force push to GitHub (DANGEROUS - only if you're sure!)
git push origin --force --all
git push origin --force --tags
```

### Option 2: Delete Repo and Start Fresh (Safest)

If the repo is public and already indexed by GitHub's secret scanner:

```bash
# 1. Delete the GitHub repo
# Go to: https://github.com/Rafael-Chavez/together-os/settings
# Scroll down → Delete this repository

# 2. Start fresh locally
cd c:/Users/wolfe/together-os
rm -rf .git

# 3. Initialize new repo
git init
git add .
git commit -m "Initial commit with secure config"

# 4. Create new GitHub repo (make it PRIVATE!)
gh repo create together-os --private --source=. --push
```

### Option 3: Just Rotate Credentials (If you don't care about history)

If you're okay with secrets being in history:

1. Restrict Firebase API key (see main instructions below)
2. Monitor Firebase usage for abuse
3. Proceed with development

---

## Restrict Firebase API Key (DO THIS NOW)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: "together-os"
3. Go to APIs & Services → Credentials
4. Find your API key: "Browser key (auto created by Firebase)"
5. Click Edit (pencil icon)
6. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add: `localhost:3000/*`
   - Add: `http://localhost:3000/*`
   - Add your production domain when you deploy
7. Under "API restrictions":
   - Select "Restrict key"
   - Check only: Identity Toolkit API
8. Click Save

This prevents unauthorized use even if the key is public.

---

## Future Prevention

**NEVER commit .env files:**

Your `.gitignore` already includes `.env` ✅

**Always use environment variables:**

✅ Fixed: `firebase.js` now uses `process.env.REACT_APP_*`

**Check before committing:**

```bash
# Before every commit, check for secrets
git diff --staged | grep -i "api"
git diff --staged | grep -i "key"
```

**Use GitHub's secret scanning:**

GitHub may have already detected this. Check:
https://github.com/Rafael-Chavez/together-os/security/secret-scanning

---

## What I've Already Fixed

✅ Removed hardcoded Firebase config from `src/config/firebase.js`
✅ Updated `.env` with correct format
✅ Verified `.env` is in `.gitignore`

## What You Need To Do

1. [ ] Restrict Firebase API key (see above)
2. [ ] Choose one of the three options to handle git history
3. [ ] If keeping the repo, make it PRIVATE on GitHub
4. [ ] Monitor Firebase console for unusual activity
5. [ ] Commit the fix: `git add . && git commit -m "fix: use env vars for Firebase config"`
