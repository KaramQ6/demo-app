import React from 'react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Loader2, Cloud, Sun, CloudRain, Snowflake, Wind } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

// A simple helper component to render a weather icon based on the description
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
    const { citiesData, isCitiesLoading } = useApp(); // Consume the NEW context state

    if (isCitiesLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!citiesData || citiesData.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-red-500">
                    {t({ ar: 'فشل تحميل بيانات المدن. يرجى المحاولة مرة أخرى لاحقاً.', en: 'Failed to load city data. Please try again later.' })}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 px-6 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        {t({ ar: 'الطقس المباشر في أنحاء الأردن', en: 'Live Weather Across Jordan' })}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        {t({ ar: 'بيانات الطقس لحظة بلحظة لمساعدتك في التخطيط لرحلتك القادمة', en: 'Up-to-the-minute weather data to help you plan your next trip' })}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {citiesData.map((city, index) => (
                        // Defensive check: only render a card if the city object and its core data exist
                        city && city.cityName && city.weather ? (
                            <div
                                key={index}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <Card className="bg-white dark:bg-gray-800 h-full overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">{city.cityName}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col items-center justify-center space-y-4 pt-0">
                                        <div className="text-6xl font-bold text-purple-600 dark:text-purple-400">
                                            {Math.round(city.temperature)}°C
                                        </div>
                                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                            <WeatherIcon description={city.weather.description} />
                                            <p className="text-lg text-gray-500 dark:text-gray-300 capitalize">{city.weather.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : null // Silently ignore if a city's data is incomplete
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DataHub;