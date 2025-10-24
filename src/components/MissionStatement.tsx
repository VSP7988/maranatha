import React, { useEffect, useRef, useState } from 'react';
import { Heart, Users, Sparkles, Eye, Target, Star } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface VisionMission {
  id: string;
  type: 'vision' | 'mission';
  title: string;
  description: string;
  points: string[];
  is_active: boolean;
}

const MissionStatement = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visionData, setVisionData] = useState<VisionMission | null>(null);
  const [missionData, setMissionData] = useState<VisionMission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchVisionMission();
    
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

  const fetchVisionMission = async () => {
    try {
      const { data, error } = await supabase
        .from('vision_mission')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching vision/mission data:', error);
        // Use fallback instead of throwing
      }
      
      // Find vision and mission content
      let vision = null;
      let mission = null;
      
      if (data && data.length > 0) {
        vision = data.find(item => item.type === 'vision');
        mission = data.find(item => item.type === 'mission');
      }
      
      // Use fallback if no data found
      if (!vision) {
        vision = {
          id: 'fallback-vision',
          type: 'vision' as const,
          title: 'Our Vision',
          description: 'To be a church that transforms lives and communities through the love of Jesus Christ, creating a place where everyone can find hope, purpose, and belonging.',
          points: ['Transforming Lives', 'Building Community', 'Spreading Hope'],
          is_active: true
        };
      }
      
      if (!mission) {
        mission = {
          id: 'fallback-mission',
          type: 'mission' as const,
          title: 'Our Mission',
          description: 'We exist to worship God, make disciples, and serve our community with love and compassion, following the example of Jesus Christ.',
          points: ['Worship God', 'Make Disciples', 'Serve Others'],
          is_active: true
        };
      }
      
      setVisionData(vision);
      setMissionData(mission);
      
    } catch (error) {
      console.error('Failed to fetch vision/mission data:', error);
      // Use fallback data
      setVisionData({
        id: 'fallback-vision',
        type: 'vision',
        title: 'Our Vision',
        description: 'To be a church that transforms lives and communities through the love of Jesus Christ, creating a place where everyone can find hope, purpose, and belonging.',
        points: ['Transforming Lives', 'Building Community', 'Spreading Hope'],
        is_active: true
      });
      setMissionData({
        id: 'fallback-mission',
        type: 'mission',
        title: 'Our Mission',
        description: 'We exist to worship God, make disciples, and serve our community with love and compassion, following the example of Jesus Christ.',
        points: ['Worship God', 'Make Disciples', 'Serve Others'],
        is_active: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPointIcon = (index: number, type: 'vision' | 'mission') => {
    const visionIcons = [Eye, Star, Sparkles];
    const missionIcons = [Heart, Users, Target];
    const icons = type === 'vision' ? visionIcons : missionIcons;
    return icons[index % icons.length];
  };

  return (
    <div id="about" ref={ref} className="py-12 bg-gradient-to-br from-amber-50 via-white to-teal-50">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 mb-16">
            
            {/* Vision Section */}
            {visionData && (
              <div className={`transform transition-all duration-1000 delay-300 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              }`}>
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 h-full relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-transparent opacity-50"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-200/20 to-transparent rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500">
                        <Eye className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold text-slate-800 group-hover:text-teal-600 transition-colors duration-300">
                        {visionData.title}
                      </h3>
                    </div>
                    
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                      {visionData.description}
                    </p>
                    
                    {visionData.points && visionData.points.length > 0 && (
                      <div className="space-y-6">
                        {visionData.points.map((point, index) => {
                          const IconComponent = getPointIcon(index, 'vision');
                          return (
                            <div
                              key={index}
                              className={`flex items-center gap-4 group/item transform transition-all duration-700 ${
                                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                              }`}
                              style={{ transitionDelay: `${600 + index * 100}ms` }}
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-all duration-300">
                                <IconComponent className="w-6 h-6 text-teal-600" />
                              </div>
                              <span className="text-lg font-semibold text-slate-700 group-hover/item:text-teal-600 transition-colors duration-300">
                                {point}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mission Section */}
            {missionData && (
              <div className={`transform transition-all duration-1000 delay-500 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              }`}>
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 h-full relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-50"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-4xl md:text-5xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors duration-300">
                        {missionData.title}
                      </h3>
                    </div>
                    
                    <p className="text-lg text-slate-600 leading-relaxed mb-8">
                      {missionData.description}
                    </p>
                    
                    {missionData.points && missionData.points.length > 0 && (
                      <div className="space-y-6">
                        {missionData.points.map((point, index) => {
                          const IconComponent = getPointIcon(index, 'mission');
                          return (
                            <div
                              key={index}
                              className={`flex items-center gap-4 group/item transform transition-all duration-700 ${
                                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                              }`}
                              style={{ transitionDelay: `${800 + index * 100}ms` }}
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-all duration-300">
                                <IconComponent className="w-6 h-6 text-amber-600" />
                              </div>
                              <span className="text-lg font-semibold text-slate-700 group-hover/item:text-amber-600 transition-colors duration-300">
                                {point}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionStatement;