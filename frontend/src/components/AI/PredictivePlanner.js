import React, { useState } from 'react';

const PredictivePlanner = () => {
    const [preferences, setPreferences] = useState({
        budget: 200,
        duration: 3,
        groupSize: 2,
        interests: [],
        season: 'spring',
        activity: 'balanced'
    });

    const [prediction, setPrediction] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const interests = [
        { id: 'history', label: 'Historical Sites', icon: '🏛️' },
        { id: 'nature', label: 'Nature & Wildlife', icon: '🌿' },
        { id: 'adventure', label: 'Adventure Sports', icon: '🏔️' },
        { id: 'culture', label: 'Cultural Experiences', icon: '🎭' },
        { id: 'food', label: 'Food & Cuisine', icon: '🍽️' },
        { id: 'relaxation', label: 'Relaxation & Spa', icon: '🧘' }
    ];

    const handleInterestToggle = (interestId) => {
        setPreferences(prev => ({
            ...prev,
            interests: prev.interests.includes(interestId)
                ? prev.interests.filter(id => id !== interestId)
                : [...prev.interests, interestId]
        }));
    };

    const generatePrediction = async () => {
        setIsLoading(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Hardcoded "Predicted Best Trip" result based on preferences
        const hardcodedPredictions = [
            {
                destination: 'Petra & Wadi Rum Adventure',
                confidence: 94,
                itinerary: [
                    { day: 1, location: 'Petra', activity: 'Treasury & Monastery exploration' },
                    { day: 2, location: 'Petra', activity: 'Royal Tombs & High Place of Sacrifice' },
                    { day: 3, location: 'Wadi Rum', activity: 'Desert camping & camel riding' }
                ],
                estimatedCost: preferences.budget * preferences.duration * 0.9,
                bestTime: preferences.season === 'spring' ? 'March-May' : 'September-November',
                highlights: ['UNESCO World Heritage Sites', 'Desert camping experience', 'Bedouin culture'],
                weatherForecast: '☀️ 25°C, Clear skies',
                crowdLevel: 'Medium',
                recommendation: 'Perfect match for history lovers seeking adventure!'
            },
            {
                destination: 'Dead Sea Relaxation Retreat',
                confidence: 87,
                itinerary: [
                    { day: 1, location: 'Dead Sea', activity: 'Float therapy & mud treatments' },
                    { day: 2, location: 'Dead Sea', activity: 'Spa resort & wellness activities' },
                    { day: 3, location: 'Mt. Nebo', activity: 'Moses memorial & panoramic views' }
                ],
                estimatedCost: preferences.budget * preferences.duration * 0.8,
                bestTime: 'Year-round',
                highlights: ['Therapeutic salt water', 'Luxury spa treatments', 'Biblical history'],
                weatherForecast: '🌤️ 28°C, Partly cloudy',
                crowdLevel: 'Low',
                recommendation: 'Ideal for relaxation and wellness focus!'
            },
            {
                destination: 'Northern Jordan Cultural Journey',
                confidence: 82,
                itinerary: [
                    { day: 1, location: 'Jerash', activity: 'Roman ruins exploration' },
                    { day: 2, location: 'Ajloun Castle', activity: 'Medieval fortress & forest reserve' },
                    { day: 3, location: 'Umm Qais', activity: 'Decapolis ruins & Tiberias views' }
                ],
                estimatedCost: preferences.budget * preferences.duration * 0.7,
                bestTime: preferences.season === 'spring' ? 'April-May' : 'October-November',
                highlights: ['Ancient Roman architecture', 'Medieval Islamic history', 'Panoramic views'],
                weatherForecast: '🌥️ 22°C, Mild weather',
                crowdLevel: 'Low-Medium',
                recommendation: 'Great for history enthusiasts and cultural immersion!'
            }
        ];

        // Select prediction based on interests and preferences
        let selectedPrediction = hardcodedPredictions[0]; // Default to Petra

        if (preferences.interests.includes('relaxation')) {
            selectedPrediction = hardcodedPredictions[1];
        } else if (preferences.interests.includes('history') && preferences.budget < 150) {
            selectedPrediction = hardcodedPredictions[2];
        }

        setPrediction(selectedPrediction);
        setIsLoading(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
                <div className="text-3xl mr-3">🤖</div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">AI Predictive Trip Planner</h2>
                    <p className="text-gray-600">Let our AI create the perfect Jordan experience for you</p>
                </div>
            </div>

            {/* Preference Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {/* Budget Slider */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Budget per Day: ${preferences.budget}
                        </label>
                        <input
                            type="range"
                            min="50"
                            max="500"
                            step="25"
                            value={preferences.budget}
                            onChange={(e) => setPreferences(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>$50</span>
                            <span>$500</span>
                        </div>
                    </div>

                    {/* Duration Slider */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trip Duration: {preferences.duration} {preferences.duration === 1 ? 'day' : 'days'}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="14"
                            step="1"
                            value={preferences.duration}
                            onChange={(e) => setPreferences(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1 day</span>
                            <span>2 weeks</span>
                        </div>
                    </div>

                    {/* Group Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Group Size: {preferences.groupSize} {preferences.groupSize === 1 ? 'person' : 'people'}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={preferences.groupSize}
                            onChange={(e) => setPreferences(prev => ({ ...prev, groupSize: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Solo</span>
                            <span>Group of 10</span>
                        </div>
                    </div>

                    {/* Season Preference */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Season
                        </label>
                        <select
                            value={preferences.season}
                            onChange={(e) => setPreferences(prev => ({ ...prev, season: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="spring">Spring (March-May)</option>
                            <option value="summer">Summer (June-August)</option>
                            <option value="fall">Fall (September-November)</option>
                            <option value="winter">Winter (December-February)</option>
                        </select>
                    </div>

                    {/* Activity Level */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Activity Level
                        </label>
                        <select
                            value={preferences.activity}
                            onChange={(e) => setPreferences(prev => ({ ...prev, activity: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="relaxed">Relaxed Pace</option>
                            <option value="balanced">Balanced</option>
                            <option value="active">Very Active</option>
                        </select>
                    </div>
                </div>

                <div>
                    {/* Interests Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Travel Interests (select all that apply)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {interests.map((interest) => (
                                <label
                                    key={interest.id}
                                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${preferences.interests.includes(interest.id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={preferences.interests.includes(interest.id)}
                                        onChange={() => handleInterestToggle(interest.id)}
                                        className="sr-only"
                                    />
                                    <span className="text-2xl mr-2">{interest.icon}</span>
                                    <span className="text-sm font-medium">{interest.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Generate Prediction Button */}
                    <button
                        onClick={generatePrediction}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                                Analyzing Preferences...
                            </div>
                        ) : (
                            '🔮 Generate Perfect Trip'
                        )}
                    </button>
                </div>
            </div>

            {/* Prediction Results */}
            {prediction && !isLoading && (
                <div className="mt-8 border-t pt-8">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-800">🎯 Predicted Best Trip</h3>
                            <div className="flex items-center">
                                <span className="text-sm text-gray-600 mr-2">Confidence:</span>
                                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    {prediction.confidence}%
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Trip Overview */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">{prediction.destination}</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-700 w-24">Duration:</span>
                                        <span>{preferences.duration} days</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-700 w-24">Cost:</span>
                                        <span className="text-green-600 font-semibold">${Math.round(prediction.estimatedCost)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-700 w-24">Best Time:</span>
                                        <span>{prediction.bestTime}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-700 w-24">Weather:</span>
                                        <span>{prediction.weatherForecast}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium text-gray-700 w-24">Crowds:</span>
                                        <span>{prediction.crowdLevel}</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="font-medium text-gray-700 mb-2">Key Highlights:</div>
                                    <div className="flex flex-wrap gap-2">
                                        {prediction.highlights.map((highlight, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                            >
                                                {highlight}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Itinerary */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Suggested Itinerary</h4>
                                <div className="space-y-3">
                                    {prediction.itinerary.map((day, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <div className="bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                                                {day.day}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800">{day.location}</div>
                                                <div className="text-sm text-gray-600">{day.activity}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                            <div className="flex items-center">
                                <div className="text-2xl mr-3">💡</div>
                                <div>
                                    <div className="font-semibold text-blue-800">AI Recommendation</div>
                                    <div className="text-blue-700">{prediction.recommendation}</div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex gap-3">
                            <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                Book This Trip
                            </button>
                            <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
                                Save to Wishlist
                            </button>
                            <button className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                                Customize Itinerary
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Features Teaser */}
            <div className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🚀 Coming Soon: Advanced AI Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <div className="font-medium text-purple-800">🎯 Behavioral Analysis</div>
                        <div className="text-gray-600">Learn from your past trips to predict preferences</div>
                    </div>
                    <div>
                        <div className="font-medium text-purple-800">🌤️ Weather Integration</div>
                        <div className="text-gray-600">Real-time weather data for optimal planning</div>
                    </div>
                    <div>
                        <div className="font-medium text-purple-800">👥 Social Recommendations</div>
                        <div className="text-gray-600">Discover trips loved by similar travelers</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictivePlanner;
