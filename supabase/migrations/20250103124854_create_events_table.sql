-- Create enum for event types
CREATE TYPE event_type AS ENUM ('exhibition', 'performance', 'opening', 'workshop');

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type event_type NOT NULL,
  venue text NOT NULL,
  address text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  area text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  -- Add constraint to ensure date is not in the past
  CONSTRAINT future_date CHECK (date >= CURRENT_DATE)
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policies

-- Allow anyone to view events
CREATE POLICY "Anyone can view events"
  ON events
  FOR SELECT
  USING (true);

-- Allow authenticated users to create events
CREATE POLICY "Authenticated users can create events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own events
CREATE POLICY "Users can update their own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own events
CREATE POLICY "Users can delete their own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX events_date_idx ON events (date);
CREATE INDEX events_type_idx ON events (type);
CREATE INDEX events_area_idx ON events (area);
CREATE INDEX events_user_id_idx ON events (user_id);