import React, { useEffect, useRef, useState } from 'react';
import { Users, Heart, Zap, Star, Globe, Music } from 'lucide-react';

const Ministries = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const ministries = [
    {
      icon: Users,
      title: 'Kids Ministry',
      description: 'Fun, engaging programs for children ages 2-12 with biblical lessons and activities',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      delay: '0ms'
    },
    {
      icon: Zap,
      title: 'Youth Ministry',
      description: 'Dynamic community for teens with worship, games, and meaningful discussions',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      delay: '200ms'
    },
    {
      icon: Heart,
      title: 'Prayer Ministry',
      description: 'Join our prayer warriors in interceding for our community and beyond',
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
      delay: '400ms'
    },
    {
      icon: Globe,
      title: 'Outreach Ministry',
      description: 'Serving our local community through various outreach programs and events',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      delay: '600ms'
    },
    {
      icon: Music,
      title: 'Worship Ministry',
      description: 'Join our worship team and use your musical gifts to glorify God',
      color: 'from-amber-400 to-amber-600',
      bgColor: 'bg-amber-50',
      delay: '800ms'
    },
    {
      icon: Star,
      title: 'Life Groups',
      description: 'Small group Bible studies and fellowship throughout the week',
      color: 'from-teal-400 to-teal-600',
      bgColor: 'bg-teal-50',
      delay: '1000ms'
    }
  ];

  return (
    <div id="ministries" ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              Ministries & Groups
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Find your place to grow, serve, and connect with others on the same journey
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ministries.map((ministry, index) => (
            <div
              key={index}
              className={`relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group border border-white/20 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: ministry.delay }}
            >
              {/* Glassmorphism background */}
              <div className={`absolute inset-0 ${ministry.bgColor} rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${ministry.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <ministry.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-amber-600 transition-colors">
                  {ministry.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed mb-6">
                  {ministry.description}
                </p>
                
                <button className="text-amber-500 hover:text-amber-600 font-semibold transition-colors flex items-center gap-2 group/btn">
                  Learn More
                  <div className="w-2 h-2 bg-amber-500 rounded-full group-hover/btn:scale-125 transition-transform"></div>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className={`transform transition-all duration-1000 delay-1200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <button className="bg-slate-800 hover:bg-slate-900 text-white px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              Get Involved Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ministries;