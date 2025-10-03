/*
  # Create Yuvanidhi Management Tables

  1. New Tables
    - `yuvanidhi_banners`
      - `id` (uuid, primary key)
      - `title` (text)
      - `image_url` (text, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `yuvanidhi_content`
      - `id` (uuid, primary key)
      - `description` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `yuvanidhi_statistics`
      - `id` (uuid, primary key)
      - `label` (text)
      - `value` (text)
      - `icon` (text, default 'Users')
      - `position` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
    - Add policies for public to read active content
*/

-- Create yuvanidhi_banners table
CREATE TABLE IF NOT EXISTS yuvanidhi_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create yuvanidhi_content table
CREATE TABLE IF NOT EXISTS yuvanidhi_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create yuvanidhi_statistics table
CREATE TABLE IF NOT EXISTS yuvanidhi_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  icon text DEFAULT 'Users',
  position integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE yuvanidhi_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE yuvanidhi_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE yuvanidhi_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies for yuvanidhi_banners
CREATE POLICY "Authenticated users can manage yuvanidhi banners"
  ON yuvanidhi_banners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active yuvanidhi banners"
  ON yuvanidhi_banners
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create policies for yuvanidhi_content
CREATE POLICY "Authenticated users can manage yuvanidhi content"
  ON yuvanidhi_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active yuvanidhi content"
  ON yuvanidhi_content
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create policies for yuvanidhi_statistics
CREATE POLICY "Authenticated users can manage yuvanidhi statistics"
  ON yuvanidhi_statistics
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active yuvanidhi statistics"
  ON yuvanidhi_statistics
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS yuvanidhi_banners_active_idx ON yuvanidhi_banners (is_active);
CREATE INDEX IF NOT EXISTS yuvanidhi_banners_created_at_idx ON yuvanidhi_banners (created_at);

CREATE INDEX IF NOT EXISTS yuvanidhi_content_active_idx ON yuvanidhi_content (is_active);
CREATE INDEX IF NOT EXISTS yuvanidhi_content_created_at_idx ON yuvanidhi_content (created_at);

CREATE INDEX IF NOT EXISTS yuvanidhi_statistics_active_idx ON yuvanidhi_statistics (is_active);
CREATE INDEX IF NOT EXISTS yuvanidhi_statistics_position_idx ON yuvanidhi_statistics (position);