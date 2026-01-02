# Together OS

A calm, private household operating system built for couples. Reduce mental load, share responsibilities, and stay connected—without notifications, gamification, or social features.

## Philosophy

Together OS is designed around three core principles:

1. **Reduce mental load** - Keep track of household responsibilities without constant reminders or stress
2. **Encourage shared accountability without blame** - See who's doing what without creating pressure or guilt
3. **Default to simplicity** - Only features that solve real problems, nothing extra

## Features

### Tasks & Chores
- Create one-time or recurring tasks
- Optional assignment to either person
- See completion history without judgment
- Simple recurring patterns (daily, weekly, monthly)

**Why it's in the MVP**: Chores are a major source of household friction. This reduces "who did what last" conversations.

**Blame-free design**:
- Tasks can be unassigned ("anyone can do it")
- Completion shows who did it, but UI is neutral
- No overdue labels or notifications

### Obligations
- Track rent, utilities, and recurring bills
- Set due dates and amounts
- Mark as paid each month
- Add notes for payment details

**Why it's in the MVP**: Forgetting bills causes stress. This is a shared memory system.

**Blame-free design**: Shows payment status without assigning responsibility or creating pressure.

### Shared Notes
- Keep agreements, lists, or reminders
- Both users can edit
- See who last updated

**Why it's in the MVP**: Replaces scattered texts, sticky notes, and "did we agree on this?" conversations.

**Blame-free design**: Shows last editor for context, not accountability.

### Weekly Check-In
- Private weekly reflection space
- Share how you're feeling
- Stay connected beyond logistics

**Why it's in the MVP**: Prevents household management from becoming purely transactional.

**Blame-free design**: No prompts, no metrics, just open space for connection.

## Tech Stack

- **Frontend**: React (functional components, hooks)
- **Authentication**: Firebase Auth
- **Database**: Supabase (PostgreSQL)
- **Styling**: Vanilla CSS (mobile-first, calm design)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Email/Password authentication
4. Create **exactly two user accounts** (one for each person)
5. Copy your Firebase config

### 3. Set Up Supabase

1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to SQL Editor and run the schema from `supabase-schema.sql`
4. Copy your Supabase URL and anon key
5. Generate a unique household ID (any random string, e.g., `household_abc123`)

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Fill in your credentials:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Household ID (shared between both users)
REACT_APP_HOUSEHOLD_ID=household_abc123
```

### 5. Run the App

```bash
npm start
```

The app will open at `http://localhost:3000`.

Both users should sign in with their Firebase credentials. All data is isolated to your household ID.

## Design Decisions

### Two-user constraint
This is intentionally not a scalable multi-user app. Building for exactly two people eliminates complexity and keeps the focus on partnership.

### Firebase + Supabase
- Firebase handles authentication (simple, secure, well-documented)
- Supabase handles data (real-time updates, PostgreSQL power, easier queries than Firestore)

### No notifications
Notifications create anxiety and pressure. Everything is pull-based—check when you want.

### Mobile-first, calm UI
- Neutral colors (warm grays, soft greens)
- Large touch targets
- Minimal chrome
- No badges, no red dots, no urgency cues

## Edge Cases Handled

1. **Recurring tasks** - Logic is scaffolded but basic. Future: auto-regenerate on completion.
2. **Obligation reset** - Currently manual. Future: auto-reset monthly.
3. **Data sync** - Real-time updates via Supabase subscriptions prevent conflicts.
4. **Concurrent edits** - Last write wins (acceptable for two users who communicate).

## Future Considerations (Not MVP)

- Calendar integration
- Expense splitting
- Photo/document storage
- Push notifications (opt-in only)
- Habit tracking

**These are intentionally excluded** to keep the MVP simple and avoid feature creep.

## Contributing

This is a private household tool. Fork it, customize it, make it yours.

## License

MIT
