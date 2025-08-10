import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { crowdData, weatherData } from '../mock';

const IoTHub = () => {
    const [loading, setLoading] = useState(true);
    const [crowd, setCrowd] = useState(null);
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            setCrowd(crowdData);
            setWeather(weatherData);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-4 text-lg text-white">Loading...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-3xl font-bold mb-8 text-center text-white">IoT Hub - Live Data</h1>
            
            {/* Crowd Level Cards - Each location as separate card */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-white">Crowd Levels</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(crowd).map(([location, data]) => (
                        <Card key={location} className="glass-card">
                            <CardContent className="p-4">
                                <h3 className="font-bold text-white mb-2">{location}</h3>
                                <div className="text-sm text-gray-300">Level: {data.percentage}%</div>
                                <div className="text-sm text-gray-300">Best time: {data.bestTime}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Weather Cards - Each city as separate card */}
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-white">Weather Data</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(weather).map(([city, data]) => (
                        <Card key={city} className="glass-card">
                            <CardContent className="p-4">
                                <h3 className="font-bold text-white mb-2">{city}</h3>
                                <div className="text-sm text-gray-300">Temperature: {data.temp}°C</div>
                                <div className="text-sm text-gray-300">Condition: {data.description}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IoTHub;
