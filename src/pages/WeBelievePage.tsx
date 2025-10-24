import React, { useEffect, useRef, useState } from 'react';
import { Cross, Heart, Book, Users, Star, Crown, Move as Dove, Globe, Shield, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface WeBelieveBanner {
  id: string;
  title: string;
  image_url?: string;
  is_active: boolean;
}

interface WeBelieveBelief {
  id: string;
  title: string;
  description: string;
  verse?: string;
  icon: string;
  position: number;
  is_active: boolean;
}

const WeBelievePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [banner, setBanner] = useState<WeBelieveBanner | null>(null);
  const [beliefs, setBeliefs] = useState<WeBelieveBelief[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    fetchWeBelieveData();
    
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

  const fetchWeBelieveData = async () => {
    try {
      setIsLoading(true);
      console.log('🎯 WE BELIEVE PAGE: Fetching data...');
      
      // Fetch banner
      const { data: bannerData, error: bannerError } = await supabase
        .from('we_believe_banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (bannerError) {
        console.error('❌ WE BELIEVE PAGE: Error fetching banner:', bannerError);
      } else {
        console.log('✅ WE BELIEVE PAGE: Banner fetched:', bannerData?.length || 0);
        setBanner(bannerData?.[0] || null);
      }

      // Fetch beliefs
      const { data: beliefsData, error: beliefsError } = await supabase
        .from('we_believe_beliefs')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (beliefsError) {
        console.error('❌ WE BELIEVE PAGE: Error fetching beliefs:', beliefsError);
      } else {
        console.log('✅ WE BELIEVE PAGE: Beliefs fetched:', beliefsData?.length || 0);
        setBeliefs(beliefsData || []);
      }
      
    } catch (error) {
      console.error('❌ WE BELIEVE PAGE: Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Cross,
      Heart,
      Book,
      Users,
      Star,
      Crown,
      Dove,
      Globe,
      Shield,
      Sparkles
    };
    return icons[iconName] || Cross;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading We Believe content...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Use database data or fallback to default
  const displayBeliefs = beliefs.length > 0 ? beliefs : [
    {
      id: 'default-1',
      title: 'The Trinity',
      description: 'We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit. Each person is fully God, yet there is one God.',
      verse: 'Matthew 28:19',
      icon: 'Cross',
      position: 1,
      is_active: true
    },
    {
      id: 'default-2',
      title: 'Salvation by Grace',
      description: 'We believe that salvation is a gift from God, received through faith in Jesus Christ alone, not by works or human effort.',
      verse: 'Ephesians 2:8-9',
      icon: 'Heart',
      position: 2,
      is_active: true
    },
    {
      id: 'default-3',
      title: 'Authority of Scripture',
      description: 'We believe the Bible is the inspired, infallible Word of God and our ultimate authority for faith and practice.',
      verse: '2 Timothy 3:16',
      icon: 'Book',
      position: 3,
      is_active: true
    },
    {
      id: 'default-4',
      title: 'Jesus Christ',
      description: 'We believe Jesus Christ is fully God and fully man, who died for our sins and rose again, and is coming back.',
      verse: 'John 1:1, 14',
      icon: 'Crown',
      position: 4,
      is_active: true
    },
    {
      id: 'default-5',
      title: 'The Holy Spirit',
      description: 'We believe the Holy Spirit indwells believers, empowers us for service, and produces spiritual fruit in our lives.',
      verse: 'Galatians 5:22-23',
      icon: 'Dove',
      position: 5,
      is_active: true
    },
    {
      id: 'default-6',
      title: 'The Church',
      description: 'We believe the church is the body of Christ, called to worship, fellowship, discipleship, ministry, and evangelism.',
      verse: '1 Corinthians 12:27',
      icon: 'Users',
      position: 6,
      is_active: true
    },
    {
      id: 'default-7',
      title: 'The Great Commission',
      description: 'We believe we are called to make disciples of all nations, baptizing and teaching them to obey Christ.',
      verse: 'Matthew 28:19-20',
      icon: 'Globe',
      position: 7,
      is_active: true
    },
    {
      id: 'default-8',
      title: 'Eternal Life',
      description: 'We believe in the resurrection of the dead, eternal life for believers, and the second coming of Jesus Christ.',
      verse: 'John 3:16',
      icon: 'Star',
      position: 8,
      is_active: true
    },
    {
      id: 'default-9',
      title: 'Baptism & Communion',
      description: 'We believe in baptism by immersion and regular communion as ordinances established by Christ for the church.',
      verse: 'Romans 6:3-4',
      icon: 'Shield',
      position: 9,
      is_active: true
    }
  ];

  const getColorForIndex = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-red-500',
      'bg-green-500',
      'bg-amber-500',
      'bg-purple-500',
      'bg-teal-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-cyan-500'
    ];
    return colors[index % colors.length];
  };

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
                {i % 4 === 0 ? (
                  <Cross className="w-2 h-2 text-amber-400/30" />
                ) : i % 4 === 1 ? (
                  <Heart className="w-2 h-2 text-amber-300/30" />
                ) : i % 4 === 2 ? (
                  <Book className="w-2 h-2 text-amber-500/30" />
                ) : (
                  <Sparkles className="w-2 h-2 text-amber-400/30" />
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
                  We
                  <span className="block text-amber-500">
                    Believe
                  </span>
                </>
              )}
            </h1>
            
            
          </div>
        </div>
      </div>

      {/* Beliefs Content Section */}
      <div ref={ref} className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className={`transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
                Our Core Beliefs
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                These fundamental truths shape who we are and guide everything we do as a church community
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {displayBeliefs.map((belief, index) => {
              const IconComponent = getIconComponent(belief.icon);
              const color = getColorForIndex(index);
              return (
              <div
                key={belief.id}
                className={`group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 border border-slate-100 overflow-hidden ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Card Shine Effect */}
                <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/5 transition-colors duration-500"></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-2xl animate-glow`}>
                  <div className={`absolute inset-0 ${color} rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500`}></div>
                  <IconComponent className="w-8 h-8 text-white relative z-10" />
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 group-hover:animate-spin transition-all duration-500" style={{ animationDuration: '3s' }}></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-amber-600 transition-colors duration-300">
                    {belief.title}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed mb-6 text-base">
                    {belief.description}
                  </p>
                  
                  {/* Bible Verse */}
                  {belief.verse && (
                    <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-400">
                      <p className="text-amber-700 font-semibold text-sm">
                        Scripture Reference: {belief.verse}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WeBelievePage;