/*
  # Add sample data with working image URLs

  1. Gallery Images
    - Add sample gallery images with working Pexels URLs
    - Set proper positions and active status

  2. Events
    - Add sample events with working image URLs
    - Set proper dates and times

  3. Banners
    - Add sample banners with working image URLs
*/

-- Clear existing data
DELETE FROM gallery;
DELETE FROM events;
DELETE FROM banners;

-- Insert sample gallery images with working URLs
INSERT INTO gallery (image_url, position, is_active) VALUES
  ('https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
  ('https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=800', 2, true),
  ('https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800', 3, true),
  ('https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800', 4, true),
  ('https://images.pexels.com/photos/8468669/pexels-photo-8468669.jpeg?auto=compress&cs=tinysrgb&w=800', 5, true),
  ('https://images.pexels.com/photos/6994314/pexels-photo-6994314.jpeg?auto=compress&cs=tinysrgb&w=800', 6, true),
  ('https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800', 7, true),
  ('https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800', 8, true),
  ('https://images.pexels.com/photos/7551659/pexels-photo-7551659.jpeg?auto=compress&cs=tinysrgb&w=800', 9, true),
  ('https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&w=800', 10, true),
  ('https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg?auto=compress&cs=tinysrgb&w=800', 11, true),
  ('https://images.pexels.com/photos/935985/pexels-photo-935985.jpeg?auto=compress&cs=tinysrgb&w=800', 12, true);

-- Insert sample events with working URLs
INSERT INTO events (title, description, location, event_date, event_time, image_url, is_active) VALUES
  ('Sunday Morning Worship', 'Join us for uplifting worship and inspiring messages that transform hearts and lives.', 'Main Sanctuary', '2024-12-22', '09:00:00', 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=800', true),
  ('Youth Night', 'High-energy worship and fellowship designed for teens and young adults.', 'Youth Hall', '2024-12-23', '19:00:00', 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800', true),
  ('Christmas Eve Service', 'Special Christmas worship service celebrating the birth of Jesus Christ.', 'Main Sanctuary', '2024-12-24', '19:30:00', 'https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg?auto=compress&cs=tinysrgb&w=800', true),
  ('Prayer Meeting', 'Join us for corporate prayer and intercession for our community and world.', 'Prayer Room', '2024-12-25', '19:30:00', 'https://images.pexels.com/photos/8468669/pexels-photo-8468669.jpeg?auto=compress&cs=tinysrgb&w=800', true),
  ('Family Fun Day', 'A day of games, food, and fellowship for the whole family.', 'Church Grounds', '2024-12-28', '10:00:00', 'https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=800', true),
  ('New Year Service', 'Welcome the new year with worship, prayer, and thanksgiving.', 'Main Sanctuary', '2024-12-31', '22:00:00', 'https://images.pexels.com/photos/6994314/pexels-photo-6994314.jpeg?auto=compress&cs=tinysrgb&w=800', true);

-- Insert sample banners with working URLs
INSERT INTO banners (type, title, subtitle, image_url, position, is_active) VALUES
  ('image', 'Welcome to Maranatha Temple', 'Experience God''s love in community', 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=1600', 1, true),
  ('image', 'Join Our Family', 'Find your place in our growing community', 'https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=1600', 2, true),
  ('image', 'Worship With Us', 'Sunday services at 9 AM and 11 AM', 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1600', 3, true);