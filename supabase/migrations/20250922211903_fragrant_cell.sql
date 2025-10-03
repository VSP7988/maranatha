/*
  # Create Vivaha Vedika Management Tables

  1. New Tables
    - `vivaha_vedika_banners`
      - `id` (uuid, primary key)
      - `title` (text)
      - `image_url` (text, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `vivaha_vedika_content`
      - `id` (uuid, primary key)
      - `description` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `vivaha_vedika_statistics`
      - `id` (uuid, primary key)
      - `label` (text)
      - `value` (text)
      - `icon` (text, default 'Heart')
      - `position` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `vivaha_vedika_pdfs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text, optional)
      - `pdf_url` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
    - Add policies for public users to read active content

  3. Indexes
    - Add indexes for performance optimization
*/

-- Create vivaha_vedika_banners table
CREATE TABLE IF NOT EXISTS vivaha_vedika_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vivaha_vedika_content table
CREATE TABLE IF NOT EXISTS vivaha_vedika_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vivaha_vedika_statistics table
CREATE TABLE IF NOT EXISTS vivaha_vedika_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  icon text DEFAULT 'Heart',
  position integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vivaha_vedika_pdfs table
CREATE TABLE IF NOT EXISTS vivaha_vedika_pdfs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  pdf_url text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE vivaha_vedika_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE vivaha_vedika_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE vivaha_vedika_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE vivaha_vedika_pdfs ENABLE ROW LEVEL SECURITY;

-- Create policies for vivaha_vedika_banners
CREATE POLICY "Authenticated users can manage vivaha vedika banners"
  ON vivaha_vedika_banners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active vivaha vedika banners"
  ON vivaha_vedika_banners
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create policies for vivaha_vedika_content
CREATE POLICY "Authenticated users can manage vivaha vedika content"
  ON vivaha_vedika_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active vivaha vedika content"
  ON vivaha_vedika_content
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create policies for vivaha_vedika_statistics
CREATE POLICY "Authenticated users can manage vivaha vedika statistics"
  ON vivaha_vedika_statistics
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active vivaha vedika statistics"
  ON vivaha_vedika_statistics
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create policies for vivaha_vedika_pdfs
CREATE POLICY "Authenticated users can manage vivaha vedika pdfs"
  ON vivaha_vedika_pdfs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active vivaha vedika pdfs"
  ON vivaha_vedika_pdfs
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS vivaha_vedika_banners_active_idx ON vivaha_vedika_banners (is_active);
CREATE INDEX IF NOT EXISTS vivaha_vedika_banners_created_at_idx ON vivaha_vedika_banners (created_at);

CREATE INDEX IF NOT EXISTS vivaha_vedika_content_active_idx ON vivaha_vedika_content (is_active);
CREATE INDEX IF NOT EXISTS vivaha_vedika_content_created_at_idx ON vivaha_vedika_content (created_at);

CREATE INDEX IF NOT EXISTS vivaha_vedika_statistics_active_idx ON vivaha_vedika_statistics (is_active);
CREATE INDEX IF NOT EXISTS vivaha_vedika_statistics_position_idx ON vivaha_vedika_statistics (position);

CREATE INDEX IF NOT EXISTS vivaha_vedika_pdfs_active_idx ON vivaha_vedika_pdfs (is_active);
CREATE INDEX IF NOT EXISTS vivaha_vedika_pdfs_created_at_idx ON vivaha_vedika_pdfs (created_at);