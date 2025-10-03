import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface GalleryImage {
  id: string;
  image_url: string;
  position: number;
  is_active: boolean;
}

const Gallery = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchGalleryImages();
    
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

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (error) {
        console.error('Error fetching gallery images:', error);
        // Use fallback instead of throwing
      }
      
      if (data && data.length > 0) {
        // Limit to 12 for homepage
        const imagesToShow = data.slice(0, 12);
        setGalleryImages(imagesToShow);
      } else {
        // Use fallback image
        setGalleryImages([
          {
            id: 'fallback-1',
            image_url: 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=600',
            position: 1,
            is_active: true
          }
        ]);
      }
      
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
      // Use fallback image
      setGalleryImages([
        {
          id: 'fallback-1',
          image_url: 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=600',
          position: 1,
          is_active: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedImage !== null) {
        if (e.key === 'Escape') {
          setSelectedImage(null);
        } else if (e.key === 'ArrowLeft') {
          navigateImage('prev');
        } else if (e.key === 'ArrowRight') {
          navigateImage('next');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage]);

  const openImage = (index: number) => {
    setSelectedImage(index);
    setCurrentIndex(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = selectedImage > 0 ? selectedImage - 1 : galleryImages.length - 1;
    } else {
      newIndex = selectedImage < galleryImages.length - 1 ? selectedImage + 1 : 0;
    }
    
    setSelectedImage(newIndex);
    setCurrentIndex(newIndex);
  };

  return (
    <div ref={ref} className="py-24 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Camera className="w-8 h-8 text-amber-500" />
              <h2 className="text-5xl md:text-6xl font-bold text-slate-800">Gallery</h2>
            </div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Explore moments from our church community and events
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ 
                transitionDelay: `${index * 50}ms`,
                aspectRatio: index % 5 === 0 ? '1/1.3' : index % 3 === 0 ? '1/0.8' : '1/1'
              }}
              onClick={() => openImage(index)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100 bg-white">
                <img
                src={image.image_url}
                alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=600';
                }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Popup Modal */}
      {selectedImage !== null && galleryImages.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-[99999999] flex items-center justify-center p-4">
          <button
            onClick={closeImage}
            className="absolute top-4 right-4 z-[99999999] w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 group backdrop-blur-sm border border-white/20"
          >
            <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => navigateImage('prev')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[99999999] w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={() => navigateImage('next')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[99999999] w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          <div className="relative max-w-4xl max-h-[80vh] w-full">
            <img
              src={galleryImages[selectedImage].image_url}
              alt={`Gallery image ${selectedImage + 1}`}
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <p className="text-white/70 text-sm mt-1">
                {selectedImage + 1} of {galleryImages.length}
              </p>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-xs overflow-x-auto">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                onClick={() => openImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === selectedImage ? 'bg-amber-400 w-8' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;