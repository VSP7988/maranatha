/*
  # Create admin users table

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `email` (text, unique)
      - `password_hash` (text)
      - `role` (text, default 'admin')
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `admin_users` table
    - Add policy for authenticated admin users to read their own data
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text DEFAULT 'admin',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create a function to handle password hashing (you'll need to implement this server-side)
-- For now, we'll insert a sample admin user with a simple hash
-- In production, use proper password hashing like bcrypt

-- Insert sample admin user (password: 'admin123' - you should change this)
INSERT INTO admin_users (username, email, password_hash) 
VALUES ('admin', 'admin@maranthatemple.org', 'admin123')
ON CONFLICT (username) DO NOTHING;