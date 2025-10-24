import React, { useEffect, useState } from 'react';
import { Sparkles, Play, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Banner {
  id: string;
  type: 'image' | 'video';
  title?: string;
  subtitle?: string;
  image_url?: string;
  video_url?: string;
  position: number;
  is_active: boolean;
}

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchBanners();

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching banners:', error);
        // Use fallback instead of throwing
      }
      
      if (data && data.length > 0) {
        // Limit to 5 for carousel
        const bannersToShow = data.slice(0, 5);
        setBanners(bannersToShow);
      } else {
        // Use fallback banner
        setBanners([
          {
            id: 'fallback-1',
            type: 'image',
            title: 'Welcome to Maranatha Temple',
            subtitle: 'A place where faith comes alive and community thrives',
            image_url: 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=1600',
            video_url: null,
            position: 1,
            is_active: true
          }
        ]);
      }
      
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      // Use fallback banner
      setBanners([
        {
          id: 'fallback-1',
          type: 'image',
          title: 'Welcome to Maranatha Temple',
          subtitle: 'A place where faith comes alive and community thrives',
          image_url: 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=1600',
          video_url: null,
          position: 1,
          is_active: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert YouTube URL to embed URL
  const convertToEmbedUrl = (url: string): string => {
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1`;
      }
      
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1]?.split('?')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1`;
      }
      
      if (url.includes('youtube.com/embed/')) {
        return url.includes('?') 
          ? `${url}&autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1`
          : `${url}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1`;
      }
      
      return url;
    } catch (error) {
      console.error('Error converting YouTube URL:', error);
      return url;
    }
  };

  const nextSlide = () => {
    if (banners.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }
  };

  const prevSlide = () => {
    if (banners.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    }
  };

  // Auto-advance slides
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(nextSlide, 8000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center text-white p-8">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Loading banners...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pb-12">
      {/* Carousel Container */}
      <div className="absolute inset-0">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: `translateY(${scrollY * 0.5}px)`,
            }}
          >
            {banner.type === 'video' && banner.video_url ? (
              banner.video_url.includes('youtube.com') || banner.video_url.includes('youtu.be') ? (
                <iframe
                  src={convertToEmbedUrl(banner.video_url)}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title="Background Video"
                />
              ) : (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={banner.video_url} type="video/mp4" />
                </video>
              )
            ) : banner.type === 'image' && banner.image_url ? (
              <img
                src={banner.image_url}
                alt={banner.title || 'Banner'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=1600';
                }}
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-lg mb-2">Welcome to Maranatha Temple</div>
                  <div className="text-sm opacity-70">A place where faith comes alive</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only show if multiple banners */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group border border-white/20"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group border border-white/20"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>
        </>
      )}

      {/* Slide Indicators - Only show if multiple banners */}
      {banners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-amber-400 w-8' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}

      {/* Background Effects */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
        
        <div 
          className="absolute top-20 left-20 w-32 h-32 bg-amber-400/10 rounded-full blur-xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
        <div 
          className="absolute bottom-40 right-32 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl animate-pulse delay-1000"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
          }}
        />
      </div>

      {/* Banner Title and Subtitle */}
      {banners[currentSlide] && (banners[currentSlide].title || banners[currentSlide].subtitle) && (
        <div className="absolute bottom-20 left-0 right-0 z-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className={`text-center transform transition-all duration-1500 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              {banners[currentSlide].title && (
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight relative">
                  {banners[currentSlide].title}
                  <div className="absolute inset-0 text-4xl md:text-5xl lg:text-6xl font-bold text-white opacity-20 blur-sm">
                    {banners[currentSlide].title}
                  </div>
                </h1>
              )}
              
              {banners[currentSlide].subtitle && (
                <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                  {banners[currentSlide].subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;