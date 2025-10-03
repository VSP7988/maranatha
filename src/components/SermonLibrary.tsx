import React, { useEffect, useRef, useState } from 'react';
import { Play, Calendar, User, Filter } from 'lucide-react';

const SermonLibrary = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
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

  const filters = ['All', 'Recent', 'Faith', 'Hope', 'Love', 'Community'];
  
  const sermons = [
    {
      title: 'Walking in Faith',
      speaker: 'Pastor John Smith',
      date: 'Dec 15, 2024',
      duration: '35 min',
      category: 'Faith',
      thumbnail: 'https://images.pexels.com/photos/236106/pexels-photo-236106.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Hope in Difficult Times',
      speaker: 'Pastor Sarah Johnson',
      date: 'Dec 8, 2024',
      duration: '42 min',
      category: 'Hope',
      thumbnail: 'https://images.pexels.com/photos/247839/pexels-photo-247839.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Love One Another',
      speaker: 'Pastor Michael Brown',
      date: 'Dec 1, 2024',
      duration: '38 min',
      category: 'Love',
      thumbnail: 'https://images.pexels.com/photos/935985/pexels-photo-935985.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Building Community',
      speaker: 'Pastor Lisa Davis',
      date: 'Nov 24, 2024',
      duration: '45 min',
      category: 'Community',
      thumbnail: 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Prayer and Worship',
      speaker: 'Pastor David Wilson',
      date: 'Nov 17, 2024',
      duration: '40 min',
      category: 'Faith',
      thumbnail: 'https://images.pexels.com/photos/316466/pexels-photo-316466.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      title: 'Grace and Forgiveness',
      speaker: 'Pastor Emily Garcia',
      date: 'Nov 10, 2024',
      duration: '37 min',
      category: 'Love',
      thumbnail: 'https://images.pexels.com/photos/1701202/pexels-photo-1701202.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div id="worship" ref={ref} className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
              Worship
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience our worship services and spiritual messages
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                activeFilter === filter
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-600 border border-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Sermon Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sermons.map((sermon, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${(index * 150) + 600}ms` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={sermon.thumbnail} 
                  alt={sermon.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-amber-500 hover:bg-amber-600 text-white w-16 h-16 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                </div>
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {sermon.duration}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-amber-600 transition-colors">
                  {sermon.title}
                </h3>
                <div className="flex items-center gap-3 text-slate-600 mb-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{sermon.speaker}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{sermon.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                    {sermon.category}
                  </span>
                  <button className="text-amber-500 hover:text-amber-600 font-semibold transition-colors">
                    Watch Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className={`transform transition-all duration-1000 delay-1200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <button className="border-2 border-slate-300 hover:border-amber-500 text-slate-700 hover:text-amber-600 px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              View All Sermons
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SermonLibrary;