import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Loader2, Cloud, Sun, CloudRain, Snowflake, Wind, Droplets } from 'lucide-react'; // 1. أضفنا أيقونة Droplets
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const WeatherIcon = ({ iconCode }) => {
    // ... (لا تغيير هنا)
};

const DataHub = () => {
    const { t } = useLanguage();
    const { citiesData, isCitiesLoading } = useApp();

    if (isCitiesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            </div>
        );
    }
    
    // ... (لا تغيير هنا)

    return (
        <div className="relative min-h-screen pt-20">
            <div className="absolute inset-0 w-full h-full">
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/60 to-black/80 z-10"></div>
                 <img src="https://images.unsplash.com/photo-1574082512734-8336f25bb9d8" alt="Background" className="w-full h-full object-cover" />
            </div>
            
            <div className="relative z-20 container mx-auto p-4 md:p-8">
                 <div className="text-center mb-16 animate-fade-in-up">
                     <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                         {t({ ar: 'الطقس المباشر في أنحاء الأردن', en: 'Live Weather Across Jordan' })}
                     </h1>
                 </div>

                {/* ... (لا تغيير هنا) */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {citiesData.map((city, index) => (
                        <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <Card className="glass-card h-full overflow-hidden border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold text-white">{city?.cityName || 'Unknown City'}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center space-y-4 pt-0">
                                    <div className="text-6xl font-bold text-purple-400">
                                        {Math.round(city?.temperature || 0)}°C
                                    </div>
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse text-gray-300">
                                        <WeatherIcon iconCode={city.weather?.icon} />
                                        <p className="text-lg capitalize">{city.weather?.description || 'No data'}</p>
                                    </div>
                                    
                                    {/* 2. هذا هو الكود الجديد لعرض الرطوبة */}
                                    {city.humidity && (
                                        <div className="flex items-center space-x-2 rtl:space-x-reverse text-gray-400 pt-2">
                                            <Droplets className="w-5 h-5" />
                                            <p className="text-md">{t({ ar: 'الرطوبة:', en: 'Humidity:' })} {city.humidity}%</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DataHub;