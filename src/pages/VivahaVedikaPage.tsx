import React, { useEffect, useRef, useState } from 'react';
import { Heart, Crown, Sparkles, Download } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface VivahaVedikaBanner {
  id: string;
  title: string;
  image_url?: string;
  is_active: boolean;
}

interface VivahaVedikaContent {
  id: string;
  description: string;
  is_active: boolean;
}

interface VivahaVedikaStatistic {
  id: string;
  label: string;
  value: string;
  icon: string;
  position: number;
  is_active: boolean;
}

interface VivahaVedikaPDF {
  id: string;
  title: string;
  description?: string;
  pdf_url: string;
  is_active: boolean;
}

const VivahaVedikaPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [banner, setBanner] = useState<VivahaVedikaBanner | null>(null);
  const [content, setContent] = useState<VivahaVedikaContent | null>(null);
  const [statistics, setStatistics] = useState<VivahaVedikaStatistic[]>([]);
  const [pdfs, setPdfs] = useState<VivahaVedikaPDF[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(true);
    fetchVivahaVedikaData();
    
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

  const fetchVivahaVedikaData = async () => {
    try {
      setIsLoading(true);
      console.log('🎯 VIVAHA VEDIKA PAGE: Fetching data...');
      
      // Fetch banner
      const { data: bannerData, error: bannerError } = await supabase
        .from('vivaha_vedika_banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (bannerError) {
        console.error('❌ VIVAHA VEDIKA PAGE: Error fetching banner:', bannerError);
      } else {
        console.log('✅ VIVAHA VEDIKA PAGE: Banner fetched:', bannerData?.length || 0);
        setBanner(bannerData?.[0] || null);
      }

      // Fetch content
      const { data: contentData, error: contentError } = await supabase
        .from('vivaha_vedika_content')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1);

      if (contentError) {
        console.error('❌ VIVAHA VEDIKA PAGE: Error fetching content:', contentError);
      } else {
        console.log('✅ VIVAHA VEDIKA PAGE: Content fetched:', contentData?.length || 0);
        setContent(contentData?.[0] || null);
      }

      // Fetch statistics
      const { data: statsData, error: statsError } = await supabase
        .from('vivaha_vedika_statistics')
        .select('*')
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (statsError) {
        console.error('❌ VIVAHA VEDIKA PAGE: Error fetching statistics:', statsError);
      } else {
        console.log('✅ VIVAHA VEDIKA PAGE: Statistics fetched:', statsData?.length || 0);
        setStatistics(statsData || []);
      }

      // Fetch PDFs
      const { data: pdfsData, error: pdfsError } = await supabase
        .from('vivaha_vedika_pdfs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (pdfsError) {
        console.error('❌ VIVAHA VEDIKA PAGE: Error fetching PDFs:', pdfsError);
      } else {
        console.log('✅ VIVAHA VEDIKA PAGE: PDFs fetched:', pdfsData?.length || 0);
        setPdfs(pdfsData || []);
      }
      
    } catch (error) {
      console.error('❌ VIVAHA VEDIKA PAGE: Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Heart,
      Crown,
      Sparkles
    };
    return icons[iconName] || Heart;
  };

  const handleDownloadPDF = async (pdfUrl: string, title: string) => {
    try {
      console.log('📄 VIVAHA VEDIKA: Downloading PDF:', { title, url: pdfUrl });

      // Fetch the PDF as blob with proper error handling
      const response = await fetch(pdfUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }

      // Get the blob
      const blob = await response.blob();

      // Verify it's a PDF
      console.log('📄 Blob type:', blob.type, 'Size:', blob.size);

      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = title.replace(/[^a-z0-9\s]/gi, '_').toLowerCase() + '.pdf';

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);

      console.log('✅ VIVAHA VEDIKA: PDF downloaded successfully');
    } catch (error) {
      console.error('❌ VIVAHA VEDIKA: PDF download error:', error);

      // Fallback: try opening in new tab
      console.log('📄 Trying fallback: opening in new tab');
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Vivaha Vedika content...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Banner */}
      <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-slate-900"
          style={{
            backgroundImage: banner?.image_url ? `url(${banner.image_url})` : 'url(https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1600)',
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
                {i % 3 === 0 ? (
                  <Heart className="w-2 h-2 text-amber-400/30" />
                ) : i % 3 === 1 ? (
                  <Crown className="w-2 h-2 text-amber-300/30" />
                ) : (
                  <Sparkles className="w-2 h-2 text-amber-500/30" />
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
                  Vivaha
                  <span className="block text-amber-500">
                    Vedika
                  </span>
                </>
              )}
            </h1>
            
            
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div ref={ref} className="py-4 md:py-6 bg-white">
        <div className="container mx-auto px-4">
          
          {/* PDF Downloads Section - Simple Buttons */}
          {pdfs.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-end">
                <div className="flex flex-wrap gap-4">
                  {pdfs.map((pdf, index) => (
                    <button
                      key={pdf.id}
                      onClick={() => handleDownloadPDF(pdf.pdf_url, pdf.title)}
                      className={`bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-3 group shadow-lg hover:shadow-xl ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      {pdf.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {content ? (
            /* About Vivaha Vedika Section */
            <div className="mb-8">
              <div className="max-w-full mx-auto">
                {/* Full Width Content */}
                <div className={`w-full transform transition-all duration-1000 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                }`}>
                  <div className="bg-white rounded-3xl p-8 md:p-16 shadow-xl border border-slate-100 space-y-8">
                    
                    <div className="text-center mb-12">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-6">
                        About Vivaha Vedika
                      </h2>
                    </div>
                    
                    <div className="max-w-4xl mx-auto">
                      <div
                        className="text-lg md:text-xl text-slate-700 leading-relaxed text-left rich-text-content"
                        dangerouslySetInnerHTML={{ __html: content.description }}
                      />
                      
                      {/* Statistics */}
                      {statistics.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                          {statistics.map((stat, index) => {
                            const IconComponent = getIconComponent(stat.icon);
                            return (
                              <div
                                key={stat.id}
                                className={`bg-white rounded-xl p-6 shadow-lg text-center border border-slate-200 transform transition-all duration-700 ${
                                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                }`}
                                style={{ transitionDelay: `${index * 100 + 600}ms` }}
                              >
                                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <IconComponent className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-red-600 mb-2">{stat.value}</div>
                                <div className="text-sm text-slate-600">{stat.label}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No content found</h3>
              <p className="text-gray-500">Add Vivaha Vedika content in the admin panel to display it here.</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VivahaVedikaPage;