import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  X, 
  Upload, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  GripVertical,
  Download
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface GalleryImage {
  id: string;
  image_url: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const GalleryManager = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]);
  const [supabaseUrls, setSupabaseUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      console.log('🔍 ADMIN: Fetching gallery data from Supabase...');
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('position', { ascending: true });

      console.log('🔍 Admin gallery raw response:');
      console.log('  - Data:', data);
      console.log('  - Error:', error);
      console.log('  - Data length:', data?.length || 0);
      
      if (error) {
        console.error('❌ Admin gallery Supabase error:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log('✅ Admin found gallery images:', data.length);
      } else {
        console.log('⚠️ Admin: No gallery images found in database');
      }
      
      setImages(data || []);
    } catch (error) {
      console.error('❌ Admin error fetching gallery images:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Starting image upload process...');
      console.log('Supabase URLs to save:', supabaseUrls);
      
      // Get the highest position number
      const maxPosition = images.length > 0 ? Math.max(...images.map(img => img.position)) : 0;
      
      // Create array of image data to insert
      const imageData = supabaseUrls.filter(url => url).map((url, index) => ({
        image_url: url,
        position: maxPosition + index + 1,
        is_active: true
      }));

      console.log('Image data to insert:', imageData);
      
      if (imageData.length === 0) {
        alert('Please upload images or provide valid URLs before saving.');
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
        .from('gallery')
        .insert(imageData);

      if (error) throw error;

      console.log('Images saved successfully to database');
      await fetchImages();
      console.log('Gallery refreshed');
      closeModal();
    } catch (error) {
      console.error('Error saving images:', error);
      alert('Error saving images. Please try again.');
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image. Please try again.');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchImages();
    } catch (error) {
      console.error('Error updating image status:', error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Clean up blob URLs
    previewImageUrls.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setSelectedFiles([]);
    setPreviewImageUrls([]);
    setSupabaseUrls([]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 200) {
      alert(`You dropped ${imageFiles.length} images. Maximum 200 images allowed. Only the first 200 will be processed.`);
      handleMultipleFileUpload(imageFiles.slice(0, 200));
    } else if (imageFiles.length > 0) {
      handleMultipleFileUpload(imageFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 200) {
      alert(`You selected ${imageFiles.length} images. Maximum 200 images allowed. Only the first 200 will be processed.`);
      handleMultipleFileUpload(imageFiles.slice(0, 200));
    } else if (imageFiles.length > 0) {
      handleMultipleFileUpload(imageFiles);
    }
  };

  const handleMultipleFileUpload = async (files: File[]) => {
    setSelectedFiles(files);
    setIsUploading(true);
    
    try {
      console.log('🔄 Starting Supabase batch file upload...');
      
      const previewUrls: string[] = [];
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        previewUrls.push(previewUrl);
        
        try {
          // Generate unique filename
          const fileExt = file.name.split('.').pop();
          const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          console.log('Generated filename:', fileName);
          
          // Check if bucket exists first (only for first file to avoid spam)
          if (uploadedUrls.length === 0) {
            try {
              const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
              console.log('Available buckets:', buckets);
              
              if (bucketsError) {
                console.error('❌ Error checking buckets:', bucketsError);
                throw new Error('Storage service unavailable. Please check Supabase configuration.');
              }
              
              const imagesBucket = buckets?.find(bucket => bucket.name === 'images');
              if (!imagesBucket) {
                console.error('❌ Images bucket not found');
                console.log('💡 Available buckets:', buckets?.map(b => b.name) || 'None');
                throw new Error('Images storage bucket not found. Please create an "images" bucket in Supabase Storage or contact administrator.');
              }
            } catch (bucketError) {
              console.error('❌ Storage bucket check failed:', bucketError);
              // Continue with upload attempt - let Supabase handle the error
            }
          }
          
          // Upload to Supabase Storage
          console.log('Uploading to images bucket...');
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false,
              contentType: file.type
            });

          if (uploadError) {
            console.error('❌ Supabase upload error for file:', file.name, uploadError);
            
            // Provide more specific error messages
            if (uploadError.message?.includes('Bucket not found')) {
              console.warn(`❌ Storage bucket not found for ${file.name}. Please create an "images" bucket in Supabase Storage.`);
              uploadedUrls.push(''); // Add empty string for failed uploads
              continue;
            } else if (uploadError.message?.includes('not allowed')) {
              console.warn(`File type not allowed for ${file.name}`);
              uploadedUrls.push(''); // Add empty string for failed uploads
              continue;
            } else if (uploadError.message?.includes('too large')) {
              console.warn(`File too large: ${file.name}`);
              uploadedUrls.push(''); // Add empty string for failed uploads
              continue;
            } else {
              console.warn(`❌ Upload failed for ${file.name}: ${uploadError.message}`);
              uploadedUrls.push(''); // Add empty string for failed uploads
              continue;
            }
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('images')
            .getPublicUrl(fileName);

          const publicUrl = urlData.publicUrl;
          uploadedUrls.push(publicUrl);
          console.log('✅ File uploaded successfully:', file.name, '→', publicUrl);
          
        } catch (error) {
          console.error('❌ Error uploading file:', file.name, error);
          uploadedUrls.push(''); // Add empty string for failed uploads
        }
      }
      
      setPreviewImageUrls(previewUrls);
      setSupabaseUrls(uploadedUrls);
      
      const successCount = uploadedUrls.filter(url => url).length;
      const failCount = uploadedUrls.length - successCount;
      
      if (successCount > 0) {
        console.log(`✅ Successfully uploaded ${successCount} images to Supabase`);
      }
      if (failCount > 0) {
        console.log(`⚠️ Failed to upload ${failCount} images`);
        if (successCount === 0) {
          alert('Upload failed. Please ensure an "images" storage bucket exists in your Supabase project, or provide image URLs manually.');
        } else {
          alert(`${successCount} images uploaded successfully. ${failCount} failed - you can provide URLs manually.`);
        }
      }
      
    } catch (error) {
      console.error('Error handling files:', error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      alert(`Upload Error: ${errorMessage}\n\nTo fix this, please create an "images" storage bucket in your Supabase project.`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeSelectedImage = (index: number) => {
    // Clean up blob URL before removing
    const urlToRemove = previewImageUrls[index];
    if (urlToRemove && urlToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(urlToRemove);
    }
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewImageUrls(prev => prev.filter((_, i) => i !== index));
    setSupabaseUrls(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gallery Management</h2>
          <p className="text-gray-600">Manage homepage gallery images</p>
        </div>
        <button
          onClick={openModal}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Images
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          {images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No images yet</h3>
              <p className="text-gray-500 mb-6">Upload your first images to get started</p>
              <button
                onClick={openModal}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Add First Images
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    image.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'
                  }`}
                >
                  {/* Drag Handle */}
                  <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="cursor-move text-white bg-black/50 rounded p-1">
                      <GripVertical className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Image */}
                  <div className="aspect-square">
                    <img 
                      src={image.image_url}
                      alt="Gallery"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(image.id, image.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                          image.is_active
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gray-500 hover:bg-gray-600 text-white'
                        }`}
                        title={image.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {image.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="absolute bottom-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      image.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {image.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Position Number */}
                  <div className="absolute top-2 right-2">
                    <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full">
                      {image.position}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Upload Gallery Images</h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Multiple Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Upload Multiple Images
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-400 bg-blue-50'
                      : isUploading 
                        ? 'border-blue-400 bg-blue-50' 
                        : selectedFiles.length > 0
                          ? 'border-green-400 bg-green-50' 
                          : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {selectedFiles.length > 0 ? (
                    <div className="space-y-6">
                      {/* Image Previews Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {previewImageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                              <img 
                                src={url} 
                                alt={`Preview ${index + 1}`} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* Upload Status Indicator */}
                            <div className="absolute top-1 right-1">
                              {supabaseUrls[index] ? (
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              ) : (
                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✗</span>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSelectedImage(index)}
                              className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs p-1 rounded text-center truncate">
                              {selectedFiles[index]?.name}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-green-600">
                        <p className="font-semibold">✓ {selectedFiles.length} Images Selected</p>
                        <p className="text-sm">
                          Total size: {(selectedFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          // Clean up all blob URLs
                          previewImageUrls.forEach(url => {
                            if (url.startsWith('blob:')) {
                              URL.revokeObjectURL(url);
                            }
                          });
                          setSelectedFiles([]);
                          setPreviewImageUrls([]);
                          setSupabaseUrls([]);
                        }}
                        className="text-red-600 hover:text-red-700 text-sm underline"
                      >
                        Clear All Images
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Upload Images for Preview</h4>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-gray-600 mb-2">Select up to 200 images to preview</p>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                            id="preview-upload"
                          />
                          <label
                            htmlFor="preview-upload"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors"
                          >
                            Select Images (Max 200)
                          </label>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">OR</p>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Enter Image URLs Directly</h4>
                        <p className="text-sm text-gray-500">Add permanent, publicly accessible image URLs below</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* URL Input Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Image URLs (Auto-filled from uploads or enter manually)
                  </label>
                  <div className="space-y-3">
                    {Array.from({ length: Math.max(1, selectedFiles.length) }, (_, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="url"
                          placeholder={`Image ${index + 1} URL${supabaseUrls[index] ? ' (uploaded to Supabase)' : ''}`}
                          value={supabaseUrls[index] || ''}
                          onChange={(e) => {
                            const newUrls = [...supabaseUrls];
                            newUrls[index] = e.target.value;
                            setSupabaseUrls(newUrls);
                          }}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                          disabled={!!supabaseUrls[index]}
                        />
                        {selectedFiles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newFiles = selectedFiles.filter((_, i) => i !== index);
                              const newPreviewUrls = previewImageUrls.filter((_, i) => i !== index);
                              const newSupabaseUrls = supabaseUrls.filter((_, i) => i !== index);
                              setSelectedFiles(newFiles);
                              setPreviewImageUrls(newPreviewUrls);
                              setSupabaseUrls(newSupabaseUrls);
                            }}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Images are automatically uploaded to Supabase storage. You can also enter external URLs manually.
                  </p>
                </div>
                
                {/* Add More URLs Button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setSupabaseUrls([...supabaseUrls, ''])}
                    className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another Image URL
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading || isUploading || supabaseUrls.filter(url => url).length === 0}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Uploading to Supabase...
                    </>
                  ) : isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Save {supabaseUrls.filter(url => url).length} Images
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;