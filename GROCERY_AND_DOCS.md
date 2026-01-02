# Grocery List & Documents - Feature Guide

## 🛒 Grocery List

### Purpose
**Quick add. Quick check. No tracking, no guilt.**

A shared grocery list built for speed and simplicity. No meal planning, no budgets, no optimization—just what you need to buy.

### How It Works

**Adding Items:**
1. Type item name
2. Choose category (produce, dairy, pantry, meat, frozen, other)
3. Click "Add"

**Shopping:**
- Check items as you add them to cart
- Unchecked items stay at top
- Checked items move to "In cart" section

**After Shopping:**
- Click "Clear Checked" to remove all purchased items
- Or uncheck items if you didn't get them

### Design Philosophy

**What it does:**
- ✅ Quick add/check interface
- ✅ Visual categories with emojis
- ✅ Realtime sync between users
- ✅ Shows who added what (context, not blame)

**What it DOESN'T do:**
- ❌ No quantities (just add item twice if needed)
- ❌ No prices or budget tracking
- ❌ No meal planning integration
- ❌ No recipe suggestions
- ❌ No "smart" recommendations

**Why:**
This isn't about optimization. It's about reducing the mental load of "what do we need?" Just add it when you think of it. Check it when you buy it. Move on.

### Edge Cases Handled

1. **Both users add same item** → That's fine. You need two!
2. **Someone checks wrong item** → Just uncheck it
3. **Forgot to add something** → Add it next time
4. **List gets long** → Clear checked items regularly

---

## 📄 Documents

### Purpose
**Store important household documents. Lease, insurance, contracts—all in one place.**

A simple file storage for documents you need to reference or can't lose.

### How It Works

**Uploading:**
1. Choose category (lease, insurance, medical, financial, legal, other)
2. Add optional description
3. Select file (PDF, Word, or images)
4. Click "Choose File" to upload

**Accessing:**
- All documents listed newest first
- Click "Download" to get a copy
- Delete if no longer needed

**File Management:**
- Max file size: 50MB
- Stored in Supabase Storage
- Only accessible to authenticated users
- Each household has separate folder

### Design Philosophy

**What it does:**
- ✅ Simple categorization
- ✅ Quick upload and download
- ✅ Shows who uploaded and when
- ✅ Secure storage (private bucket)

**What it DOESN'T do:**
- ❌ No version control
- ❌ No document editing
- ❌ No OCR or search
- ❌ No sharing outside household
- ❌ No expiration tracking

**Why:**
This is for *reference*, not management. Lease agreement? Insurance policy? Store it here. Need to check something? Download it. That's it.

### Supported File Types

- **PDFs**: Contracts, forms, scanned documents
- **Word Docs**: .doc, .docx
- **Images**: .jpg, .jpeg, .png (for scanned documents)

---

## 🔧 Setup Instructions

### 1. Run Database Migration

In Supabase SQL Editor, run:

```sql
-- Copy contents of supabase-grocery-docs-schema.sql
```

This creates:
- `grocery_items` table
- `documents` table
- Indexes, RLS policies, triggers
- Realtime subscriptions

### 2. Create Storage Bucket

In Supabase Dashboard:
1. Go to **Storage** in left sidebar
2. Click **"New bucket"**
3. Name: `household-documents`
4. **Public**: Uncheck (keep private)
5. **File size limit**: 50MB
6. Click **"Create bucket"**

### 3. Configure Storage Policies

In the `household-documents` bucket settings:

**Upload policy:**
```sql
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'household-documents');
```

**Download policy:**
```sql
CREATE POLICY "Authenticated users can download documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'household-documents');
```

**Delete policy:**
```sql
CREATE POLICY "Authenticated users can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'household-documents');
```

### 4. Deploy

Push your code to trigger Vercel rebuild:

```bash
git add .
git commit -m "feat: add grocery list and document storage"
git push
```

---

## 📊 Database Schema

### grocery_items

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| household_id | TEXT | Links to household |
| item_name | TEXT | What to buy |
| category | TEXT | produce, dairy, etc |
| is_checked | BOOLEAN | In cart? |
| added_by | UUID | Who added it |
| checked_by | UUID | Who checked it |
| checked_at | TIMESTAMP | When checked |
| created_at | TIMESTAMP | When added |

### documents

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| household_id | TEXT | Links to household |
| file_name | TEXT | Original filename |
| file_type | TEXT | Extension (pdf, jpg) |
| file_size | INTEGER | Bytes |
| storage_path | TEXT | Path in Storage |
| category | TEXT | lease, insurance, etc |
| description | TEXT | Optional note |
| uploaded_by | UUID | Who uploaded |
| created_at | TIMESTAMP | Upload date |

---

## 🎨 UI/UX Details

### Grocery List

**Categories with Emojis:**
- 🥬 Produce
- 🥛 Dairy
- 🥫 Pantry
- 🍖 Meat
- 🧊 Frozen
- 🛒 Other

**Visual Hierarchy:**
1. Add form (always visible)
2. Unchecked items (what you need)
3. Checked items (in cart - collapsed)

**Mobile Optimized:**
- Large touch targets
- Single-column layout
- Quick add/check flow

### Documents

**Categories with Emojis:**
- 🏠 Lease/Rent
- 🛡️ Insurance
- ⚕️ Medical
- 💰 Financial
- 📋 Legal
- 📄 Other

**File Type Icons:**
- 📕 PDF
- 📘 Word Doc
- 🖼️ Image
- 📄 Other

**Card Layout:**
- Icon on left
- Filename + metadata
- Download + delete on right

---

## ⚠️ Important Notes

### Storage Costs

Supabase free tier includes:
- **1GB storage**
- **2GB bandwidth/month**

For a two-person household:
- ~50 documents × 2MB avg = 100MB
- Well within free tier

### Security

- ✅ Files stored in private bucket
- ✅ RLS policies enforce authentication
- ✅ Download requires valid session
- ✅ Each household has separate folder

### Limitations

**Grocery List:**
- No quantities (by design)
- No history tracking
- Checked items cleared manually

**Documents:**
- No folder structure (flat list)
- No previews (download to view)
- No sharing outside household
- No encryption beyond Supabase's standard

---

## 🚀 Future Enhancements (Optional)

**Grocery:**
- Common items quick-add buttons
- Sort by aisle/store layout
- Voice input for adding items

**Documents:**
- Preview PDFs in-browser
- OCR for scanned documents
- Document expiration reminders
- Tags instead of single category

**Not planning to add:**
- ❌ Meal planning
- ❌ Budget tracking
- ❌ Recipe integration
- ❌ Price comparison
- ❌ Version control

---

**Built to reduce friction, not add features.** 🏡
