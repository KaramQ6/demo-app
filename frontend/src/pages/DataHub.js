import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { MapPin, Thermometer, Cloud, Loader2 } from 'lucide-react';

const DataHub = () => {
  const { t, isRTL } = useLanguage();
  const { citiesData, isCitiesLoading } = useApp();

  if (isCitiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        {t({ ar: 'جاري تحميل بيانات المدن...', en: 'Loading cities data...' })}
      </div>
    );
  }

  if (!citiesData || citiesData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {t({ ar: 'لا توجد بيانات للمدن متاحة.', en: 'No cities data available.' })}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold font-['Montserrat'] text-white mb-12 text-center">
          {t({ ar: 'بيانات الطقس للمدن الرئيسية', en: 'Weather Data for Key Cities' })}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {citiesData.map((city, index) => (
            <Card key={index} className="glass-card h-full overflow-hidden border-white/10 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-bold font-['Montserrat'] text-white">
                      {city.cityName}
                    </h3>
                  </div>
                  {city.weather && city.weather.iconUrl && (
                    <img 
                      src={city.weather.iconUrl} 
                      alt={city.weather.description || 'Weather icon'}
                      className="w-10 h-10" 
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                      <Thermometer className="w-4 h-4" />
                      <span>{t({ ar: 'درجة الحرارة', en: 'Temperature' })}</span>
                    </div>
                    <span className="font-semibold">{city.temperature}°C</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                      <Cloud className="w-4 h-4" />
                      <span>{t({ ar: 'الحالة', en: 'Condition' })}</span>
                    </div>
                    <span className="font-semibold capitalize">
                      {t({ ar: city.weather?.description_ar || city.weather?.description, en: city.weather?.description })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataHub;