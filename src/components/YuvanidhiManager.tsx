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
  Users,
  Heart,
  Sparkles,
  Minus,
  FileText,
  BarChart3
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface YuvanidhibBanner {
  id: string;
  title: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface YuvanidhiContent {
  id: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface YuvanidhiStatistic {
  id: string;
  label: string;
  value: string;
  icon: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const YuvanidhiManager = () => {
  const [activeTab, setActiveTab] = useState<'banners' | 'content' | 'statistics'>('banners');
  const [banners, setBanners] = useState<YuvanidhibBanner[]>([]);
  const [content, setContent] = useState<YuvanidhiContent[]>([]);
  const [statistics, setStatistics] = useState<YuvanidhiStatistic[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<YuvanidhibBanner | YuvanidhiContent | YuvanidhiStatistic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    label: '',
    value: '',
    icon: 'Users',
    position: 1,
    is_active: true
  });

  const iconOptions = ['Users', 'Heart', 'Sparkles', 'Star', 'Globe', 'Target'];

  useEffect(() => {
    fetchBanners();
    fetchContent();
    fetchStatistics();
  }, []);

  const fetchBanners = async () => {
    try {
      console.log('🎯 YUVANIDHI: Fetching banners...');
      const { data, error } = await supabase
        .from('yuvanidhi_banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('✅ YUVANIDHI: Banners fetched:', data?.length || 0);
      setBanners(data || []);
    } catch (error) {
      console.error('❌ YUVANIDHI: Error fetching banners:', error);
    }
  };

  const fetchContent = async () => {
    try {
      console.log('🎯 YUVANIDHI: Fetching content...');
      const { data, error } = await supabase
        .from('yuvanidhi_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('✅ YUVANIDHI: Content fetched:', data?.length || 0);
      setContent(data || []);
    } catch (error) {
      console.error('❌ YUVANIDHI: Error fetching content:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      console.log('🎯 YUVANIDHI: Fetching statistics...');
      const { data, error } = await supabase
        .from('yuvanidhi_statistics')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;
      console.log('✅ YUVANIDHI: Statistics fetched:', data?.length || 0);
      setStatistics(data || []);
    } catch (error) {
      console.error('❌ YUVANIDHI: Error fetching statistics:', error);
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
      } else if (activeTab === 'content') {
        itemData.description = formData.description;
      } else if (activeTab === 'statistics') {
        itemData.label = formData.label;
        itemData.value = formData.value;
        itemData.icon = formData.icon;
        itemData.position = formData.position;
      }

      const table = `yuvanidhi_${activeTab}`;

      if (editingItem) {
        const { error } = await supabase
          .from(table)
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
        console.log(`✅ YUVANIDHI: ${activeTab} updated successfully`);
      } else {
        const { error } = await supabase
          .from(table)
          .insert([itemData]);

        if (error) throw error;
        console.log(`✅ YUVANIDHI: ${activeTab} created successfully`);
      }

      if (activeTab === 'banners') {
        await fetchBanners();
      } else if (activeTab === 'content') {
        await fetchContent();
      } else if (activeTab === 'statistics') {
        await fetchStatistics();
      }
      
      closeModal();
    } catch (error) {
      console.error(`❌ YUVANIDHI: Error saving ${activeTab}:`, error);
      alert(`Error saving ${activeTab}. Please try again.`);
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab.slice(0, -1)}?`)) return;

    try {
      const table = `yuvanidhi_${activeTab}`;
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      if (activeTab === 'banners') {
        await fetchBanners();
      } else if (activeTab === 'content') {
        await fetchContent();
      } else if (activeTab === 'statistics') {
        await fetchStatistics();
      }
    } catch (error) {
      console.error(`❌ YUVANIDHI: Error deleting ${activeTab}:`, error);
      alert(`Error deleting ${activeTab}. Please try again.`);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const table = `yuvanidhi_${activeTab}`;
      const { error } = await supabase
        .from(table)
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      if (activeTab === 'banners') {
        await fetchBanners();
      } else if (activeTab === 'content') {
        await fetchContent();
      } else if (activeTab === 'statistics') {
        await fetchStatistics();
      }
    } catch (error) {
      console.error(`❌ YUVANIDHI: Error updating ${activeTab} status:`, error);
    }
  };

  const openModal = (item?: YuvanidhibBanner | YuvanidhiContent | YuvanidhiStatistic) => {
    if (item) {
      setEditingItem(item);
      if (activeTab === 'banners') {
        const banner = item as YuvanidhibBanner;
        setFormData({
          title: banner.title,
          description: '',
          image_url: banner.image_url || '',
          label: '',
          value: '',
          icon: 'Users',
          position: 1,
          is_active: banner.is_active
        });
      } else if (activeTab === 'content') {
        const contentItem = item as YuvanidhiContent;
        setFormData({
          title: '',
          description: contentItem.description,
          image_url: '',
          label: '',
          value: '',
          icon: 'Users',
          position: 1,
          is_active: contentItem.is_active
        });
      } else if (activeTab === 'statistics') {
        const stat = item as YuvanidhiStatistic;
        setFormData({
          title: '',
          description: '',
          image_url: '',
          label: stat.label,
          value: stat.value,
          icon: stat.icon,
          position: stat.position,
          is_active: stat.is_active
        });
      }
    } else {
      setEditingItem(null);
      const maxPosition = activeTab === 'statistics' ? Math.max(...statistics.map(s => s.position), 0) : 0;
      setFormData({
        title: '',
        description: '',
        image_url: '',
        label: '',
        value: '',
        icon: 'Users',
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
      description: '',
      image_url: '',
      label: '',
      value: '',
      icon: 'Users',
      position: 1,
      is_active: true
    });
  };

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);
    
    try {
      console.log('🔄 YUVANIDHI: Starting file upload...');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `yuvanidhi-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('❌ YUVANIDHI: Upload error:', uploadError);
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
      
      console.log('✅ YUVANIDHI: File uploaded successfully');
      
    } catch (error) {
      console.error('❌ YUVANIDHI: Error uploading file:', error);
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

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Users,
      Heart,
      Sparkles
    };
    return icons[iconName] || Users;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Yuvanidhi Management</h2>
          <p className="text-gray-600">Manage Yuvanidhi banners, content, and statistics</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add {activeTab === 'banners' ? 'Banner' : activeTab === 'content' ? 'Content' : 'Statistic'}
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
            onClick={() => setActiveTab('content')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'content'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Content ({content.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'statistics'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Statistics ({statistics.length})
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
                <p className="text-gray-500 mb-6">Create your first Yuvanidhi banner</p>
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
          ) : activeTab === 'content' ? (
            content.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No content yet</h3>
                <p className="text-gray-500 mb-6">Create your first Yuvanidhi content</p>
                <button
                  onClick={() => openModal()}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Add First Content
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {content.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-xl p-6 transition-all duration-300 ${
                      item.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.is_active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(item.id, item.is_active)}
                          className={`p-2 rounded-lg transition-colors ${
                            item.is_active
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
            statistics.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No statistics yet</h3>
                <p className="text-gray-500 mb-6">Create your first Yuvanidhi statistic</p>
                <button
                  onClick={() => openModal()}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Add First Statistic
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {statistics.map((stat) => {
                  const IconComponent = getIconComponent(stat.icon);
                  return (
                    <div
                      key={stat.id}
                      className={`border rounded-xl p-4 transition-all duration-300 ${
                        stat.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="cursor-move text-gray-400 hover:text-gray-600">
                          <GripVertical className="w-5 h-5" />
                        </div>

                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-800 text-lg">{stat.value}</h3>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              Position {stat.position}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              stat.is_active 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {stat.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-gray-600">{stat.label}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleActive(stat.id, stat.is_active)}
                            className={`p-2 rounded-lg transition-colors ${
                              stat.is_active
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            {stat.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openModal(stat)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(stat.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                  {editingItem ? 'Edit' : 'Add'} {activeTab === 'banners' ? 'Banner' : activeTab === 'content' ? 'Content' : 'Statistic'}
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
              {/* Banner Fields */}
              {activeTab === 'banners' && (
                <>
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Title *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter banner title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Banner Image
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
                </>
              )}

              {/* Content Fields */}
              {activeTab === 'content' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Description *
                  </label>
                  <textarea
                    placeholder="Enter Yuvanidhi description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 resize-none"
                    required
                  />
                </div>
              )}

              {/* Statistics Fields */}
              {activeTab === 'statistics' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Label *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Active Youth"
                        value={formData.label}
                        onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Value *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., 200+"
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Icon
                      </label>
                      <select
                        value={formData.icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      >
                        {iconOptions.map(icon => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
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
                  </div>
                </>
              )}

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

export default YuvanidhiManager;