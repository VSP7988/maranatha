import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye,
  EyeOff,
  Users,
  Heart,
  Sparkles,
  Minus
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AboutData {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
    icon: string;
  }>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const AboutManager = () => {
  const [aboutData, setAboutData] = useState<AboutData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    stats: [{ label: '', value: '', icon: 'Heart' }],
    is_active: true
  });

  const iconOptions = ['Heart', 'Users', 'Sparkles', 'Star', 'Globe', 'Church'];

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAboutData(data || []);
    } catch (error) {
      console.error('Error fetching about data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const aboutDataToSave = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description,
        stats: formData.stats.filter(stat => stat.label.trim() !== '' && stat.value.trim() !== ''),
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      };

      if (editingItem) {
        const { error } = await supabase
          .from('about')
          .update(aboutDataToSave)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('about')
          .insert([aboutDataToSave]);

        if (error) throw error;
      }

      await fetchAboutData();
      closeModal();
    } catch (error) {
      console.error('Error saving about data:', error);
      alert('Error saving data. Please try again.');
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this about section?')) return;

    try {
      const { error } = await supabase
        .from('about')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAboutData();
    } catch (error) {
      console.error('Error deleting about data:', error);
      alert('Error deleting data. Please try again.');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('about')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchAboutData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openModal = (item?: AboutData) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        subtitle: item.subtitle || '',
        description: item.description,
        stats: item.stats.length > 0 ? item.stats : [{ label: '', value: '', icon: 'Heart' }],
        is_active: item.is_active
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        stats: [{ label: '', value: '', icon: 'Heart' }],
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      stats: [{ label: '', value: '', icon: 'Heart' }],
      is_active: true
    });
  };

  const addStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, { label: '', value: '', icon: 'Heart' }]
    }));
  };

  const removeStat = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  const updateStat = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.map((stat, i) => 
        i === index ? { ...stat, [field]: value } : stat
      )
    }));
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Heart,
      Users,
      Sparkles
    };
    return icons[iconName] || Heart;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">About Section Management</h2>
          <p className="text-gray-600">Manage the homepage about section content</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add About Section
        </button>
      </div>

      {/* About Data List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          {aboutData.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No about sections yet</h3>
              <p className="text-gray-500 mb-6">Create your first about section</p>
              <button
                onClick={() => openModal()}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Add First Section
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {aboutData.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-xl p-6 transition-all duration-300 ${
                    item.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {item.subtitle && (
                        <p className="text-lg text-gray-700 mb-3 font-medium">{item.subtitle}</p>
                      )}
                      
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{item.description}</p>
                      
                      {item.stats.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-gray-700">Statistics:</h4>
                          <div className="flex flex-wrap gap-3">
                            {item.stats.map((stat, index) => {
                              const IconComponent = getIconComponent(stat.icon);
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm"
                                >
                                  <IconComponent className="w-4 h-4" />
                                  <span className="font-semibold">{stat.value}</span>
                                  <span>{stat.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleActive(item.id, item.is_active)}
                        className={`p-2 rounded-lg transition-colors ${
                          item.is_active
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={item.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openModal(item)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingItem ? 'Edit About Section' : 'Add About Section'}
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
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter section title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Subtitle (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter section subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Description *
                </label>
                <textarea
                  placeholder="Enter section description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 resize-none"
                  required
                />
              </div>

              {/* Statistics */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Statistics
                  </label>
                  <button
                    type="button"
                    onClick={addStat}
                    className="text-amber-600 hover:text-amber-700 text-sm font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Stat
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.stats.map((stat, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Label (e.g., Families)"
                          value={stat.label}
                          onChange={(e) => updateStat(index, 'label', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 text-sm"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="Value (e.g., 500+)"
                          value={stat.value}
                          onChange={(e) => updateStat(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 text-sm"
                        />
                      </div>
                      <div className="col-span-4">
                        <select
                          value={stat.icon}
                          onChange={(e) => updateStat(index, 'icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 text-sm"
                        >
                          {iconOptions.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-1">
                        {formData.stats.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStat(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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
                  disabled={isLoading}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
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

export default AboutManager;