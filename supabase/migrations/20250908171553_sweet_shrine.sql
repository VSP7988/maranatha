/*
  # Create Storage Bucket for Images

  1. Storage Setup
    - Create 'images' bucket for file uploads
    - Enable public access for uploaded images
    - Set up proper policies for authenticated users

  2. Security
    - Allow authenticated users to upload files
    - Allow public read access to images
    - Restrict file types to images only
*/

-- Create the images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images');

-- Allow public read access to images
CREATE POLICY "Public can view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'images');