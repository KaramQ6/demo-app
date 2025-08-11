import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { crowdData, weatherData } from '../mock';

const IoTHub = () => {
    const [loading, setLoading] = useState(true);
    const [crowd, setCrowd] = useState(null);
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        // Simulate API fetch with realistic delay
        setTimeout(() => {
            setCrowd(crowdData);
            setWeather(weatherData);
            setLoading(false);
        }, 1500);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen relative">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(https://jordantraveler.com/wp-content/uploads/2023/06/Facts-about-Jordan-Hero-1024x683.png)'
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                </div>
                
                {/* Loading Content */}
                <div className="relative z-10 flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-transparent mx-auto mb-4"></div>
                            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent animate-pulse mx-auto"></div>
                        </div>
                        <div className="text-white text-xl font-medium mb-2">Loading IoT Data</div>
                        <div className="text-purple-200 text-sm">Connecting to sensors...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(https://jordantraveler.com/wp-content/uploads/2023/06/Facts-about-Jordan-Hero-1024x683.png)'
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 py-12">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse shadow-lg shadow-green-400/50"></div>
                        <h1 className="text-4xl font-bold text-white drop-shadow-lg">Smart Tour - Live Data</h1>
                        <div className="w-3 h-3 bg-blue-400 rounded-full ml-3 animate-pulse shadow-lg shadow-blue-400/50"></div>
                    </div>
                    <p className="text-gray-200 text-lg max-w-2xl mx-auto drop-shadow-md">
                        Real-time monitoring of crowd levels and weather conditions across Jordan's top destinations
                    </p>
                    <div className="mt-4">
                        <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm border border-white/20">
                            🌐 smart-tour.app/data
                        </span>
                    </div>
                </div>

                {/* Crowd Level Section */}
                <div className="mb-12">
                    <div className="flex items-center mb-6">
                        <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-white">Live Crowd Monitoring</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(crowd).map(([location, data], index) => (
                            <Card key={location} className="group hover:scale-105 transition-all duration-300 bg-white/10 backdrop-blur-md border-white/20 hover:border-purple-400/50 shadow-xl"
                                style={{ animationDelay: `${index * 0.1}s` }}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-white text-lg group-hover:text-purple-200 transition-colors drop-shadow">
                                            {location}
                                        </h3>
                                        <div className={`w-3 h-3 rounded-full ${data.percentage > 70 ? 'bg-red-400 shadow-red-400/50' :
                                                data.percentage > 40 ? 'bg-yellow-400 shadow-yellow-400/50' :
                                                    'bg-green-400 shadow-green-400/50'
                                            } shadow-lg animate-pulse`}></div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-200 text-sm">Crowd Level</span>
                                            <span className={`font-bold ${data.percentage > 70 ? 'text-red-400' :
                                                    data.percentage > 40 ? 'text-yellow-400' :
                                                        'text-green-400'
                                                }`}>{data.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden backdrop-blur">
                                            <div className={`h-2 rounded-full transition-all duration-1000 ${data.percentage > 70 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                                                    data.percentage > 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                                                        'bg-gradient-to-r from-green-500 to-green-400'
                                                }`} style={{ width: `${data.percentage}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-200">
                                        <span>💡 Best time:</span>
                                        <span className="font-medium text-white">{data.bestTime}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Weather Section */}
                <div>
                    <div className="flex items-center mb-6">
                        <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full mr-4"></div>
                        <h2 className="text-2xl font-bold text-white">Weather Conditions</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(weather).map(([city, data], index) => (
                            <Card key={city} className="group hover:scale-105 transition-all duration-300 bg-white/10 backdrop-blur-md border-white/20 hover:border-blue-400/50 shadow-xl"
                                style={{ animationDelay: `${index * 0.1}s` }}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold text-white text-lg group-hover:text-blue-200 transition-colors drop-shadow">
                                            {city}
                                        </h3>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                                                <div className="w-4 h-4 bg-white rounded-full opacity-80"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex items-end justify-between mb-2">
                                            <span className="text-gray-200 text-sm">Temperature</span>
                                            <div className="flex items-end">
                                                <span className="text-3xl font-bold text-white drop-shadow">{data.temp}</span>
                                                <span className="text-gray-200 text-lg ml-1">°C</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-200">
                                        <span>🌤️ Condition:</span>
                                        <span className="font-medium text-white">{data.description}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                        <span className="text-gray-200 text-sm mr-4">Live data updated every 30 seconds</span>
                        <span className="text-white font-medium">🌐 smart-tour.app/data</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IoTHub;
