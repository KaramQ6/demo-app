import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Globe, Menu, X, User, LogOut, MapPin } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const { openChatbot, user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
    }
  };

  // SIMPLIFIED NAVIGATION STRUCTURE
  const primaryNavigation = [
    {
      path: '/',
      label: { ar: 'الرئيسية', en: 'Home' },
      public: true
    },
    {
      path: '/destinations',
      label: { ar: 'وجهاتنا', en: 'Destinations' },
      public: true
    },
    {
      path: '/plan-trip',
      label: { ar: 'خطط رحلتك', en: 'Plan Trip' },
      public: true
    },
    {
      path: '/about',
      label: { ar: 'حول', en: 'About' },
      public: true
    }
  ];

  // SECONDARY NAVIGATION (Hamburger Menu)
  const secondaryNavigation = [
    {
      path: '/data',
      label: { ar: 'البيانات الحية', en: 'Live Data' },
      public: true
    },
    {
      path: '/voice-agent',
      label: { ar: 'المساعد الصوتي', en: 'Voice Assistant' },
      public: true
    },
    {
      path: '/demo',
      label: { ar: 'Demo', en: 'Demo' },
      public: true
    },
    {
      path: '/ar',
      label: { ar: 'AR View', en: 'AR View' },
      public: true
    },
    // User-specific items
    {
      path: '/my-plan',
      label: { ar: 'خطتي', en: 'My Plan' },
      public: false
    },
    {
      path: '/itinerary',
      label: { ar: 'المسار السياحي', en: 'Itinerary' },
      public: false
    },
    {
      path: '/profile',
      label: { ar: 'ملفي الشخصي', en: 'My Profile' },
      public: false
    }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Handle Plan Trip click - opens chatbot for now
  const handlePlanTripClick = (e) => {
    if (location.pathname !== '/plan-trip') {
      e.preventDefault();
      openChatbot();
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 py-4">
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

          {/* SIMPLIFIED PRIMARY NAVIGATION - Desktop */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {primaryNavigation
              .filter(item => item.public || user)
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={item.path === '/plan-trip' ? handlePlanTripClick : undefined}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 font-['Open_Sans'] font-medium text-center ${
                    isActivePath(item.path)
                      ? 'gradient-purple text-white shadow-lg'
                      : item.path === '/plan-trip'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md hover:shadow-lg hover:from-purple-600 hover:to-blue-600'
                      : 'text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t(item.label)}
                </Link>
              ))}
          </nav>

          {/* Language Toggle & User Menu & Mobile Menu */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg glass hover:bg-white/10 transition-all duration-200 interactive-button"
                  aria-label={t({ ar: 'قائمة المستخدم', en: 'User Menu' })}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium font-['Open_Sans'] hidden md:block">
                    {user.email?.split('@')[0] || 'المستخدم'}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <Link
                        to="/my-plan"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        {t({ ar: 'خطتي', en: 'My Plan' })}
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <User className="w-4 h-4 mr-2" />
                        {t({ ar: 'الملف الشخصي', en: 'Profile' })}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t({ ar: 'تسجيل الخروج', en: 'Logout' })}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  {t({ ar: 'دخول', en: 'Login' })}
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 text-sm font-medium rounded-lg gradient-purple text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {t({ ar: 'تسجيل', en: 'Register' })}
                </Link>
              </div>
            )}

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

        {/* MOBILE NAVIGATION - ALL ITEMS IN HAMBURGER */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10">
            <nav className="flex flex-col space-y-2 mt-4">
              {/* Primary Navigation on Mobile */}
              {primaryNavigation
                .filter(item => item.public || user)
                .map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      if (item.path === '/plan-trip') handlePlanTripClick(e);
                    }}
                    className={`px-4 py-3 rounded-lg transition-all duration-200 font-['Open_Sans'] font-medium ${
                      isActivePath(item.path)
                        ? 'gradient-purple text-white shadow-lg'
                        : item.path === '/plan-trip'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                        : 'text-muted-foreground hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {t(item.label)}
                  </Link>
                ))}
              
              {/* Divider */}
              <div className="border-t border-white/10 my-2"></div>
              
              {/* Secondary Navigation on Mobile */}
              {secondaryNavigation
                .filter(item => item.public || user)
                .map((item) => (
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