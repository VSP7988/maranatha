/*
  # Fix Gallery Sample Data

  1. Updates
    - Add proper sample gallery images with working URLs
    - Ensure all images have valid Pexels URLs
    - Set proper positions and active status
*/

-- Clear existing gallery data
DELETE FROM gallery;

-- Insert sample gallery images with working Pexels URLs
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