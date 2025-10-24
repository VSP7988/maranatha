/*
  # Clear All Dummy Data

  1. Remove all existing dummy/sample data
  2. Reset tables to empty state
  3. Ensure clean database for real data only
*/

-- Clear all existing dummy data
DELETE FROM gallery;
DELETE FROM events;
DELETE FROM banners;
DELETE FROM vision_mission;
DELETE FROM about;

-- Reset sequences if needed
-- This ensures clean start with real data only