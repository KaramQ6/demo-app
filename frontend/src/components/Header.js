import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Menu, X, Activity } from 'lucide-react';

const Header = () => {
  const { language, toggleLanguage, t, isRTL } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { 
      name: { ar: 'الرئيسية', en: 'Home' }, 
      href: '/' 
    },
    { 
      name: { ar: 'وجهاتنا', en: 'Our Destinations' }, 
      href: '/destinations' 
    },
    { 
      name: { ar: 'البيانات الحية', en: 'Live Data Hub' }, 
      href: '/iot-hub',
      icon: Activity
    },
    { 
      name: { ar: 'التجربة التفاعلية', en: 'Interactive Experience' }, 
      href: '/demo' 
    },
    { 
      name: { ar: 'عن المشروع', en: 'About Project' }, 
      href: '/about' 
    }
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 group">
            <div className="text-2xl font-bold gradient-purple bg-clip-text text-transparent font-['Montserrat'] group-hover:scale-105 transition-transform duration-200">
              SmartTour.Jo
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 rtl:space-x-reverse">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 font-['Open_Sans'] flex items-center space-x-2 rtl:space-x-reverse rounded-lg relative group ${
                    isActive(item.href)
                      ? 'text-white bg-primary/20 border border-primary/30'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{t(item.name)}</span>
                  {/* Hover underline animation */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
                </Link>
              );
            })}
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5 interactive-button relative group"
            >
              <Globe className="w-4 h-4" />
              <span className="font-['Open_Sans']">{language === 'ar' ? 'EN' : 'ع'}</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5 interactive-button"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 text-sm font-medium transition-all duration-300 rounded-md font-['Open_Sans'] flex items-center space-x-2 rtl:space-x-reverse interactive-button ${
                      isActive(item.href)
                        ? 'text-white bg-primary/20 border border-primary/30'
                        : 'text-muted-foreground hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{t(item.name)}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;