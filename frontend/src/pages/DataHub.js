import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Loader2, Cloud, Sun, CloudRain, Snowflake, Wind, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

// Fallback data in case the live fetch fails
const fallbackCitiesData = [
  { cityName: 'Amman', temperature: 28, weather: { description: 'Sunny' } },
  { cityName: 'Petra', temperature: 32, weather: { description: 'Clear' } },
  { cityName: 'Aqaba', temperature: 35, weather: { description: 'Hot' } },
];

const WeatherIcon = ({ description }) => {
    if (!description) return <Cloud className="w-8 h-8 text-gray-400" />;
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (desc.includes('snow')) return <Snowflake className="w-8 h-8 text-blue-200" />;
    if (desc.includes('sun') || desc.includes('clear')) return <Sun className="w-8 h-8 text-yellow-400" />;
    if (desc.includes('wind')) return <Wind className="w-8 h-8 text-gray-400" />;
    return <Cloud className="w-8 h-8 text-gray-400" />;
};

const DataHub = () => {
    const { t } = useLanguage();
    const { citiesData, isCitiesLoading } = useApp();

    if (isCitiesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            </div>
        );
    }

    const hasFailed = !citiesData || citiesData.length === 0;
    const dataToDisplay = hasFailed ? fallbackCitiesData : citiesData;

    return (
        // This is the corrected structure with a parent div and background
        <div className="relative min-h-screen pt-20">
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/60 to-black/80 z-10"></div>
                <img src="https://images.unsplash.com/photo-1574082512734-8336f25bb9d8" alt="Background" className="w-full h-full object-cover" />
            </div>
            
            {/* All page content goes inside this relative container */}
            <div className="relative z-20 container mx-auto p-4 md:p-8">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {t({ ar: 'الطقس المباشر في أنحاء الأردن', en: 'Live Weather Across Jordan' })}
                    </h1>
                    <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                        {t({ ar: 'بيانات الطقس لحظة بلحظة لمساعدتك في التخطيط لرحلتك', en: 'Up-to-the-minute weather data for your trip planning' })}
                    </p>
                </div>

                {hasFailed && (
                    <div className="mb-8 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-500/50 rounded-lg flex items-center justify-center space-x-3 rtl:space-x-reverse animate-fade-in">
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        <p className="text-red-800 dark:text-red-300 font-medium">
                            {t({ ar: 'فشل تحميل البيانات الحية. يتم عرض بيانات مؤقتة.', en: 'Failed to load live data. Displaying cached information.' })}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dataToDisplay.map((city, index) => (
                        <div
                            key={index}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <Card className="glass-card h-full overflow-hidden border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold text-white">
                                        {city?.cityName || 'Unknown City'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center space-y-4 pt-0">
                                    <div className="text-6xl font-bold text-purple-400">
                                        {Math.round(city?.temperature || 0)}°C
                                    </div>
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        <WeatherIcon description={city.weather?.description} />
                                        <p className="text-lg text-gray-300 capitalize">
                                            {city.weather?.description || 'No data'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div> {/* This div closes the "relative z-20 container" */}
        </div> // This div closes the main "relative min-h-screen"
    );
};

export default DataHub;