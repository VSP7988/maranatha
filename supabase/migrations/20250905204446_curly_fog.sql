/*
  # Add Working Sample Data
  
  1. Sample Data
    - Add working banner, gallery, events, about, and vision/mission data
    - Use verified Pexels URLs that work
    - Provide immediate content for testing
  
  2. Purpose
    - Give users working examples to see
    - Test the admin-frontend sync
    - Demonstrate the system functionality
*/

-- Add sample banners
INSERT INTO banners (type, title, subtitle, image_url, position, is_active) VALUES
('image', 'Welcome to Maranatha Temple', 'A place where faith comes alive', 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=1600', 1, true),
('image', 'Join Our Community', 'Experience worship like never before', 'https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=1600', 2, true);

-- Add sample gallery images
INSERT INTO gallery (image_url, position, is_active) VALUES
('https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=800', 1, true),
('https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=800', 2, true),
('https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800', 3, true),
('https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800', 4, true),
('https://images.pexels.com/photos/8468669/pexels-photo-8468669.jpeg?auto=compress&cs=tinysrgb&w=800', 5, true),
('https://images.pexels.com/photos/6994314/pexels-photo-6994314.jpeg?auto=compress&cs=tinysrgb&w=800', 6, true);

-- Add sample events
INSERT INTO events (title, description, location, event_date, event_time, image_url, is_active) VALUES
('Sunday Morning Worship', 'Join us for uplifting worship and inspiring messages', 'Main Sanctuary', '2024-12-22', '09:00:00', 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Youth Night', 'Special evening for teens and young adults', 'Youth Hall', '2024-12-23', '19:00:00', 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800', true),
('Prayer Meeting', 'Come together in prayer and fellowship', 'Prayer Room', '2024-12-25', '19:30:00', 'https://images.pexels.com/photos/8468669/pexels-photo-8468669.jpeg?auto=compress&cs=tinysrgb&w=800', true);

-- Add sample about data
INSERT INTO about (title, subtitle, description, stats, is_active) VALUES
('About Us', 'Building Faith Together', 'We are a vibrant community of believers dedicated to growing in faith, building authentic relationships, and making a positive impact in our generation.', '[
  {"label": "Families", "value": "500+", "icon": "Heart"},
  {"label": "Members", "value": "1200+", "icon": "Users"},
  {"label": "Years", "value": "25+", "icon": "Sparkles"}
]'::jsonb, true);

-- Add sample vision and mission
INSERT INTO vision_mission (type, title, description, points, is_active) VALUES
('vision', 'Our Vision', 'To be a church that transforms lives and communities through the love of Jesus Christ.', '["Spiritual Growth", "Community Impact", "Global Outreach"]', true),
('mission', 'Our Mission', 'To make disciples of all nations by sharing the Gospel and serving our community with love.', '["Worship Excellence", "Biblical Teaching", "Compassionate Service"]', true);