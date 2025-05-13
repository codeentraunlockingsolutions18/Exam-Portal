
-- Create storage bucket for question images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('questions', 'Questions', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy to allow public access to images
CREATE POLICY "Public Access to Question Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'questions');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'questions' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'questions' AND auth.uid() = owner);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (bucket_id = 'questions' AND auth.uid() = owner);
