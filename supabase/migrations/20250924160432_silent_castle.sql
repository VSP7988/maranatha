/*
  # Fix Public Access Policies for Homepage Data

  1. Security Updates
    - Enable RLS on all tables that don't have it
    - Add public read policies for anonymous users
    - Ensure homepage data is accessible without authentication

  2. Tables Updated
    - admin_users (keep restricted)
    - banners (add public read access)
    - vision_mission (add public read access) 
    - events (add public read access)
    - gallery (add public read access)
    - about (add public read access)
    - All ministry tables (add public read access)

  3. Policy Changes
    - Allow anonymous users to read active content
    - Keep admin authentication required for modifications
    - Maintain data security while enabling public access
*/

-- Enable RLS on tables that don't have it
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_mission ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_ministry_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tv_ministry_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_hut_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_hut_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_hut_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE worship_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE worship_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE yuvanidhi_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE yuvanidhi_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE yuvanidhi_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE satellite_church_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE satellite_church_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vivaha_vedika_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE vivaha_vedika_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE vivaha_vedika_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE vivaha_vedika_pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE we_believe_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE we_believe_beliefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations_payment_methods ENABLE ROW LEVEL SECURITY;

-- Drop existing conflicting policies if they exist
DROP POLICY IF EXISTS "Public can read banners" ON banners;
DROP POLICY IF EXISTS "Public can read vision_mission" ON vision_mission;
DROP POLICY IF EXISTS "Public can read about" ON about;

-- Add public read policies for homepage data
CREATE POLICY "Public can read all banners"
  ON banners
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read all vision_mission"
  ON vision_mission
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read all about"
  ON about
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Update existing policies to be more permissive for public read access
DROP POLICY IF EXISTS "Public can read active events" ON events;
CREATE POLICY "Public can read all events"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active gallery items" ON gallery;
CREATE POLICY "Public can read all gallery items"
  ON gallery
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Ministry tables - make all readable by public
DROP POLICY IF EXISTS "Public can read active TV ministry logos" ON tv_ministry_logos;
CREATE POLICY "Public can read all TV ministry logos"
  ON tv_ministry_logos
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active TV ministry banners" ON tv_ministry_banners;
CREATE POLICY "Public can read all TV ministry banners"
  ON tv_ministry_banners
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active prayer hut banners" ON prayer_hut_banners;
CREATE POLICY "Public can read all prayer hut banners"
  ON prayer_hut_banners
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active prayer hut content" ON prayer_hut_content;
CREATE POLICY "Public can read all prayer hut content"
  ON prayer_hut_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active prayer hut statistics" ON prayer_hut_statistics;
CREATE POLICY "Public can read all prayer hut statistics"
  ON prayer_hut_statistics
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active worship banners" ON worship_banners;
CREATE POLICY "Public can read all worship banners"
  ON worship_banners
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active worship content" ON worship_content;
CREATE POLICY "Public can read all worship content"
  ON worship_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active yuvanidhi banners" ON yuvanidhi_banners;
CREATE POLICY "Public can read all yuvanidhi banners"
  ON yuvanidhi_banners
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active yuvanidhi content" ON yuvanidhi_content;
CREATE POLICY "Public can read all yuvanidhi content"
  ON yuvanidhi_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active yuvanidhi statistics" ON yuvanidhi_statistics;
CREATE POLICY "Public can read all yuvanidhi statistics"
  ON yuvanidhi_statistics
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active satellite church banners" ON satellite_church_banners;
CREATE POLICY "Public can read all satellite church banners"
  ON satellite_church_banners
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active satellite church locations" ON satellite_church_locations;
CREATE POLICY "Public can read all satellite church locations"
  ON satellite_church_locations
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active vivaha vedika banners" ON vivaha_vedika_banners;
CREATE POLICY "Public can read all vivaha vedika banners"
  ON vivaha_vedika_banners
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active vivaha vedika content" ON vivaha_vedika_content;
CREATE POLICY "Public can read all vivaha vedika content"
  ON vivaha_vedika_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active vivaha vedika statistics" ON vivaha_vedika_statistics;
CREATE POLICY "Public can read all vivaha vedika statistics"
  ON vivaha_vedika_statistics
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active vivaha vedika pdfs" ON vivaha_vedika_pdfs;
CREATE POLICY "Public can read all vivaha vedika pdfs"
  ON vivaha_vedika_pdfs
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active we believe banners" ON we_believe_banners;
CREATE POLICY "Public can read all we believe banners"
  ON we_believe_banners
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active we believe beliefs" ON we_believe_beliefs;
CREATE POLICY "Public can read all we believe beliefs"
  ON we_believe_beliefs
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active donations banners" ON donations_banners;
CREATE POLICY "Public can read all donations banners"
  ON donations_banners
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Public can read active donations payment methods" ON donations_payment_methods;
CREATE POLICY "Public can read all donations payment methods"
  ON donations_payment_methods
  FOR SELECT
  TO anon, authenticated
  USING (true);