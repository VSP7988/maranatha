/*
  # Create banners table for homepage banner management

  1. New Tables
    - `banners`
      - `id` (uuid, primary key)
      - `type` (text, 'image' or 'video')
      - `title` (text, optional)
      - `subtitle` (text, optional)
      - `image_url` (text, for image type)
      - `video_url` (text, for video type - YouTube URL)
      - `position` (integer, for ordering)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `banners` table
    - Add policy for authenticated users to manage banners
*/

CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('image', 'video')),
  title text,
  subtitle text,
  image_url text,
  video_url text,
  position integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage banners"
  ON banners
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS banners_position_idx ON banners(position);
CREATE INDEX IF NOT EXISTS banners_active_idx ON banners(is_active);

-- Insert sample banner
INSERT INTO banners (type, title, subtitle, video_url, position) VALUES
('video', 'Experience God''s Presence', 'Join us in worship and fellowship', 'https://videos.pexels.com/video-files/6894223/6894223-hd_1920_1080_25fps.mp4', 1);