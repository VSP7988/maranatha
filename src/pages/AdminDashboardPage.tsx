import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, DollarSign, MessageSquare, BarChart3, Settings, LogOut, Bell, Search, Plus, Eye, CreditCard as Edit, Trash2, TrendingUp, Heart, Church, Image as ImageIcon, Target, Cross } from 'lucide-react';
import { supabase } from '../lib/supabase';
import BannerManager from '../components/BannerManager';
import VisionMissionManager from '../components/VisionMissionManager';
import EventsManager from '../components/EventsManager';
import GalleryManager from '../components/GalleryManager';
import AboutManager from '../components/AboutManager';
import WorshipManager from '../components/WorshipManager';
import YuvanidhiManager from '../components/YuvanidhiManager';
import TVMinistryManager from '../components/TVMinistryManager';
import PrayerHutManager from '../components/PrayerHutManager';
import SatelliteChurchManager from '../components/SatelliteChurchManager';
import VivahaVedikaManager from '../components/VivahaVedikaManager';
import WeBelieveManager from '../components/WeBelieveManager';
import DonationsManager from '../components/DonationsManager';
import LogoManager from '../components/LogoManager';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminUser, setAdminUser] = useState<any>(null);
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    
    console.log('🔐 DASHBOARD: Checking authentication...', {
      hasToken: !!token,
      hasUser: !!userStr
    });
    
    if (!token) {
      console.log('🔐 DASHBOARD: No token found, redirecting to login');
      navigate('/admin/login');
    } else if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('🔐 DASHBOARD: User authenticated:', user.email);
        setAdminUser(user);
      } catch (error) {
        console.error('🔐 DASHBOARD: Error parsing user data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    console.log('🔐 DASHBOARD: Logging out...');
    // Sign out from Supabase
    supabase.auth.signOut();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    console.log('🔐 DASHBOARD: Redirecting to login');
    navigate('/admin/login');
  };

  const stats = [
    {
      title: 'Total Members',
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Monthly Donations',
      value: '$24,580',
      change: '+8%',
      icon: DollarSign,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Upcoming Events',
      value: '8',
      change: '+2',
      icon: Calendar,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Prayer Requests',
      value: '156',
      change: '+23',
      icon: Heart,
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const recentActivities = [
    { type: 'member', message: 'New member John Doe registered', time: '2 hours ago' },
    { type: 'donation', message: 'Received $500 donation from Sarah Smith', time: '4 hours ago' },
    { type: 'event', message: 'Youth Night event created for Saturday', time: '6 hours ago' },
    { type: 'prayer', message: '5 new prayer requests submitted', time: '8 hours ago' },
    { type: 'member', message: 'Member profile updated: Mike Johnson', time: '1 day ago' }
  ];

  const upcomingEvents = [
    { title: 'Sunday Worship Service', date: 'Dec 22, 2024', time: '9:00 AM', attendees: 500 },
    { title: 'Youth Night', date: 'Dec 23, 2024', time: '7:00 PM', attendees: 200 },
    { title: 'Prayer Meeting', date: 'Dec 25, 2024', time: '7:30 PM', attendees: 150 },
    { title: 'Family Fun Day', date: 'Dec 28, 2024', time: '10:00 AM', attendees: 300 }
  ];

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'logo', label: 'Logo Management', icon: ImageIcon },
    { id: 'banners', label: 'Banner Management', icon: ImageIcon },
    { id: 'about', label: 'About Section', icon: Users },
    { id: 'vision-mission', label: 'Vision & Mission', icon: Target },
    { id: 'we-believe', label: 'We Believe Management', icon: Cross },
    { id: 'worship', label: 'Worship Management', icon: Heart },
    { id: 'yuvanidhi', label: 'Yuvanidhi Management', icon: Users },
    { id: 'tv-ministry', label: 'TV Ministry Management', icon: Users },
    { id: 'prayer-hut', label: 'Prayer Hut Management', icon: Heart },
    { id: 'satellite-church', label: 'Satellite Church Management', icon: Users },
    { id: 'vivaha-vedika', label: 'Vivaha Vedika Management', icon: Heart },
    { id: 'donations', label: 'Donations Management', icon: DollarSign },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'events', label: 'Events', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
              <Church className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">MARANATHA</h2>
              <p className="text-sm text-gray-600">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-amber-50 text-amber-600 border border-amber-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeTab}</h1>
              <p className="text-gray-600">Welcome back, {adminUser?.email || 'Admin'}</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 font-semibold"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Access Services Grid */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Access - All Services</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {sidebarItems.filter(item => item.id !== 'overview').map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className="group bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 group-hover:bg-amber-100 rounded-xl flex items-center justify-center transition-colors duration-300">
                          <item.icon className="w-6 h-6 text-gray-600 group-hover:text-amber-600 transition-colors duration-300" />
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-gray-800 group-hover:text-amber-600 transition-colors duration-300 leading-tight">
                            {item.label}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Logo Management Tab */}
          {activeTab === 'logo' && <LogoManager />}

          {/* Banner Management Tab */}
          {activeTab === 'banners' && <BannerManager />}

          {/* About Management Tab */}
          {activeTab === 'about' && <AboutManager />}

          {/* Vision & Mission Management Tab */}
          {activeTab === 'vision-mission' && <VisionMissionManager />}

          {/* Events Management Tab */}
          {activeTab === 'events' && <EventsManager />}

          {/* Gallery Management Tab */}
          {activeTab === 'gallery' && <GalleryManager />}

          {/* Worship Management Tab */}
          {activeTab === 'worship' && <WorshipManager />}

          {/* Yuvanidhi Management Tab */}
          {activeTab === 'yuvanidhi' && <YuvanidhiManager />}

          {/* TV Ministry Management Tab */}
          {activeTab === 'tv-ministry' && <TVMinistryManager />}

          {/* Prayer Hut Management Tab */}
          {activeTab === 'prayer-hut' && <PrayerHutManager />}

          {/* Satellite Church Management Tab */}
          {activeTab === 'satellite-church' && <SatelliteChurchManager />}

          {/* Vivaha Vedika Management Tab */}
          {activeTab === 'vivaha-vedika' && <VivahaVedikaManager />}

          {/* We Believe Management Tab */}
          {activeTab === 'we-believe' && <WeBelieveManager />}

          {/* Donations Management Tab */}
          {activeTab === 'donations' && <DonationsManager />}

          {/* Other tabs content */}
          {!['overview', 'logo', 'banners', 'about', 'vision-mission', 'events', 'gallery', 'worship', 'yuvanidhi', 'tv-ministry', 'prayer-hut', 'satellite-church', 'vivaha-vedika', 'we-believe', 'donations'].includes(activeTab) && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {sidebarItems.find(item => item.id === activeTab)?.icon && (
                  React.createElement(sidebarItems.find(item => item.id === activeTab)!.icon, { className: "w-8 h-8 text-gray-400" })
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 capitalize">{activeTab} Management</h3>
              <p className="text-gray-600 mb-6">This section is under development. Content for {activeTab} will be available soon.</p>
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                Coming Soon
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;