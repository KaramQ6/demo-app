import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const { openChatbot } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { 
      path: '/', 
      label: { ar: 'الرئيسية', en: 'Home' }
    },
    { 
      path: '/destinations', 
      label: { ar: 'وجهاتنا', en: 'Destinations' }
    },
    { 
      path: '/data', 
      label: { ar: 'البيانات الحية', en: 'Live Data' }
    },
    {
      path: '/profile',
      label: { ar: 'ملفي الشخصي', en: 'My Profile' }
    }
    {
      path: '/demo',
      label: { ar: 'Demo', en: 'Demo' }
    }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse group">
            <div className="w-10 h-10 gradient-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg font-['Montserrat']">S</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold font-['Montserrat'] text-white group-hover:text-primary transition-colors">
                SmartTour.Jo
              </h1>
              <p className="text-xs text-muted-foreground font-['Open_Sans']">
                {t({ ar: 'مرشدك الذكي في الأردن', en: 'Your Smart Guide in Jordan' })}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-['Open_Sans'] font-medium ${
                  isActivePath(item.path)
                    ? 'gradient-purple text-white shadow-lg'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
              >
                {t(item.label)}
              </Link>
            ))}
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg glass hover:bg-white/10 transition-all duration-200 interactive-button"
              aria-label={t({ ar: 'تغيير اللغة', en: 'Change Language' })}
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium font-['Open_Sans']">
                {language === 'ar' ? 'EN' : 'ع'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg glass hover:bg-white/10 transition-all duration-200"
              aria-label={t({ ar: 'فتح القائمة', en: 'Open Menu' })}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10">
            <nav className="flex flex-col space-y-2 mt-4">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all duration-200 font-['Open_Sans'] font-medium ${
                    isActivePath(item.path)
                      ? 'gradient-purple text-white shadow-lg'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t(item.label)}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;