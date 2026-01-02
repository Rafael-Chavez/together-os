# Design Rationale

This document explains **why** every feature exists and how it avoids blame/pressure.

---

## Core Problem

**Couples need to coordinate household tasks, but existing tools either:**
1. Feel like work software (Trello, Asana)
2. Are too social (shared calendars with notifications)
3. Create guilt through metrics and streaks
4. Don't reduce mental load—they add to it

**Together OS is different**: It's a calm, private space that reduces friction without creating new stress.

---

## Feature Breakdown

### 1. Tasks & Chores

**Problem it solves:**
- "Did you take out the trash?" "I did it last time!"
- Mental load of remembering recurring chores
- Unclear division of labor

**Implementation:**
- Create one-time or recurring tasks
- Optionally assign to someone (or leave unassigned)
- Mark complete when done
- See who completed it (for context, not blame)

**Blame-free design choices:**

| **What we DIDN'T do** | **Why** | **What we DID instead** |
|----------------------|---------|------------------------|
| Overdue labels in red | Creates pressure and guilt | No due dates—just "next due" for recurring tasks |
| Notifications | Interrupts and nags | Pull-based—check when you want |
| Streaks or points | Gamifies what should be partnership | Simple completion history |
| Force assignment | Creates resentment if uneven | Allow unassigned tasks ("anyone can do it") |
| Show "completion rate" | Turns it into a scorecard | Just show who did what, neutrally |

**Edge case handled:**
- If someone always does the same task, that's visible—but the UI doesn't judge. The couple can discuss, not the app.

---

### 2. Obligations (Bills & Payments)

**Problem it solves:**
- Forgetting to pay rent/utilities
- "Did we pay the electric bill?" "I thought you did!"
- Lack of shared financial memory

**Implementation:**
- List recurring bills with due dates
- Mark as paid each month
- Optionally track amount and add notes

**Blame-free design choices:**

| **What we DIDN'T do** | **Why** | **What we DID instead** |
|----------------------|---------|------------------------|
| Auto-charge reminders | Creates anxiety | Just track status—you decide when to pay |
| Show who paid more | Creates resentment | Just show who paid this month (neutral) |
| Split payment tracking | Assumes 50/50, which may not fit all couples | Let couples handle splitting however they want |
| Late fees or warnings | Adds stress | Calm display of due day—no panic |

**Edge case handled:**
- If one person always pays bills, that's fine. The app just makes it visible so the other person knows it's handled.

---

### 3. Shared Notes

**Problem it solves:**
- Scattered info in texts, sticky notes, memory
- "Where did we write that down?"
- Agreements get forgotten

**Implementation:**
- Simple title + content notes
- Both can create and edit
- Shows who last edited (for freshness, not accountability)

**Blame-free design choices:**

| **What we DIDN'T do** | **Why** | **What we DID instead** |
|----------------------|---------|------------------------|
| Version history | Creates "who changed what" drama | Just show last editor—live document |
| Comment threads | Turns it into a discussion tool | Keep it simple—use for reference, not debate |
| Categories or tags | Adds complexity | Flat list—it's just two people, search mentally |
| Permissions | Implies lack of trust | Full edit access for both |

**Edge case handled:**
- If both edit at the same time, last save wins. For two people who communicate, this is fine.

---

### 4. Weekly Check-In

**Problem it solves:**
- Household management becomes transactional
- Partners drift apart while managing logistics
- No space for feelings/reflection

**Implementation:**
- Once per week, write how you're feeling
- See your partner's check-in when they post it
- Open-ended—no prompts or requirements

**Blame-free design choices:**

| **What we DIDN'T do** | **Why** | **What we DID instead** |
|----------------------|---------|------------------------|
| Daily prompts | Too much—creates burden | Weekly cadence—sustainable |
| Prompt questions | Feels like therapy homework | Open-ended—write what matters to you |
| "Both must complete" | Creates pressure | Each person posts when ready |
| Reactions or replies | Turns it into a chat | Read-only after posting—discuss in person |
| Streak tracking | Gamifies vulnerability | No metrics—just connection |

**Edge case handled:**
- If one person never checks in, that's visible—but the UI doesn't nag. The couple can talk about it.

---

## Why These Features? Why Not Others?

### Included in MVP:
- **Tasks**: Biggest source of household friction
- **Obligations**: Prevents costly mistakes (late bills)
- **Notes**: Reduces mental load of remembering things
- **Check-ins**: Keeps relationship human

### Not Included (and why):

| **Feature** | **Why Excluded** |
|-------------|------------------|
| Calendar | Most couples already have shared calendars. Adds complexity without solving a unique problem. |
| Expense splitting | Assumes financial relationship structure. Too opinionated for MVP. |
| Grocery lists | Solved by existing apps (AnyList, etc.). Not household-specific. |
| Photo/doc storage | Google Drive/iCloud already do this well. Not a unique pain point. |
| Messaging | Texting exists. Don't recreate it. |
| Habit tracking | Turns partnership into self-improvement project. Wrong vibe. |

---

## UI/UX Philosophy

### Calm Design Principles

1. **No red**
   - Red triggers anxiety
   - We use warm neutrals and soft green

2. **No numbers as metrics**
   - "7 tasks completed" becomes a scorecard
   - We just show the list

3. **No "overdue" or "late"**
   - Life happens—labeling things overdue creates guilt
   - We show status neutrally

4. **No notifications**
   - Interruptions create stress
   - Everything is pull-based

5. **Large touch targets**
   - Mobile-first
   - Easy to use when tired or distracted

6. **Generous whitespace**
   - Reduces visual clutter
   - Feels calm, not overwhelming

---

## Technical Philosophy

### Keep It Simple

- **No over-engineering**: This is for two people, not a startup
- **No microservices**: Supabase + Firebase is plenty
- **No state management library**: React context is enough
- **No CSS framework**: Vanilla CSS keeps it customizable
- **No routing**: Single-page app with tabs is simpler

### Privacy-First

- **No analytics**: You don't need to track yourselves
- **No third-party integrations**: Your data stays with Firebase/Supabase
- **No social features**: This is private by design
- **Household ID isolation**: Your data is only yours

---

## Success Criteria

This tool succeeds if:

1. You check it 2-3 times per week (not daily—that's too much)
2. You have fewer "did you...?" conversations
3. You feel less mental load
4. It doesn't create new guilt or stress
5. You forget it's there (in a good way—it's just part of life)

---

## What This Is NOT

- ❌ A productivity tool
- ❌ A project manager
- ❌ A habit tracker
- ❌ A relationship therapy app
- ❌ A social network

## What This IS

- ✅ Shared memory
- ✅ Gentle accountability
- ✅ Mental load reducer
- ✅ Connection preserver
- ✅ Calm household operating system

---

**Built with intention. Kept simple on purpose.**
