/*
  # Fix Events Sample Data

  1. Updates
    - Add proper sample events with working image URLs
    - Ensure all events have valid Pexels URLs
    - Set proper dates and times
*/

-- Clear existing events data
DELETE FROM events;

-- Insert sample events with working Pexels URLs
INSERT INTO events (title, description, location, event_date, event_time, image_url, is_active) VALUES
  (
    'Sunday Morning Worship',
    'Join us for uplifting worship and inspiring messages that transform hearts.',
    'Main Sanctuary',
    '2024-12-22',
    '09:00:00',
    'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=800',
    true
  ),
  (
    'Youth Night',
    'High-energy worship designed for teens and young adults with relevant messages.',
    'Youth Hall',
    '2024-12-23',
    '19:00:00',
    'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800',
    true
  ),
  (
    'Christmas Eve Service',
    'Special Christmas worship services celebrating the birth of Jesus Christ.',
    'Main Sanctuary',
    '2024-12-24',
    '19:00:00',
    'https://images.pexels.com/photos/1387174/pexels-photo-1387174.jpeg?auto=compress&cs=tinysrgb&w=800',
    true
  ),
  (
    'Prayer Meeting',
    'Join our prayer warriors in interceding for our community and beyond.',
    'Prayer Room',
    '2024-12-25',
    '19:30:00',
    'https://images.pexels.com/photos/8468669/pexels-photo-8468669.jpeg?auto=compress&cs=tinysrgb&w=800',
    true
  ),
  (
    'Family Fun Day',
    'Worship services designed for families with children-friendly activities.',
    'Church Grounds',
    '2024-12-28',
    '10:00:00',
    'https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg?auto=compress&cs=tinysrgb&w=800',
    true
  ),
  (
    'New Year Service',
    'Joyful celebration welcoming the new year with special music and worship.',
    'Main Sanctuary',
    '2024-12-31',
    '21:00:00',
    'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800',
    true
  );