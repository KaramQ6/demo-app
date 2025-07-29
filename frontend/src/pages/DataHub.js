import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Activity, 
  Users, 
  Car, 
  Thermometer, 
  Cloud, 
  CloudRain, 
  Sun,
  Zap,
  Wifi,
  Database,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { destinations, iotSensorData } from '../mock';

const DataHub = () => {
  const { t, language } = useLanguage();
  const { iotData, setIotData, openChatbot } = useApp();
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [feedbackGiven, setFeedbackGiven] = useState({});

  // Initialize IoT data if not present
  useEffect(() => {
    if (Object.keys(iotData).length === 0) {
      setIotData(iotSensorData);
    }
  }, [iotData, setIotData]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIotData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (updated[key]) {
            // Simulate small fluctuations in crowd level
            const fluctuation = (Math.random() - 0.5) * 10;
            updated[key] = {
              ...updated[key],
              crowdLevel: Math.max(0, Math.min(100, updated[key].crowdLevel + fluctuation)),
              lastUpdated: new Date()
            };
          }
        });
        return updated;
      });
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [setIotData]);

  const handleFeedbackClick = (destinationId) => {
    setFeedbackGiven(prev => ({ ...prev, [destinationId]: true }));
    
    // Simulate animated confirmation
    setTimeout(() => {
      setFeedbackGiven(prev => ({ ...prev, [destinationId]: false }));
    }, 3000);
    
    openChatbot(t({
      ar: `شكراً لك! هل تريد المزيد من المعلومات حول الوضع الحالي في المواقع السياحية؟`,
      en: `Thank you! Would you like more information about the current situation at tourist sites?`
    }));
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
      case 'clear':
        return Sun;
      case 'partly-cloudy':
      case 'cloudy':
        return Cloud;
      case 'rainy':
        return CloudRain;
      default:
        return Sun;
    }
  };

  const getCrowdColor = (level) => {
    if (level < 30) return { color: 'text-green-400', bg: 'bg-green-500/20', stroke: '#10b981' };
    if (level < 70) return { color: 'text-yellow-400', bg: 'bg-yellow-500/20', stroke: '#f59e0b' };
    return { color: 'text-red-400', bg: 'bg-red-500/20', stroke: '#ef4444' };
  };

  const CircularProgress = ({ value, max = 100, size = 80, strokeWidth = 8, color = '#8A2BE2' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / max) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">{Math.round(value)}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center space-x-3 rtl:space-x-reverse mb-6">
            <div className="w-12 h-12 gradient-purple rounded-full flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-['Montserrat'] text-white">
              {t({ ar: 'مركز البيانات الحية', en: 'Live Data Hub' })}
            </h1>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-xl text-muted-foreground font-['Open_Sans'] max-w-3xl mx-auto">
            {t({ 
              ar: 'قراءات مباشرة من أجهزة الاستشعار IoT في المواقع السياحية الأردنية لمساعدتك في اتخاذ قرارات ذكية',
              en: 'Live readings from IoT sensors at Jordanian tourist sites to help you make smart decisions'
            })}
          </p>
          
          {/* Status Indicators */}
          <div className="flex items-center justify-center space-x-6 rtl:space-x-reverse mt-8">
            <div className="flex items-center space-x-2 rtl:space-x-reverse glass px-4 py-2 rounded-full">
              <Wifi className="w-4 h-4 text-green-400" />
              <span className="text-sm font-['Open_Sans'] text-green-400">
                {t({ ar: 'متصل مباشرة', en: 'Live Connected' })}
              </span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse glass px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-['Open_Sans'] text-blue-400">
                {t({ ar: 'آخر تحديث', en: 'Last Updated' })}: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Live Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {destinations.map((destination, index) => {
            const data = iotData[destination.id] || iotSensorData[destination.id];
            if (!data) return null;

            const { crowdLevel, parkingAvailable, temperature, weatherCondition } = data;
            const crowdInfo = getCrowdColor(crowdLevel);
            const WeatherIcon = getWeatherIcon(weatherCondition);
            
            return (
              <Card 
                key={destination.id} 
                className="glass-card interactive-card border-white/10 animate-scale-in overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  {/* Destination Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold font-['Montserrat'] text-white mb-1">
                        {t(destination.name)}
                      </h3>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400 font-['Open_Sans']">
                          {t({ ar: 'مباشر', en: 'LIVE' })}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="glass">
                      IoT
                    </Badge>
                  </div>

                  {/* Crowd Level Gauge */}
                  <div className="text-center mb-6">
                    <div className="mb-3">
                      <CircularProgress 
                        value={crowdLevel} 
                        color={crowdInfo.stroke}
                        size={100}
                        strokeWidth={8}
                      />
                    </div>
                    <h4 className="text-lg font-semibold font-['Montserrat'] text-white mb-1">
                      {t({ ar: 'مستوى الازدحام', en: 'Crowd Level' })}
                    </h4>
                    <span className={`text-sm font-semibold ${crowdInfo.color}`}>
                      {crowdLevel < 30 ? t({ ar: 'هادئ', en: 'Quiet' }) :
                       crowdLevel < 70 ? t({ ar: 'متوسط', en: 'Moderate' }) :
                       t({ ar: 'مزدحم', en: 'Busy' })}
                    </span>
                  </div>

                  {/* Data Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Parking */}
                    <div className="glass p-3 rounded-lg text-center">
                      <Car className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-white">{parkingAvailable}%</div>
                      <div className="text-xs text-muted-foreground font-['Open_Sans']">
                        {t({ ar: 'مواقف متاحة', en: 'Parking' })}
                      </div>
                    </div>

                    {/* Weather */}
                    <div className="glass p-3 rounded-lg text-center">
                      <WeatherIcon className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                      <div className="text-lg font-bold text-white">{temperature}°C</div>
                      <div className="text-xs text-muted-foreground font-['Open_Sans']">
                        {t({ ar: 'الطقس', en: 'Weather' })}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleFeedbackClick(destination.id)}
                    className={`w-full transition-all duration-300 font-['Open_Sans'] ${
                      feedbackGiven[destination.id]
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'gradient-purple hover:opacity-90'
                    }`}
                    disabled={feedbackGiven[destination.id]}
                  >
                    {feedbackGiven[destination.id] ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {t({ ar: 'شكراً لمساهمتك!', en: 'Thanks for contributing!' })}
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {t({ ar: 'تقرير حالة', en: 'Report Status' })}
                      </>
                    )}
                  </Button>

                  {/* Last Updated */}
                  <div className="mt-4 text-center">
                    <span className="text-xs text-muted-foreground font-['Open_Sans']">
                      {t({ ar: 'آخر تحديث', en: 'Updated' })}: {data.lastUpdated.toLocaleTimeString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <Activity className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold font-['Montserrat'] text-white mb-2">24/7</div>
              <div className="text-muted-foreground font-['Open_Sans']">
                {t({ ar: 'مراقبة مستمرة', en: 'Continuous Monitoring' })}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <div className="text-3xl font-bold font-['Montserrat'] text-white mb-2">50+</div>
              <div className="text-muted-foreground font-['Open_Sans']">
                {t({ ar: 'نقطة استشعار', en: 'Sensor Points' })}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6 text-center">
              <Database className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <div className="text-3xl font-bold font-['Montserrat'] text-white mb-2">Real-time</div>
              <div className="text-muted-foreground font-['Open_Sans']">
                {t({ ar: 'بيانات فورية', en: 'Live Data' })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <div className="glass-card rounded-3xl p-12 shadow-2xl max-w-3xl mx-auto border border-primary/20">
            <div className="mb-8">
              <h2 className="text-3xl font-bold font-['Montserrat'] text-white mb-4">
                {t({ ar: 'تحتاج تحليل أعمق للبيانات؟', en: 'Need Deeper Data Analysis?' })}
              </h2>
              <p className="text-muted-foreground font-['Open_Sans'] text-lg">
                {t({ 
                  ar: 'دع جواد يحلل البيانات الحية ويقدم لك التوصيات المناسبة لرحلتك',
                  en: 'Let Jawad analyze the live data and provide you with appropriate recommendations for your trip'
                })}
              </p>
            </div>
            <Button
              onClick={() => openChatbot(t({ 
                ar: 'حلل لي البيانات الحية وأخبرني عن أفضل الأوقات لزيارة المواقع السياحية',
                en: 'Analyze the live data for me and tell me about the best times to visit tourist sites'
              }))}
              size="lg"
              className="gradient-purple text-white px-8 py-4 text-lg font-semibold font-['Open_Sans'] hover:scale-105 transition-all duration-300 interactive-button shadow-2xl"
            >
              <Database className="w-5 h-5 mr-2" />
              {t({ ar: 'تحليل ذكي للبيانات', en: 'Smart Data Analysis' })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataHub;