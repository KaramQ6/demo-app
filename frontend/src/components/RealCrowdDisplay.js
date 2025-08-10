import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Users, Clock, MapPin, AlertTriangle, CheckCircle, Loader, RefreshCw } from 'lucide-react';

const RealCrowdDisplay = ({ destinationId, className = "" }) => {
    const { realCrowdData, getRealCrowdData } = useApp();
    const { t } = useLanguage();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const crowdData = realCrowdData[destinationId];

    // دالة لتحديث البيانات يدوياً
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await getRealCrowdData(destinationId);
        } catch (error) {
            console.error('Error refreshing crowd data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    // تحديد لون الازدحام
    const getCrowdLevelColor = (level) => {
        if (level <= 30) return 'text-green-400 bg-green-500/20';
        if (level <= 60) return 'text-yellow-400 bg-yellow-500/20';
        return 'text-red-400 bg-red-500/20';
    };

    // تحديد نص الازدحام
    const getCrowdLevelText = (level) => {
        if (level <= 30) return t({ ar: 'هادئ', en: 'Quiet' });
        if (level <= 60) return t({ ar: 'متوسط', en: 'Moderate' });
        return t({ ar: 'مزدحم', en: 'Busy' });
    };

    // تحديد أيقونة الحالة
    const getStatusIcon = (isOpen) => {
        return isOpen ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
        ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
        );
    };

    // تنسيق وقت آخر تحديث
    const formatLastUpdated = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffMinutes < 1) return t({ ar: 'الآن', en: 'Now' });
        if (diffMinutes < 60) return t({
            ar: `منذ ${diffMinutes} دقيقة`,
            en: `${diffMinutes}m ago`
        });

        const diffHours = Math.floor(diffMinutes / 60);
        return t({
            ar: `منذ ${diffHours} ساعة`,
            en: `${diffHours}h ago`
        });
    };

    if (!crowdData) {
        return (
            <div className={`flex items-center justify-center p-4 rounded-lg bg-gray-800/50 ${className}`}>
                <Loader className="w-6 h-6 animate-spin text-blue-400" />
                <span className="ml-2 text-gray-300">
                    {t({ ar: 'جاري تحميل بيانات الازدحام...', en: 'Loading crowd data...' })}
                </span>
            </div>
        );
    }

    return (
        <div className={`p-4 rounded-lg bg-gray-800/50 border border-gray-700 ${className}`}>
            {/* Header with refresh button */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-400" />
                    {t({ ar: 'مستوى الازدحام الحالي', en: 'Current Crowd Level' })}
                </h3>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Main crowd level display */}
            <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1">
                    <div className={`inline-flex items-center px-3 py-2 rounded-full font-semibold ${getCrowdLevelColor(crowdData.crowdLevel)}`}>
                        <span className="text-lg">{crowdData.crowdLevel}%</span>
                        <span className="ml-2 text-sm">{getCrowdLevelText(crowdData.crowdLevel)}</span>
                    </div>
                </div>

                {/* Status indicator */}
                <div className="flex items-center space-x-2">
                    {getStatusIcon(crowdData.isOpen)}
                    <span className={`text-sm ${crowdData.isOpen ? 'text-green-400' : 'text-red-400'}`}>
                        {crowdData.isOpen ?
                            t({ ar: 'مفتوح', en: 'Open' }) :
                            t({ ar: 'مغلق', en: 'Closed' })
                        }
                    </span>
                </div>
            </div>

            {/* Additional information */}
            <div className="grid grid-cols-2 gap-4">
                {/* Current visitors */}
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                        {crowdData.currentVisitors}
                    </div>
                    <div className="text-sm text-gray-400">
                        {t({ ar: 'زائر حالياً', en: 'Current visitors' })}
                    </div>
                </div>

                {/* Rating */}
                <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                        {crowdData.rating?.toFixed(1) || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-400">
                        {t({ ar: 'التقييم', en: 'Rating' })}
                        {crowdData.totalRatings && (
                            <span className="block text-xs">
                                ({crowdData.totalRatings.toLocaleString()} {t({ ar: 'تقييم', en: 'reviews' })})
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Weather info if available */}
            {crowdData.weather && (
                <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-blue-400">
                            <span className="mr-2">🌡️</span>
                            {crowdData.weather.temperature}°C
                        </div>
                        <div className="flex items-center text-blue-400">
                            <span className="mr-2">
                                {crowdData.weather.weather === 'Clear' ? '☀️' :
                                    crowdData.weather.weather === 'Rain' ? '🌧️' : '☁️'}
                            </span>
                            {crowdData.weather.weather}
                        </div>
                    </div>
                </div>
            )}

            {/* Data source and last updated */}
            <div className="mt-4 pt-3 border-t border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {crowdData.dataSource === 'alternative_apis' ?
                            t({ ar: 'بيانات ذكية (بدون Google)', en: 'Smart data (No Google)' }) :
                            crowdData.dataSource === 'fallback_smart_estimation' ?
                                t({ ar: 'تقدير ذكي', en: 'Smart estimation' }) :
                                t({ ar: 'بيانات تقديرية', en: 'Estimated data' })
                        }
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatLastUpdated(crowdData.lastUpdated)}
                    </div>
                </div>
            </div>

            {/* Tips based on crowd level */}
            {crowdData.crowdLevel > 70 && (
                <div className="mt-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-center text-yellow-400 text-sm">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        {t({
                            ar: 'مزدحم جداً! فكر في زيارة مكان آخر أو العودة لاحقاً',
                            en: 'Very busy! Consider visiting another place or coming back later'
                        })}
                    </div>
                </div>
            )}

            {crowdData.crowdLevel <= 30 && (
                <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t({
                            ar: 'الآن وقت مثالي للزيارة!',
                            en: 'Perfect time to visit!'
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RealCrowdDisplay;
