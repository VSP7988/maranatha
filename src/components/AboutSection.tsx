import React, { useEffect, useRef, useState } from 'react';
import { Heart, Users, Sparkles, ArrowRight } from 'lucide-react';
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
}

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAboutData();
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const handleMouseMove = (e: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    if (ref.current) {
      observer.observe(ref.current);
      ref.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      observer.disconnect();
      if (ref.current) {
        ref.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error('Error fetching about data:', error);
        // Use fallback data instead of throwing
      }
      
      if (data && data.length > 0) {
        setAboutData(data[0]);
      } else {
        // Use fallback data
        setAboutData({
          id: 'fallback',
          title: 'About Our Church',
          subtitle: 'Welcome to Our Community',
          description: 'We are a vibrant community of believers dedicated to spreading love, hope, and faith. Our church has been serving the community for years, providing spiritual guidance and support to all who seek it.',
          stats: [
            { label: 'Members', value: '500+', icon: 'Users' },
            { label: 'Years of Service', value: '25+', icon: 'Heart' },
            { label: 'Community Programs', value: '15+', icon: 'Sparkles' }
          ],
          is_active: true
        });
      }
      
    } catch (error) {
      console.error('Failed to fetch about data:', error);
      // Use fallback data
      setAboutData({
        id: 'fallback',
        title: 'About Our Church',
        subtitle: 'Welcome to Our Community',
        description: 'We are a vibrant community of believers dedicated to spreading love, hope, and faith. Our church has been serving the community for years, providing spiritual guidance and support to all who seek it.',
        stats: [
          { label: 'Members', value: '500+', icon: 'Users' },
          { label: 'Years of Service', value: '25+', icon: 'Heart' },
          { label: 'Community Programs', value: '15+', icon: 'Sparkles' }
        ],
        is_active: true
      });
    } finally {
      setIsLoading(false);
    }
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
    <div id="about" ref={ref} className="relative min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 overflow-hidden py-24">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div 
          className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"
          style={{
            left: `${mousePosition.x * 0.02}px`,
            top: `${mousePosition.y * 0.02}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-amber-400/10 rounded-full blur-2xl animate-pulse delay-1000"
          style={{
            right: `${mousePosition.x * -0.01}px`,
            bottom: `${mousePosition.y * -0.01}px`,
          }}
        />
        
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
                <Heart className="w-2 h-2 text-white/20" />
              ) : i % 3 === 1 ? (
                <Users className="w-2 h-2 text-white/20" />
              ) : (
                <Sparkles className="w-2 h-2 text-white/20" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-20 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
          {/* Left Side - Typography */}
          <div className="space-y-8">
            <div className={`transform transition-all duration-1500 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
            }`}>
              <div className="relative">
                <h2 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-white/10 leading-none select-none">
                  {aboutData?.title?.split(' ')[0] || 'ABOUT'}
                </h2>
                <div className="absolute inset-0 flex items-center z-10">
                  <div className="space-y-2">
                    {(aboutData?.title || 'About Us').split(' ').map((word, index) => (
                      <div key={index} className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
                        <span className={
                          index === (aboutData?.title || 'About Us').split(' ').length - 1 
                            ? "text-amber-400" 
                            : index === (aboutData?.title || 'About Us').split(' ').length - 2
                              ? "text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500"
                              : "text-white"
                        }>
                          {word}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`transform transition-all duration-1500 delay-500 ${
              isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}>
              <div className="relative w-32 h-32 mx-auto lg:mx-0">
                <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-spin" style={{ animationDuration: '20s' }}>
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute inset-4 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white text-xs font-semibold tracking-wider">JOIN US</div>
                    <div className="text-white text-xs font-semibold tracking-wider">ON SUNDAYS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            <div className={`transform transition-all duration-1500 delay-300 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
            }`}>
              {aboutData?.subtitle && (
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                  {aboutData.subtitle.split(' ').slice(0, -1).join(' ')}
                  <span className="block text-amber-400">{aboutData.subtitle.split(' ').slice(-1)[0]}</span>
                </h3>
              )}
              
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12 max-w-2xl">
                {aboutData?.description || 'Welcome to our church community where faith comes alive.'}
              </p>
            </div>

            {/* Stats */}
            {aboutData?.stats && aboutData.stats.length > 0 && (
              <div className={`grid grid-cols-3 gap-8 pt-16 transform transition-all duration-1500 delay-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                {aboutData.stats.map((stat, index) => {
                  const IconComponent = getIconComponent(stat.icon);
                  return (
                    <div key={index} className="text-center group">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-all duration-300">
                        <IconComponent className="w-8 h-8 text-amber-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                      <div className="text-white/70 text-sm">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section Title */}
      <div className="absolute bottom-0 left-0 right-0 pb-16 z-10">
        <div className="container mx-auto px-4">
          <div className={`text-center transform transition-all duration-1500 delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h4 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/30 tracking-wider">
              — Who We Are
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;