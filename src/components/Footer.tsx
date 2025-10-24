import React, { useEffect, useRef, useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [footerLogo, setFooterLogo] = useState<string | null>(null);
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

  useEffect(() => {
    fetchFooterLogo();
  }, []);

  const fetchFooterLogo = async () => {
    try {
      const { data, error } = await supabase
        .from('logo')
        .select('image_url')
        .eq('type', 'footer')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFooterLogo(data.image_url);
      }
    } catch (error) {
      console.error('Error fetching footer logo:', error);
    }
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  const quickLinks = [
    { title: 'We Believe', href: '/we-believe' },
    { title: 'Worship', href: '/worship' },
    { title: 'Donate', href: '/donate' }
  ];

  const ministryLinks = [
    { title: 'Yuvanidhi', href: '/yuvanidhi' },
    { title: 'TV Ministry', href: '/tv-ministry' },
    { title: 'Prayer Hut', href: '/prayer-hut' },
    { title: 'Satellite Church', href: '/satellite-church' },
    { title: 'Vivaha Vedika', href: '/vivaha-vedika' }
  ];

  return (
    <footer ref={ref} className="bg-slate-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo */}
          <div className={`lg:col-span-1 transform transition-all duration-1000 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="mb-6">
              {footerLogo ? (
                <img
                  src={footerLogo}
                  alt="Maranatha Temple Logo"
                  className="h-32 w-auto object-contain"
                />
              ) : (
                <div className="w-32 h-32 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-6xl font-bold text-white">M</span>
                </div>
              )}
            </div>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-slate-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-slate-300 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={`transform transition-all duration-1000 delay-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-2 h-2 bg-amber-400 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministries */}
          <div className={`transform transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h4 className="text-xl font-bold mb-6">Ministries</h4>
            <ul className="space-y-3">
              {ministryLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-300 hover:text-amber-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-2 h-2 bg-amber-400 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={`transform transition-all duration-1000 delay-800 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h4 className="text-xl font-bold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-slate-300">PV Rao Rd, Gayatri Nagar,</p>
                  <p className="text-slate-300">Benz Circle, Vijayawada,</p>
                  <p className="text-slate-300">Andhra Pradesh 520008.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <a href="tel:+919394247333" className="text-slate-300 hover:text-amber-400 transition-colors">
                  (+91) 9394247333
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <a href="mailto:mediaoffice@maranthatemple.org" className="text-slate-300 hover:text-amber-400 transition-colors">
                  mediaoffice@maranthatemple.org
                </a>
              </div>
              
              
             
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t border-slate-800 pt-8 text-center transform transition-all duration-1000 delay-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <p className="text-slate-400">
            © 2025 Dream Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;