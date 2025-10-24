/*
  # Clear existing data and add working sample data

  1. Clear existing data
    - Remove all existing banners, events, gallery images
  
  2. Add working sample data
    - Add verified working image URLs
    - Ensure proper data structure
    - Test with known working Pexels URLs
*/

-- Clear existing data
DELETE FROM banners;
DELETE FROM events;
DELETE FROM gallery;

-- Add working banner data
INSERT INTO banners (type, title, subtitle, image_url, position, is_active) VALUES
('image', 'Welcome to Maranatha Temple', 'Experience God''s love in community', 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=1600', 1, true),
('image', 'Join Our Worship Services', 'Every Sunday at 9 AM and 11 AM', 'https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=1600', 2, true),
('image', 'Prayer Changes Everything', 'Come and experience the power of prayer', 'https://images.pexels.com/photos/8468669/pexels-photo-8468669.jpeg?auto=compress&cs=tinysrgb&w=1600', 3, true);

-- Add working event data
INSERT INTO events (title, description, location, event_date, event_time, image_url, is_active) VALUES
('Sunday Morning Worship', 'Join us for uplifting worship and inspiring messages', 'Main Sanctuary', '2024-12-22', '09:00:00', 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Youth Night', 'High-energy worship and fellowship for teens and young adults', 'Youth Hall', '2024-12-23', '19:00:00', 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Prayer Meeting', 'Join us for corporate prayer and intercession', 'Prayer Room', '2024-12-25', '19:30:00', 'https://images.pexels.com/photos/8468669/pexels-photo-8468669.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Family Fun Day', 'Activities and fellowship for the whole family', 'Church Grounds', '2024-12-28', '10:00:00', 'https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=800', true);

-- Add working gallery data
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
('https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&w=800', 10, true);