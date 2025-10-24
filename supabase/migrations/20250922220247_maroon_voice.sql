/*
  # Create We Believe Management Tables

  1. New Tables
    - `we_believe_banners`
      - `id` (uuid, primary key)
      - `title` (text)
      - `image_url` (text, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `we_believe_beliefs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `verse` (text, optional)
      - `icon` (text, default 'Heart')
      - `position` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage data
    - Add policies for public to read active data

  3. Indexes
    - Add indexes for performance on commonly queried columns
*/

-- Create we_believe_banners table
CREATE TABLE IF NOT EXISTS we_believe_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create we_believe_beliefs table
CREATE TABLE IF NOT EXISTS we_believe_beliefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  verse text,
  icon text DEFAULT 'Heart',
  position integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE we_believe_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE we_believe_beliefs ENABLE ROW LEVEL SECURITY;

-- Create policies for we_believe_banners
CREATE POLICY "Authenticated users can manage we believe banners"
  ON we_believe_banners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active we believe banners"
  ON we_believe_banners
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create policies for we_believe_beliefs
CREATE POLICY "Authenticated users can manage we believe beliefs"
  ON we_believe_beliefs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active we believe beliefs"
  ON we_believe_beliefs
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS we_believe_banners_active_idx ON we_believe_banners (is_active);
CREATE INDEX IF NOT EXISTS we_believe_banners_created_at_idx ON we_believe_banners (created_at);

CREATE INDEX IF NOT EXISTS we_believe_beliefs_active_idx ON we_believe_beliefs (is_active);
CREATE INDEX IF NOT EXISTS we_believe_beliefs_position_idx ON we_believe_beliefs (position);
CREATE INDEX IF NOT EXISTS we_believe_beliefs_created_at_idx ON we_believe_beliefs (created_at);