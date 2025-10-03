import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface Logo {
  id: string;
  image_url: string;
  type: 'header' | 'footer';
  is_active: boolean;
  created_at: string;
}

export default function LogoManager() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedType, setSelectedType] = useState<'header' | 'footer'>('header');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const { data, error } = await supabase
        .from('logo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogos(data || []);
    } catch (error) {
      console.error('Error fetching logos:', error);
    } finally {
      setLoading(false);
    }
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      await supabase
        .from('logo')
        .update({ is_active: false })
        .eq('type', selectedType);

      const { error: insertError } = await supabase
        .from('logo')
        .insert([
          {
            image_url: publicUrl,
            type: selectedType,
            is_active: true,
          },
        ]);

      if (insertError) throw insertError;

      await fetchLogos();
      alert('Logo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error uploading logo. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this logo?')) return;

    try {
      const { error } = await supabase.from('logo').delete().eq('id', id);

      if (error) throw error;

      await fetchLogos();
      alert('Logo deleted successfully!');
    } catch (error) {
      console.error('Error deleting logo:', error);
      alert('Error deleting logo. Please try again.');
    }
  };

  const handleSetActive = async (id: string, type: 'header' | 'footer') => {
    try {
      await supabase
        .from('logo')
        .update({ is_active: false })
        .eq('type', type);

      const { error } = await supabase
        .from('logo')
        .update({ is_active: true })
        .eq('id', id);

      if (error) throw error;

      await fetchLogos();
      alert('Logo activated successfully!');
    } catch (error) {
      console.error('Error activating logo:', error);
      alert('Error activating logo. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const headerLogos = logos.filter((logo) => logo.type === 'header');
  const footerLogos = logos.filter((logo) => logo.type === 'footer');

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Logo Management</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Logo Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as 'header' | 'footer')}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="header">Header Logo</option>
          <option value="footer">Footer Logo</option>
        </select>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="logo-upload"
        />
        <label
          htmlFor="logo-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            {uploading ? 'Uploading...' : 'Drop logo here or click to upload'}
          </p>
          <p className="text-sm text-gray-500">
            PNG, JPG, or SVG (recommended: 200x60px for header, 150x50px for footer)
          </p>
        </label>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Header Logos</h3>
        {headerLogos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No header logos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {headerLogos.map((logo) => (
              <div
                key={logo.id}
                className={`relative border rounded-lg p-4 ${
                  logo.is_active ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                {logo.is_active && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Active
                  </div>
                )}
                <button
                  onClick={() => handleDelete(logo.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                  title="Delete logo"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex justify-center items-center h-24 mb-3 bg-white rounded">
                  <img
                    src={logo.image_url}
                    alt="Header Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                {!logo.is_active && (
                  <button
                    onClick={() => handleSetActive(logo.id, 'header')}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    Set as Active
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Footer Logos</h3>
        {footerLogos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No footer logos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {footerLogos.map((logo) => (
              <div
                key={logo.id}
                className={`relative border rounded-lg p-4 ${
                  logo.is_active ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                {logo.is_active && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Active
                  </div>
                )}
                <button
                  onClick={() => handleDelete(logo.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                  title="Delete logo"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex justify-center items-center h-24 mb-3 bg-white rounded">
                  <img
                    src={logo.image_url}
                    alt="Footer Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                {!logo.is_active && (
                  <button
                    onClick={() => handleSetActive(logo.id, 'footer')}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    Set as Active
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
