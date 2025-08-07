import React, { useState, useEffect } from 'react';

const CrowdPredictionPage = () => {
    const [selectedDestination, setSelectedDestination] = useState('petra');
    const [timeRange, setTimeRange] = useState('week');
    const [crowdData, setCrowdData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Destinations with crowd prediction data
    const destinations = [
        {
            id: 'petra',
            name: 'Petra Archaeological Park',
            icon: '🏛️',
            color: '#e74c3c'
        },
        {
            id: 'wadi-rum',
            name: 'Wadi Rum Desert',
            icon: '🏜️',
            color: '#f39c12'
        },
        {
            id: 'dead-sea',
            name: 'Dead Sea',
            icon: '🌊',
            color: '#3498db'
        },
        {
            id: 'jerash',
            name: 'Jerash Roman Ruins',
            icon: '🏺',
            color: '#9b59b6'
        },
        {
            id: 'aqaba',
            name: 'Aqaba Red Sea',
            icon: '🏖️',
            color: '#1abc9c'
        }
    ];

    // Generate mock crowd prediction data
    const generateCrowdData = (destination, range) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];

        if (range === 'week') {
            return days.map(day => {
                // Simulate higher crowds on weekends for most destinations
                const isWeekend = day === 'Sat' || day === 'Sun';
                const baseCrowd = destination === 'petra' ? 75 :
                    destination === 'dead-sea' ? 60 :
                        destination === 'wadi-rum' ? 45 : 55;

                const crowdLevel = isWeekend ?
                    Math.min(100, baseCrowd + Math.random() * 20 + 10) :
                    baseCrowd + Math.random() * 15 - 7.5;

                return {
                    day,
                    crowd: Math.round(crowdLevel),
                    visitors: Math.round(crowdLevel * 12), // Approximate daily visitors
                    recommendation: crowdLevel < 40 ? 'Perfect' :
                        crowdLevel < 70 ? 'Good' :
                            crowdLevel < 85 ? 'Busy' : 'Very Busy'
                };
            });
        }

        if (range === 'day') {
            return hours.map(hour => {
                // Simulate typical daily patterns
                const hourNum = parseInt(hour.split(':')[0]);
                let baseCrowd;

                if (hourNum < 10) baseCrowd = 30; // Early morning
                else if (hourNum < 12) baseCrowd = 70; // Late morning peak
                else if (hourNum < 14) baseCrowd = 85; // Noon peak
                else if (hourNum < 16) baseCrowd = 75; // Afternoon
                else baseCrowd = 50; // Evening

                const crowdLevel = baseCrowd + Math.random() * 15 - 7.5;

                return {
                    hour,
                    crowd: Math.round(Math.max(0, crowdLevel)),
                    visitors: Math.round(crowdLevel * 3),
                    recommendation: crowdLevel < 40 ? 'Perfect' :
                        crowdLevel < 70 ? 'Good' :
                            crowdLevel < 85 ? 'Busy' : 'Very Busy'
                };
            });
        }

        return [];
    };

    // Load crowd data
    const loadCrowdData = async () => {
        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const data = generateCrowdData(selectedDestination, timeRange);
        setCrowdData(data);
        setIsLoading(false);
    };

    // Load data when destination or time range changes
    useEffect(() => {
        loadCrowdData();
    }, [selectedDestination, timeRange]);

    // Simple Bar Chart Component (instead of recharts for now)
    const SimpleBarChart = ({ data, colorScheme }) => {
        if (!data || data.length === 0) return null;

        const maxValue = Math.max(...data.map(item => item.crowd));

        return (
            <div className="space-y-3">
                {data.map((item, index) => {
                    const percentage = (item.crowd / maxValue) * 100;
                    const label = item.day || item.hour;

                    return (
                        <div key={index} className="flex items-center space-x-3">
                            <div className="w-12 text-sm font-medium text-gray-600">
                                {label}
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                                    style={{
                                        width: `${Math.max(percentage, 5)}%`,
                                        backgroundColor: colorScheme
                                    }}
                                >
                                    <span className="text-xs font-medium text-white">
                                        {item.crowd}%
                                    </span>
                                </div>
                            </div>
                            <div className="w-16 text-sm text-gray-600">
                                {item.visitors} people
                            </div>
                            <div className={`w-16 text-xs font-medium px-2 py-1 rounded-full text-center ${item.recommendation === 'Perfect' ? 'bg-green-100 text-green-700' :
                                    item.recommendation === 'Good' ? 'bg-blue-100 text-blue-700' :
                                        item.recommendation === 'Busy' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                }`}>
                                {item.recommendation}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const selectedDestInfo = destinations.find(d => d.id === selectedDestination);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                🔮 Crowd Prediction Dashboard
                            </h1>
                            <p className="text-gray-600">
                                AI-powered crowd forecasting to help you plan the perfect visit
                            </p>
                        </div>
                        <div className="text-6xl">📊</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Destination Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Select Destination
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {destinations.map(destination => (
                                    <label
                                        key={destination.id}
                                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedDestination === destination.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="destination"
                                            value={destination.id}
                                            checked={selectedDestination === destination.id}
                                            onChange={(e) => setSelectedDestination(e.target.value)}
                                            className="sr-only"
                                        />
                                        <span className="text-2xl mr-3">{destination.icon}</span>
                                        <span className="font-medium">{destination.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Time Range Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Time Range
                            </label>
                            <div className="space-y-2">
                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${timeRange === 'week'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="timeRange"
                                        value="week"
                                        checked={timeRange === 'week'}
                                        onChange={(e) => setTimeRange(e.target.value)}
                                        className="sr-only"
                                    />
                                    <span className="text-2xl mr-3">📅</span>
                                    <div>
                                        <div className="font-medium">7-Day Forecast</div>
                                        <div className="text-sm text-gray-600">Weekly crowd patterns</div>
                                    </div>
                                </label>

                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${timeRange === 'day'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="timeRange"
                                        value="day"
                                        checked={timeRange === 'day'}
                                        onChange={(e) => setTimeRange(e.target.value)}
                                        className="sr-only"
                                    />
                                    <span className="text-2xl mr-3">🕐</span>
                                    <div>
                                        <div className="font-medium">Today's Hours</div>
                                        <div className="text-sm text-gray-600">Hourly crowd levels</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Crowd Chart */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {selectedDestInfo?.icon} {selectedDestInfo?.name}
                            </h2>
                            <p className="text-gray-600">
                                {timeRange === 'week' ? '7-day crowd forecast' : 'Today\'s hourly predictions'}
                            </p>
                        </div>
                        <button
                            onClick={loadCrowdData}
                            disabled={isLoading}
                            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Updating...' : 'Refresh Data'}
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Analyzing crowd patterns...</p>
                            </div>
                        </div>
                    ) : (
                        <SimpleBarChart
                            data={crowdData}
                            colorScheme={selectedDestInfo?.color || '#3498db'}
                        />
                    )}
                </div>

                {/* Insights and Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Best Times */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            ⭐ Best Times to Visit
                        </h3>
                        {crowdData && (
                            <div className="space-y-3">
                                {crowdData
                                    .filter(item => item.recommendation === 'Perfect' || item.recommendation === 'Good')
                                    .slice(0, 3)
                                    .map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                            <div>
                                                <div className="font-medium text-green-800">
                                                    {item.day || item.hour}
                                                </div>
                                                <div className="text-sm text-green-600">
                                                    {item.crowd}% capacity • {item.visitors} expected visitors
                                                </div>
                                            </div>
                                            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                {item.recommendation}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                    </div>

                    {/* Crowd Patterns */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            📈 Crowd Insights
                        </h3>
                        {crowdData && (
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <div className="font-medium text-blue-800 mb-1">Peak Times</div>
                                    <div className="text-sm text-blue-600">
                                        Highest crowds expected: {
                                            crowdData.reduce((max, item) =>
                                                item.crowd > max.crowd ? item : max
                                            ).day || crowdData.reduce((max, item) =>
                                                item.crowd > max.crowd ? item : max
                                            ).hour
                                        } ({Math.max(...crowdData.map(item => item.crowd))}% capacity)
                                    </div>
                                </div>

                                <div className="bg-green-50 p-3 rounded-lg">
                                    <div className="font-medium text-green-800 mb-1">Quietest Times</div>
                                    <div className="text-sm text-green-600">
                                        Lowest crowds expected: {
                                            crowdData.reduce((min, item) =>
                                                item.crowd < min.crowd ? item : min
                                            ).day || crowdData.reduce((min, item) =>
                                                item.crowd < min.crowd ? item : min
                                            ).hour
                                        } ({Math.min(...crowdData.map(item => item.crowd))}% capacity)
                                    </div>
                                </div>

                                <div className="bg-yellow-50 p-3 rounded-lg">
                                    <div className="font-medium text-yellow-800 mb-1">Average Crowds</div>
                                    <div className="text-sm text-yellow-600">
                                        {Math.round(crowdData.reduce((sum, item) => sum + item.crowd, 0) / crowdData.length)}%
                                        capacity expected across the {timeRange === 'week' ? 'week' : 'day'}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Predictions */}
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mb-8">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                🤖 AI Prediction Analysis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <div className="font-medium text-purple-800">Weather Impact</div>
                                    <div className="text-gray-700">Clear skies expected - crowds may be 15% higher</div>
                                </div>
                                <div>
                                    <div className="font-medium text-blue-800">Historical Patterns</div>
                                    <div className="text-gray-700">Similar to last year's trends with 8% variation</div>
                                </div>
                                <div>
                                    <div className="font-medium text-green-800">Confidence Level</div>
                                    <div className="text-gray-700">87% accuracy based on 2+ years of data</div>
                                </div>
                            </div>
                        </div>
                        <div className="text-4xl ml-4">🔮</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Your Visit</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                            Book Optimal Time Slot
                        </button>
                        <button className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors">
                            Set Crowd Alerts
                        </button>
                        <button className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors">
                            Share Predictions
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrowdPredictionPage;
