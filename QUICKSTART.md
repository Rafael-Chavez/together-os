# Quick Start Guide

Get Together OS running in under 10 minutes.

## Prerequisites

- Node.js installed
- Firebase account
- Supabase account

---

## 1. Install Dependencies

```bash
npm install
```

---

## 2. Firebase Setup

1. Create project at https://console.firebase.google.com/
2. Enable Email/Password authentication
3. Create two user accounts
4. Copy config from Project Settings → Your apps → Web app

---

## 3. Supabase Setup

1. Create project at https://supabase.com/
2. Run the SQL from `supabase-schema.sql` in SQL Editor
3. Copy URL and anon key from Settings → API

---

## 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials.

**Important**: Set a unique `REACT_APP_HOUSEHOLD_ID` (e.g., `household_alex_jordan`)

---

## 5. Run

```bash
npm start
```

Open http://localhost:3000 and sign in!

---

## File Structure

```
together-os/
├── src/
│   ├── components/        # All UI components
│   │   ├── Auth/         # Login
│   │   ├── Dashboard/    # Main container
│   │   ├── Tasks/        # Task management
│   │   ├── Obligations/  # Bill tracking
│   │   ├── Notes/        # Shared notes
│   │   └── CheckIn/      # Weekly check-in
│   ├── contexts/         # Auth context
│   ├── config/           # Firebase + Supabase
│   └── index.css         # Global styles
├── public/
└── supabase-schema.sql   # Database schema
```

---

## Common Commands

```bash
# Development
npm start

# Build for production
npm run build

# Test production build locally
npx serve -s build
```

---

## Next Steps

- Read [SETUP.md](SETUP.md) for detailed instructions
- Read [README.md](README.md) for design philosophy
- Read [STRUCTURE.md](STRUCTURE.md) for architecture details

---

## Tips

- Both users must use the same `HOUSEHOLD_ID`
- Realtime updates work automatically via Supabase
- Mobile-first design—test on your phone
- Calm UI—no notifications or red badges
- Simple by design—don't add features unless truly needed
