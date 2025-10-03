/*
  # Create Logo Management Table

  1. New Tables
    - `logo`
      - `id` (uuid, primary key)
      - `image_url` (text) - URL of the logo image
      - `type` (text) - Type of logo (header/footer)
      - `is_active` (boolean) - Whether this logo is currently active
      - `created_at` (timestamptz) - Timestamp when logo was created
      - `updated_at` (timestamptz) - Timestamp when logo was last updated
  
  2. Security
    - Enable RLS on `logo` table
    - Add policy for public read access (anyone can view logos)
    - Add policy for authenticated users to manage logos (admin access)
*/

CREATE TABLE IF NOT EXISTS logo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  type text NOT NULL CHECK (type IN ('header', 'footer')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE logo ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active logos
CREATE POLICY "Anyone can view active logos"
  ON logo
  FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to insert logos
CREATE POLICY "Authenticated users can insert logos"
  ON logo
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update logos
CREATE POLICY "Authenticated users can update logos"
  ON logo
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete logos
CREATE POLICY "Authenticated users can delete logos"
  ON logo
  FOR DELETE
  TO authenticated
  USING (true);

-- Create an index on type for faster queries
CREATE INDEX IF NOT EXISTS logo_type_idx ON logo(type);
CREATE INDEX IF NOT EXISTS logo_is_active_idx ON logo(is_active);