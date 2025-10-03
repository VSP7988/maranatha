/*
  # Create About Management Table

  1. New Tables
    - `about`
      - `id` (uuid, primary key)
      - `title` (text)
      - `subtitle` (text)
      - `description` (text)
      - `stats` (jsonb) - for statistics like families, ministries, years
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `about` table
    - Add policy for authenticated users to manage about content
    - Add policy for public to read active about content

  3. Sample Data
    - Insert default about content
*/

CREATE TABLE IF NOT EXISTS about (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text NOT NULL,
  stats jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE about ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage about content"
  ON about
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active about content"
  ON about
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS about_active_idx ON about (is_active);
CREATE INDEX IF NOT EXISTS about_created_at_idx ON about (created_at);

-- Insert default about content
INSERT INTO about (title, subtitle, description, stats, is_active) VALUES
(
  'WE''RE PEOPLE JUST LIKE YOU',
  'Everyone is welcome.',
  'Seriously. Every week at Maranatha Temple, Christians and non-Christians, seekers and skeptics, the fired-up and the burned-out all come together to learn the ins and outs of Jesus'' great invitation into a new life.',
  '[
    {"label": "Families", "value": "500+", "icon": "Heart"},
    {"label": "Ministries", "value": "15", "icon": "Users"},
    {"label": "Years", "value": "10", "icon": "Sparkles"}
  ]'::jsonb,
  true
);