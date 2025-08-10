import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { crowdData, weatherData } from '../mock';

const IoTHub = () => {
  const [loading, setLoading] = useState(true);
  const [crowd, setCrowd] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Simulate fast API fetch
    setTimeout(() => {
      setCrowd(crowdData);
      setWeather(weatherData);
      setLoading(false);
    }, 500); // Fast loading
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 text-lg text-white">جاري تحميل بيانات الحساسات...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-white font-['Montserrat']">
          مركز البيانات الحية IoT
        </h1>
        <p className="text-center text-muted-foreground mb-12 text-lg font-['Open_Sans']">
          مراقبة مستويات الازدحام والطقس في الوقت الفعلي
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card border-white/10 animate-fade-in-up">
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <h2 className="text-2xl font-semibold text-white font-['Montserrat']">
                  مستوى الازدحام الحي
                </h2>
              </div>
              <div className="space-y-6">
                {Object.entries(crowd).map(([location, data]) => (
                  <div key={location} className="glass p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold text-white font-['Open_Sans']">{location}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        data.percentage > 70 ? 'bg-red-500/20 text-red-400' :
                        data.percentage > 40 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {data.percentage}%
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground text-sm">
                      <span>الحالة: {data.current}</span>
                      <span>أفضل وقت: {data.bestTime}</span>
                    </div>
                    <div className="mt-3 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          data.percentage > 70 ? 'bg-red-500' :
                          data.percentage > 40 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${data.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
                <h2 className="text-2xl font-semibold text-white font-['Montserrat']">
                  الطقس الحي
                </h2>
              </div>
              <div className="space-y-6">
                {Object.entries(weather).map(([city, data]) => (
                  <div key={city} className="glass p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold text-white font-['Open_Sans']">{city}</h3>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-white mr-2">{data.temp}°</span>
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-muted-foreground text-sm mb-2">
                      {data.description}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>الرطوبة: {data.humidity || '65%'}</span>
                      <span>الرياح: {data.windSpeed || '12 كم/س'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 pointer-events-none" />
      <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
    </div>
  );
};

export default IoTHub;
