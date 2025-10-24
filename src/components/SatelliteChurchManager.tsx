import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  GripVertical,
  Church,
  MapPin,
  Mail,
  Phone,
  Minus,
  FileText,
  Building
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SatelliteChurchBanner {
  id: string;
  title: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SatelliteChurchLocation {
  id: string;
  title: string;
  address: string;
  email: string;
  phone: string;
  image_url?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const SatelliteChurchManager = () => {
  const [activeTab, setActiveTab] = useState<'banners' | 'locations'>('banners');
  const [banners, setBanners] = useState<SatelliteChurchBanner[]>([]);
  const [locations, setLocations] = useState<SatelliteChurchLocation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SatelliteChurchBanner | SatelliteChurchLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    email: '',
    phone: '',
    image_url: '',
    position: 1,
    is_active: true
  });

  useEffect(() => {
    fetchBanners();
    fetchLocations();
  }, []);

  const fetchBanners = async () => {
    try {
      console.log('🎯 SATELLITE CHURCH: Fetching banners...');
      const { data, error } = await supabase
        .from('satellite_church_banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('✅ SATELLITE CHURCH: Banners fetched:', data?.length || 0);
      setBanners(data || []);
    } catch (error) {
      console.error('❌ SATELLITE CHURCH: Error fetching banners:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      console.log('🎯 SATELLITE CHURCH: Fetching locations...');
      const { data, error } = await supabase
        .from('satellite_church_locations')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      console.log('✅ SATELLITE CHURCH: Locations fetched:', data?.length || 0);
      setLocations(data || []);
    } catch (error) {
      console.error('❌ SATELLITE CHURCH: Error fetching locations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let itemData: any = {
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      };

      if (activeTab === 'banners') {
        itemData.title = formData.title;
        itemData.image_url = formData.image_url || null;
      } else if (activeTab === 'locations') {
        itemData.title = formData.title;
        itemData.address = formData.address;
        itemData.email = formData.email;
        itemData.phone = formData.phone;
        itemData.image_url = formData.image_url || null;
        itemData.position = formData.position;
      }

      const table = `satellite_church_${activeTab}`;

      if (editingItem) {
        const { error } = await supabase
          .from(table)
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
        console.log(`✅ SATELLITE CHURCH: ${activeTab} updated successfully`);
      } else {
        const { error } = await supabase
          .from(table)
          .insert([itemData]);

        if (error) throw error;
        console.log(`✅ SATELLITE CHURCH: ${activeTab} created successfully`);
      }

      if (activeTab === 'banners') {
        await fetchBanners();
      } else if (activeTab === 'locations') {
        await fetchLocations();
      }
      
      closeModal();
    } catch (error) {
      console.error(`❌ SATELLITE CHURCH: Error saving ${activeTab}:`, error);
      alert(`Error saving ${activeTab}. Please try again.`);
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;

    try {
      const table = `satellite_church_${activeTab}`;
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      if (activeTab === 'banners') {
        await fetchBanners();
      } else if (activeTab === 'locations') {
        await fetchLocations();
      }
    } catch (error) {
      console.error(`❌ SATELLITE CHURCH: Error deleting ${activeTab}:`, error);
      alert(`Error deleting ${activeTab}. Please try again.`);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const table = `satellite_church_${activeTab}`;
      const { error } = await supabase
        .from(table)
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      if (activeTab === 'banners') {
        await fetchBanners();
      } else if (activeTab === 'locations') {
        await fetchLocations();
      }
    } catch (error) {
      console.error(`❌ SATELLITE CHURCH: Error updating ${activeTab} status:`, error);
    }
  };

  const openModal = (item?: SatelliteChurchBanner | SatelliteChurchLocation) => {
    if (item) {
      setEditingItem(item);
      if (activeTab === 'banners') {
        const banner = item as SatelliteChurchBanner;
        setFormData({
          title: banner.title,
          address: '',
          email: '',
          phone: '',
          image_url: banner.image_url || '',
          position: 1,
          is_active: banner.is_active
        });
      } else if (activeTab === 'locations') {
        const location = item as SatelliteChurchLocation;
        setFormData({
          title: location.title,
          address: location.address,
          email: location.email,
          phone: location.phone,
          image_url: location.image_url || '',
          position: location.position,
          is_active: location.is_active
        });
      }
    } else {
      setEditingItem(null);
      const maxPosition = activeTab === 'locations' ? Math.max(...locations.map(l => l.position), 0) : 0;
      setFormData({
        title: '',
        address: '',
        email: '',
        phone: '',
        image_url: '',
        position: maxPosition + 1,
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    if (previewImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewImageUrl);
    }
    setSelectedFile(null);
    setPreviewImageUrl('');
    setFormData({
      title: '',
      address: '',
      email: '',
      phone: '',
      image_url: '',
      position: 1,
      is_active: true
    });
  };

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);
    
    try {
      console.log('🔄 SATELLITE CHURCH: Starting file upload...');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `satellite-church-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('❌ SATELLITE CHURCH: Upload error:', uploadError);
        if (uploadError.message?.includes('Bucket not found')) {
          throw new Error('Storage bucket not found. Please create an "images" bucket in Supabase Storage.');
        }
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;
      const previewUrl = URL.createObjectURL(file);
      setPreviewImageUrl(previewUrl);
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      
      console.log('✅ SATELLITE CHURCH: File uploaded successfully');
      
    } catch (error) {
      console.error('❌ SATELLITE CHURCH: Error uploading file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      alert(`Upload Error: ${errorMessage}`);
      
      const previewUrl = URL.createObjectURL(file);
      setPreviewImageUrl(previewUrl);
      setFormData(prev => ({ ...prev, image_url: '' }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file);
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Satellite Church Management</h2>
          <p className="text-gray-600">Manage Satellite Church banners and locations</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add {activeTab === 'banners' ? 'Banner' : 'Location'}
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
              <ImageIcon className="w-4 h-4" />
              Banners ({banners.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'locations'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Locations ({locations.length})
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
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No banners yet</h3>
                <p className="text-gray-500 mb-6">Create your first Satellite Church banner</p>
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
                            <ImageIcon className="w-6 h-6 text-gray-400" />
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
                          onClick={() => openModal(banner)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
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
            locations.length === 0 ? (
              <div className="text-center py-12">
                <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No locations yet</h3>
                <p className="text-gray-500 mb-6">Create your first Satellite Church location</p>
                <button
                  onClick={() => openModal()}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Add First Location
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className={`border rounded-xl p-4 transition-all duration-300 ${
                      location.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="cursor-move text-gray-400 hover:text-gray-600">
                        <GripVertical className="w-5 h-5" />
                      </div>

                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {location.image_url ? (
                          <img 
                            src={location.image_url}
                            alt={location.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Church className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-800 text-lg">{location.title}</h3>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            Position {location.position}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            location.is_active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {location.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3" />
                            <span>{location.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            <span>{location.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            <span>{location.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(location.id, location.is_active)}
                          className={`p-2 rounded-lg transition-colors ${
                            location.is_active
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {location.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openModal(location)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(location.id)}
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
                  {editingItem ? 'Edit' : 'Add'} {activeTab === 'banners' ? 'Banner' : 'Location'}
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
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {activeTab === 'banners' ? 'Banner Title' : 'Church Name'} *
                </label>
                <input
                  type="text"
                  placeholder={activeTab === 'banners' ? 'Enter banner title' : 'Enter church name'}
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Location Fields (only for locations tab) */}
              {activeTab === 'locations' && (
                <>
                  {/* Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Address *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter church address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="church@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
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
                </>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {activeTab === 'banners' ? 'Banner Image' : 'Church Image'}
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
                  placeholder="Image URL (auto-filled from upload or enter manually)"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                  Active (visible on website)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading || isUploading}
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
                      {editingItem ? 'Update' : 'Create'}
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

export default SatelliteChurchManager;