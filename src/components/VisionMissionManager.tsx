import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye,
  EyeOff,
  Target,
  Lightbulb,
  Minus
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VisionMission {
  id: string;
  type: 'vision' | 'mission';
  title: string;
  description: string;
  points: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const VisionMissionManager = () => {
  const [visionMissions, setVisionMissions] = useState<VisionMission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VisionMission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'vision' as 'vision' | 'mission',
    title: '',
    description: '',
    points: [''],
    is_active: true
  });

  useEffect(() => {
    fetchVisionMissions();
  }, []);

  const fetchVisionMissions = async () => {
    try {
      const { data, error } = await supabase
        .from('vision_mission')
        .select('*')
        .order('type', { ascending: true });

      if (error) throw error;
      setVisionMissions(data || []);
    } catch (error) {
      console.error('Error fetching vision/mission data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const itemData = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        points: formData.points.filter(point => point.trim() !== ''),
        is_active: formData.is_active,
        updated_at: new Date().toISOString()
      };

      if (editingItem) {
        const { error } = await supabase
          .from('vision_mission')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('vision_mission')
          .insert([itemData]);

        if (error) throw error;
      }

      await fetchVisionMissions();
      closeModal();
    } catch (error) {
      console.error('Error saving vision/mission:', error);
      alert('Error saving data. Please try again.');
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase
        .from('vision_mission')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchVisionMissions();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('vision_mission')
        .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchVisionMissions();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openModal = (item?: VisionMission) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        type: item.type,
        title: item.title,
        description: item.description,
        points: item.points.length > 0 ? item.points : [''],
        is_active: item.is_active
      });
    } else {
      setEditingItem(null);
      setFormData({
        type: 'vision',
        title: '',
        description: '',
        points: [''],
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      type: 'vision',
      title: '',
      description: '',
      points: [''],
      is_active: true
    });
  };

  const addPoint = () => {
    setFormData(prev => ({
      ...prev,
      points: [...prev.points, '']
    }));
  };

  const removePoint = (index: number) => {
    setFormData(prev => ({
      ...prev,
      points: prev.points.filter((_, i) => i !== index)
    }));
  };

  const updatePoint = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      points: prev.points.map((point, i) => i === index ? value : point)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vision & Mission Management</h2>
          <p className="text-gray-600">Manage your church's vision and mission statements</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New
        </button>
      </div>

      {/* Vision & Mission List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          {visionMissions.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No vision or mission statements yet</h3>
              <p className="text-gray-500 mb-6">Create your first vision or mission statement</p>
              <button
                onClick={() => openModal()}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Add First Item
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {visionMissions.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-xl p-6 transition-all duration-300 ${
                    item.is_active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Type Icon */}
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      item.type === 'vision' 
                        ? 'bg-teal-100 text-teal-600' 
                        : 'bg-amber-100 text-amber-600'
                    }`}>
                      {item.type === 'vision' ? (
                        <Lightbulb className="w-6 h-6" />
                      ) : (
                        <Target className="w-6 h-6" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.type === 'vision'
                            ? 'bg-teal-100 text-teal-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.is_active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
                      
                      {item.points.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-gray-700">Key Points:</h4>
                          <div className="flex flex-wrap gap-2">
                            {item.points.map((point, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                              >
                                {point}
                              </span>
                            ))}
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
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  {editingItem ? 'Edit' : 'Add New'} {formData.type === 'vision' ? 'Vision' : 'Mission'}
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
                  Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'vision' }))}
                    className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                      formData.type === 'vision'
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Lightbulb className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-semibold">Vision</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'mission' }))}
                    className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                      formData.type === 'mission'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Target className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-semibold">Mission</div>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Description
                </label>
                <textarea
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 resize-none"
                  required
                />
              </div>

              {/* Points */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Key Points
                  </label>
                  <button
                    type="button"
                    onClick={addPoint}
                    className="text-amber-600 hover:text-amber-700 text-sm font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Point
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.points.map((point, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        placeholder={`Point ${index + 1}`}
                        value={point}
                        onChange={(e) => updatePoint(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                      {formData.points.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePoint(index)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
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
                  Active (visible on website)
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

export default VisionMissionManager;