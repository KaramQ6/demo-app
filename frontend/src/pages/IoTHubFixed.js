import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Activity, Car, Cloud, Sun, CloudRain, Wifi, MapPin, Users, Clock, Thermometer } from 'lucide-react';
import { destinations } from '../mock';
import IoTCardSkeleton from '../components/IoTCardSkeleton';

const IoTHub = () => {
    const { t } = useLanguage();
    const { iotData, updateIotData } = useApp();
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [loading, setLoading] = useState(true);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: {
            opacity: 1, y: 0, scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        },
        hover: {
            y: -5,
            scale: 1.02,
            transition: { duration: 0.2, ease: "easeInOut" }
        }
    };

    // Simulate initial loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Simulate real-time updates every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setLastUpdate(new Date());

            // Update IoT data for all destinations with slight variations
            destinations.forEach(destination => {
                const currentData = iotData[destination.id] || generateInitialIoTData(destination.id);
                const newData = {
                    ...currentData,
                    crowdLevel: Math.max(10, Math.min(95, currentData.crowdLevel + (Math.random() - 0.5) * 10)),
                    parkingAvailable: Math.max(5, Math.min(95, currentData.parkingAvailable + (Math.random() - 0.5) * 8)),
                    temperature: Math.max(15, Math.min(40, currentData.temperature + (Math.random() - 0.5) * 2)),
                    airQuality: Math.max(50, Math.min(100, currentData.airQuality + (Math.random() - 0.5) * 5)),
                    visitors: Math.max(20, Math.min(500, currentData.visitors + Math.floor((Math.random() - 0.5) * 20)))
                };
                updateIotData(destination.id, newData);
            });
        }, 30000);

        return () => clearInterval(interval);
    }, [iotData, updateIotData]);

    // Initialize IoT data for destinations that don't have it
    useEffect(() => {
        destinations.forEach(destination => {
            if (!iotData[destination.id]) {
                updateIotData(destination.id, generateInitialIoTData(destination.id));
            }
        });
    }, [iotData, updateIotData]);

    const pageTitle = {
        ar: 'مركز البيانات الحية: قراراتك أصبحت أذكى',
        en: 'Live Data Hub: Your Decisions Just Got Smarter'
    };

    const pageDescription = {
        ar: 'اتخذ قرارات ذكية بناءً على البيانات الحية من أجهزة الاستشعار المنتشرة في جميع أنحاء الأردن',
        en: 'Make smart decisions based on live data from sensors deployed across Jordan'
    };

    // Generate initial IoT data for a destination
    const generateInitialIoTData = (destinationId) => {
        const crowdLevels = [25, 45, 65, 85, 30, 55];
        const parkingLevels = [80, 60, 45, 25, 75, 90];
        const weatherIcons = ['Sun', 'Cloud', 'CloudRain'];

        const index = destinations.findIndex(d => d.id === destinationId);
        const baseIndex = index >= 0 ? index : 0;

        return {
            crowdLevel: crowdLevels[baseIndex % crowdLevels.length] + Math.floor(Math.random() * 10),
            parkingAvailable: parkingLevels[baseIndex % parkingLevels.length] + Math.floor(Math.random() * 10),
            weatherIcon: weatherIcons[baseIndex % weatherIcons.length],
            temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
            airQuality: Math.floor(Math.random() * 40) + 60, // 60-100 AQI
            visitors: Math.floor(Math.random() * 200) + 50, // 50-250 visitors
            lastUpdated: new Date().toISOString()
        };
    };

    const CircularProgress = ({ percentage, size = 80, strokeWidth = 8 }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

        let colorClass = 'progress-low';
        if (percentage > 70) colorClass = 'progress-high';
        else if (percentage > 40) colorClass = 'progress-medium';

        return (
            <div className="circular-progress" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        className="circular-progress-background"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        className={`circular-progress-fill ${colorClass}`}
                        strokeDasharray={strokeDasharray}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{Math.round(percentage)}%</span>
                </div>
            </div>
        );
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen py-16 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Montserrat']">
                        {t(pageTitle)}
                    </h1>
                    <div className="w-24 h-1 gradient-purple mx-auto rounded-full mb-8"></div>
                    <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-['Open_Sans'] mb-12">
                        {t(pageDescription)}
                    </p>

                    {/* Live Status Indicator */}
                    <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse glass-card p-6 max-w-lg mx-auto rounded-2xl">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-glow"></div>
                            <Wifi className="w-6 h-6 text-green-500" />
                            <span className="text-lg font-medium text-white font-['Open_Sans']">
                                {t({ ar: 'متصل مباشرة', en: 'Live Connected' })}
                            </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {formatTime(lastUpdate)}
                        </div>
                    </div>
                </motion.div>

                {/* Live Dashboard Grid */}
                {loading ? (
                    // Skeleton Loading State
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {Array.from({ length: 6 }, (_, index) => (
                            <IoTCardSkeleton key={`skeleton-${index}`} />
                        ))}
                    </motion.div>
                ) : (
                    // Actual Content with Animations
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {destinations.map((destination, index) => {
                            const data = iotData[destination.id] || generateInitialIoTData(destination.id);
                            const { crowdLevel, parkingAvailable, weatherIcon, temperature, airQuality, visitors } = data;

                            // Get the appropriate weather icon component
                            const getWeatherIcon = (iconName) => {
                                switch (iconName) {
                                    case 'Sun': return Sun;
                                    case 'Cloud': return Cloud;
                                    case 'CloudRain': return CloudRain;
                                    default: return Sun;
                                }
                            };

                            const WeatherIconComponent = getWeatherIcon(weatherIcon);

                            return (
                                <motion.div
                                    key={destination.id}
                                    variants={cardVariants}
                                    whileHover="hover"
                                >
                                    <Card className="glass-card interactive-card border-white/10 overflow-hidden">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center justify-between text-white font-['Montserrat']">
                                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                    <MapPin className="w-6 h-6 text-primary" />
                                                    <span className="text-xl">{t(destination.name)}</span>
                                                </div>
                                                <Badge className="bg-primary/20 text-primary border-primary/30">
                                                    <Activity className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                                                    {t({ ar: 'مباشر', en: 'Live' })}
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="space-y-6">
                                            {/* Congestion Gauge */}
                                            <div className="flex items-center justify-between">
                                                <div className="text-center">
                                                    <CircularProgress percentage={crowdLevel} />
                                                    <p className="text-xs text-muted-foreground mt-3 font-['Open_Sans']">
                                                        {t({ ar: 'مستوى الازدحام', en: 'Congestion Level' })}
                                                    </p>
                                                </div>

                                                <div className="space-y-4 flex-1 ml-8 rtl:ml-0 rtl:mr-8">
                                                    {/* Parking Availability */}
                                                    <div className="flex items-center justify-between glass p-4 rounded-lg">
                                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                            <Car className="w-5 h-5 text-primary" />
                                                            <span className="text-sm text-muted-foreground font-['Open_Sans']">
                                                                {t({ ar: 'مواقف السيارات', en: 'Parking' })}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-semibold text-white">
                                                            {Math.round(parkingAvailable)}% {t({ ar: 'متاح', en: 'Available' })}
                                                        </span>
                                                    </div>

                                                    {/* Weather */}
                                                    <div className="flex items-center justify-between glass p-4 rounded-lg">
                                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                            <WeatherIconComponent className="w-5 h-5 text-primary" />
                                                            <span className="text-sm text-muted-foreground font-['Open_Sans']">
                                                                {t({ ar: 'الطقس', en: 'Weather' })}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-semibold text-white">{Math.round(temperature)}°C</span>
                                                    </div>

                                                    {/* Air Quality */}
                                                    <div className="flex items-center justify-between glass p-4 rounded-lg">
                                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                            <Cloud className="w-5 h-5 text-primary" />
                                                            <span className="text-sm text-muted-foreground font-['Open_Sans']">
                                                                {t({ ar: 'جودة الهواء', en: 'Air Quality' })}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-semibold text-white">{Math.round(airQuality)} AQI</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Visitors Count */}
                                            <div className="flex items-center justify-between glass p-4 rounded-lg">
                                                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                                    <Users className="w-5 h-5 text-primary" />
                                                    <span className="text-sm text-muted-foreground font-['Open_Sans']">
                                                        {t({ ar: 'الزوار الحاليون', en: 'Current Visitors' })}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-semibold text-white">
                                                    {Math.round(visitors)}
                                                </span>
                                            </div>

                                            {/* Last Update */}
                                            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse pt-4 border-t border-white/10">
                                                <Clock className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground font-['Open_Sans']">
                                                    {t({ ar: 'آخر تحديث: الآن', en: 'Last updated: Now' })}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* Smart Features Section */}
                <div className="mt-16">
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <h2 className="text-3xl font-bold text-white mb-4 font-['Montserrat']">
                            {t({ ar: 'الميزات الذكية', en: 'Smart Features' })}
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-['Open_Sans']">
                            {t({
                                ar: 'استكشف أدواتنا المتقدمة لتحسين تجربة سفركم',
                                en: 'Explore our advanced smart tools to enhance your travel experience'
                            })}
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Weather Station */}
                        <motion.div variants={cardVariants}>
                            <Link to="/weather" className="block group">
                                <Card className="glass-card border-white/10 h-full hover:scale-105 transition-all duration-300 cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Sun className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2 font-['Montserrat']">
                                            {t({ ar: 'محطة الطقس', en: 'Weather Station' })}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-['Open_Sans']">
                                            {t({
                                                ar: 'تنبؤات دقيقة ومحدثة للطقس في جميع المواقع السياحية',
                                                en: 'Accurate real-time weather forecasts for all tourist locations'
                                            })}
                                        </p>
                                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mt-3">
                                            {t({ ar: 'مباشر', en: 'Live' })}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>

                        {/* Crowd Prediction */}
                        <motion.div variants={cardVariants}>
                            <Link to="/crowd-prediction" className="block group">
                                <Card className="glass-card border-white/10 h-full hover:scale-105 transition-all duration-300 cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Users className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2 font-['Montserrat']">
                                            {t({ ar: 'توقع الازدحام', en: 'Crowd Prediction' })}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-['Open_Sans']">
                                            {t({
                                                ar: 'تنبؤات ذكية بمستويات الازدحام لتخطيط زيارتكم الأمثل',
                                                en: 'Smart crowd level predictions for optimal visit planning'
                                            })}
                                        </p>
                                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mt-3">
                                            {t({ ar: 'ذكي', en: 'AI' })}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>

                        {/* Smart Recommendations */}
                        <motion.div variants={cardVariants}>
                            <Link to="/smart-recommendations" className="block group">
                                <Card className="glass-card border-white/10 h-full hover:scale-105 transition-all duration-300 cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Activity className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2 font-['Montserrat']">
                                            {t({ ar: 'التوصيات الذكية', en: 'Smart Recommendations' })}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-['Open_Sans']">
                                            {t({
                                                ar: 'اقتراحات مخصصة بناءً على تفضيلاتكم وسلوككم',
                                                en: 'Personalized suggestions based on your preferences and behavior'
                                            })}
                                        </p>
                                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mt-3">
                                            {t({ ar: 'مخصص', en: 'Personal' })}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>

                        {/* Voice Assistant */}
                        <motion.div variants={cardVariants}>
                            <Link to="/voice-assistant" className="block group">
                                <Card className="glass-card border-white/10 h-full hover:scale-105 transition-all duration-300 cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Wifi className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2 font-['Montserrat']">
                                            {t({ ar: 'المساعد الصوتي', en: 'Voice Assistant' })}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-['Open_Sans']">
                                            {t({
                                                ar: 'تفاعل صوتي ذكي للحصول على إجابات فورية ومساعدة شخصية',
                                                en: 'Smart voice interaction for instant answers and personal assistance'
                                            })}
                                        </p>
                                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 mt-3">
                                            {t({ ar: 'صوتي', en: 'Voice' })}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Statistics Summary */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                >
                    <Card className="glass-card border-white/10 text-center">
                        <CardContent className="p-8">
                            <Activity className="w-10 h-10 text-primary mx-auto mb-4" />
                            <div className="text-3xl font-bold text-white font-['Montserrat'] mb-2">150+</div>
                            <div className="text-sm text-muted-foreground font-['Open_Sans']">
                                {t({ ar: 'أجهزة استشعار', en: 'IoT Sensors' })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/10 text-center">
                        <CardContent className="p-8">
                            <Wifi className="w-10 h-10 text-primary mx-auto mb-4" />
                            <div className="text-3xl font-bold text-white font-['Montserrat'] mb-2">99.9%</div>
                            <div className="text-sm text-muted-foreground font-['Open_Sans']">
                                {t({ ar: 'وقت التشغيل', en: 'Uptime' })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/10 text-center">
                        <CardContent className="p-8">
                            <Users className="w-10 h-10 text-primary mx-auto mb-4" />
                            <div className="text-3xl font-bold text-white font-['Montserrat'] mb-2">
                                {Object.values(iotData).reduce((sum, data) => sum + (data.visitors || 0), 0) || 1250}
                            </div>
                            <div className="text-sm text-muted-foreground font-['Open_Sans']">
                                {t({ ar: 'زائر اليوم', en: 'Today\'s Visitors' })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-white/10 text-center">
                        <CardContent className="p-8">
                            <MapPin className="w-10 h-10 text-primary mx-auto mb-4" />
                            <div className="text-3xl font-bold text-white font-['Montserrat'] mb-2">{destinations.length}</div>
                            <div className="text-sm text-muted-foreground font-['Open_Sans']">
                                {t({ ar: 'مواقع مراقبة', en: 'Monitored Sites' })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default IoTHub;
