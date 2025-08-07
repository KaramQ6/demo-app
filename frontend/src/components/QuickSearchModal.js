import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import {
    Search,
    Clock,
    Zap,
    Home,
    MapPin,
    User,
    Thermometer,
    Mic,
    Smartphone,
    Calendar,
    X
} from 'lucide-react';

const QuickSearchModal = () => {
    const { t, language } = useLanguage();
    const { quickSearchOpen, toggleQuickSearch, navigationHistory, user } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPages, setFilteredPages] = useState([]);
    const searchInputRef = useRef(null);

    // All available pages
    const allPages = [
        {
            id: 'home',
            path: '/',
            icon: Home,
            title: { ar: 'الرئيسية', en: 'Home' },
            description: { ar: 'الصفحة الرئيسية للموقع', en: 'Main homepage' },
            category: { ar: 'أساسي', en: 'Main' },
            keywords: ['home', 'main', 'الرئيسية', 'الصفحة الرئيسية']
        },
        {
            id: 'destinations',
            path: '/destinations',
            icon: MapPin,
            title: { ar: 'الوجهات', en: 'Destinations' },
            description: { ar: 'استكشف الوجهات السياحية', en: 'Explore tourist destinations' },
            category: { ar: 'سياحة', en: 'Tourism' },
            keywords: ['destinations', 'places', 'tourism', 'الوجهات', 'الأماكن', 'السياحة']
        },
        {
            id: 'data',
            path: '/data',
            icon: Thermometer,
            title: { ar: 'البيانات الحية', en: 'Live Data' },
            description: { ar: 'بيانات الطقس والازدحام الحية', en: 'Real-time weather and crowd data' },
            category: { ar: 'بيانات', en: 'Data' },
            keywords: ['weather', 'data', 'live', 'الطقس', 'البيانات', 'الحية']
        },
        {
            id: 'iot',
            path: '/iot-hub',
            icon: Zap,
            title: { ar: 'إنترنت الأشياء', en: 'IoT Hub' },
            description: { ar: 'مركز أجهزة إنترنت الأشياء', en: 'Internet of Things hub' },
            category: { ar: 'تقنية', en: 'Technology' },
            keywords: ['iot', 'sensors', 'technology', 'إنترنت الأشياء', 'أجهزة الاستشعار']
        },
        {
            id: 'voice',
            path: '/voice-assistant',
            icon: Mic,
            title: { ar: 'المساعد الصوتي', en: 'Voice Agent' },
            description: { ar: 'مساعد صوتي ذكي للسياحة', en: 'Smart voice assistant for tourism' },
            category: { ar: 'مساعدة', en: 'Assistant' },
            keywords: ['voice', 'assistant', 'ai', 'المساعد الصوتي', 'الذكاء الاصطناعي']
        },
        {
            id: 'ar',
            path: '/ar',
            icon: Smartphone,
            title: { ar: 'الواقع المعزز', en: 'AR Experience' },
            description: { ar: 'تجربة الواقع المعزز التفاعلية', en: 'Interactive Augmented Reality experience' },
            category: { ar: 'تقنية', en: 'Technology' },
            keywords: ['ar', 'augmented', 'reality', 'الواقع المعزز', 'تفاعلي']
        },
        {
            id: 'itinerary',
            path: '/my-plan',
            icon: Calendar,
            title: { ar: 'خطة رحلتي', en: 'My Itinerary' },
            description: { ar: 'خطة السفر المخصصة', en: 'Personal travel itinerary' },
            category: { ar: 'تخطيط', en: 'Planning' },
            keywords: ['itinerary', 'plan', 'travel', 'خطة الرحلة', 'السفر', 'التخطيط']
        },
        {
            id: 'profile',
            path: user ? '/profile' : '/login',
            icon: User,
            title: user ? { ar: 'حسابي', en: 'My Profile' } : { ar: 'تسجيل الدخول', en: 'Login' },
            description: user
                ? { ar: 'إدارة الحساب والتفضيلات', en: 'Manage account and preferences' }
                : { ar: 'تسجيل الدخول للحصول على تجربة مخصصة', en: 'Login for personalized experience' },
            category: { ar: 'حساب', en: 'Account' },
            keywords: ['profile', 'account', 'login', 'الحساب', 'الملف الشخصي', 'تسجيل الدخول']
        }
    ];

    // Filter pages based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredPages(allPages);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = allPages.filter(page => {
            const titleMatch = t(page.title).toLowerCase().includes(query);
            const descriptionMatch = t(page.description).toLowerCase().includes(query);
            const categoryMatch = t(page.category).toLowerCase().includes(query);
            const keywordsMatch = page.keywords.some(keyword =>
                keyword.toLowerCase().includes(query)
            );

            return titleMatch || descriptionMatch || categoryMatch || keywordsMatch;
        });

        setFilteredPages(filtered);
    }, [searchQuery, language, t]);

    // Focus search input when modal opens
    useEffect(() => {
        if (quickSearchOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 100);
        }
    }, [quickSearchOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && quickSearchOpen) {
                toggleQuickSearch();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [quickSearchOpen, toggleQuickSearch]);

    const handlePageClick = () => {
        setSearchQuery('');
        toggleQuickSearch();
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: -20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", damping: 20, stiffness: 300 }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: -20,
            transition: { duration: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.05, type: "spring", stiffness: 300 }
        })
    };

    return (
        <AnimatePresence>
            {quickSearchOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
                    onClick={toggleQuickSearch}
                >
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="glass-card border border-white/20 rounded-2xl w-full max-w-2xl mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Search className="w-6 h-6 text-purple-400" />
                                    {t({ ar: 'البحث السريع', en: 'Quick Search' })}
                                </h3>
                                <button
                                    onClick={toggleQuickSearch}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t({ ar: 'ابحث عن الصفحات...', en: 'Search pages...' })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                                    {language === 'ar' ? 'Ctrl+K' : 'Ctrl+K'}
                                </div>
                            </div>
                        </div>

                        {/* Recent History */}
                        {!searchQuery && navigationHistory.length > 0 && (
                            <div className="p-6 border-b border-white/10">
                                <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {t({ ar: 'المستخدم حديثاً', en: 'Recently Visited' })}
                                </h4>
                                <div className="space-y-1">
                                    {navigationHistory.slice(0, 3).map((item, index) => (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={handlePageClick}
                                            className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors group"
                                        >
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <p className="text-white group-hover:text-purple-300 transition-colors">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(item.timestamp).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US')}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search Results */}
                        <div className="max-h-96 overflow-y-auto">
                            <div className="p-6">
                                <h4 className="text-sm font-medium text-gray-400 mb-3">
                                    {searchQuery
                                        ? t({ ar: `نتائج البحث (${filteredPages.length})`, en: `Search Results (${filteredPages.length})` })
                                        : t({ ar: 'جميع الصفحات', en: 'All Pages' })
                                    }
                                </h4>

                                <div className="space-y-1">
                                    {filteredPages.map((page, index) => (
                                        <motion.div
                                            key={page.id}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            custom={index}
                                        >
                                            <Link
                                                to={page.path}
                                                onClick={handlePageClick}
                                                className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-all group"
                                            >
                                                <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-colors">
                                                    <page.icon className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-white group-hover:text-purple-300 transition-colors font-medium">
                                                        {t(page.title)}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {t(page.description)}
                                                    </p>
                                                    <p className="text-xs text-purple-400/70 mt-1">
                                                        {t(page.category)}
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {filteredPages.length === 0 && searchQuery && (
                                    <div className="text-center py-8">
                                        <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                        <p className="text-gray-400">
                                            {t({ ar: 'لم يتم العثور على نتائج', en: 'No results found' })}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {t({ ar: 'جرب البحث بكلمات مختلفة', en: 'Try searching with different keywords' })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">↵</kbd>
                                        {t({ ar: 'انتقال', en: 'Navigate' })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20">Esc</kbd>
                                        {t({ ar: 'إغلاق', en: 'Close' })}
                                    </span>
                                </div>
                                <span>{t({ ar: 'البحث السريع', en: 'Quick Search' })}</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuickSearchModal;
