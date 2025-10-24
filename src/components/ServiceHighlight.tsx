import React, { useEffect, useRef, useState } from 'react';
import { Clock, MapPin, Calendar, Users } from 'lucide-react';

const ServiceHighlight = () => {
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

  const services = [
    {
      title: 'Sunday Morning Worship',
      time: '9:00 AM & 11:00 AM',
      description: 'Join us for uplifting worship and inspiring messages',
      attendees: '200+ attendees'
    },
    {
      title: 'Wednesday Night Service',
      time: '7:00 PM',
      description: 'Mid-week encouragement and community fellowship',
      attendees: '150+ attendees'
    },
    {
      title: 'Online Service',
      time: 'Available 24/7',
      description: 'Watch live or catch up on previous services',
      attendees: 'Global community'
    }
  ];

  return (
    <div ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              Service Times
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose the service time that works best for you and your family
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="h-2 bg-gradient-to-r from-amber-400 to-amber-600 group-hover:h-3 transition-all duration-300"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-amber-600 transition-colors">
                  {service.title}
                </h3>
                <div className="flex items-center gap-3 text-amber-600 mb-4">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold text-lg">{service.time}</span>
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{service.attendees}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-3xl p-12 max-w-4xl mx-auto">
          <div className={`transform transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-slate-800 mb-4">Find Us</h3>
              <div className="flex items-center justify-center gap-3 text-slate-600 mb-6">
                <MapPin className="w-6 h-6 text-amber-500" />
                <span className="text-lg">123 Faith Avenue, Spiritual City, SC 12345</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                Get Directions
              </button>
              <button className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-800 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHighlight;