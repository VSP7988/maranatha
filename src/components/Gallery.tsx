import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface GalleryImage {
  id: string;
  image_url: string;
  position: number;
  is_active: boolean;
}

const Gallery = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('🔄 Gallery useEffect triggered - fetching images');
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
      console.log('Fetching gallery images...');

      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured, using fallback images');
        throw new Error('Supabase not configured');
      }

      // Use direct fetch API to avoid WebContainer issues
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const url = `${supabaseUrl}/rest/v1/gallery?is_active=eq.true&order=position.asc&select=*`;

      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gallery data received:', data?.length || 0, 'images');
      console.log('Gallery data:', data);

      if (data && data.length > 0) {
        console.log('✅ Setting gallery images:', data.length);
        console.log('First image URL:', data[0]?.image_url);
        console.log('Sample image object:', JSON.stringify(data[0], null, 2));

        const sortedImages = data.sort((a: GalleryImage, b: GalleryImage) => a.position - b.position);
        console.log('⚙️ About to call setGalleryImages with', sortedImages.length, 'images');
        setGalleryImages(sortedImages);
        console.log('✅ setGalleryImages called');

        setTimeout(() => {
          console.log('🔍 State check after 100ms - galleryImages.length:', sortedImages.length);
        }, 100);
      } else {
        console.log('No gallery data found in database, using fallbacks');
        setGalleryImages([
          {
            id: 'fallback-1',
            image_url: 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=600',
            position: 1,
            is_active: true
          },
          {
            id: 'fallback-2',
            image_url: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=600',
            position: 2,
            is_active: true
          },
          {
            id: 'fallback-3',
            image_url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
            position: 3,
            is_active: true
          },
          {
            id: 'fallback-4',
            image_url: 'https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg?auto=compress&cs=tinysrgb&w=600',
            position: 4,
            is_active: true
          },
          {
            id: 'fallback-5',
            image_url: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600',
            position: 5,
            is_active: true
          },
          {
            id: 'fallback-6',
            image_url: 'https://images.pexels.com/photos/8468669/pexels-photo-8468669.jpeg?auto=compress&cs=tinysrgb&w=600',
            position: 6,
            is_active: true
          },
          {
            id: 'fallback-7',
            image_url: 'https://images.pexels.com/photos/3194519/pexels-photo-3194519.jpeg?auto=compress&cs=tinysrgb&w=600',
            position: 7,
            is_active: true
          },
          {
            id: 'fallback-8',
            image_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
            position: 8,
            is_active: true
          }
        ]);
      }

    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
      setGalleryImages([
        {
          id: 'fallback-1',
          image_url: 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=600',
          position: 1,
          is_active: true
        },
        {
          id: 'fallback-2',
          image_url: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=600',
          position: 2,
          is_active: true
        },
        {
          id: 'fallback-3',
          image_url: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
          position: 3,
          is_active: true
        },
        {
          id: 'fallback-4',
          image_url: 'https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg?auto=compress&cs=tinysrgb&w=600',
          position: 4,
          is_active: true
        },
        {
          id: 'fallback-5',
          image_url: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600',
          position: 5,
          is_active: true
        },
        {
          id: 'fallback-6',
          image_url: 'https://images.pexels.com/photos/8468669/pexels-photo-8468669.jpeg?auto=compress&cs=tinysrgb&w=600',
          position: 6,
          is_active: true
        },
        {
          id: 'fallback-7',
          image_url: 'https://images.pexels.com/photos/3194519/pexels-photo-3194519.jpeg?auto=compress&cs=tinysrgb&w=600',
          position: 7,
          is_active: true
        },
        {
          id: 'fallback-8',
          image_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
          position: 8,
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

  console.log('==== GALLERY RENDER STATE ====');
  console.log('isLoading:', isLoading);
  console.log('galleryImages.length:', galleryImages.length);
  console.log('isVisible:', isVisible);
  console.log('Should render grid?', !isLoading && galleryImages.length > 0);
  console.log('First 3 images:', galleryImages.slice(0, 3));
  console.log('=============================');

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        )}

        {/* Gallery Grid */}
        {!isLoading && galleryImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {console.log('Rendering gallery grid with', galleryImages.length, 'images')}
            {galleryImages.map((image, index) => (
              <div
                key={image.id}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100 bg-white ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`
                }}
                onClick={() => openImage(index)}
              >
                <img
                  src={image.image_url}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  onError={(e) => {
                    console.error('Image failed to load:', image.image_url);
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('pexels.com')) {
                      target.src = 'https://images.pexels.com/photos/1701208/pexels-photo-1701208.jpeg?auto=compress&cs=tinysrgb&w=600';
                    }
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', image.image_url);
                  }}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Images Message */}
        {!isLoading && galleryImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No images to display</p>
          </div>
        )}
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