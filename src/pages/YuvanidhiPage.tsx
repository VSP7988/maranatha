import React, { useEffect, useRef, useState } from 'react';
import { Users, Heart, Star, Target, Globe, BookOpen, Calendar, MapPin } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface YuvanidhibBanner {
  id: string;
  title: string;
  image_url?: string;
  is_active: boolean;
}

interface YuvanidhiContent {
  id: string;
  description: string;
  is_active: boolean;
}

interface YuvanidhiStatistic {
  id: string;
  label: string;
  value: string;
  icon: string;
  position: number;
  is_active: boolean;
}

const YuvanidhiPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [banner, setBanner] = useState<YuvanidhibBanner | null>(null);
  const [content, setContent] = useState<YuvanidhiContent | null>(null);
  const [statistics, setStatistics] = useState<YuvanidhiStatistic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    fetchYuvanidhiData();
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const fetchYuvanidhiData = async () => {
    try {
      setIsLoading(true);
      console.log('🎯 YUVANIDHI PAGE: Fetching data...');
      
      // Fetch banner
      const { data: bannerData, error: bannerError } = await supabase
        .from('yuvanidhi_banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (bannerError) {
        console.error('❌ YUVANIDHI PAGE: Error fetching banner:', bannerError);
      } else {
        console.log('✅ YUVANIDHI PAGE: Banner fetched:', bannerData?.length || 0);
        setBanner(bannerData?.[0] || null);
      }

      // Fetch content
      const { data: contentData, error: contentError } = await supabase
        .from('yuvanidhi_content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (contentError) {
        console.error('❌ YUVANIDHI PAGE: Error fetching content:', contentError);
      } else {
        console.log('✅ YUVANIDHI PAGE: Content fetched:', contentData?.length || 0);
        setContent(contentData?.[0] || null);
      }

      // Fetch statistics
      const { data: statsData, error: statsError } = await supabase
        .from('yuvanidhi_statistics')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (statsError) {
        console.error('❌ YUVANIDHI PAGE: Error fetching statistics:', statsError);
      } else {
        console.log('✅ YUVANIDHI PAGE: Statistics fetched:', statsData?.length || 0);
        setStatistics(statsData || []);
      }
      
    } catch (error) {
      console.error('❌ YUVANIDHI PAGE: Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Users,
      Heart,
      Star,
      Target,
      Globe,
      BookOpen
    };
    return icons[iconName] || Users;
  };

  const programs = [
    {
      icon: BookOpen,
      title: 'Bible Study Groups',
      description: 'Weekly Bible study sessions designed specifically for young adults to explore God\'s word together.',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Fellowship Events',
      description: 'Regular social gatherings, retreats, and community service projects to build lasting friendships.',
      color: 'bg-green-500'
    },
    {
      icon: Target,
      title: 'Leadership Training',
      description: 'Develop leadership skills and spiritual maturity through mentorship and practical ministry experience.',
      color: 'bg-purple-500'
    },
    {
      icon: Heart,
      title: 'Worship & Prayer',
      description: 'Contemporary worship services and prayer meetings tailored for the younger generation.',
      color: 'bg-red-500'
    },
    {
      icon: Globe,
      title: 'Mission Trips',
      description: 'Local and international mission opportunities to serve communities and share God\'s love.',
      color: 'bg-teal-500'
    },
    {
      icon: Star,
      title: 'Mentorship Program',
      description: 'One-on-one mentoring relationships with mature believers for spiritual growth and guidance.',
      color: 'bg-amber-500'
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Yuvanidhi content...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Banner */}
      <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-slate-900"
          style={{
            backgroundImage: banner?.image_url ? `url(${banner.image_url})` : 'url(https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=1600)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${4 + Math.random() * 3}s`,
                }}
              >
                {i % 3 === 0 ? (
                  <Users className="w-2 h-2 text-amber-400/30" />
                ) : i % 3 === 1 ? (
                  <Heart className="w-2 h-2 text-amber-300/30" />
                ) : (
                  <Star className="w-2 h-2 text-amber-500/30" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Banner Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className={`transform transition-all duration-1500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {banner?.title ? (
                banner.title.split(' ').map((word, index) => (
                  <span key={index} className={index === banner.title.split(' ').length - 1 ? 
                    "block text-amber-500" : 
                    ""
                  }>
                    {word}{index < banner.title.split(' ').length - 1 ? ' ' : ''}
                  </span>
                ))
              ) : (
                <>
                  Yuvanidhi
                  <span className="block text-amber-500">
                    Youth Ministry
                  </span>
                </>
              )}
            </h1>
            
           
            
            
          </div>
        </div>
      </div>

      {/* Programs Content Section */}
      <div ref={ref} className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          {content ? (
            /* About Yuvanidhi Section */
            <div className="mb-20">
              <div className="max-w-full mx-auto">
                {/* Full Width Content */}
                <div className={`w-full transform transition-all duration-1000 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}>
                  <div className="bg-white rounded-3xl p-8 md:p-16 shadow-xl border border-slate-100 space-y-8">
                    
                    <div className="text-center mb-12">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
                        About Yuvanidhi
                      </h2>
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                      <p className="text-lg md:text-xl text-slate-700 leading-relaxed text-center">
                        {content.description}
                      </p>
                      
                      {/* Statistics */}
                      {statistics.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                          {statistics.map((stat, index) => {
                            const IconComponent = getIconComponent(stat.icon);
                            return (
                              <div
                                key={stat.id}
                                className={`bg-white rounded-xl p-6 shadow-lg text-center border border-slate-200 transform transition-all duration-700 ${
                                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                }`}
                                style={{ transitionDelay: `${index * 100 + 600}ms` }}
                              >
                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <IconComponent className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                                <div className="text-sm text-slate-600">{stat.label}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No content found</h3>
              <p className="text-gray-500">Add Yuvanidhi content in the admin panel to display it here.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default YuvanidhiPage;