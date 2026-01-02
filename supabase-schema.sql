-- Together OS Database Schema
-- Run this in your Supabase SQL editor

-- Users table (linked to Firebase auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT,
  household_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id) NOT NULL,
  is_complete BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID REFERENCES users(id),

  -- Recurring task fields
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT, -- 'daily', 'weekly', 'monthly'
  recurrence_interval INTEGER DEFAULT 1,
  next_due_date DATE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Obligations table (rent, utilities, etc)
CREATE TABLE obligations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id TEXT NOT NULL,
  title TEXT NOT NULL,
  amount DECIMAL(10,2),
  due_day INTEGER, -- day of month (1-31)
  category TEXT, -- 'rent', 'utilities', 'internet', 'other'
  notes TEXT,
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP WITH TIME ZONE,
  paid_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shared notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_by UUID REFERENCES users(id) NOT NULL,
  last_edited_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly check-ins table
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  week_start_date DATE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure one check-in per user per week
  UNIQUE(user_id, week_start_date)
);

-- Indexes for performance
CREATE INDEX idx_tasks_household ON tasks(household_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_next_due ON tasks(next_due_date) WHERE is_recurring = TRUE;
CREATE INDEX idx_obligations_household ON obligations(household_id);
CREATE INDEX idx_notes_household ON notes(household_id);
CREATE INDEX idx_checkins_household ON check_ins(household_id);
CREATE INDEX idx_checkins_week ON check_ins(week_start_date);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- Users can read all household members
CREATE POLICY "Users can view household members"
  ON users FOR SELECT
  USING (household_id = current_setting('app.household_id', TRUE));

-- Tasks policies
CREATE POLICY "Users can view household tasks"
  ON tasks FOR SELECT
  USING (household_id = current_setting('app.household_id', TRUE));

CREATE POLICY "Users can create household tasks"
  ON tasks FOR INSERT
  WITH CHECK (household_id = current_setting('app.household_id', TRUE));

CREATE POLICY "Users can update household tasks"
  ON tasks FOR UPDATE
  USING (household_id = current_setting('app.household_id', TRUE));

CREATE POLICY "Users can delete household tasks"
  ON tasks FOR DELETE
  USING (household_id = current_setting('app.household_id', TRUE));

-- Obligations policies
CREATE POLICY "Users can view household obligations"
  ON obligations FOR SELECT
  USING (household_id = current_setting('app.household_id', TRUE));

CREATE POLICY "Users can create household obligations"
  ON obligations FOR INSERT
  WITH CHECK (household_id = current_setting('app.household_id', TRUE));

CREATE POLICY "Users can update household obligations"
  ON obligations FOR UPDATE
  USING (household_id = current_setting('app.household_id', TRUE));

CREATE POLICY "Users can delete household obligations"
  ON obligations FOR DELETE
  USING (household_id = current_setting('app.household_id', TRUE));

-- Notes policies
CREATE POLICY "Users can view household notes"
  ON notes FOR SELECT
  USING (household_id = current_setting('app.household_id', TRUE));

CREATE POLICY "Users can create household notes"
  ON notes FOR INSERT
  WITH CHECK (household_id = current_setting('app.household_id', TRUE));

CREATE POLICY "Users can update household notes"
  ON notes FOR UPDATE
  USING (household_id = current_setting('app.household_id', TRUE));

CREATE POLICY "Users can delete household notes"
  ON notes FOR DELETE
  USING (household_id = current_setting('app.household_id', TRUE));

-- Check-ins policies
CREATE POLICY "Users can view household check-ins"
  ON check_ins FOR SELECT
  USING (household_id = current_setting('app.household_id', TRUE));

CREATE POLICY "Users can create their own check-ins"
  ON check_ins FOR INSERT
  WITH CHECK (household_id = current_setting('app.household_id', TRUE));

CREATE POLICY "Users can update their own check-ins"
  ON check_ins FOR UPDATE
  USING (user_id::text = current_setting('app.user_id', TRUE));

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_obligations_updated_at BEFORE UPDATE ON obligations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_checkins_updated_at BEFORE UPDATE ON check_ins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
