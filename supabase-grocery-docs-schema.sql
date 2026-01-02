-- Grocery List and Documents Schema
-- Add these tables to your existing Supabase database

-- Grocery list items table
CREATE TABLE IF NOT EXISTS grocery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT, -- 'produce', 'dairy', 'pantry', 'meat', 'frozen', 'other'
  is_checked BOOLEAN DEFAULT FALSE,
  added_by UUID REFERENCES users(id) NOT NULL,
  checked_by UUID REFERENCES users(id),
  checked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table (metadata - actual files stored in Supabase Storage)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT, -- 'pdf', 'image', 'doc', etc
  file_size INTEGER, -- in bytes
  storage_path TEXT NOT NULL, -- path in Supabase Storage
  category TEXT, -- 'lease', 'insurance', 'medical', 'financial', 'other'
  description TEXT,
  uploaded_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_grocery_household ON grocery_items(household_id);
CREATE INDEX IF NOT EXISTS idx_grocery_checked ON grocery_items(is_checked);
CREATE INDEX IF NOT EXISTS idx_documents_household ON documents(household_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);

-- Enable RLS
ALTER TABLE grocery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for grocery_items
CREATE POLICY "Authenticated users can view grocery items"
  ON grocery_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create grocery items"
  ON grocery_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update grocery items"
  ON grocery_items FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete grocery items"
  ON grocery_items FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for documents
CREATE POLICY "Authenticated users can view documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can upload documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete documents"
  ON documents FOR DELETE
  TO authenticated
  USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_grocery_items_updated_at BEFORE UPDATE ON grocery_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE grocery_items;
ALTER PUBLICATION supabase_realtime ADD TABLE documents;

-- Create storage bucket for documents (run this separately in Supabase Storage UI or via API)
-- Bucket name: 'household-documents'
-- Public: false
-- File size limit: 50MB
-- Allowed MIME types: application/pdf, image/*, application/msword, application/vnd.openxmlformats-officedocument.*
