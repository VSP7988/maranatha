import React, { useEffect, useRef, useState } from 'react';
import { 
  Heart, 
  CreditCard, 
  Calendar, 
  Gift, 
  Globe, 
  MapPin, 
  DollarSign,
  Euro,
  PoundSterling,
  IndianRupee,
  Smartphone,
  Building2,
  QrCode,
  Shield,
  CheckCircle,
  Flag,
  Users,
  Copy,
  ExternalLink,
  FileText
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

interface DonationsBanner {
  id: string;
  title: string;
  image_url?: string;
  is_active: boolean;
}

interface DonationsPaymentMethod {
  id: string;
  type: 'national' | 'international';
  method_type: 'upi' | 'bank' | 'online' | 'paypal' | 'wire' | 'crypto';
  title: string;
  description?: string;
  qr_code_url?: string;
  upi_id?: string;
  bank_details: {
    accountName?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    branch?: string;
    routingNumber?: string;
    swiftCode?: string;
    address?: string;
  };
  payment_link?: string;
  position: number;
  is_active: boolean;
}

const DonatePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'national' | 'international' | null>(null);
  const [copiedText, setCopiedText] = useState('');
  const [banner, setBanner] = useState<DonationsBanner | null>(null);
  const [nationalMethods, setNationalMethods] = useState<DonationsPaymentMethod[]>([]);
  const [internationalMethods, setInternationalMethods] = useState<DonationsPaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchDonationsData();
  }, []);

  const fetchDonationsData = async () => {
    try {
      setIsLoading(true);
      console.log('🎯 DONATIONS PAGE: Fetching data...');
      
      // Check Supabase connection first
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ DONATIONS: Supabase not configured');
        alert('⚠️ Database Connection Error\n\nSupabase is not configured. Please connect to Supabase.');
        return;
      }
      
      // Fetch banner
      const { data: bannerData, error: bannerError } = await supabase
        .from('donations_banners')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (bannerError) {
        console.error('❌ DONATIONS PAGE: Error fetching banner:', bannerError);
      } else {
        console.log('✅ DONATIONS PAGE: Banner fetched:', bannerData?.length || 0);
        // Find active banner or use first one
        const activeBanner = bannerData?.find(b => b.is_active === true || b.is_active === 'true') || bannerData?.[0];
        setBanner(activeBanner || null);
        console.log('📋 DONATIONS: Using banner:', activeBanner?.title || 'None');
      }

      // First check what's in the database
      const { data: allNationalData, error: allNationalError } = await supabase
        .from('donations_payment_methods')
        .select('*')
        .eq('type', 'national');
      
      console.log('🔍 DONATIONS: All national data in database:', allNationalData);
      console.log('🔍 DONATIONS: National database error:', allNationalError);
      
      const { data: allInternationalData, error: allInternationalError } = await supabase
        .from('donations_payment_methods')
        .select('*')
        .eq('type', 'international');
      
      console.log('🔍 DONATIONS: All international data in database:', allInternationalData);
      console.log('🔍 DONATIONS: International database error:', allInternationalError);
      
      // Fetch national payment methods
      const { data: nationalData, error: nationalError } = await supabase
        .from('donations_payment_methods')
        .select('*')
        .eq('type', 'national')
        .order('position', { ascending: true });

      if (nationalError) {
        console.error('❌ DONATIONS PAGE: Error fetching national methods:', nationalError);
      } else {
        console.log('✅ DONATIONS PAGE: National methods fetched:', nationalData?.length || 0);
        // Filter active methods on client side to handle boolean/string inconsistencies
        const activeNational = nationalData?.filter(method => method.is_active === true || method.is_active === 'true') || [];
        console.log('📊 DONATIONS: Active national methods:', activeNational.length);
        setNationalMethods(activeNational);
        
        // Log each method details
        activeNational.forEach((method, index) => {
          console.log(`💳 National Method ${index + 1}:`, {
            id: method.id,
            title: method.title,
            method_type: method.method_type,
            has_qr_code: !!method.qr_code_url,
            has_upi_id: !!method.upi_id,
            has_bank_details: !!method.bank_details && Object.keys(method.bank_details).length > 0,
            has_payment_link: !!method.payment_link,
            is_active: method.is_active
          });
        });
      }

      // Fetch international payment methods
      const { data: internationalData, error: internationalError } = await supabase
        .from('donations_payment_methods')
        .select('*')
        .eq('type', 'international')
        .order('position', { ascending: true });

      if (internationalError) {
        console.error('❌ DONATIONS PAGE: Error fetching international methods:', internationalError);
      } else {
        console.log('✅ DONATIONS PAGE: International methods fetched:', internationalData?.length || 0);
        // Filter active methods on client side to handle boolean/string inconsistencies
        const activeInternational = internationalData?.filter(method => method.is_active === true || method.is_active === 'true') || [];
        console.log('📊 DONATIONS: Active international methods:', activeInternational.length);
        setInternationalMethods(activeInternational);
        
        // Log each method details
        activeInternational.forEach((method, index) => {
          console.log(`💳 International Method ${index + 1}:`, {
            id: method.id,
            title: method.title,
            method_type: method.method_type,
            has_qr_code: !!method.qr_code_url,
            has_upi_id: !!method.upi_id,
            has_bank_details: !!method.bank_details && Object.keys(method.bank_details).length > 0,
            has_payment_link: !!method.payment_link,
            is_active: method.is_active
          });
        });
      }
      
    } catch (error) {
      console.error('❌ DONATIONS PAGE: Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const getMethodIcon = (methodType: string) => {
    const icons: { [key: string]: any } = {
      upi: QrCode,
      bank: Building2,
      online: CreditCard,
      paypal: Globe,
      wire: Building2,
      crypto: QrCode
    };
    return icons[methodType] || CreditCard;
  };

  const getMethodColor = (methodType: string) => {
    const colors: { [key: string]: string } = {
      upi: 'bg-green-500',
      bank: 'bg-blue-500',
      online: 'bg-purple-500',
      paypal: 'bg-blue-500',
      wire: 'bg-green-500',
      crypto: 'bg-amber-500'
    };
    return colors[methodType] || 'bg-gray-500';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading donations page...</p>
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
            backgroundImage: banner?.image_url ? `url(${banner.image_url})` : 'url(https://images.pexels.com/photos/6994314/pexels-photo-6994314.jpeg?auto=compress&cs=tinysrgb&w=1600)',
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
                  <Gift className="w-2 h-2 text-amber-300/30" />
                ) : (
                  <DollarSign className="w-2 h-2 text-amber-500/30" />
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
            <div className="mb-6">
              <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-glow">
                <Heart className="w-10 h-10 text-white" />
              </div>
            </div>
            
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
                  Support Our
                  <span className="block text-amber-500">
                    Mission
                  </span>
                </>
              )}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your generous donations help us spread hope, love, and transformation in our community and around the world
            </p>
          </div>
        </div>
      </div>

      {/* Donation Options Section */}
      <div className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          {/* Both Options Side by Side */}
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            
            {/* National Donations Section */}
            <div className={`transform transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
            }`}>
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                {/* National Header */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Flag className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">National Donations</h3>
                  <p className="text-gray-600 leading-relaxed">
                    For donors within India - UPI, Bank Transfer, and local payment methods
                  </p>
                </div>

                {/* National Payment Methods */}
                <div className="space-y-6">
                  {nationalMethods.length === 0 ? (
                    <div className="text-center py-8">
                      <QrCode className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No national payment methods configured</p>
                    </div>
                  ) : (
                    nationalMethods.map((method, index) => {
                      const IconComponent = getMethodIcon(method.method_type);
                      const colorClass = getMethodColor(method.method_type);
                      
                      return (
                        <div key={method.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-800">{method.title}</h4>
                              {method.description && (
                                <p className="text-gray-600 text-sm">{method.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {/* QR Code */}
                            {method.qr_code_url && (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h5 className="font-semibold text-gray-800 mb-3 text-center">QR Code Payment</h5>
                                <div className="text-center">
                                  <img 
                                    src={method.qr_code_url} 
                                    alt={`${method.title} QR Code`} 
                                    className="w-24 h-24 rounded-lg mx-auto object-cover border border-gray-200" 
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                  <p className="text-gray-600 text-xs mt-2">Scan to pay</p>
                                </div>
                              </div>
                            )}
                            
                            {/* UPI ID */}
                            {method.upi_id && (
                              <div className="bg-green-50 rounded-lg p-4">
                                <h5 className="font-semibold text-gray-800 mb-3">UPI Payment</h5>
                                <div className="bg-white rounded-lg p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="font-mono text-sm text-gray-800 break-all">{method.upi_id}</div>
                                    <button
                                      onClick={() => copyToClipboard(method.upi_id!, 'UPI ID')}
                                      className="text-green-600 hover:text-green-700 p-1 rounded transition-colors"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Bank Details */}
                            {method.bank_details && Object.values(method.bank_details).some(value => value) && (
                              <div className="bg-blue-50 rounded-lg p-4">
                                <h5 className="font-semibold text-gray-800 mb-3">Bank Transfer Details</h5>
                                <div className="space-y-2">
                                  {Object.entries(method.bank_details)
                                    .filter(([key, value]) => value)
                                    .map(([key, value]) => (
                                      <div key={key} className="bg-white rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </div>
                                            <div className="font-mono text-sm text-gray-800 break-all">{value}</div>
                                          </div>
                                          <button
                                            onClick={() => copyToClipboard(value as string, key)}
                                            className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                                          >
                                            <Copy className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Payment Link */}
                            {method.payment_link && (
                              <div className="bg-purple-50 rounded-lg p-4">
                                <h5 className="font-semibold text-gray-800 mb-3">Online Payment</h5>
                                <a
                                  href={method.payment_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group"
                                >
                                  Pay via {method.title}
                                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* International Donations Section */}
            <div className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}>
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                {/* International Header */}
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">International Donations</h3>
                  <p className="text-gray-600 leading-relaxed">
                    For global donors - PayPal, Wire Transfer, and cryptocurrency options
                  </p>
                </div>

                {/* International Payment Methods */}
                <div className="space-y-6">
                  {internationalMethods.length === 0 ? (
                    <div className="text-center py-8">
                      <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No international payment methods configured</p>
                    </div>
                  ) : (
                    internationalMethods.map((method, index) => {
                      const IconComponent = getMethodIcon(method.method_type);
                      const colorClass = getMethodColor(method.method_type);
                      
                      return (
                        <div key={method.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-800">{method.title}</h4>
                              {method.description && (
                                <p className="text-gray-600 text-sm">{method.description}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {/* QR Code */}
                            {method.qr_code_url && (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h5 className="font-semibold text-gray-800 mb-3 text-center">QR Code Payment</h5>
                                <div className="text-center">
                                  <img 
                                    src={method.qr_code_url} 
                                    alt={`${method.title} QR Code`} 
                                    className="w-24 h-24 rounded-lg mx-auto object-cover border border-gray-200" 
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                    }}
                                  />
                                  <p className="text-gray-600 text-xs mt-2">Scan to pay</p>
                                </div>
                              </div>
                            )}
                            
                            {/* UPI ID */}
                            {method.upi_id && (
                              <div className="bg-green-50 rounded-lg p-4">
                                <h5 className="font-semibold text-gray-800 mb-3">UPI Payment</h5>
                                <div className="bg-white rounded-lg p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="font-mono text-sm text-gray-800 break-all">{method.upi_id}</div>
                                    <button
                                      onClick={() => copyToClipboard(method.upi_id!, 'UPI ID')}
                                      className="text-green-600 hover:text-green-700 p-1 rounded transition-colors"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Bank Details */}
                            {method.bank_details && Object.values(method.bank_details).some(value => value) && (
                              <div className="bg-blue-50 rounded-lg p-4">
                                <h5 className="font-semibold text-gray-800 mb-3">Bank Transfer Details</h5>
                                <div className="space-y-2">
                                  {Object.entries(method.bank_details)
                                    .filter(([key, value]) => value)
                                    .map(([key, value]) => (
                                      <div key={key} className="bg-white rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                            </div>
                                            <div className="font-mono text-sm text-gray-800 break-all">{value}</div>
                                          </div>
                                          <button
                                            onClick={() => copyToClipboard(value as string, key)}
                                            className="text-blue-600 hover:text-blue-700 p-1 rounded transition-colors"
                                          >
                                            <Copy className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Payment Link */}
                            {method.payment_link && (
                              <div className="bg-purple-50 rounded-lg p-4">
                                <h5 className="font-semibold text-gray-800 mb-3">Online Payment</h5>
                                <a
                                  href={method.payment_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group"
                                >
                                  Pay via {method.title}
                                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DonatePage;
