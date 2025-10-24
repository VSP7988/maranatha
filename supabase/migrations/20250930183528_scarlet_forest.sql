/*
  # Fix Public Access for Homepage Content

  1. Security Updates
    - Add proper public read policies for all homepage tables
    - Allow anonymous users to read active content
    - Keep admin functions secure

  2. Tables Updated
    - about: Allow public to read active content
    - vision_mission: Allow public to read active content  
    - events: Allow public to read active content
    - gallery: Allow public to read active content
    - banners: Allow public to read active content
*/

-- About table public access
DROP POLICY IF EXISTS "Public can read active about content" ON about;
CREATE POLICY "Public can read active about content"
  ON about
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Vision Mission table public access  
DROP POLICY IF EXISTS "Public can read active vision_mission" ON vision_mission;
CREATE POLICY "Public can read active vision_mission"
  ON vision_mission
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Events table public access
DROP POLICY IF EXISTS "Public can read active events" ON events;
CREATE POLICY "Public can read active events"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Gallery table public access
DROP POLICY IF EXISTS "Public can read active gallery" ON gallery;
CREATE POLICY "Public can read active gallery"
  ON gallery
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Banners table public access
DROP POLICY IF EXISTS "Public can read active banners" ON banners;
CREATE POLICY "Public can read active banners"
  ON banners
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);