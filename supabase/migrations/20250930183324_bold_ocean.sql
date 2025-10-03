/*
  # Fix Homepage Public Access

  1. Security Updates
    - Update RLS policies to allow anonymous (public) access to active content
    - Ensure homepage can display admin-added content without authentication
    - Maintain security for admin operations

  2. Tables Updated
    - `about` - Allow public read access to active content
    - `vision_mission` - Allow public read access to active content  
    - `events` - Allow public read access to active content
    - `gallery` - Allow public read access to active content
    - `banners` - Allow public read access to active content

  3. Policy Changes
    - Add public read policies for anonymous users
    - Keep existing authenticated policies for admin management
*/

-- About table - Allow public read access to active content
DROP POLICY IF EXISTS "Public can read active about content" ON about;
CREATE POLICY "Public can read active about content"
  ON about
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Vision Mission table - Allow public read access to active content  
DROP POLICY IF EXISTS "Public can read active vision_mission" ON vision_mission;
CREATE POLICY "Public can read active vision_mission"
  ON vision_mission
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Events table - Allow public read access to active content
DROP POLICY IF EXISTS "Public can read active events" ON events;
CREATE POLICY "Public can read active events"
  ON events
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Gallery table - Allow public read access to active content
DROP POLICY IF EXISTS "Public can read active gallery" ON gallery;
CREATE POLICY "Public can read active gallery"
  ON gallery
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Banners table - Allow public read access to active content
DROP POLICY IF EXISTS "Public can read active banners" ON banners;
CREATE POLICY "Public can read active banners"
  ON banners
  FOR SELECT
  TO anon
  USING (is_active = true);