import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { MapPin, Thermometer, Activity, Zap } from 'lucide-react';

const DataHub = () => {
  const { t, isRTL } = useLanguage();
  const [iotData, setIotData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/iot-data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIotData(data);
      } catch (error) {
        console.error("Failed to fetch IoT data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {t({ ar: 'جاري تحميل البيانات...', en: 'Loading data...' })}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {t({ ar: 'خطأ في تحميل البيانات: ', en: 'Error loading data: ' })}{error.message}
      </div>
    );
  }

  if (!iotData || !Array.isArray(iotData) || iotData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {t({ ar: 'لا توجد بيانات IoT متاحة.', en: 'No IoT data available.' })}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold font-['Montserrat'] text-white mb-6">
            {t({ ar: 'مركز البيانات الحية', en: 'Live Data Hub' })}
          </h1>
          <p className="text-xl text-muted-foreground font-['Open_Sans'] max-w-2xl mx-auto">
            {t({ ar: 'راقب حالة الوجهات السياحية لحظة بلحظة لاتخاذ قرارات أذكى', en: 'Monitor the status of tourist destinations moment by moment to make smarter decisions' })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {iotData.map((data, index) => (
            <div
              key={data.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card className="glass-card h-full overflow-hidden border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <h3 className="text-xl font-bold font-['Montserrat'] text-white">
                        {t(data.name)}
                      </h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      data.status === 'Operational' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {t({ ar: data.status === 'Operational' ? 'فعّال' : 'متوقف', en: data.status })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Temperature */}
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                        <Thermometer className="w-4 h-4" />
                        <span>{t({ ar: 'درجة الحرارة', en: 'Temperature' })}</span>
                      </div>
                      <span className="font-semibold">{data.temperature}°C</span>
                    </div>
                    
                    {/* Crowd Level */}
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                        <Activity className="w-4 h-4" />
                        <span>{t({ ar: 'مستوى الازدحام', en: 'Crowd Level' })}</span>
                      </div>
                      <span className={`font-semibold ${
                        data.crowdLevel === 'low' ? 'text-green-400' :
                        data.crowdLevel === 'medium' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {t({
                          ar: data.crowdLevel === 'low' ? 'منخفض' : data.crowdLevel === 'medium' ? 'متوسط' : 'مرتفع',
                          en: data.crowdLevel
                        })}
                      </span>
                    </div>

                    {/* Power Consumption */}
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground">
                        <Zap className="w-4 h-4" />
                        <span>{t({ ar: 'استهلاك الطاقة', en: 'Power Usage' })}</span>
                      </div>
                      <span className="font-semibold">{data.powerUsage} kW</span>
                    </div>
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