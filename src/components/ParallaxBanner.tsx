import React, { useEffect, useRef, useState } from 'react';
import { Star, Heart, Sparkles } from 'lucide-react';

const ParallaxBanner = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        style={{
          transform: `translateY(${scrollY * 0.4}px) scale(1.1)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        {/* Enhanced Animated background elements */}
        <div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-400/8 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) scale(${1 + Math.sin(Date.now() * 0.001) * 0.1})`,
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/6 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * -0.015}px) scale(${1 + Math.cos(Date.now() * 0.0008) * 0.15})`,
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-amber-300/4 rounded-full blur-3xl animate-pulse delay-500"
          style={{
            transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
          }}
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            >
              {i % 3 === 0 ? (
                <Star className="w-2 h-2 text-amber-400/30" />
              ) : i % 3 === 1 ? (
                <Heart className="w-2 h-2 text-amber-300/30" />
              ) : (
                <Sparkles className="w-2 h-2 text-amber-500/30" />
              )}
            </div>
          ))}
        </div>
        
        {/* Animated Light Rays */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-amber-400 to-transparent animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          <div 
            className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-amber-300 to-transparent animate-pulse"
            style={{ animationDuration: '4s', animationDelay: '1s' }}
          />
          <div 
            className="absolute top-0 left-2/3 w-1 h-full bg-gradient-to-b from-amber-500 to-transparent animate-pulse"
            style={{ animationDuration: '5s', animationDelay: '2s' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        {/* Floating Decorative Elements */}
        <div className="absolute -top-20 -left-20 opacity-30">
          <div className="relative">
            <Star className="w-12 h-12 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
            <div className="absolute inset-0 w-12 h-12 border border-amber-400/50 rounded-full animate-ping"></div>
          </div>
        </div>
        <div className="absolute -top-16 -right-16 opacity-30">
          <div className="relative">
            <Heart className="w-10 h-10 text-amber-300 animate-pulse" />
            <div className="absolute inset-0 w-10 h-10 bg-amber-300/20 rounded-full animate-ping delay-500"></div>
          </div>
        </div>
        
        <div className={`transform transition-all duration-2000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <blockquote className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-8 leading-tight relative">
            "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future."
            {/* Text Shadow Effect */}
            <div className="absolute inset-0 text-4xl md:text-5xl lg:text-6xl font-light text-amber-400/20 blur-sm scale-105">
              "For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future."
            </div>
          </blockquote>
          <cite className="text-2xl md:text-3xl text-amber-400 font-semibold relative">
            Jeremiah 29:11
            <div className="absolute inset-0 text-2xl md:text-3xl text-amber-400/30 blur-sm">
              Jeremiah 29:11
            </div>
          </cite>
        </div>

        <div className={`mt-16 transform transition-all duration-2000 delay-800 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <button className="group relative bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white px-12 py-4 rounded-full font-semibold text-lg transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/30 overflow-hidden">
            {/* Button Animation Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="absolute inset-0 rounded-full bg-amber-400/20 scale-0 group-hover:scale-100 transition-transform duration-500"></div>
            <span className="relative z-10">
            Discover God's Plan for You
            </span>
          </button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10">
        <div className="relative">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
          <div className="absolute inset-0 w-2 h-2 bg-amber-400/50 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
      <div className="absolute bottom-32 right-20">
        <div className="relative">
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse delay-500"></div>
          <div className="absolute inset-0 w-6 h-6 border border-amber-500/30 rounded-full animate-ping delay-700"></div>
        </div>
      </div>
      <div className="absolute top-1/2 right-10">
        <div className="relative">
          <div className="w-2 h-2 bg-amber-300 rounded-full animate-ping delay-1000"></div>
          <div className="absolute inset-0 w-4 h-4 bg-amber-300/20 rounded-full animate-pulse delay-1200"></div>
        </div>
      </div>
      
      {/* Additional Floating Elements */}
      <div className="absolute top-1/4 left-10 opacity-40">
        <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
      </div>
      <div className="absolute bottom-1/4 left-1/4 opacity-40">
        <Star className="w-3 h-3 text-amber-300 animate-pulse" />
      </div>
      <div className="absolute top-3/4 right-1/4 opacity-40">
        <Heart className="w-3 h-3 text-amber-500 animate-bounce" style={{ animationDuration: '3s' }} />
      </div>
    </div>
  );
};

export default ParallaxBanner;