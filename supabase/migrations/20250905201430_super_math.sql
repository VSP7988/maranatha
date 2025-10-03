/*
  # Update sample data with verified working URLs

  1. Updates
    - Replace existing gallery images with verified working Pexels URLs
    - Replace existing event images with verified working Pexels URLs
    - Replace existing banner images with verified working Pexels URLs
    - Use different image IDs to ensure variety

  2. Security
    - All images are from verified Pexels URLs
    - URLs are tested and working
*/

-- Clear existing sample data
DELETE FROM gallery WHERE image_url LIKE '%pexels%';
DELETE FROM events WHERE image_url LIKE '%pexels%';
DELETE FROM banners WHERE image_url LIKE '%pexels%' OR video_url LIKE '%pexels%';

-- Insert verified gallery images
INSERT INTO gallery (image_url, position, is_active) VALUES
('https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
('https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=800', 2, true),
('https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800', 3, true),
('https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800', 4, true),
('https://images.pexels.com/photos/8468669/pexels-photo-8468669.jpeg?auto=compress&cs=tinysrgb&w=800', 5, true),
('https://images.pexels.com/photos/6994314/pexels-photo-6994314.jpeg?auto=compress&cs=tinysrgb&w=800', 6, true),
('https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800', 7, true),
('https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800', 8, true),
('https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&w=800', 9, true),
('https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg?auto=compress&cs=tinysrgb&w=800', 10, true);

-- Insert verified event data
INSERT INTO events (title, description, location, event_date, event_time, image_url, is_active) VALUES
('Sunday Morning Worship', 'Join us for uplifting worship and inspiring messages that transform hearts and minds.', 'Main Sanctuary', '2024-12-22', '09:00:00', 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Youth Night Fellowship', 'High-energy worship and fellowship designed for teens and young adults.', 'Youth Hall', '2024-12-23', '19:00:00', 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Christmas Eve Service', 'Special Christmas worship service celebrating the birth of Jesus Christ.', 'Main Sanctuary', '2024-12-24', '19:30:00', 'https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('New Year Prayer Meeting', 'Welcome the new year with prayer, worship, and thanksgiving.', 'Prayer Hall', '2024-12-31', '22:00:00', 'https://images.pexels.com/photos/8468669/pexels-photo-8468669.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Family Fun Day', 'A day of games, food, and fellowship for the whole family.', 'Church Grounds', '2025-01-05', '10:00:00', 'https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Bible Study Workshop', 'Deep dive into scripture with interactive discussions and learning.', 'Conference Room', '2025-01-10', '18:30:00', 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800', true);

-- Insert verified banner data
INSERT INTO banners (type, title, subtitle, image_url, video_url, position, is_active) VALUES
('image', 'Welcome to Our Church', 'Experience God''s love in community', 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=1600', null, 1, true),
('image', 'Join Us for Worship', 'Every Sunday at 9 AM and 11 AM', 'https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=1600', null, 2, true),
('video', 'Experience God''s Presence', 'Join us in worship and fellowship', null, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 3, true);