import React, { useEffect, useRef, useState } from 'react';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  description?: string;
  location: string;
  event_date: string;
  event_time: string;
  image_url?: string;
  is_active: boolean;
}

const EventsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEvents();
    
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

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        // Use fallback instead of throwing
      }
      
      if (data && data.length > 0) {
        // Limit to 6 for homepage
        const eventsToShow = data.slice(0, 6);
        setEvents(eventsToShow);
      } else {
        // Use fallback event
        setEvents([
          {
            id: 'fallback-1',
            title: 'Sunday Worship Service',
            description: 'Join us for our weekly worship service with inspiring music and messages.',
            location: 'Main Sanctuary',
            event_date: '2024-12-22',
            event_time: '09:00',
            image_url: 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=800',
            is_active: true
          }
        ]);
      }
      
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // Use fallback event
      setEvents([
        {
          id: 'fallback-1',
          title: 'Sunday Worship Service',
          description: 'Join us for our weekly worship service with inspiring music and messages.',
          location: 'Main Sanctuary',
          event_date: '2024-12-22',
          event_time: '09:00',
          image_url: 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=800',
          is_active: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div ref={ref} className="py-24 bg-gradient-to-br from-amber-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">Upcoming Events</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join us for these upcoming events and activities
            </p>
          </div>
        </div>

        {/* Scrolling Events Container */}
        <div className="relative">
          {/* Navigation Arrows - Only show if multiple events */}
          {events.length > 1 && (
            <>
              <button
                onClick={scrollLeft}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 hover:bg-white shadow-lg hover:shadow-xl rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 group border border-slate-200"
              >
                <ChevronLeft className="w-6 h-6 text-slate-600 group-hover:text-amber-600 transition-colors" />
              </button>

              <button
                onClick={scrollRight}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 hover:bg-white shadow-lg hover:shadow-xl rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 group border border-slate-200"
              >
                <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-amber-600 transition-colors" />
              </button>
            </>
          )}

          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide pb-4"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitScrollbar: { display: 'none' }
            }}
          >
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`flex-shrink-0 w-80 group cursor-pointer transform transition-all duration-700 hover-lift ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-slate-100 z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* Event Image */}
                  <div className="relative overflow-hidden h-48">
                    {event.image_url && !event.image_url.startsWith('blob:') ? (
                      <img 
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onLoad={() => console.log(`✅ EVENTS: Image loaded: ${event.image_url}`)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-amber-50">
                                <div class="text-center p-4">
                                  <div class="text-amber-600 text-lg font-semibold mb-2">${event.title}</div>
                                  <div class="text-amber-500 text-sm">No Image Available</div>
                                </div>
                              </div>
                            `;
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-amber-50">
                        <div className="text-center p-4">
                          <div className="text-amber-600 text-lg font-semibold mb-2">{event.title}</div>
                          <div className="text-amber-500 text-sm">
                            No Image Available
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-amber-600 transition-colors duration-300">
                      {event.title}
                    </h3>
                    
                    {event.description && (
                      <p className="text-slate-600 mb-4 line-clamp-2">{event.description}</p>
                    )}
                    
                    <div className="flex items-center gap-3 text-slate-600 mb-3">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium">{event.location}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium">{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium">{formatTime(event.event_time)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsSection;