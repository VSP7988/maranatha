import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  Video, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  GripVertical
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Banner {
  id: string;
  type: 'image' | 'video';
  title?: string;
  subtitle?: string;
  image_url?: string;
  video_url?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const BannerManager = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'image' as 'image' | 'video',
    title: '',
    subtitle: '',
    image_url: '',
    video_url: '',
    position: 1,
    is_active: true
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      console.log('Fetching real banners data for admin from Supabase...');
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      console.log('Real Supabase admin banners data:', data);
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Starting banner save process...');
      console.log('Form data:', formData);
      
      const bannerData = {
        type: formData.type,
        title: formData.title || null,
        subtitle: formData.subtitle || null,
        image_url: formData.type === 'image' ? formData.image_url || null : null,
        video_url: formData.type === 'video' ? formData.video_url || null : null,
        position: formData.position,
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      };

      console.log('Banner data to save:', bannerData);
      if (editingBanner) {
        const { error } = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', editingBanner.id);

        if (error) throw error;
        console.log('Banner updated successfully');
      } else {
        const { error } = await supabase
          .from('banners')
          .insert([bannerData]);

        if (error) throw error;
        console.log('Banner created successfully');
      }

      await fetchBanners();
      console.log('Banners list refreshed');
      closeModal();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Error saving banner. Please try again.');
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert('Error deleting banner. Please try again.');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchBanners();
    } catch (error) {
      console.error('Error updating banner status:', error);
    }
  };

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        type: banner.type,
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        image_url: banner.image_url || '',
        video_url: banner.video_url || '',
        position: banner.position,
        is_active: banner.is_active
      });
    } else {
      setEditingBanner(null);
      setFormData({
        type: 'image',
        title: '',
        subtitle: '',
        image_url: '',
        video_url: '',
        position: banners.length + 1,
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    // Clean up blob URL if it exists
    if (previewImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewImageUrl);
    }
    setSelectedFile(null);
    setPreviewImageUrl('');
    setFormData({
      type: 'image',
      title: '',
      subtitle: '',
      image_url: '',
      video_url: '',
      position: 1,
      is_active: true
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    if (imageFile) {
      handleFileUpload(imageFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
  };
  const IMAGES_BUCKET = 'images'; // make sure this bucket exists in Supabase Storage


 const handleFileUpload = async (file: File) => {
  // cleanup old preview blob if any
  if (previewImageUrl && previewImageUrl.startsWith('blob:')) {
    URL.revokeObjectURL(previewImageUrl);
  }

  setSelectedFile(file);
  setIsUploading(true);

  try {
    // basic checks
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file.');
    }
    const sizeMb = file.size / 1024 / 1024;
    if (sizeMb > 10) {
      throw new Error('File too large. Please use images smaller than 10MB.');
    }

    // unique path under a folder
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `banners/banner-${Date.now()}-${crypto.randomUUID()}.${ext}`;

    // upload directly to known bucket (no listBuckets on client)
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      if (uploadError.message?.includes('Bucket not found')) {
        throw new Error(`Storage bucket "${IMAGES_BUCKET}" not found. Please create an "images" bucket in your Supabase Storage.`);
      }
      if (uploadError.message?.toLowerCase().includes('not allowed')) {
        throw new Error('File type not allowed. Please use JPEG, PNG, GIF, or WebP images.');
      }
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // get a permanent public URL (bucket must be Public)
    const { data } = supabase.storage.from('images').getPublicUrl(path);
    const publicUrl = data.publicUrl;

    // update preview + form
    const previewUrl = URL.createObjectURL(file);
    setPreviewImageUrl(previewUrl);
    setFormData(prev => ({ ...prev, image_url: publicUrl }));

    console.log('✅ Supabase public URL set:', publicUrl);
  } catch (err) {
    console.error('❌ Error uploading file:', err);
    const msg = err instanceof Error ? err.message : 'Unknown upload error';
    alert(`Upload Error: ${msg}`);

    // still show local preview for UX
    const previewUrl = URL.createObjectURL(file);
    setPreviewImageUrl(previewUrl);
    setFormData(prev => ({ ...prev, image_url: '' }));
  } finally {
    setIsUploading(false);
  }
};


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Banner Management</h2>
          <p className="text-gray-600">Manage homepage banners and carousel content</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Banner
        </button>
      </div>

      {/* Banners List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          {banners.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No banners yet</h3>
              <p className="text-gray-500 mb-6">Create your first banner to get started</p>
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
                    {/* Drag Handle */}
                    <div className="cursor-move text-gray-400 hover:text-gray-600">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    {/* Type Icon */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      banner.type === 'video' 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {banner.type === 'video' ? (
                        <Video className="w-6 h-6" />
                      ) : (
                        <ImageIcon className="w-6 h-6" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-800">
                          {banner.title || `${banner.type === 'video' ? 'Video' : 'Image'} Banner`}
                        </h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          Position {banner.position}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          banner.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {banner.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {banner.subtitle && (
                        <p className="text-gray-600 text-sm mb-2">{banner.subtitle}</p>
                      )}
                      <div className="text-xs text-gray-500">
                        {banner.type === 'video' ? (
                          <span>Video URL: {banner.video_url}</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>Image:</span>
                            {banner.image_url && (
                              <img 
                                src={banner.image_url}
                                alt="Banner preview"
                                className="w-8 h-8 object-cover rounded border"
                              />
                            )}
                            <span className="truncate max-w-xs">{banner.image_url}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(banner.id, banner.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                          banner.is_active
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={banner.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openModal(banner)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingBanner ? 'Edit Banner' : 'Add New Banner'}
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
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Banner Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'image' }))}
                    className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                      formData.type === 'image'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-semibold">Image</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'video' }))}
                    className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                      formData.type === 'video'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Video className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-semibold">Video</div>
                  </button>
                </div>
              </div>

              {/* Image Upload */}
              {formData.type === 'image' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Image Upload
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      isUploading 
                        ? 'border-blue-400 bg-blue-50' 
                        : selectedFile 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {selectedFile ? (
                      <div className="space-y-4">
                        {/* Image Preview */}
                        <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border border-gray-200">
                          <img 
                            src={previewImageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-green-600">
                          <p className="font-semibold">✓ Image Selected</p>
                          <p className="text-sm">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (previewImageUrl.startsWith('blob:')) {
                              URL.revokeObjectURL(previewImageUrl);
                            }
                            setSelectedFile(null);
                            setPreviewImageUrl('');
                            setFormData(prev => ({ ...prev, image_url: '' }));
                          }}
                          className="text-red-600 hover:text-red-700 text-sm underline"
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className={`w-12 h-12 mx-auto mb-4 ${
                          isUploading ? 'text-blue-500 animate-bounce' : 'text-gray-400'
                        }`} />
                        <p className="text-gray-600 mb-4">
                          {isUploading ? 'Processing image...' : 'Drag and drop an image here, or click to select'}
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="image-upload"
                          disabled={isUploading}
                        />
                        <label
                          htmlFor="image-upload"
                          className={`px-6 py-2 rounded-lg cursor-pointer transition-colors ${
                            isUploading 
                              ? 'bg-gray-400 text-white cursor-not-allowed' 
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          {isUploading ? 'Processing...' : 'Select Image'}
                        </label>
                      </>
                    )}
                  </div>
                <input
  type="url"
  placeholder="Image URL (auto-filled from upload)"
  value={formData.image_url}
  readOnly
  className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
/>
<p className="text-xs text-gray-500 mt-1">
  This URL is auto-filled after uploading to Supabase Storage.
</p>

                </div>
              )}

              {/* Video URL */}
              {formData.type === 'video' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.video_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500"
                    required={formData.type === 'video'}
                  />
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter banner title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter banner subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Position
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">
                  Active (visible on homepage)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
               <button
  type="submit"
  disabled={isLoading || isUploading || (formData.type === 'image' && !formData.image_url)}
  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
>
  {isLoading || isUploading ? (
    <>
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      {isUploading ? 'Uploading...' : 'Saving...'}
    </>
  ) : (
    <>
      <Save className="w-4 h-4" />
      {editingBanner ? 'Update Banner' : 'Create Banner'}
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

export default BannerManager;