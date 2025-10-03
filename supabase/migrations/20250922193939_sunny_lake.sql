/*
  # Create TV Ministry Management Tables

  1. New Tables
    - `tv_ministry_banners`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `image_url` (text, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tv_ministry_logos`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `image_url` (text, optional)
      - `position` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage content
    - Add policies for public users to read active content

  3. Indexes
    - Add indexes for performance on commonly queried columns
*/

-- Create TV Ministry Banners table
CREATE TABLE IF NOT EXISTS tv_ministry_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create TV Ministry Logos table
CREATE TABLE IF NOT EXISTS tv_ministry_logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  position integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tv_ministry_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_ministry_logos ENABLE ROW LEVEL SECURITY;

-- Create policies for tv_ministry_banners
CREATE POLICY "Authenticated users can manage TV ministry banners"
  ON tv_ministry_banners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active TV ministry banners"
  ON tv_ministry_banners
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create policies for tv_ministry_logos
CREATE POLICY "Authenticated users can manage TV ministry logos"
  ON tv_ministry_logos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active TV ministry logos"
  ON tv_ministry_logos
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS tv_ministry_banners_active_idx ON tv_ministry_banners (is_active);
CREATE INDEX IF NOT EXISTS tv_ministry_banners_created_at_idx ON tv_ministry_banners (created_at);

CREATE INDEX IF NOT EXISTS tv_ministry_logos_active_idx ON tv_ministry_logos (is_active);
CREATE INDEX IF NOT EXISTS tv_ministry_logos_position_idx ON tv_ministry_logos (position);
CREATE INDEX IF NOT EXISTS tv_ministry_logos_created_at_idx ON tv_ministry_logos (created_at);