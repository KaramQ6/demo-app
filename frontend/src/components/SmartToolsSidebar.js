import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
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
  Dot
} from 'lucide-react';

const SmartToolsSidebar = () => {
  const { t, language } = useLanguage();
  const { user, liveData, isLoadingData } = useApp();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Smart tools configuration with live data integration
  const smartTools = [
    {
      id: 'live-data',
      path: '/data',
      icon: Thermometer,
      label: { ar: 'البيانات الحية', en: 'Live Data' },
      badge: liveData?.temperature ? `${Math.round(liveData.temperature)}°C` : '---',
      indicator: liveData?.temperature > 25 ? TrendingUp : TrendingDown,
      indicatorColor: liveData?.temperature > 25 ? 'text-red-400' : 'text-blue-400',
      description: { ar: 'طقس وازدحام مباشر', en: 'Real-time weather & crowds' }
    },
    {
      id: 'voice-agent',
      path: '/voice-agent', 
      icon: Mic,
      label: { ar: 'المساعد الصوتي', en: 'Voice Guide' },
      badge: { ar: 'جاهز', en: 'Ready' },
      indicator: Circle,
      indicatorColor: 'text-green-400',
      description: { ar: 'مرشد صوتي ذكي', en: 'AI-powered voice assistant' }
    },
    {
      id: 'ar-view',
      path: '/ar',
      icon: Smartphone,
      label: { ar: 'تجربة الواقع المعزز', en: 'AR Experience' },
      badge: 'NEW',
      indicator: null,
      indicatorColor: 'text-purple-400',
      description: { ar: 'استكشاف تفاعلي بالواقع المعزز', en: 'Interactive AR exploration' }
    },
    {
      id: 'demo',
      path: '/demo',
      icon: Zap,
      label: { ar: 'العروض التفاعلية', en: 'Interactive Demo' },
      badge: '●●○', // Progress indicator
      indicator: null,
      indicatorColor: 'text-yellow-400',
      description: { ar: 'جولات تفاعلية مصورة', en: 'Interactive guided tours' }
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
        : { ar: 'انضم للحصول على تجربة مخصصة', en: 'Join for personalized experience' }
    }
  ];

  const isActiveRoute = (path) => location.pathname === path;

  // Mobile floating menu component
  const MobileFloatingMenu = () => (
    <div className="fixed bottom-20 right-4 z-40 md:hidden">
      <div className="flex flex-col space-y-2">
        {/* Floating action cluster */}
        <div className={`flex flex-col space-y-2 transition-all duration-300 ${
          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          {smartTools.slice(0, 4).map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              className="w-12 h-12 glass-card rounded-full flex items-center justify-center border border-white/20 hover:border-purple-400/50 transition-all"
              onClick={() => setIsExpanded(false)}
            >
              <tool.icon className="w-5 h-5 text-white" />
            </Link>
          ))}
        </div>
        
        {/* Main toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 gradient-purple rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        >
          <ChevronRight className={`w-5 h-5 text-white transition-transform ${
            isExpanded ? 'rotate-90' : 'rotate-0'
          }`} />
        </button>
      </div>
    </div>
  );

  // Desktop sidebar component  
  const DesktopSidebar = () => (
    <div 
      className={`fixed left-0 top-0 h-full z-30 transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="h-full glass-card border-r border-white/10 pt-20 pb-6">
        <div className="flex flex-col space-y-1 px-2">
          {smartTools.map((tool) => {
            const isActive = isActiveRoute(tool.path);
            
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className={`group relative flex items-center p-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30' 
                    : 'hover:bg-white/5 hover:border hover:border-white/10'
                } border border-transparent`}
              >
                {/* Icon container */}
                <div className="relative flex-shrink-0">
                  <tool.icon className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-purple-400' : 'text-gray-300 group-hover:text-white'
                  }`} />
                  
                  {/* Live data indicator */}
                  {tool.indicator && (
                    <tool.indicator className={`absolute -top-1 -right-1 w-3 h-3 ${tool.indicatorColor}`} />
                  )}
                </div>

                {/* Expanded content */}
                <div className={`ml-4 flex-1 transition-all duration-300 ${
                  isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium text-sm ${
                        isActive ? 'text-white' : 'text-gray-200'
                      }`}>
                        {t(tool.label)}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {t(tool.description)}
                      </p>
                    </div>
                    
                    {/* Live badge */}
                    {tool.badge && (
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        tool.id === 'live-data' 
                          ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300'
                          : tool.id === 'voice-agent'
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300'
                          : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300'
                      }`}>
                        {typeof tool.badge === 'string' ? tool.badge : t(tool.badge)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Loading indicator for live data */}
                {tool.id === 'live-data' && isLoadingData && (
                  <div className="absolute top-1 right-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? <MobileFloatingMenu /> : <DesktopSidebar />}
    </>
  );
};

export default SmartToolsSidebar;