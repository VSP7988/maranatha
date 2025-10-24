import React, { useEffect, useRef, useState } from 'react';
import { Tv, Radio, Globe, Play, Calendar, Clock, Users, Satellite, Music, Heart, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface TVMinistryBanner {
  id: string;
  title: string;
  image_url?: string;
  is_active: boolean;
}

interface TVMinistryLogo {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  position: number;
  is_active: boolean;
}

const TVMinistryPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [banner, setBanner] = useState<TVMinistryBanner | null>(null);
  const [logos, setLogos] = useState<TVMinistryLogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    fetchTVMinistryData();
    
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

  const fetchTVMinistryData = async () => {
    try {
      setIsLoading(true);
      console.log('🎯 TV MINISTRY PAGE: Fetching data...');
      
      // Fetch banner
      const { data: bannerData, error: bannerError } = await supabase
        .from('tv_ministry_banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (bannerError) {
        console.error('❌ TV MINISTRY PAGE: Error fetching banner:', bannerError);
      } else {
        console.log('✅ TV MINISTRY PAGE: Banner fetched:', bannerData?.length || 0);
        setBanner(bannerData?.[0] || null);
      }

      // Fetch logos
      const { data: logosData, error: logosError } = await supabase
        .from('tv_ministry_logos')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (logosError) {
        console.error('❌ TV MINISTRY PAGE: Error fetching logos:', logosError);
      } else {
        console.log('✅ TV MINISTRY PAGE: Logos fetched:', logosData?.length || 0);
        setLogos(logosData || []);
      }
      
    } catch (error) {
      console.error('❌ TV MINISTRY PAGE: Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const programs = [
    {
      icon: Tv,
      title: 'Daily Devotions',
      description: 'Start your day with inspiring devotional messages and prayers broadcast every morning.',
      time: '6:00 AM - 6:30 AM',
      color: 'bg-blue-500'
    },
    {
      icon: Play,
      title: 'Sunday Service Live',
      description: 'Experience our complete Sunday worship service broadcast live to homes worldwide.',
      time: '9:00 AM & 11:00 AM',
      color: 'bg-red-500'
    },
    {
      icon: Radio,
      title: 'Gospel Hour',
      description: 'Weekly program featuring gospel music, testimonies, and uplifting spiritual messages.',
      time: 'Wednesdays 7:00 PM',
      color: 'bg-green-500'
    },
    {
      icon: Globe,
      title: 'Online Streaming',
      description: 'Watch all our programs live or on-demand through our online streaming platform.',
      time: '24/7 Available',
      color: 'bg-purple-500'
    },
    {
      icon: Users,
      title: 'Special Events',
      description: 'Coverage of special church events, conferences, and community outreach programs.',
      time: 'As Scheduled',
      color: 'bg-teal-500'
    },
    {
      icon: Satellite,
      title: 'International Broadcast',
      description: 'Reaching viewers across multiple countries through satellite and cable networks.',
      time: 'Multiple Time Zones',
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
            <p className="text-gray-600">Loading TV Ministry content...</p>
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
            backgroundImage: banner?.image_url ? `url(${banner.image_url})` : 'url(https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1600)',
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
                  <Tv className="w-2 h-2 text-amber-400/30" />
                ) : i % 3 === 1 ? (
                  <Radio className="w-2 h-2 text-amber-300/30" />
                ) : (
                  <Satellite className="w-2 h-2 text-amber-500/30" />
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
                  TV
                  <span className="block text-amber-500">
                    Ministry
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
          {/* TV Ministry Logos Section */}
          {logos.length > 0 ? (
            <div className="w-full">
              <div className="text-center mb-16">
                <div className={`transform transition-all duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
                    Our TV Ministry Partners
                  </h2>
                  <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                    Broadcasting the Gospel through various television networks and platforms
                  </p>
                </div>
              </div>

              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {logos.map((logo, index) => (
                  <div
                    key={logo.id}
                    className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 border border-slate-100 w-[80%] mx-auto ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/5 transition-colors duration-500"></div>
                    
                    {/* Logo Image - Full Width */}
                    <div className="relative w-full h-48 overflow-hidden">
                      {logo.image_url ? (
                        <img 
                          src={logo.image_url} 
                          alt={logo.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                          <Tv className="w-16 h-16 text-white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Tv className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No TV Ministry content found</h3>
              <p className="text-gray-500">Add TV Ministry images in the admin panel to display them here.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TVMinistryPage;