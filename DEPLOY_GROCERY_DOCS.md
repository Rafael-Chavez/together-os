# Deploy Grocery List & Documents - Quick Guide

## ✅ What's Ready

Your code is ready to deploy! Here's what was built:
- 🛒 Grocery List component with realtime sync
- 📄 Documents storage component with file upload/download
- 🎨 Both tabs added to Dashboard
- 📊 Database schema ready to run

---

## 🚀 Deployment Steps (5 minutes)

### Step 1: Run Database Schema

1. Go to **Supabase** → **SQL Editor**
2. Click **"New Query"**
3. Copy **ALL** of [supabase-grocery-docs-schema.sql](supabase-grocery-docs-schema.sql)
4. Paste and click **"Run"**

You should see: "Success" ✅

---

### Step 2: Create Storage Bucket

1. In Supabase, go to **Storage** (left sidebar)
2. Click **"New bucket"**
3. Settings:
   - **Name**: `household-documents`
   - **Public**: ❌ **Uncheck** (keep private)
   - **File size limit**: `52428800` (50MB in bytes)
   - **Allowed MIME types**: Leave default or set to:
     ```
     application/pdf
     image/*
     application/msword
     application/vnd.openxmlformats-officedocument.*
     ```
4. Click **"Create bucket"**

---

### Step 3: Add Storage Policies

1. Click on the `household-documents` bucket
2. Go to **Policies** tab
3. Click **"New Policy"** → **"For full customization"**
4. Add these 3 policies:

**Upload Policy:**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'household-documents');
```

**Download Policy:**
```sql
CREATE POLICY "Authenticated users can download"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'household-documents');
```

**Delete Policy:**
```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'household-documents');
```

---

### Step 4: Deploy to Vercel

```bash
git add .
git commit -m "feat: add grocery list and document storage"
git push
```

Vercel will automatically rebuild (takes ~2 minutes).

---

## ✅ Verify It Works

After deployment:

1. **Grocery List:**
   - Go to "Grocery" tab
   - Add an item
   - Check it off
   - Open in another browser/device
   - Verify realtime sync works

2. **Documents:**
   - Go to "Documents" tab
   - Upload a PDF or image
   - Download it
   - Verify file downloads correctly

---

## 🔧 Troubleshooting

### Error: "relation 'grocery_items' does not exist"
**Fix:** Run the SQL schema in Supabase SQL Editor

### Error: "Storage bucket not found"
**Fix:** Create the `household-documents` bucket in Supabase Storage

### Error: "Upload failed: new row violates row-level security"
**Fix:** Add the storage policies (Step 3)

### Error: "Cannot read properties of null"
**Fix:** Make sure you're signed in with Firebase auth

---

## 📊 What You'll Have

After deployment, Together OS will have:

| Feature | Purpose | Status |
|---------|---------|--------|
| Tasks | Chores & todos | ✅ Existing |
| **Grocery** | Shopping list | 🆕 **NEW** |
| Obligations | Bills & payments | ✅ Existing |
| Notes | Shared notes | ✅ Existing |
| **Documents** | File storage | 🆕 **NEW** |
| Check-in | Weekly reflection | ✅ Existing |

---

## 💾 Storage Usage

**Supabase Free Tier:**
- 1GB storage
- 2GB bandwidth/month

**Expected usage for 2 people:**
- Grocery list: ~1KB
- ~50 documents @ 2MB avg = 100MB
- Well within free tier ✅

---

## 🎉 You're Done!

After these 4 steps, you'll have:
- ✅ Fast shared grocery list
- ✅ Secure document storage
- ✅ Realtime sync between users
- ✅ All stored privately in your Supabase account

Questions? Check [GROCERY_AND_DOCS.md](GROCERY_AND_DOCS.md) for full documentation.
