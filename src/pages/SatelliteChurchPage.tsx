import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Mail, Phone, Church, Globe } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface SatelliteChurchBanner {
  id: string;
  title: string;
  image_url?: string;
  is_active: boolean;
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
}

const SatelliteChurchPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [banner, setBanner] = useState<SatelliteChurchBanner | null>(null);
  const [locations, setLocations] = useState<SatelliteChurchLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    fetchSatelliteChurchData();
    
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

  const fetchSatelliteChurchData = async () => {
    try {
      setIsLoading(true);
      console.log('🎯 SATELLITE CHURCH PAGE: Fetching data...');
      
      // Fetch banner
      const { data: bannerData, error: bannerError } = await supabase
        .from('satellite_church_banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (bannerError) {
        console.error('❌ SATELLITE CHURCH PAGE: Error fetching banner:', bannerError);
      } else {
        console.log('✅ SATELLITE CHURCH PAGE: Banner fetched:', bannerData?.length || 0);
        setBanner(bannerData?.[0] || null);
      }

      // Fetch locations
      const { data: locationsData, error: locationsError } = await supabase
        .from('satellite_church_locations')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (locationsError) {
        console.error('❌ SATELLITE CHURCH PAGE: Error fetching locations:', locationsError);
      } else {
        console.log('✅ SATELLITE CHURCH PAGE: Locations fetched:', locationsData?.length || 0);
        setLocations(locationsData || []);
      }
      
    } catch (error) {
      console.error('❌ SATELLITE CHURCH PAGE: Failed to fetch data:', error);
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
            <p className="text-gray-600">Loading Satellite Church content...</p>
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
                  <Church className="w-2 h-2 text-amber-400/30" />
                ) : i % 3 === 1 ? (
                  <MapPin className="w-2 h-2 text-amber-300/30" />
                ) : (
                  <Globe className="w-2 h-2 text-amber-500/30" />
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
                  Satellite
                  <span className="block text-amber-500">
                    Churches
                  </span>
                </>
              )}
            </h1>
            
           
          </div>
        </div>
      </div>

      {/* Locations Content Section */}
      <div ref={ref} className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          
          {locations.length === 0 ? (
            <div className="text-center py-12">
              <Church className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No satellite church locations found</h3>
              <p className="text-gray-500">Add satellite church locations in the admin panel to display them here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {locations.map((location, index) => (
                <div
                  key={location.id}
                  className={`group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 border border-slate-100 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Church Image */}
                  <div className="relative overflow-hidden h-48">
                    {location.image_url ? (
                      <img 
                        src={location.image_url} 
                        alt={location.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=600';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-100 flex items-center justify-center">
                        <Church className="w-16 h-16 text-amber-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Church Name */}
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center group-hover:text-amber-600 transition-colors duration-300">
                      {location.title}
                    </h3>
                    
                    {/* Address */}
                    <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-200">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Address</div>
                          <div className="text-sm text-slate-700">{location.address}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Email */}
                    <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-100">
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-blue-600 uppercase tracking-wide mb-1">Email</div>
                          <a href={`mailto:${location.email}`} className="text-sm text-blue-700 hover:text-blue-800 transition-colors">
                            {location.email}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Phone */}
                    <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-green-600 uppercase tracking-wide mb-1">Phone</div>
                          <a href={`tel:${location.phone}`} className="text-sm text-green-700 hover:text-green-800 transition-colors">
                            {location.phone}
                          </a>
                        </div>
                      </div>
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

export default SatelliteChurchPage;