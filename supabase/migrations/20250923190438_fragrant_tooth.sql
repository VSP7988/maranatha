/*
  # Create donations management tables

  1. New Tables
    - `donations_banners`
      - `id` (uuid, primary key)
      - `title` (text)
      - `image_url` (text, optional)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `donations_payment_methods`
      - `id` (uuid, primary key)
      - `type` (text) - 'national' or 'international'
      - `method_type` (text) - 'upi', 'bank', 'online', 'paypal', 'wire', 'crypto'
      - `title` (text)
      - `description` (text, optional)
      - `qr_code_url` (text, optional)
      - `upi_id` (text, optional)
      - `bank_details` (jsonb, optional)
      - `payment_link` (text, optional)
      - `position` (integer, default 0)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage data
    - Add policies for public users to read active data
*/

-- Create donations_banners table
CREATE TABLE IF NOT EXISTS donations_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create donations_payment_methods table
CREATE TABLE IF NOT EXISTS donations_payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('national', 'international')),
  method_type text NOT NULL CHECK (method_type IN ('upi', 'bank', 'online', 'paypal', 'wire', 'crypto')),
  title text NOT NULL,
  description text,
  qr_code_url text,
  upi_id text,
  bank_details jsonb DEFAULT '{}',
  payment_link text,
  position integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE donations_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations_payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies for donations_banners
CREATE POLICY "Authenticated users can manage donations banners"
  ON donations_banners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active donations banners"
  ON donations_banners
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create policies for donations_payment_methods
CREATE POLICY "Authenticated users can manage donations payment methods"
  ON donations_payment_methods
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can read active donations payment methods"
  ON donations_payment_methods
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS donations_banners_active_idx ON donations_banners (is_active);
CREATE INDEX IF NOT EXISTS donations_banners_created_at_idx ON donations_banners (created_at);

CREATE INDEX IF NOT EXISTS donations_payment_methods_active_idx ON donations_payment_methods (is_active);
CREATE INDEX IF NOT EXISTS donations_payment_methods_type_idx ON donations_payment_methods (type);
CREATE INDEX IF NOT EXISTS donations_payment_methods_position_idx ON donations_payment_methods (position);
CREATE INDEX IF NOT EXISTS donations_payment_methods_created_at_idx ON donations_payment_methods (created_at);