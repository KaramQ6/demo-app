import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import QuickSearchModalSimple from './QuickSearchModalSimple';
import {
    Thermometer,
    Mic,
    Smartphone,
    Zap,
    User,
    Home,
    MapPin,
    Calendar,
    Pin,
    PinOff,
    Search,
    Wifi,
    WifiOff
} from 'lucide-react';

const SmartToolsSidebar = () => {
    const { t } = useLanguage();
    const {
        user,
        liveData,
        sidebarPinned,
        toggleSidebarPin,
        toggleQuickSearch,
        connectionStatus
    } = useApp();

    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(sidebarPinned);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (sidebarPinned) {
            setIsExpanded(true);
        }
    }, [sidebarPinned]);

    const smartTools = [
        {
            id: 'home',
            path: '/',
            icon: Home,
            label: { ar: 'الرئيسية', en: 'Home' },
            description: { ar: 'الصفحة الرئيسية', en: 'Main homepage' }
        },
        {
            id: 'destinations',
            path: '/destinations',
            icon: MapPin,
            label: { ar: 'الوجهات', en: 'Destinations' },
            description: { ar: 'استكشف الوجهات السياحية', en: 'Explore destinations' }
        },
        {
            id: 'live-data',
            path: '/data',
            icon: Thermometer,
            label: { ar: 'البيانات الحية', en: 'Live Data' },
            badge: liveData?.main?.temp ? `${Math.round(liveData.main.temp)}°C` : '---',
            description: { ar: 'طقس جميع محافظات الأردن', en: 'Weather for all Jordan governorates' }
        },
        {
            id: 'iot-hub',
            path: '/iot-hub',
            icon: Zap,
            label: { ar: 'إنترنت الأشياء', en: 'IoT Hub' },
            description: { ar: 'الأماكن السياحية الرئيسية', en: 'Main tourist destinations' }
        },
        {
            id: 'voice-agent',
            path: '/voice-assistant',
            icon: Mic,
            label: { ar: 'المساعد الصوتي', en: 'Voice Guide' },
            badge: { ar: 'جاهز', en: 'Ready' },
            description: { ar: 'مرشد صوتي ذكي', en: 'Smart voice assistant' }
        },
        {
            id: 'ar-view',
            path: '/ar',
            icon: Smartphone,
            label: { ar: 'تجربة الواقع المعزز', en: 'AR Experience' },
            badge: 'NEW',
            description: { ar: 'استكشاف تفاعلي بالواقع المعزز', en: 'Interactive AR exploration' }
        },
        {
            id: 'itinerary',
            path: '/my-plan',
            icon: Calendar,
            label: { ar: 'خطة رحلتي', en: 'My Itinerary' },
            description: { ar: 'خطة السفر المخصصة', en: 'Personal travel plan' }
        },
        {
            id: 'profile',
            path: user ? '/profile' : '/login',
            icon: User,
            label: user ? { ar: 'حسابي', en: 'My Account' } : { ar: 'تسجيل الدخول', en: 'Login' },
            badge: user ? '📊' : null,
            description: user
                ? { ar: 'إدارة الرحلات والتفضيلات', en: 'Manage trips & preferences' }
                : { ar: 'انضم للحصول على تجربة مخصصة', en: 'Join for personalized experience' }
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

    return (
        <>
            <div
                className={`fixed left-0 top-0 h-full z-30 transition-all duration-300 ${isExpanded ? 'w-80' : 'w-16'}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="h-full glass-card border-r border-white/10 pt-20 pb-6 flex flex-col">
                    {/* Header with controls */}
                    <div className="px-3 mb-4">
                        <div className="flex items-center justify-between">
                            <div className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                <h2 className="text-lg font-bold text-white">
                                    {t({ ar: 'الأدوات الذكية', en: 'Smart Tools' })}
                                </h2>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={toggleSidebarPin}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title={sidebarPinned ? t({ ar: 'إلغاء التثبيت', en: 'Unpin' }) : t({ ar: 'تثبيت', en: 'Pin' })}
                                >
                                    {sidebarPinned ? (
                                        <PinOff className="w-4 h-4 text-purple-400" />
                                    ) : (
                                        <Pin className="w-4 h-4 text-gray-400 hover:text-white" />
                                    )}
                                </button>

                                <button
                                    onClick={toggleQuickSearch}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title={t({ ar: 'البحث السريع (Ctrl+K)', en: 'Quick Search (Ctrl+K)' })}
                                >
                                    <Search className="w-4 h-4 text-gray-400 hover:text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Status */}
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
                        </div>
                    </div>

                    {/* Main Navigation */}
                    <div className="flex-1 overflow-y-auto px-2 space-y-1">
                        {smartTools.map((tool) => {
                            const isActive = isActiveRoute(tool.path);

                            return (
                                <Link
                                    key={tool.id}
                                    to={tool.path}
                                    className={`group relative flex items-center p-3 rounded-xl transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30'
                                        : 'hover:bg-white/5 hover:border hover:border-white/10'
                                        } border border-transparent`}
                                >
                                    {/* Icon */}
                                    <div className="relative flex-shrink-0">
                                        <tool.icon className={`w-6 h-6 transition-colors ${isActive ? 'text-purple-400' : 'text-gray-300 group-hover:text-white'
                                            }`} />
                                    </div>

                                    {/* Content */}
                                    <div className={`ml-4 flex-1 transition-all duration-300 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
                                        }`}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-200'
                                                    }`}>
                                                    {t(tool.label)}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {t(tool.description)}
                                                </p>
                                            </div>

                                            {/* Badge */}
                                            {tool.badge && (
                                                <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300">
                                                    {typeof tool.badge === 'string' ? tool.badge : t(tool.badge)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    {isExpanded && (
                        <div className="px-3 pt-4 border-t border-white/10">
                            <div className="text-xs text-gray-400 text-center">
                                <p>{t({ ar: 'اضغط Ctrl+K للبحث السريع', en: 'Press Ctrl+K for quick search' })}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile version */}
            {isMobile && (
                <div className="fixed bottom-20 right-4 z-40 md:hidden">
                    <div className="flex flex-col space-y-2">
                        <button
                            onClick={toggleQuickSearch}
                            className="w-12 h-12 glass-card rounded-full flex items-center justify-center border border-white/20 hover:border-purple-400/50 transition-all"
                        >
                            <Search className="w-5 h-5 text-white" />
                        </button>

                        {smartTools.slice(0, 4).map((tool) => (
                            <Link
                                key={tool.id}
                                to={tool.path}
                                className="w-12 h-12 glass-card rounded-full flex items-center justify-center border border-white/20 hover:border-purple-400/50 transition-all"
                            >
                                <tool.icon className="w-5 h-5 text-white" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <QuickSearchModalSimple />
        </>
    );
};

export default SmartToolsSidebar;
