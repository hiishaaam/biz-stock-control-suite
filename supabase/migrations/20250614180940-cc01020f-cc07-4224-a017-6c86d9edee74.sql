
-- First, let's check if there are any existing storage buckets
-- If none exist, we'll create a secure one for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  false, -- Make it private by default for security
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create secure RLS policies for the product-images bucket
-- Policy 1: Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.uid() IS NOT NULL
);

-- Policy 2: Allow authenticated users to view files
CREATE POLICY "Authenticated users can view product images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'product-images' AND
  auth.uid() IS NOT NULL
);

-- Policy 3: Allow users to update their own uploaded files
CREATE POLICY "Users can update product images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  auth.uid() IS NOT NULL
)
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.uid() IS NOT NULL
);

-- Policy 4: Allow users to delete product images (admin/manager level)
CREATE POLICY "Authorized users can delete product images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  auth.uid() IS NOT NULL
);

-- Create a documents bucket for other files (invoices, reports, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false, -- Private for security
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
)
ON CONFLICT (id) DO NOTHING;

-- Create secure RLS policies for the documents bucket
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authenticated users can view documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid() IS NOT NULL
)
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Authorized users can delete documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid() IS NOT NULL
);
