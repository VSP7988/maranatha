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
  Tv,
  Radio,
  Download
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TVMinistryBanner {
  id: string;
  title: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TVMinistryLogo {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const TVMinistryManager = () => {
  const [activeTab, setActiveTab] = useState<'banners' | 'logos'>('banners');
  const [banners, setBanners] = useState<TVMinistryBanner[]>([]);
  const [logos, setLogos] = useState<TVMinistryLogo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TVMinistryBanner | TVMinistryLogo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImageUrls, setPreviewImageUrls] = useState<string[]>([]);
  const [supabaseUrls, setSupabaseUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchBanners();
    fetchLogos();
  }, []);

  const fetchBanners = async () => {
    try {
      console.log('🎯 TV MINISTRY: Fetching banners...');
      const { data, error } = await supabase
        .from('tv_ministry_banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('✅ TV MINISTRY: Banners fetched:', data?.length || 0);
      setBanners(data || []);
    } catch (error) {
      console.error('❌ TV MINISTRY: Error fetching banners:', error);
    }
  };

  const fetchLogos = async () => {
    try {
      console.log('🎯 TV MINISTRY: Fetching logos...');
      const { data, error } = await supabase
        .from('tv_ministry_logos')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      console.log('✅ TV MINISTRY: Logos fetched:', data?.length || 0);
      setLogos(data || []);
    } catch (error) {
      console.error('❌ TV MINISTRY: Error fetching logos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Starting image upload process...');
      console.log('Active tab:', activeTab);
      console.log('Supabase URLs to save:', supabaseUrls);

      if (activeTab === 'banners') {
        if (supabaseUrls.filter(url => url).length === 0) {
          alert('Please upload an image or provide a valid URL before saving.');
          setIsLoading(false);
          return;
        }

        const bannerData = {
          title: `TV Ministry Banner`,
          image_url: supabaseUrls[0],
          is_active: true
        };

        console.log('Banner data to insert:', bannerData);

        const { error } = await supabase
          .from('tv_ministry_banners')
          .insert(bannerData);

        if (error) throw error;

        console.log('Banner saved successfully to database');
        await fetchBanners();
        console.log('TV Ministry banners refreshed');
      } else {
        const maxPosition = logos.length > 0 ? Math.max(...logos.map(logo => logo.position)) : 0;

        const imageData = supabaseUrls.filter(url => url).map((url, index) => ({
          title: `TV Ministry Logo ${maxPosition + index + 1}`,
          description: null,
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
          .from('tv_ministry_logos')
          .insert(imageData);

        if (error) throw error;

        console.log('Images saved successfully to database');
        await fetchLogos();
        console.log('TV Ministry logos refreshed');
      }

      closeModal();
    } catch (error) {
      console.error('Error saving images:', error);
      alert('Error saving images. Please try again.');
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;

    try {
      const table = activeTab === 'banners' ? 'tv_ministry_banners' : 'tv_ministry_logos';
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      if (activeTab === 'banners') {
        await fetchBanners();
      } else {
        await fetchLogos();
      }
    } catch (error) {
      console.error(`❌ TV MINISTRY: Error deleting ${activeTab}:`, error);
      alert(`Error deleting ${activeTab}. Please try again.`);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const table = activeTab === 'banners' ? 'tv_ministry_banners' : 'tv_ministry_logos';
      const { error } = await supabase
        .from(table)
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      if (activeTab === 'banners') {
        await fetchBanners();
      } else {
        await fetchLogos();
      }
    } catch (error) {
      console.error(`❌ TV MINISTRY: Error updating ${activeTab} status:`, error);
    }
  };

  const openModal = (item?: TVMinistryBanner | TVMinistryLogo) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
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
    if (imageFiles.length > 0) {
      handleMultipleFileUpload(imageFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      if (activeTab === 'banners') {
        handleMultipleFileUpload([imageFiles[0]]);
      } else {
        handleMultipleFileUpload(imageFiles);
      }
    }
  };

  const handleMultipleFileUpload = async (files: File[]) => {
    setSelectedFiles(files);
    setIsUploading(true);
    
    try {
      console.log('🔄 TV MINISTRY: Starting batch file upload...');
      
      const previewUrls: string[] = [];
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        previewUrls.push(previewUrl);
        
        try {
          // Generate unique filename
          const fileExt = file.name.split('.').pop();
          const fileName = `tv-ministry-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          console.log('Generated filename:', fileName);
          
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
            console.error('❌ TV MINISTRY: Upload error for file:', file.name, uploadError);
            
            if (uploadError.message?.includes('Bucket not found')) {
              console.warn(`❌ Storage bucket not found for ${file.name}`);
              uploadedUrls.push('');
              continue;
            } else if (uploadError.message?.includes('not allowed')) {
              console.warn(`File type not allowed for ${file.name}`);
              uploadedUrls.push('');
              continue;
            } else {
              console.warn(`❌ Upload failed for ${file.name}: ${uploadError.message}`);
              uploadedUrls.push('');
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
          uploadedUrls.push('');
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
          alert('Upload failed. Please ensure an "images" storage bucket exists in your Supabase project.');
        } else {
          alert(`${successCount} images uploaded successfully. ${failCount} failed.`);
        }
      }
      
    } catch (error) {
      console.error('Error handling files:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      alert(`Upload Error: ${errorMessage}`);
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
          <h2 className="text-2xl font-bold text-gray-800">TV Ministry Management</h2>
          <p className="text-gray-600">Manage TV Ministry banners and logo images</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add {activeTab === 'banners' ? 'Banner' : 'Images'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('banners')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'banners'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4" />
              Banners ({banners.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('logos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'logos'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4" />
              Images ({logos.length})
            </div>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          {activeTab === 'banners' ? (
            banners.length === 0 ? (
              <div className="text-center py-12">
                <Tv className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No banners yet</h3>
                <p className="text-gray-500 mb-6">Create your first TV Ministry banner</p>
                <button
                  onClick={() => openModal()}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Add First Banner
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className={`border rounded-xl p-4 transition-all duration-300 ${
                      banner.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {banner.image_url ? (
                          <img 
                            src={banner.image_url}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Tv className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-800 text-lg">{banner.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            banner.is_active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {banner.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(banner.id, banner.is_active)}
                          className={`p-2 rounded-lg transition-colors ${
                            banner.is_active
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            logos.length === 0 ? (
              <div className="text-center py-12">
                <Radio className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No images yet</h3>
                <p className="text-gray-500 mb-6">Upload your first TV Ministry images</p>
                <button
                  onClick={() => openModal()}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Add First Images
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {logos.map((logo) => (
                  <div
                    key={logo.id}
                    className={`relative group rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      logo.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'
                    }`}
                  >
                    {/* Drag Handle */}
                    <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="cursor-move text-white bg-black/50 rounded p-1">
                        <GripVertical className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Image */}
                    <div className="aspect-square">
                      <img 
                        src={logo.image_url}
                        alt={logo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleActive(logo.id, logo.is_active)}
                          className={`p-2 rounded-lg transition-colors ${
                            logo.is_active
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-gray-500 hover:bg-gray-600 text-white'
                          }`}
                          title={logo.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {logo.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(logo.id)}
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
                        logo.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {logo.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    {/* Position Number */}
                    <div className="absolute top-2 right-2">
                      <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full">
                        {logo.position}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {activeTab === 'banners' ? 'Add TV Ministry Banner' : 'Upload TV Ministry Images'}
                </h3>
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
                  {activeTab === 'banners' ? 'Upload Banner Image' : 'Upload Multiple Images'}
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
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          {activeTab === 'banners' ? 'Upload Banner Image' : 'Upload Images for TV Ministry'}
                        </h4>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-gray-600 mb-2">
                            {activeTab === 'banners'
                              ? 'Drag and drop banner image here or click to select'
                              : 'Drag and drop images here or click to select'}
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            multiple={activeTab === 'logos'}
                            onChange={handleFileSelect}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors"
                          >
                            {activeTab === 'banners' ? 'Select Banner' : 'Select Images'}
                          </label>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">OR</p>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Enter Image URL Directly</h4>
                        <p className="text-sm text-gray-500">Add a permanent, publicly accessible image URL below</p>
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

export default TVMinistryManager;