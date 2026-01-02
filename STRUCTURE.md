# Project Structure

## Directory Layout

```
together-os/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.js        # Authentication UI
│   │   │   └── Login.css
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.js    # Main app container with tabs
│   │   │   └── Dashboard.css
│   │   ├── Tasks/
│   │   │   ├── Tasks.js        # Task list with realtime updates
│   │   │   ├── TaskForm.js     # Create task form
│   │   │   ├── TaskItem.js     # Individual task display
│   │   │   └── Tasks.css
│   │   ├── Obligations/
│   │   │   ├── Obligations.js  # Obligations list
│   │   │   ├── ObligationForm.js
│   │   │   ├── ObligationItem.js
│   │   │   └── Obligations.css
│   │   ├── Notes/
│   │   │   ├── Notes.js        # Shared notes list
│   │   │   ├── NoteForm.js     # Create/edit note
│   │   │   ├── NoteItem.js
│   │   │   └── Notes.css
│   │   └── CheckIn/
│   │       ├── CheckIn.js      # Weekly check-in view
│   │       └── CheckIn.css
│   ├── contexts/
│   │   └── AuthContext.js      # Firebase auth + user state
│   ├── config/
│   │   ├── firebase.js         # Firebase initialization
│   │   └── supabase.js         # Supabase client
│   ├── App.js                  # Root component (auth routing)
│   ├── index.js                # React entry point
│   └── index.css               # Global styles + design system
├── .env                        # Environment variables (gitignored)
├── .env.example                # Template for setup
├── .gitignore
├── package.json
├── supabase-schema.sql         # Database schema
├── README.md                   # Project overview
├── SETUP.md                    # Step-by-step setup guide
└── STRUCTURE.md                # This file
```

---

## Data Flow

### Authentication
1. User enters email/password in `Login.js`
2. `AuthContext` calls Firebase Auth
3. On success, Firebase UID is synced to Supabase `users` table
4. `AuthContext` provides `currentUser` and `userProfile` to all components

### Data Operations
1. Components use Supabase client directly (no API layer needed for MVP)
2. All queries filter by `HOUSEHOLD_ID` (from env)
3. Realtime subscriptions update UI automatically when data changes
4. Row Level Security (RLS) policies ensure data isolation

---

## Component Patterns

### List Components (Tasks, Obligations, Notes)
- Fetch data on mount
- Subscribe to realtime updates
- Show form on button click
- Display items in a list
- Handle delete with confirmation

### Form Components
- Controlled inputs (useState)
- Submit handler creates/updates via Supabase
- Call parent's `onSuccess` callback to close form

### Item Components
- Display individual record
- Toggle actions (complete task, pay obligation)
- Expand/collapse for details
- Delete button with confirmation

---

## Styling Approach

### Design System (src/index.css)
- CSS variables for colors, spacing, typography
- Mobile-first responsive utilities
- Calm, warm color palette (neutral with green accent)

### Component Styles
- Each component has its own CSS file
- No CSS-in-JS, no Tailwind (keeps it simple)
- BEM-like naming (e.g., `.task-item`, `.task-title`)

---

## State Management

### Global State
- `AuthContext`: Current user, Firebase auth state, sign in/out methods
- No Redux, no Zustand (not needed for this scope)

### Local State
- Each component manages its own loading, form, and UI state
- Supabase realtime keeps data in sync across clients

---

## Key Design Decisions

### Why no API layer?
For two users, Supabase client-side queries are fine. RLS handles security.

### Why separate CSS files?
Easier to read, easier to customize, no build tooling complexity.

### Why Firebase + Supabase?
- Firebase Auth is battle-tested and simple
- Supabase gives us PostgreSQL power + realtime subscriptions
- Best of both worlds

### Why no routing?
Single-page dashboard with tabs is simpler for this use case.

---

## Database Schema

See `supabase-schema.sql` for full details. Key tables:

- `users`: Synced from Firebase, links to household
- `tasks`: Tasks and chores with recurring support
- `obligations`: Bills and payments
- `notes`: Shared text documents
- `check_ins`: Weekly reflections

All tables have:
- `household_id` for data isolation
- `created_at` and `updated_at` timestamps
- RLS policies for security

---

## Extension Points

### Adding a New Feature

1. Create component folder in `src/components/`
2. Add tab to `Dashboard.js`
3. Create Supabase table (update schema)
4. Follow the list/form/item pattern
5. Add realtime subscription

### Customizing UI

- Colors: Edit CSS variables in `src/index.css`
- Fonts: Update `--font-sans` variable
- Spacing: Adjust `--space-*` variables

### Adding Third-party Services

- Create new file in `src/config/`
- Import in components as needed
- Add credentials to `.env`

---

## Performance Considerations

- Realtime subscriptions are efficient (only sends diffs)
- Small dataset (two users, personal use)
- No pagination needed
- CSS is minimal and loads fast

---

## Testing Strategy (Future)

- Manual testing sufficient for MVP
- Future: Add React Testing Library for components
- Future: Add Playwright for E2E
- Database is already in transactions (Supabase handles it)

---

## Deployment Checklist

- [ ] Set environment variables in hosting platform
- [ ] Verify `.env` is in `.gitignore`
- [ ] Test with both user accounts
- [ ] Verify realtime updates work
- [ ] Check mobile responsiveness
- [ ] Set up custom domain (optional)

---

This structure keeps the codebase simple, predictable, and easy to modify.
