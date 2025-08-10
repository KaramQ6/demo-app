import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Settings, Activity, CheckCircle, RefreshCw, Info, Zap, Globe, Clock } from 'lucide-react';

const AlternativeCrowdSettings = () => {
    const { t } = useLanguage();
    const { realCrowdData, initializeRealCrowdData } = useApp();
    const [isRefreshing, setIsRefreshing] = useState(false);

    // إعادة تحميل بيانات الازدحام
    const refreshCrowdData = async () => {
        setIsRefreshing(true);
        try {
            await initializeRealCrowdData();
        } catch (error) {
            console.error('Error refreshing crowd data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // تحديد لون مستوى الازدحام
    const getCrowdLevelColor = (level) => {
        if (level <= 30) return 'text-green-400 bg-green-500/20';
        if (level <= 60) return 'text-yellow-400 bg-yellow-500/20';
        return 'text-red-400 bg-red-500/20';
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-900 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-4 flex items-center">
                    <Activity className="w-8 h-8 mr-3 text-green-400" />
                    {t({ ar: 'نظام بيانات الازدحام الذكي', en: 'Smart Crowd Data System' })}
                </h1>
                <p className="text-gray-400">
                    {t({
                        ar: 'نظام ذكي لتقدير مستوى الازدحام بدون الحاجة لـ Google API - يعتمد على الطقس والوقت والأنماط الموسمية',
                        en: 'Smart system to estimate crowd levels without Google API - based on weather, time, and seasonal patterns'
                    })}
                </p>
            </div>

            {/* System Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-green-800/30 border border-green-500/50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-400 text-sm font-medium">
                                {t({ ar: 'الحالة', en: 'Status' })}
                            </p>
                            <p className="text-lg font-semibold text-green-300">
                                {t({ ar: 'نشط', en: 'Active' })}
                            </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                </div>

                <div className="bg-blue-800/30 border border-blue-500/50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-400 text-sm font-medium">
                                {t({ ar: 'الوجهات', en: 'Destinations' })}
                            </p>
                            <p className="text-lg font-semibold text-blue-300">
                                {Object.keys(realCrowdData || {}).length}/10
                            </p>
                        </div>
                        <Globe className="w-8 h-8 text-blue-400" />
                    </div>
                </div>

                <div className="bg-yellow-800/30 border border-yellow-500/50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-400 text-sm font-medium">
                                {t({ ar: 'التحديث', en: 'Update Freq' })}
                            </p>
                            <p className="text-lg font-semibold text-yellow-300">
                                {t({ ar: '10 دقائق', en: '10 minutes' })}
                            </p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-400" />
                    </div>
                </div>

                <div className="bg-purple-800/30 border border-purple-500/50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-400 text-sm font-medium">
                                {t({ ar: 'التكلفة', en: 'Cost' })}
                            </p>
                            <p className="text-lg font-semibold text-purple-300">
                                {t({ ar: 'مجاني', en: 'FREE' })}
                            </p>
                        </div>
                        <Zap className="w-8 h-8 text-purple-400" />
                    </div>
                </div>
            </div>

            {/* How it Works */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    {t({ ar: 'كيف يعمل النظام', en: 'How It Works' })}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium text-blue-400">
                            {t({ ar: 'مصادر البيانات', en: 'Data Sources' })}
                        </h4>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                                {t({ ar: 'الوقت المحلي (API مجاني)', en: 'Local time (Free API)' })}
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                                {t({ ar: 'بيانات الطقس التقديرية', en: 'Weather estimation' })}
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                                {t({ ar: 'الأنماط الموسمية', en: 'Seasonal patterns' })}
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                                {t({ ar: 'أوقات الذروة المحلية', en: 'Local peak times' })}
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-lg font-medium text-green-400">
                            {t({ ar: 'العوامل المؤثرة', en: 'Influencing Factors' })}
                        </h4>
                        <ul className="space-y-2 text-gray-300">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                                {t({ ar: 'ساعة اليوم (أوقات الذروة)', en: 'Hour of day (Peak times)' })}
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                                {t({ ar: 'يوم الأسبوع (نهاية الأسبوع)', en: 'Day of week (Weekends)' })}
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                                {t({ ar: 'درجة الحرارة والطقس', en: 'Temperature & weather' })}
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-pink-400 rounded-full mr-3"></span>
                                {t({ ar: 'الموسم السياحي', en: 'Tourism season' })}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Live Data Display */}
            <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">
                        {t({ ar: 'البيانات المباشرة', en: 'Live Data' })}
                    </h3>
                    <button
                        onClick={refreshCrowdData}
                        disabled={isRefreshing}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {t({ ar: 'تحديث', en: 'Refresh' })}
                    </button>
                </div>

                {Object.keys(realCrowdData || {}).length === 0 ? (
                    <div className="text-center py-12">
                        <Activity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">
                            {t({ ar: 'جاري تحميل البيانات...', en: 'Loading data...' })}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(realCrowdData).map(([destinationId, data]) => (
                            <div key={destinationId} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium text-white capitalize">
                                        {destinationId.replace('-', ' ')}
                                    </h4>
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">
                                            {t({ ar: 'الازدحام', en: 'Crowd' })}
                                        </span>
                                        <div className={`px-2 py-1 rounded text-xs font-medium ${getCrowdLevelColor(data.crowdLevel)}`}>
                                            {data.crowdLevel}%
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">
                                            {t({ ar: 'الزوار', en: 'Visitors' })}
                                        </span>
                                        <span className="text-sm text-blue-400">
                                            {data.currentVisitors}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-400">
                                            {t({ ar: 'الحالة', en: 'Status' })}
                                        </span>
                                        <span className={`text-sm ${data.isOpen ? 'text-green-400' : 'text-red-400'}`}>
                                            {data.isOpen ?
                                                t({ ar: 'مفتوح', en: 'Open' }) :
                                                t({ ar: 'مغلق', en: 'Closed' })
                                            }
                                        </span>
                                    </div>

                                    {data.weather && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-400">
                                                {t({ ar: 'الطقس', en: 'Weather' })}
                                            </span>
                                            <span className="text-sm text-yellow-400">
                                                {data.weather.temperature}°C
                                            </span>
                                        </div>
                                    )}

                                    <div className="pt-2 border-t border-gray-600">
                                        <span className="text-xs text-gray-500">
                                            {data.dataSource === 'alternative_apis' ?
                                                t({ ar: 'بيانات ذكية', en: 'Smart data' }) :
                                                t({ ar: 'تقدير ذكي', en: 'Smart estimation' })
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Advantages */}
            <div className="mt-8 bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-400 mb-4">
                    {t({ ar: 'مزايا النظام البديل', en: 'Alternative System Advantages' })}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center text-green-300">
                            <CheckCircle className="w-5 h-5 mr-3" />
                            {t({ ar: 'مجاني تماماً - لا توجد تكلفة', en: 'Completely free - no costs' })}
                        </div>
                        <div className="flex items-center text-green-300">
                            <CheckCircle className="w-5 h-5 mr-3" />
                            {t({ ar: 'لا يحتاج مفاتيح APIs خارجية', en: 'No external API keys needed' })}
                        </div>
                        <div className="flex items-center text-green-300">
                            <CheckCircle className="w-5 h-5 mr-3" />
                            {t({ ar: 'تحديث أسرع (كل 10 دقائق)', en: 'Faster updates (every 10 minutes)' })}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center text-green-300">
                            <CheckCircle className="w-5 h-5 mr-3" />
                            {t({ ar: 'خاص بالبيئة الأردنية', en: 'Tailored for Jordanian context' })}
                        </div>
                        <div className="flex items-center text-green-300">
                            <CheckCircle className="w-5 h-5 mr-3" />
                            {t({ ar: 'يعمل دائماً - لا يوجد quota', en: 'Always works - no quota limits' })}
                        </div>
                        <div className="flex items-center text-green-300">
                            <CheckCircle className="w-5 h-5 mr-3" />
                            {t({ ar: 'تقدير ذكي بناءً على عوامل متعددة', en: 'Smart estimation based on multiple factors' })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlternativeCrowdSettings;
