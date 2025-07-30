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
        <div className="min-h-screen py-20 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        {t({ ar: 'الطقس المباشر في أنحاء الأردن', en: 'Live Weather Across Jordan' })}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
                            <Card className="bg-white dark:bg-gray-800 h-full overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
                                        {/* Use optional chaining here as a fallback */}
                                        {city?.cityName || 'Unknown City'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center space-y-4 pt-0">
                                    <div className="text-6xl font-bold text-purple-600 dark:text-purple-400">
                                        {/* Use optional chaining and provide a default value */}
                                        {Math.round(city?.temperature || 0)}°C
                                    </div>
                                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                        {/* THE FIX IS HERE: Using '?.' to prevent the crash */}
                                        <WeatherIcon description={city.weather?.description} />
                                        <p className="text-lg text-gray-500 dark:text-gray-300 capitalize">
                                            {/* AND HERE */}
                                            {city.weather?.description || 'No data'}
                                        </p>
                                    </div>
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