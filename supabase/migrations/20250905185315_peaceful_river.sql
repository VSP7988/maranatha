/*
  # Create events table

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `location` (text, required)
      - `event_date` (date, required)
      - `event_time` (time, required)
      - `image_url` (text, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `events` table
    - Add policy for authenticated users to manage events
    - Add policy for public to read active events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  location text NOT NULL,
  event_date date NOT NULL,
  event_time time NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to manage events
CREATE POLICY "Authenticated users can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for public to read active events
CREATE POLICY "Public can read active events"
  ON events
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS events_active_idx ON events (is_active);
CREATE INDEX IF NOT EXISTS events_date_idx ON events (event_date);
CREATE INDEX IF NOT EXISTS events_created_at_idx ON events (created_at);

-- Insert sample events
INSERT INTO events (title, description, location, event_date, event_time, image_url, is_active) VALUES
('Sunday Worship Service', 'Join us for uplifting worship and inspiring messages that transform hearts.', 'Main Sanctuary', '2024-12-22', '09:00:00', 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Youth Night', 'High-energy worship designed for teens and young adults with relevant messages.', 'Youth Hall', '2024-12-23', '19:00:00', 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Prayer Meeting', 'Mid-week prayer and worship sessions for deeper spiritual connection.', 'Prayer Hall', '2024-12-25', '19:30:00', 'https://images.pexels.com/photos/8468669/pexels-photo-8468669.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Family Fun Day', 'A day of fun activities, games, and fellowship for the whole family.', 'Church Grounds', '2024-12-28', '10:00:00', 'https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('New Year Service', 'Welcome the new year with worship, prayer, and celebration.', 'Main Sanctuary', '2024-12-31', '22:00:00', 'https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Bible Study', 'Weekly Bible study sessions for spiritual growth and fellowship.', 'Fellowship Hall', '2024-12-24', '19:00:00', 'https://images.pexels.com/photos/1701202/pexels-photo-1701202.jpeg?auto=compress&cs=tinysrgb&w=800', true);