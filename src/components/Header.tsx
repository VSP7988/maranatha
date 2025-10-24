import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null);
  const [headerLogo, setHeaderLogo] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetchHeaderLogo();
  }, []);

  const fetchHeaderLogo = async () => {
    try {
      const { data, error } = await supabase
        .from('logo')
        .select('image_url')
        .eq('type', 'header')
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setHeaderLogo(data.image_url);
      }
    } catch (error) {
      console.error('Error fetching header logo:', error);
    }
  };

  const toggleMobileDropdown = (itemName: string) => {
    setMobileActiveDropdown(mobileActiveDropdown === itemName ? null : itemName);
  };

  const menuItems = [
    { name: 'Home', href: '/', isRoute: true },
    { 
      name: 'About', 
      href: '#about',
      dropdown: [
        { name: 'We believe', href: '/we-believe', isRoute: true },
        { name: 'Founder', href: 'https://moseschoudary.org/about/founder', external: true }
      ]
    },
    { 
      name: 'Ministries', 
      href: '#ministries',
      dropdown: [
        { name: 'Yuvanidhi', href: '/yuvanidhi', isRoute: true },
        { name: 'TV Ministry', href: '/tv-ministry', isRoute: true },
        { name: 'Prayer Hut', href: '/prayer-hut', isRoute: true },
        { name: 'Satellite Church', href: '/satellite-church', isRoute: true },
        { name: 'Vivaha Vedika', href: '/vivaha-vedika', isRoute: true },
        { name: 'Magazine', href: 'https://moseschoudary.org/ministries/magazine', external: true },
        { name: 'Vimukthi Charities', href: 'https://mvcharities.org/', external: true },
        { name: 'Biblical Seminary', href: 'https://biblicalseminary.in/', external: true }
      ]
    },
    { name: 'Worship', href: '/worship', isRoute: true },
    { name: 'Donate', href: '/donate', isRoute: true }
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[999999] transition-all duration-500 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-amber-100'
        : 'bg-black/40 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            {headerLogo ? (
              <img
                src={headerLogo}
                alt="Maranatha Temple Logo"
                className="h-16 w-auto object-contain transition-all duration-500"
              />
            ) : (
              <>
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isScrolled
                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg'
                    : 'bg-white/20 backdrop-blur-sm border border-white/30'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
                  <span className={`text-2xl font-bold transition-colors duration-500 ${
                    isScrolled ? 'text-white' : 'text-white'
                  }`}>M</span>
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-amber-400/50 group-hover:animate-spin transition-all duration-500" style={{ animationDuration: '3s' }}></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className={`text-2xl font-bold transition-colors duration-500 ${
                    isScrolled ? 'text-slate-800' : 'text-white'
                  }`}>
                    MARANATHA
                  </h1>
                  <p className={`text-sm transition-colors duration-500 ${
                    isScrolled ? 'text-slate-600' : 'text-white/80'
                  }`}>
                    TEMPLE
                  </p>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.dropdown ? item.name : null)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.isRoute ? (
                  <Link
                    to={item.href}
                    className={`flex items-center gap-1 font-semibold transition-all duration-300 hover:scale-105 ${
                      isScrolled 
                        ? 'text-slate-700 hover:text-amber-600' 
                        : 'text-white hover:text-amber-400'
                    }`}
                  >
                    {item.name}
                    {item.dropdown && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    )}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className={`flex items-center gap-1 font-semibold transition-all duration-300 hover:scale-105 ${
                      isScrolled 
                        ? 'text-slate-700 hover:text-amber-600' 
                        : 'text-white hover:text-amber-400'
                    }`}
                  >
                    {item.name}
                    {item.dropdown && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        activeDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    )}
                  </a>
                )}

                {/* Dropdown Menu */}
                {item.dropdown && (
                  <div className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 z-[9999999] ${
                    activeDropdown === item.name 
                      ? 'opacity-100 visible translate-y-0' 
                      : 'opacity-0 invisible -translate-y-2'
                  }`}>
                    {item.dropdown.map((dropdownItem, dropdownIndex) => (
                      dropdownItem.isRoute ? (
                        <Link
                          key={dropdownIndex}
                          to={dropdownItem.href}
                          className="block px-6 py-3 text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300 border-b border-gray-50 last:border-b-0"
                        >
                          {dropdownItem.name}
                        </Link>
                      ) : (
                        <a
                        key={dropdownIndex}
                        href={dropdownItem.href}
                        target={dropdownItem.external ? '_blank' : '_self'}
                        rel={dropdownItem.external ? 'noopener noreferrer' : undefined}
                        className="block px-6 py-3 text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300 border-b border-gray-50 last:border-b-0"
                      >
                        {dropdownItem.name}
                        </a>
                      )
                    ))}
                  </div>
                )}

                {/* Hover Underline */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></div>
              </div>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a 
              href="https://www.youtube.com/@MaranathaTemple/streams"
              target="_blank"
              rel="noopener noreferrer"
              className={`relative px-6 py-3 rounded-full font-semibold transition-all duration-500 transform hover:scale-105 overflow-hidden group whitespace-nowrap inline-block ${
              isScrolled 
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl' 
                : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30'
            }`}
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10">Watch Live</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-full transition-all duration-300 ${
              isScrolled 
                ? 'text-slate-700 hover:bg-slate-100' 
                : 'text-white hover:bg-white/20'
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-6 bg-white/95 backdrop-blur-lg rounded-2xl mt-4 shadow-2xl border border-amber-100 relative z-[9999999] max-h-96 overflow-y-auto">
            {menuItems.map((item, index) => (
              <div key={index} className="border-b border-gray-100 last:border-b-0">
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleMobileDropdown(item.name)}
                      className="w-full flex items-center justify-between px-6 py-4 text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300 font-semibold"
                    >
                      {item.name}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                        mobileActiveDropdown === item.name ? 'rotate-180' : ''
                      }`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${
                      mobileActiveDropdown === item.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="bg-gray-50 border-t border-gray-200">
                        {item.dropdown.map((dropdownItem, dropdownIndex) => (
                          dropdownItem.isRoute ? (
                            <Link
                              key={dropdownIndex}
                              to={dropdownItem.href}
                              className="block px-12 py-3 text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300 text-sm"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setMobileActiveDropdown(null);
                              }}
                            >
                              {dropdownItem.name}
                            </Link>
                          ) : (
                            <a
                              key={dropdownIndex}
                              href={dropdownItem.href}
                              target={dropdownItem.external ? '_blank' : '_self'}
                              rel={dropdownItem.external ? 'noopener noreferrer' : undefined}
                              className="block px-12 py-3 text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300 text-sm"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setMobileActiveDropdown(null);
                              }}
                            >
                              {dropdownItem.name}
                            </a>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                ) : item.isRoute ? (
                  <Link
                    to={item.href}
                    className="block px-6 py-4 text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300 font-semibold"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setMobileActiveDropdown(null);
                    }}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className="block px-6 py-4 text-slate-700 hover:text-amber-600 hover:bg-amber-50 transition-all duration-300 font-semibold"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setMobileActiveDropdown(null);
                    }}
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
            <div className="px-6 pt-4">
              <a
                href="https://www.youtube.com/channel/UCl_anQ9uGIHI9Dh061NbM3w"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 text-sm inline-block text-center"
              >
                Watch Live
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;