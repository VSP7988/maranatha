import React, { useEffect, useRef, useState } from 'react';
import { HandHeart, BookOpen, Users } from 'lucide-react';

const CallToAction = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const actions = [
    {
      icon: HandHeart,
      title: 'Serve',
      description: 'Use your gifts to make a difference in our community',
      bgColor: 'from-red-400 to-red-600',
      delay: '0ms'
    },
    {
      icon: BookOpen,
      title: 'Give',
      description: 'Support our mission to spread love and hope',
      bgColor: 'from-green-400 to-green-600',
      delay: '200ms'
    },
    {
      icon: Users,
      title: 'Attend a Class',
      description: 'Grow in faith through Bible study and fellowship',
      bgColor: 'from-blue-400 to-blue-600',
      delay: '400ms'
    }
  ];

  return (
    <div ref={ref} className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              Get Involved
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Take your next step in faith and become part of our growing community
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {actions.map((action, index) => (
            <div
              key={index}
              className={`group cursor-pointer transform transition-all duration-700 hover-lift ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: action.delay }}
            >
              <div className="relative bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 overflow-hidden">
                {/* Card Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className={`relative w-20 h-20 bg-gradient-to-br ${action.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-125 transition-all duration-500 shadow-lg group-hover:shadow-2xl animate-glow`}>
                  {/* Icon Background Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.bgColor} rounded-full opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500`}></div>
                  <action.icon className="w-10 h-10 text-white" />
                  {/* Rotating Border */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/30 group-hover:animate-spin" style={{ animationDuration: '3s' }}></div>
                </div>
                
                <h3 className="relative text-3xl font-bold text-slate-800 mb-4 group-hover:text-amber-600 transition-all duration-300 group-hover:text-glow">
                  {action.title}
                </h3>
                
                <p className="relative text-slate-600 leading-relaxed mb-8 group-hover:text-slate-700 transition-colors duration-300">
                  {action.description}
                </p>
                
                <button className="relative bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-full font-semibold transition-all duration-500 transform group-hover:scale-110 btn-enhanced overflow-hidden">
                  <span className="relative z-10">
                  Learn More
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className={`transform transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
              Ready to take the next step? We're here to help you find your place in our community.
            </p>
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;