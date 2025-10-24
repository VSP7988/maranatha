/*
  # Create worship management tables

  1. New Tables
    - `worship_banners`
      - `id` (uuid, primary key)
      - `title` (text)
      - `image_url` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `worship_content`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `position` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage content
    - Add policies for public users to read active content
*/

-- Create worship_banners table
CREATE TABLE IF NOT EXISTS worship_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create worship_content table
CREATE TABLE IF NOT EXISTS worship_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  position integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE worship_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE worship_content ENABLE ROW LEVEL SECURITY;

-- Create policies for worship_banners
CREATE POLICY "Authenticated users can manage worship banners"
  ON worship_banners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active worship banners"
  ON worship_banners
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create policies for worship_content
CREATE POLICY "Authenticated users can manage worship content"
  ON worship_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active worship content"
  ON worship_content
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS worship_banners_active_idx ON worship_banners (is_active);
CREATE INDEX IF NOT EXISTS worship_banners_created_at_idx ON worship_banners (created_at);

CREATE INDEX IF NOT EXISTS worship_content_active_idx ON worship_content (is_active);
CREATE INDEX IF NOT EXISTS worship_content_position_idx ON worship_content (position);
CREATE INDEX IF NOT EXISTS worship_content_created_at_idx ON worship_content (created_at);