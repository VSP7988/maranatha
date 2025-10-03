/*
  # Create Prayer Hut Management Tables

  1. New Tables
    - `prayer_hut_banners`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `image_url` (text, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `prayer_hut_content`
      - `id` (uuid, primary key)
      - `description` (text, required)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `prayer_hut_statistics`
      - `id` (uuid, primary key)
      - `label` (text, required)
      - `value` (text, required)
      - `icon` (text, default 'Heart')
      - `position` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
    - Add policies for public to read active content

  3. Indexes
    - Add indexes for performance on active status, position, and created_at columns
*/

-- Prayer Hut Banners Table
CREATE TABLE IF NOT EXISTS prayer_hut_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Prayer Hut Content Table
CREATE TABLE IF NOT EXISTS prayer_hut_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Prayer Hut Statistics Table
CREATE TABLE IF NOT EXISTS prayer_hut_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  icon text DEFAULT 'Heart',
  position integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE prayer_hut_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_hut_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_hut_statistics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Prayer Hut Banners
CREATE POLICY "Authenticated users can manage prayer hut banners"
  ON prayer_hut_banners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active prayer hut banners"
  ON prayer_hut_banners
  FOR SELECT
  TO anon
  USING (is_active = true);

-- RLS Policies for Prayer Hut Content
CREATE POLICY "Authenticated users can manage prayer hut content"
  ON prayer_hut_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active prayer hut content"
  ON prayer_hut_content
  FOR SELECT
  TO anon
  USING (is_active = true);

-- RLS Policies for Prayer Hut Statistics
CREATE POLICY "Authenticated users can manage prayer hut statistics"
  ON prayer_hut_statistics
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active prayer hut statistics"
  ON prayer_hut_statistics
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS prayer_hut_banners_active_idx ON prayer_hut_banners (is_active);
CREATE INDEX IF NOT EXISTS prayer_hut_banners_created_at_idx ON prayer_hut_banners (created_at);

CREATE INDEX IF NOT EXISTS prayer_hut_content_active_idx ON prayer_hut_content (is_active);
CREATE INDEX IF NOT EXISTS prayer_hut_content_created_at_idx ON prayer_hut_content (created_at);

CREATE INDEX IF NOT EXISTS prayer_hut_statistics_active_idx ON prayer_hut_statistics (is_active);
CREATE INDEX IF NOT EXISTS prayer_hut_statistics_position_idx ON prayer_hut_statistics (position);