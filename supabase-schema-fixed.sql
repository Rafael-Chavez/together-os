-- Together OS Database Schema - FIXED RLS Policies
-- Run this in your Supabase SQL editor

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view household members" ON users;
DROP POLICY IF EXISTS "Users can view household tasks" ON tasks;
DROP POLICY IF EXISTS "Users can create household tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update household tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete household tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view household obligations" ON obligations;
DROP POLICY IF EXISTS "Users can create household obligations" ON obligations;
DROP POLICY IF EXISTS "Users can update household obligations" ON obligations;
DROP POLICY IF EXISTS "Users can delete household obligations" ON obligations;
DROP POLICY IF EXISTS "Users can view household notes" ON notes;
DROP POLICY IF EXISTS "Users can create household notes" ON notes;
DROP POLICY IF EXISTS "Users can update household notes" ON notes;
DROP POLICY IF EXISTS "Users can delete household notes" ON notes;
DROP POLICY IF EXISTS "Users can view household check-ins" ON check_ins;
DROP POLICY IF EXISTS "Users can create their own check-ins" ON check_ins;
DROP POLICY IF EXISTS "Users can update their own check-ins" ON check_ins;

-- FIXED RLS Policies - Allow authenticated users to access their household data

-- Users table - authenticated users can view all users
CREATE POLICY "Authenticated users can view users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Tasks policies - authenticated users can manage tasks
CREATE POLICY "Authenticated users can view tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (true);

-- Obligations policies - authenticated users can manage obligations
CREATE POLICY "Authenticated users can view obligations"
  ON obligations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create obligations"
  ON obligations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update obligations"
  ON obligations FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete obligations"
  ON obligations FOR DELETE
  TO authenticated
  USING (true);

-- Notes policies - authenticated users can manage notes
CREATE POLICY "Authenticated users can view notes"
  ON notes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create notes"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update notes"
  ON notes FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete notes"
  ON notes FOR DELETE
  TO authenticated
  USING (true);

-- Check-ins policies - authenticated users can manage check-ins
CREATE POLICY "Authenticated users can view check-ins"
  ON check_ins FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create check-ins"
  ON check_ins FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update check-ins"
  ON check_ins FOR UPDATE
  TO authenticated
  USING (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE obligations;
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
ALTER PUBLICATION supabase_realtime ADD TABLE check_ins;
