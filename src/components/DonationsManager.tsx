import React, { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit, Trash2, Save, X, Upload, Image as ImageIcon, Eye, EyeOff, GripVertical, Heart, CreditCard, QrCode, Building2, Globe, Minus, FileText, DollarSign } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DonationsBanner {
  id: string;
  title: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DonationsPaymentMethod {
  id: string;
  type: 'national' | 'international';
  method_type: 'upi' | 'bank' | 'online' | 'paypal' | 'wire' | 'crypto';
  title: string;
  description?: string;
  qr_code_url?: string;
  upi_id?: string;
  bank_details: {
    accountName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branch?: string;
    routingNumber?: string;
    swiftCode?: string;
    address?: string;
  };
  payment_link?: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const DonationsManager = () => {
  const [activeTab, setActiveTab] = useState<'banners' | 'national' | 'international'>('banners');
  const [banners, setBanners] = useState<DonationsBanner[]>([]);
  const [nationalMethods, setNationalMethods] = useState<DonationsPaymentMethod[]>([]);
  const [internationalMethods, setInternationalMethods] = useState<DonationsPaymentMethod[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DonationsBanner | DonationsPaymentMethod | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    method_type: 'upi' as 'upi' | 'bank' | 'online' | 'paypal' | 'wire' | 'crypto',
    qr_code_url: '',
    upi_id: '',
    bank_details: {
      accountName: '',
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      branch: '',
      routingNumber: '',
      swiftCode: '',
      address: ''
    },
    payment_link: '',
    position: 1,
    is_active: true
  });

  useEffect(() => {
    fetchBanners();
    fetchPaymentMethods();
  }, []);

  const fetchBanners = async () => {
    try {
      console.log('🎯 DONATIONS: Fetching banners...');
      const { data, error } = await supabase
        .from('donations_banners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('✅ DONATIONS: Banners fetched:', data?.length || 0);
      setBanners(data || []);
    } catch (error) {
      console.error('❌ DONATIONS: Error fetching banners:', error);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      console.log('🎯 DONATIONS: Fetching payment methods...');
      
      // Fetch national methods
      const { data: nationalData, error: nationalError } = await supabase
        .from('donations_payment_methods')
        .select('*')
        .eq('type', 'national')
        .order('position', { ascending: true });

      if (nationalError) throw nationalError;
      console.log('✅ DONATIONS: National methods fetched:', nationalData?.length || 0);
      setNationalMethods(nationalData || []);

      // Fetch international methods
      const { data: internationalData, error: internationalError } = await supabase
        .from('donations_payment_methods')
        .select('*')
        .eq('type', 'international')
        .order('position', { ascending: true });

      if (internationalError) throw internationalError;
      console.log('✅ DONATIONS: International methods fetched:', internationalData?.length || 0);
      setInternationalMethods(internationalData || []);
    } catch (error) {
      console.error('❌ DONATIONS: Error fetching payment methods:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === 'banners') {
        const bannerData = {
          title: formData.title,
          image_url: formData.image_url || null,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        };

        if (editingItem) {
          const { error } = await supabase
            .from('donations_banners')
            .update(bannerData)
            .eq('id', editingItem.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('donations_banners')
            .insert([bannerData]);

          if (error) throw error;
        }

        await fetchBanners();
      } else {
        const paymentData = {
          type: activeTab,
          method_type: formData.method_type,
          title: formData.title,
          description: formData.description || null,
          qr_code_url: formData.qr_code_url || null,
          upi_id: formData.upi_id || null,
          bank_details: formData.bank_details,
          payment_link: formData.payment_link || null,
          position: formData.position,
          is_active: formData.is_active,
          updated_at: new Date().toISOString()
        };

        if (editingItem) {
          const { error } = await supabase
            .from('donations_payment_methods')
            .update(paymentData)
            .eq('id', editingItem.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('donations_payment_methods')
            .insert([paymentData]);

          if (error) throw error;
        }

        await fetchPaymentMethods();
      }

      closeModal();
    } catch (error) {
      console.error('❌ DONATIONS: Error saving data:', error);
      alert('Error saving data. Please try again.');
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      if (activeTab === 'banners') {
        const { error } = await supabase
          .from('donations_banners')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchBanners();
      } else {
        const { error } = await supabase
          .from('donations_payment_methods')
          .delete()
          .eq('id', id);

        if (error) throw error;
        await fetchPaymentMethods();
      }
    } catch (error) {
      console.error('❌ DONATIONS: Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      if (activeTab === 'banners') {
        const { error } = await supabase
          .from('donations_banners')
          .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
        await fetchBanners();
      } else {
        const { error } = await supabase
          .from('donations_payment_methods')
          .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (error) throw error;
        await fetchPaymentMethods();
      }
    } catch (error) {
      console.error('❌ DONATIONS: Error updating status:', error);
    }
  };

  const openModal = (item?: DonationsBanner | DonationsPaymentMethod) => {
    if (item) {
      setEditingItem(item);
      if (activeTab === 'banners') {
        const banner = item as DonationsBanner;
        setFormData({
          title: banner.title,
          description: '',
          image_url: banner.image_url || '',
          method_type: 'upi',
          qr_code_url: '',
          upi_id: '',
          bank_details: {
            accountName: '',
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branch: '',
            routingNumber: '',
            swiftCode: '',
            address: ''
          },
          payment_link: '',
          position: 1,
          is_active: banner.is_active
        });
      } else {
        const method = item as DonationsPaymentMethod;
        setFormData({
          title: method.title,
          description: method.description || '',
          image_url: '',
          method_type: method.method_type,
          qr_code_url: method.qr_code_url || '',
          upi_id: method.upi_id || '',
          bank_details: method.bank_details || {
            accountName: '',
            accountNumber: '',
            ifscCode: '',
            bankName: '',
            branch: '',
            routingNumber: '',
            swiftCode: '',
            address: ''
          },
          payment_link: method.payment_link || '',
          position: method.position,
          is_active: method.is_active
        });
      }
    } else {
      setEditingItem(null);
      const currentMethods = activeTab === 'national' ? nationalMethods : internationalMethods;
      const maxPosition = currentMethods.length > 0 ? Math.max(...currentMethods.map(m => m.position)) : 0;
      
      setFormData({
        title: '',
        description: '',
        image_url: '',
        method_type: activeTab === 'national' ? 'upi' : 'paypal',
        qr_code_url: '',
        upi_id: '',
        bank_details: {
          accountName: '',
          accountNumber: '',
          ifscCode: '',
          bankName: '',
          branch: '',
          routingNumber: '',
          swiftCode: '',
          address: ''
        },
        payment_link: '',
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
      method_type: 'upi',
      qr_code_url: '',
      upi_id: '',
      bank_details: {
        accountName: '',
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        branch: '',
        routingNumber: '',
        swiftCode: '',
        address: ''
      },
      payment_link: '',
      position: 1,
      is_active: true
    });
  };

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);
    
    try {
      console.log('🔄 DONATIONS: Starting file upload...');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `donations-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        console.error('❌ DONATIONS: Upload error:', uploadError);
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
      
      if (activeTab === 'banners') {
        setFormData(prev => ({ ...prev, image_url: publicUrl }));
      } else {
        setFormData(prev => ({ ...prev, qr_code_url: publicUrl }));
      }
      
      console.log('✅ DONATIONS: File uploaded successfully');
      
    } catch (error) {
      console.error('❌ DONATIONS: Error uploading file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      alert(`Upload Error: ${errorMessage}`);
      
      const previewUrl = URL.createObjectURL(file);
      setPreviewImageUrl(previewUrl);
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

  const updateBankDetail = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      bank_details: {
        ...prev.bank_details,
        [field]: value
      }
    }));
  };

  const getMethodIcon = (methodType: string) => {
    const icons: { [key: string]: any } = {
      upi: QrCode,
      bank: Building2,
      online: CreditCard,
      paypal: Globe,
      wire: Building2,
      crypto: QrCode
    };
    return icons[methodType] || CreditCard;
  };

  const currentMethods = activeTab === 'national' ? nationalMethods : internationalMethods;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Donations Management</h2>
          <p className="text-gray-600">Manage donations page banners and payment methods</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add {activeTab === 'banners' ? 'Banner' : 'Payment Method'}
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
            onClick={() => setActiveTab('national')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'national'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              National ({nationalMethods.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('international')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'international'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              International ({internationalMethods.length})
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
                <p className="text-gray-500 mb-6">Create your first donations banner</p>
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
                            <Heart className="w-6 h-6 text-gray-400" />
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
            currentMethods.length === 0 ? (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No payment methods yet</h3>
                <p className="text-gray-500 mb-6">Create your first {activeTab} payment method</p>
                <button
                  onClick={() => openModal()}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Add First Method
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentMethods.map((method) => {
                  const IconComponent = getMethodIcon(method.method_type);
                  return (
                    <div
                      key={method.id}
                      className={`border rounded-xl p-4 transition-all duration-300 ${
                        method.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="cursor-move text-gray-400 hover:text-gray-600">
                          <GripVertical className="w-5 h-5" />
                        </div>

                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-6 h-6 text-amber-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-800 text-lg">{method.title}</h3>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {method.method_type.toUpperCase()}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              Position {method.position}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              method.is_active 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {method.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          {method.description && (
                            <p className="text-gray-600 text-sm">{method.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleActive(method.id, method.is_active)}
                            className={`p-2 rounded-lg transition-colors ${
                              method.is_active
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-50'
                            }`}
                          >
                            {method.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => openModal(method)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(method.id)}
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
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingItem ? 'Edit' : 'Add'} {activeTab === 'banners' ? 'Banner' : `${activeTab} Payment Method`}
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
                      Banner Title *
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

              {/* Payment Method Fields */}
              {(activeTab === 'national' || activeTab === 'international') && (
                <>
                  {/* Title and Description */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Title *
                      </label>
                      <input
                        type="text"
                        placeholder="Enter method title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="Enter description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Method Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Payment Method Type *
                    </label>
                    <select
                      value={formData.method_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, method_type: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      required
                    >
                      {activeTab === 'national' ? (
                        <>
                          <option value="upi">UPI Payment</option>
                          <option value="bank">Bank Transfer</option>
                          <option value="online">Online Payment</option>
                        </>
                      ) : (
                        <>
                          <option value="paypal">PayPal</option>
                          <option value="wire">Wire Transfer</option>
                          <option value="crypto">Cryptocurrency</option>
                        </>
                      )}
                    </select>
                  </div>

                  {/* 1. QR Code Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      1. QR Code Image (Optional)
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                        isUploading 
                          ? 'border-blue-400 bg-blue-50' 
                          : selectedFile 
                            ? 'border-green-400 bg-green-50' 
                            : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {selectedFile ? (
                        <div className="space-y-4">
                          <div className="w-24 h-24 mx-auto rounded-lg overflow-hidden border border-gray-200">
                            <img 
                              src={previewImageUrl} 
                              alt="QR Code Preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-green-600">
                            <p className="font-semibold">✓ QR Code Selected</p>
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
                              setFormData(prev => ({ ...prev, qr_code_url: '' }));
                            }}
                            className="text-red-600 hover:text-red-700 text-sm underline"
                          >
                            Remove QR Code
                          </button>
                        </div>
                      ) : (
                        <>
                          <QrCode className={`w-8 h-8 mx-auto mb-2 ${
                            isUploading ? 'text-blue-500 animate-bounce' : 'text-gray-400'
                          }`} />
                          <p className="text-gray-600 mb-2">
                            {isUploading ? 'Processing QR code...' : 'Upload QR Code (Optional)'}
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="qr-upload"
                            disabled={isUploading}
                          />
                          <label
                            htmlFor="qr-upload"
                            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                              isUploading 
                                ? 'bg-gray-400 text-white cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                          >
                            {isUploading ? 'Processing...' : 'Select QR Code'}
                          </label>
                        </>
                      )}
                    </div>
                    <input
                      type="url"
                      placeholder="QR Code URL (auto-filled from upload or enter manually)"
                      value={formData.qr_code_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, qr_code_url: e.target.value }))}
                      className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* 2. UPI ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      2. UPI ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="example@paytm (for UPI payments)"
                      value={formData.upi_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, upi_id: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* 3. Bank Details */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      3. Bank Account Details (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Account Name"
                        value={formData.bank_details.accountName}
                        onChange={(e) => updateBankDetail('accountName', e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Account Number"
                        value={formData.bank_details.accountNumber}
                        onChange={(e) => updateBankDetail('accountNumber', e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="IFSC Code / SWIFT Code"
                        value={formData.bank_details.ifscCode || formData.bank_details.swiftCode}
                        onChange={(e) => {
                          updateBankDetail('ifscCode', e.target.value);
                          updateBankDetail('swiftCode', e.target.value);
                        }}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Bank Name"
                        value={formData.bank_details.bankName}
                        onChange={(e) => updateBankDetail('bankName', e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Branch / Routing Number"
                        value={formData.bank_details.branch || formData.bank_details.routingNumber}
                        onChange={(e) => {
                          updateBankDetail('branch', e.target.value);
                          updateBankDetail('routingNumber', e.target.value);
                        }}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Bank Address (for international)"
                        value={formData.bank_details.address}
                        onChange={(e) => updateBankDetail('address', e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* 4. Payment Link */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      4. Payment Link (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/payment (for online payments)"
                      value={formData.payment_link}
                      onChange={(e) => setFormData(prev => ({ ...prev, payment_link: e.target.value }))}
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

export default DonationsManager;