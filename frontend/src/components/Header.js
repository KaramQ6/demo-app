import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Home, MapPin, Thermometer, Calendar, User, LogIn } from 'lucide-react';

const Header = () => {
  const { t, toggleLanguage, language } = useLanguage();
  const { user } = useApp();
  const location = useLocation();

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ST</span>
            </div>
            <span className="text-white font-semibold text-lg">
              SmartTour.Jo
            </span>
          </Link>

          {/* Navigation - Single Row */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                    active 
                      ? 'text-white bg-white/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{t(item.label)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {language === 'ar' ? 'EN' : 'عر'}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden pb-4 overflow-x-auto">
          <div className="flex space-x-4 rtl:space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    active 
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
