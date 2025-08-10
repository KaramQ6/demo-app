import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Spinner } from '../components/ui/spinner';
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
        <Spinner size="lg" />
        <span className="ml-4 text-lg">جاري تحميل بيانات الحساسات...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">لوحة بيانات الحساسات الحية</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">مستوى الازدحام الحي</h2>
            {Object.entries(crowd).map(([location, data]) => (
              <div key={location} className="mb-4">
                <div className="font-bold">{location}</div>
                <div>النسبة: {data.percentage}%</div>
                <div>أفضل وقت: {data.bestTime}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">الطقس الحي</h2>
            {Object.entries(weather).map(([city, data]) => (
              <div key={city} className="mb-4">
                <div className="font-bold">{city}</div>
                <div>درجة الحرارة: {data.temp}°C</div>
                <div>الوصف: {data.description}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IoTHub;
