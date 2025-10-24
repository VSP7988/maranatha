import React, { useEffect, useRef, useState } from 'react';
import { Play, Calendar, User, Music, Heart, Star, Clock, Eye } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface WorshipBanner {
  id: string;
  title: string;
  image_url?: string;
  is_active: boolean;
}

interface WorshipContent {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  position: number;
  is_active: boolean;
}

const WorshipPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [banner, setBanner] = useState<WorshipBanner | null>(null);
  const [worshipContent, setWorshipContent] = useState<WorshipContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    fetchWorshipData();

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

  const fetchWorshipData = async () => {
    try {
      setIsLoading(true);
      console.log('🎯 WORSHIP PAGE: Fetching worship data...');

      // Fetch banner
      const { data: bannerData, error: bannerError } = await supabase
        .from('worship_banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (bannerError) {
        console.error('❌ WORSHIP PAGE: Error fetching banner:', bannerError);
      } else {
        console.log('✅ WORSHIP PAGE: Banner fetched:', bannerData?.length || 0);
        setBanner(bannerData?.[0] || null);
      }

      // Fetch content
      const { data: contentData, error: contentError } = await supabase
        .from('worship_content')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (contentError) {
        console.error('❌ WORSHIP PAGE: Error fetching content:', contentError);
      } else {
        console.log('✅ WORSHIP PAGE: Content fetched:', contentData?.length || 0);
        setWorshipContent(contentData || []);
      }

    } catch (error) {
      console.error('❌ WORSHIP PAGE: Failed to fetch worship data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading worship content...</p>
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
            backgroundImage: banner?.image_url ? `url(${banner.image_url})` : 'url(https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=1600)',
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
                  <Music className="w-2 h-2 text-amber-400/30" />
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
                  Worship
                  <span className="block text-amber-500">
                    Experience
                  </span>
                </>
              )}
            </h1>


          </div>
        </div>
      </div>

      {/* Worship Content Grid */}
      <div ref={ref} className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <div className={`transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
                {worshipContent.length > 0 ? 'Our Worship Services' : 'Worship Services'}
              </h2>
              <div className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed space-y-6 text-left">
                {worshipContent.length > 0 ? (
                  <>
                    <p>
                      At Maranatha Visvasa Samajam, every worship service is a time of divine encounter — where hearts are renewed, lives are transformed, and the presence of God fills every soul with peace and joy.
                    </p>
                    <p>
                      Our services are filled with heartfelt praise, powerful preaching of the Word, and fervent prayer. People from all walks of life come together in unity to worship the Lord, and countless testimonies stand as proof of God's mighty hand upon His people.
                    </p>
                    <p>
                      Come, be part of what God is doing.
                    </p>
                    <p>
                      Many have been blessed — and your life can be too.
                    </p>
                  </>
                ) : (
                  <p>Worship content will be displayed here once added in the admin panel</p>
                )}
              </div>
            </div>
          </div>

          {worshipContent.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No worship content found</h3>
              <p className="text-gray-500">Add worship content in the admin panel to display it here.</p>
            </div>
          ) : (
            <div className="space-y-8 max-w-6xl mx-auto">
              {worshipContent.map((item, index) => (
                <div
                  key={item.id}
                  className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 border border-slate-100 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image Container */}
                    <div className="relative overflow-hidden h-64 md:h-80">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=800';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                          <Music className="w-16 h-16 text-amber-600" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 group-hover:text-amber-600 transition-colors duration-300 leading-tight">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WorshipPage;
