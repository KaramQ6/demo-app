import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Globe, Menu, X, User, LogOut, MapPin, Shield, MessageCircle } from 'lucide-react';

const Header = () => {
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const { openChatbot, user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll progress tracking
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

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
    }
  };

  // Check if user is admin
  const isAdmin = user?.email === 'admin@smarttour.jo' || user?.role === 'admin' || process.env.NODE_ENV === 'development';

  // SIMPLIFIED NAVIGATION STRUCTURE
  const primaryNavigation = [
    {
      path: '/',
      label: { ar: 'الرئيسية', en: 'Home' },
      public: true
    },
    {
      path: '/destinations',
      label: { ar: 'الوجهات', en: 'Destinations' },
      public: true
    },
    {
      path: '/booking',
      label: { ar: 'حجز رحلة', en: 'Book Tour' },
      public: true,
    },
    {
      path: '/about',
      label: { ar: 'حول', en: 'About' },
      public: true
    },
    // Add admin link if user is admin
    ...(isAdmin ? [{
      path: '/admin',
      label: { ar: 'لوحة الإدارة', en: 'Admin Panel' },
      public: false,
      isAdmin: true
    }] : [])
  ];

  // SECONDARY NAVIGATION (Hamburger Menu)
  const secondaryNavigation = [
    {
      path: '/booking',
      label: { ar: 'الحجوزات', en: 'Booking' },
      public: true
    },
    {
      path: '/community',
      label: { ar: 'المجتمع', en: 'Community' },
      public: true
    },
    {
      path: '/data',
      label: { ar: 'البيانات الحية', en: 'Live Data' },
      public: true
    },
    {
      path: '/weather-crowds',
      label: { ar: 'الطقس والازدحام الحية', en: 'Real-time weather & crowds' },
      public: true
    },
    {
      path: '/discover',
      label: { ar: 'اكتشف المزيد', en: 'Discover More' },
      public: true
    },
    // User-specific items
    {
      path: '/admin',
      label: { ar: 'لوحة الإدارة', en: 'Admin Dashboard' },
      public: false
    },
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
    },
    {
      path: '/profile-page',
      label: { ar: 'صفحة الملف الشخصي', en: 'Profile Page' },
      public: false
    }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handlePlanTripClick = (e) => {
    if (location.pathname !== '/plan-trip') {
      e.preventDefault();
      openChatbot();
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

            {/* Regular navigation */}
            {primaryNavigation
              .filter(item => item.public || user)
              .slice(0, 3)
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link px-4 py-2 rounded-lg transition-all duration-300 font-medium text-center ${isActivePath(item.path)
                    ? 'gradient-purple text-white shadow-lg'
                    : item.featured || item.path === '/booking'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {t(item.label)}
                </Link>
              ))}

            {/* Enhanced Chat Button */}
            <button
              onClick={openChatbot}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30 font-medium"
            >
              {t({ ar: 'تحدث مع جواد', en: 'Chat with Jawad' })}
            </button>
          </div>

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

            {/* Enhanced Mobile Menu Toggle */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Chat Button */}
              <button onClick={openChatbot} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-full">
                <MessageCircle className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg glass hover:bg-white/10 transition-all duration-200"
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
                    className={`px-4 py-3 rounded-lg transition-all duration-200 font-['Open_Sans'] font-medium ${isActivePath(item.path)
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
                    className={`px-4 py-3 rounded-lg transition-all duration-200 font-['Open_Sans'] font-medium ${isActivePath(item.path)
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
    </nav>
  );
};

export default Header;