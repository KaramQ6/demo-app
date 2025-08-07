import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import QuickSearchModal from './QuickSearchModal';
import {
  Thermometer,
  Mic,
  Smartphone,
  Zap,
  User,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Circle,
  Dot,
  Pin,
  PinOff,
  Search,
  Clock,
  Wifi,
  WifiOff,
  Bell,
  Settings,
  MoreVertical,
  Home,
  MapPin,
  Calendar
} from 'lucide-react';

const SmartToolsSidebar = () => {
  const { t, language } = useLanguage();
  const {
    user,
    liveData,
    isLoadingData,
    sidebarPinned,
    toggleSidebarPin,
    navigationHistory,
    addToNavigationHistory,
    toggleQuickSearch,
    connectionStatus,
    notificationCount
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(sidebarPinned);
  const [isMobile, setIsMobile] = useState(false);
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Handle sidebar expansion based on pin state
  useEffect(() => {
    if (sidebarPinned) {
      setIsExpanded(true);
    }
  }, [sidebarPinned]);

  // Track navigation history
  useEffect(() => {
    const currentPage = smartTools.find(tool => tool.path === location.pathname);
    if (currentPage) {
      addToNavigationHistory(location.pathname, t(currentPage.label));
    }
  }, [location.pathname, addToNavigationHistory, t]);

  // Smart tools configuration with live data integration
  const smartTools = [
    {
      id: 'home',
      path: '/',
      icon: Home,
      label: { ar: 'الرئيسية', en: 'Home' },
      badge: null,
      indicator: null,
      indicatorColor: 'text-blue-400',
      description: { ar: 'الصفحة الرئيسية', en: 'Main homepage' },
      category: 'main'
    },
    {
      id: 'destinations',
      path: '/destinations',
      icon: MapPin,
      label: { ar: 'الوجهات', en: 'Destinations' },
      badge: null,
      indicator: null,
      indicatorColor: 'text-green-400',
      description: { ar: 'استكشف الوجهات السياحية', en: 'Explore destinations' },
      category: 'tourism'
    },
    {
      id: 'live-data',
      path: '/data',
      icon: Thermometer,
      label: { ar: 'البيانات الحية', en: 'Live Data' },
      badge: liveData?.main?.temp ? `${Math.round(liveData.main.temp)}°C` : '---',
      indicator: liveData?.main?.temp > 25 ? TrendingUp : TrendingDown,
      indicatorColor: liveData?.main?.temp > 25 ? 'text-red-400' : 'text-blue-400',
      description: { ar: 'طقس وازدحام مباشر', en: 'Real-time weather & crowds' },
      category: 'data'
    },
    {
      id: 'iot-hub',
      path: '/iot-hub',
      icon: Zap,
      label: { ar: 'إنترنت الأشياء', en: 'IoT Hub' },
      badge: '●●○',
      indicator: null,
      indicatorColor: 'text-yellow-400',
      description: { ar: 'أجهزة الاستشعار الذكية', en: 'Smart sensors network' },
      category: 'technology'
    },
    {
      id: 'voice-agent',
      path: '/voice-assistant',
      icon: Mic,
      label: { ar: 'المساعد الصوتي', en: 'Voice Guide' },
      badge: { ar: 'جاهز', en: 'Ready' },
      indicator: Circle,
      indicatorColor: 'text-green-400',
      description: { ar: 'مرشد صوتي ذكي', en: 'Smart voice assistant' },
      category: 'assistant'
    },
    {
      id: 'ar-view',
      path: '/ar',
      icon: Smartphone,
      label: { ar: 'تجربة الواقع المعزز', en: 'AR Experience' },
      badge: 'NEW',
      indicator: null,
      indicatorColor: 'text-purple-400',
      description: { ar: 'استكشاف تفاعلي بالواقع المعزز', en: 'Interactive AR exploration' },
      category: 'technology'
    },
    {
      id: 'itinerary',
      path: '/my-plan',
      icon: Calendar,
      label: { ar: 'خطة رحلتي', en: 'My Itinerary' },
      badge: null,
      indicator: null,
      indicatorColor: 'text-indigo-400',
      description: { ar: 'خطة السفر المخصصة', en: 'Personal travel plan' },
      category: 'planning'
    },
    {
      id: 'profile',
      path: user ? '/profile' : '/login',
      icon: User,
      label: user ? { ar: 'حسابي', en: 'My Account' } : { ar: 'تسجيل الدخول', en: 'Login' },
      badge: user ? '📊' : null,
      indicator: null,
      indicatorColor: 'text-indigo-400',
      description: user
        ? { ar: 'إدارة الرحلات والتفضيلات', en: 'Manage trips & preferences' }
        : { ar: 'انضم للحصول على تجربة مخصصة', en: 'Join for personalized experience' },
      category: 'account'
    }
  ];

  const isActiveRoute = (path) => location.pathname === path;

  const handleMouseEnter = () => {
    if (!sidebarPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!sidebarPinned) {
      setIsExpanded(false);
    }
  };

  // Quick access items (most used pages)
  const quickAccessItems = navigationHistory.slice(0, 3);

  // Status indicator component
  const StatusIndicator = () => (
    <div className="flex items-center gap-2 px-3 py-2 text-xs">
      <div className="flex items-center gap-1">
        {connectionStatus === 'online' ? (
          <>
            <Wifi className="w-3 h-3 text-green-400" />
            <span className="text-green-400">{t({ ar: 'متصل', en: 'Online' })}</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3 text-red-400" />
            <span className="text-red-400">{t({ ar: 'غير متصل', en: 'Offline' })}</span>
          </>
        )}
      </div>
      {isExpanded && (
        <div className="text-gray-400">
          {currentTime.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )}
    </div>
  );

  // Mobile floating menu component
  const MobileFloatingMenu = () => (
    <div className="fixed bottom-20 right-4 z-40 md:hidden">
      <AnimatePresence>
        {showQuickAccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-3 space-y-2"
          >
            {/* Quick Search Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleQuickSearch}
              className="w-12 h-12 glass-card rounded-full flex items-center justify-center border border-white/20 hover:border-purple-400/50 transition-all"
            >
              <Search className="w-5 h-5 text-white" />
            </motion.button>

            {/* Recent Pages */}
            {quickAccessItems.map((item, index) => {
              const tool = smartTools.find(t => t.path === item.path);
              if (!tool) return null;

              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className="w-12 h-12 glass-card rounded-full flex items-center justify-center border border-white/20 hover:border-purple-400/50 transition-all"
                    onClick={() => setShowQuickAccess(false)}
                  >
                    <tool.icon className="w-5 h-5 text-white" />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle button with notification */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowQuickAccess(!showQuickAccess)}
        className="relative w-14 h-14 gradient-purple rounded-full flex items-center justify-center shadow-lg"
      >
        <motion.div
          animate={{ rotate: showQuickAccess ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <MoreVertical className="w-6 h-6 text-white" />
        </motion.div>

        {notificationCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          </div>
        )}
      </motion.button>
    </div>
  );

  // Desktop sidebar component  
  const DesktopSidebar = () => (
    <motion.div
      className={`fixed left-0 top-0 h-full z-30 transition-all duration-300`}
      initial={false}
      animate={{ width: isExpanded ? 320 : 64 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="h-full glass-card border-r border-white/10 pt-20 pb-6 flex flex-col">
        {/* Header with controls */}
        <div className="px-3 mb-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={false}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              className="flex items-center gap-2"
            >
              <h2 className="text-lg font-bold text-white">
                {t({ ar: 'الأدوات الذكية', en: 'Smart Tools' })}
              </h2>
            </motion.div>

            <div className="flex items-center gap-1">
              {/* Pin/Unpin Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleSidebarPin}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title={sidebarPinned ? t({ ar: 'إلغاء التثبيت', en: 'Unpin' }) : t({ ar: 'تثبيت', en: 'Pin' })}
              >
                {sidebarPinned ? (
                  <PinOff className="w-4 h-4 text-purple-400" />
                ) : (
                  <Pin className="w-4 h-4 text-gray-400 hover:text-white" />
                )}
              </motion.button>

              {/* Quick Search Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleQuickSearch}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title={t({ ar: 'البحث السريع (Ctrl+K)', en: 'Quick Search (Ctrl+K)' })}
              >
                <Search className="w-4 h-4 text-gray-400 hover:text-white" />
              </motion.button>
            </div>
          </div>

          {/* Status Indicator */}
          <StatusIndicator />
        </div>

        {/* Recent Pages Quick Access */}
        <AnimatePresence>
          {isExpanded && quickAccessItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 mb-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  {t({ ar: 'المستخدم حديثاً', en: 'Recently Used' })}
                </span>
              </div>
              <div className="space-y-1">
                {quickAccessItems.map((item, index) => {
                  const tool = smartTools.find(t => t.path === item.path);
                  if (!tool) return null;

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        className="flex items-center gap-2 p-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <tool.icon className="w-4 h-4" />
                        <span className="truncate">{t(tool.label)}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-2 space-y-1">
            {smartTools.map((tool, index) => {
              const isActive = isActiveRoute(tool.path);

              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={tool.path}
                    className={`group relative flex items-center p-3 rounded-xl transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30'
                      : 'hover:bg-white/5 hover:border hover:border-white/10'
                      } border border-transparent`}
                  >
                    {/* Icon container */}
                    <div className="relative flex-shrink-0">
                      <tool.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-purple-400' : 'text-gray-300 group-hover:text-white'
                        }`} />

                      {/* Live data indicator */}
                      {tool.indicator && (
                        <tool.indicator className={`absolute -top-1 -right-1 w-3 h-3 ${tool.indicatorColor}`} />
                      )}

                      {/* Notification dot */}
                      {tool.id === 'live-data' && isLoadingData && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      )}
                    </div>

                    {/* Expanded content */}
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isExpanded ? 1 : 0,
                        x: isExpanded ? 0 : -20,
                        width: isExpanded ? 'auto' : 0
                      }}
                      className="ml-4 flex-1 overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <p className={`font-medium text-sm truncate ${isActive ? 'text-white' : 'text-gray-200'
                            }`}>
                            {t(tool.label)}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {t(tool.description)}
                          </p>
                        </div>

                        {/* Live badge */}
                        {tool.badge && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${tool.id === 'live-data'
                              ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300'
                              : tool.id === 'voice-agent'
                                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300'
                                : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300'
                              }`}
                          >
                            {typeof tool.badge === 'string' ? tool.badge : t(tool.badge)}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 pt-4 border-t border-white/10"
            >
              <div className="text-xs text-gray-400 text-center">
                <p>{t({ ar: 'اضغط Ctrl+K للبحث السريع', en: 'Press Ctrl+K for quick search' })}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  return (
    <>
      {isMobile ? <MobileFloatingMenu /> : <DesktopSidebar />}
      <QuickSearchModal />
    </>
  );
};

export default SmartToolsSidebar;