import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Home, MapPin, Thermometer, Calendar, User, LogIn, Menu, X } from 'lucide-react';

const Header = () => {
  const { t, toggleLanguage, language } = useLanguage();
  const { user } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Calculate scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: { ar: 'الرئيسية', en: 'Home' } },
    { path: '/destinations', icon: MapPin, label: { ar: 'الوجهات', en: 'Destinations' } },
    { path: '/data', icon: Thermometer, label: { ar: 'البيانات', en: 'Live Data' } },
    { path: '/booking', icon: Calendar, label: { ar: 'احجز رحلة', en: 'Book Tour' } },
    {
      path: user ? '/profile' : '/login',
      icon: user ? User : LogIn,
      label: user ? { ar: 'حسابي', en: 'Profile' } : { ar: 'دخول', en: 'Login' }
    }
  ];

  const isActive = (path) => location.pathname === path;

  const scrollToSection = (sectionId) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-xl z-50 border-b border-gray-800/50 transition-all duration-300 shadow-xl">
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-600 via-purple-400 to-blue-600 transition-all duration-300 ease-out shadow-lg shadow-purple-500/50" style={{ width: `${scrollProgress}%` }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white hover:text-purple-400 transition-all duration-300 cursor-pointer font-poppins tracking-tight transform hover:scale-105" onClick={() => scrollToSection('home')}>
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-glow">Smart</span>
                <span className="text-white ml-1">Tour.jo</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg transition-colors ${active
                      ? 'text-white bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{t(item.label)}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side - Language Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 rounded-lg transition-all duration-300 border border-gray-700/50"
              aria-label={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
            >
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                {language === 'ar' ? 'EN' : 'عر'}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-colors ${active
                        ? 'text-white bg-white/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{t(item.label)}</span>
                  </Link>
                );
              })}
              
              {/* Language Toggle in Mobile Menu */}
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-colors text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 border border-gray-700/50 mt-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="font-medium">
                  {language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
