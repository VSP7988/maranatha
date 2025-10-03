/*
  # Create Vision and Mission Management

  1. New Tables
    - `vision_mission`
      - `id` (uuid, primary key)
      - `type` (text, 'vision' or 'mission')
      - `title` (text)
      - `description` (text)
      - `points` (jsonb array of points)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `vision_mission` table
    - Add policy for authenticated users to manage vision/mission data
*/

CREATE TABLE IF NOT EXISTS vision_mission (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('vision', 'mission')),
  title text NOT NULL,
  description text NOT NULL,
  points jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vision_mission ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage vision/mission"
  ON vision_mission
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default vision and mission data
INSERT INTO vision_mission (type, title, description, points, is_active) VALUES
(
  'vision',
  'Our Vision',
  'To be a church that transforms communities worldwide through the power of God''s love, creating a movement of believers who impact every sphere of society with the Gospel of Jesus Christ.',
  '["Global Impact", "Transformed Lives", "Kingdom Growth"]'::jsonb,
  true
),
(
  'mission',
  'Our Mission', 
  'To create a place where people can have a life-changing experience with Jesus Christ, building authentic community and equipping believers to live out their faith in everyday life.',
  '["Loving God", "Serving People", "Making Disciples"]'::jsonb,
  true
);