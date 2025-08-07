import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SmartRecommendationsPage = () => {
    const navigate = useNavigate();
    const [userPreferences, setUserPreferences] = useState({
        interests: ['history', 'adventure'],
        budget: 'medium',
        travelStyle: 'explorer',
        season: 'spring'
    });
    const [recommendations, setRecommendations] = useState([]);
    const [activeTab, setActiveTab] = useState('personalized');
    const [isLoading, setIsLoading] = useState(false);

    // All available interests
    const allInterests = [
        { id: 'history', name: 'Historical Sites', icon: '🏛️' },
        { id: 'nature', name: 'Nature & Wildlife', icon: '🌿' },
        { id: 'adventure', name: 'Adventure Sports', icon: '🏔️' },
        { id: 'culture', name: 'Cultural Experiences', icon: '🎭' },
        { id: 'food', name: 'Culinary Tours', icon: '🍽️' },
        { id: 'beach', name: 'Beach & Water', icon: '🏖️' },
        { id: 'shopping', name: 'Shopping', icon: '🛍️' },
        { id: 'nightlife', name: 'Nightlife', icon: '🌙' }
    ];

    // Generate smart recommendations based on user preferences
    const generateRecommendations = (type) => {
        const baseRecommendations = {
            personalized: [
                {
                    id: 1,
                    title: 'Petra Historical Adventure',
                    description: 'Perfect blend of history and adventure hiking through ancient Nabataean architecture',
                    image: '🏛️',
                    match: 95,
                    reasons: ['Matches your love for history', 'Great for adventurous explorers', 'Perfect for spring weather'],
                    duration: '2 days',
                    difficulty: 'Moderate',
                    price: '$120',
                    highlights: ['Treasury facade', 'Monastery hike', 'Roman theater']
                },
                {
                    id: 2,
                    title: 'Wadi Rum Desert Experience',
                    description: 'Adventurous desert camping under stars with historical Nabataean inscriptions',
                    image: '🏜️',
                    match: 92,
                    reasons: ['Adventure-focused experience', 'Historical rock art', 'Unique overnight stay'],
                    duration: '1-2 days',
                    difficulty: 'Easy-Moderate',
                    price: '$85',
                    highlights: ['Jeep safari', 'Stargazing', 'Bedouin culture']
                },
                {
                    id: 3,
                    title: 'Jerash Ancient City Tour',
                    description: 'Explore the best-preserved Roman ruins outside Italy with guided historical insights',
                    image: '🏺',
                    match: 88,
                    reasons: ['Rich historical significance', 'Educational exploration', 'Great photo opportunities'],
                    duration: '1 day',
                    difficulty: 'Easy',
                    price: '$65',
                    highlights: ['Roman theaters', 'Colonnaded street', 'Artemis temple']
                }
            ],
            trending: [
                {
                    id: 4,
                    title: 'Dana Biosphere Reserve',
                    description: 'Jordan\'s largest nature reserve with diverse ecosystems and hiking trails',
                    image: '🌿',
                    match: 78,
                    reasons: ['Growing popularity', 'Nature conservation focus', 'Unique biodiversity'],
                    duration: '1-2 days',
                    difficulty: 'Moderate',
                    price: '$95',
                    highlights: ['Eco-lodge stay', 'Wildlife spotting', 'Dramatic landscapes']
                },
                {
                    id: 5,
                    title: 'Jordan Trail Highlights',
                    description: 'Sample the best sections of Jordan\'s famous long-distance hiking trail',
                    image: '🥾',
                    match: 85,
                    reasons: ['Trending adventure experience', 'Multiple difficulty options', 'Stunning scenery'],
                    duration: '3-5 days',
                    difficulty: 'Moderate-Hard',
                    price: '$180',
                    highlights: ['Trail variety', 'Local communities', 'Mountain views']
                }
            ],
            seasonal: [
                {
                    id: 6,
                    title: 'Spring Flower Festival - Ajloun',
                    description: 'Witness Jordan\'s beautiful wildflower blooms in the northern highlands',
                    image: '🌸',
                    match: 82,
                    reasons: ['Perfect spring timing', 'Limited seasonal availability', 'Natural beauty peak'],
                    duration: '1 day',
                    difficulty: 'Easy',
                    price: '$55',
                    highlights: ['Wildflower meadows', 'Forest walks', 'Cool weather']
                },
                {
                    id: 7,
                    title: 'Dead Sea Wellness Retreat',
                    description: 'Rejuvenating spring wellness experience at the lowest point on Earth',
                    image: '🧘',
                    match: 75,
                    reasons: ['Ideal spring temperatures', 'Health benefits', 'Relaxing atmosphere'],
                    duration: '1-3 days',
                    difficulty: 'Easy',
                    price: '$140',
                    highlights: ['Mud treatments', 'Float therapy', 'Spa services']
                }
            ]
        };

        return baseRecommendations[type] || [];
    };

    // Load recommendations
    const loadRecommendations = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        const newRecommendations = generateRecommendations(activeTab);
        setRecommendations(newRecommendations);
        setIsLoading(false);
    };

    // Update user preferences
    const updatePreferences = (key, value) => {
        setUserPreferences(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Toggle interest
    const toggleInterest = (interestId) => {
        setUserPreferences(prev => ({
            ...prev,
            interests: prev.interests.includes(interestId)
                ? prev.interests.filter(id => id !== interestId)
                : [...prev.interests, interestId]
        }));
    };

    // Handle booking button click
    const handleBookTrip = (recommendation) => {
        // Convert recommendation to trip data format expected by booking engine
        const tripData = {
            id: recommendation.id,
            title: recommendation.title,
            description: recommendation.description,
            image: recommendation.image,
            price: parseInt(recommendation.price.replace('$', '')),
            duration: recommendation.duration,
            difficulty: recommendation.difficulty,
            highlights: recommendation.highlights,
            match: recommendation.match
        };

        // Navigate to booking page with trip data
        navigate('/booking', { state: { tripData } });
    };

    // Load recommendations when tab changes
    useEffect(() => {
        loadRecommendations();
    }, [activeTab]);

    // Reload when preferences change (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (activeTab === 'personalized') {
                loadRecommendations();
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [userPreferences]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                🎯 Smart Recommendations
                            </h1>
                            <p className="text-gray-600">
                                Personalized suggestions tailored to your interests and preferences
                            </p>
                        </div>
                        <div className="text-6xl">🤖</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Preferences Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Preferences</h3>

                            {/* Interests */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Interests
                                </label>
                                <div className="space-y-2">
                                    {allInterests.map(interest => (
                                        <label
                                            key={interest.id}
                                            className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${userPreferences.interests.includes(interest.id)
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={userPreferences.interests.includes(interest.id)}
                                                onChange={() => toggleInterest(interest.id)}
                                                className="sr-only"
                                            />
                                            <span className="mr-2">{interest.icon}</span>
                                            <span className="text-sm">{interest.name}</span>
                                            {userPreferences.interests.includes(interest.id) && (
                                                <span className="ml-auto text-blue-600">✓</span>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Budget */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Budget Range
                                </label>
                                <select
                                    value={userPreferences.budget}
                                    onChange={(e) => updatePreferences('budget', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="budget">Budget (Under $100)</option>
                                    <option value="medium">Medium ($100-200)</option>
                                    <option value="luxury">Luxury ($200+)</option>
                                </select>
                            </div>

                            {/* Travel Style */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Travel Style
                                </label>
                                <select
                                    value={userPreferences.travelStyle}
                                    onChange={(e) => updatePreferences('travelStyle', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="relaxed">Relaxed Explorer</option>
                                    <option value="explorer">Active Explorer</option>
                                    <option value="adventurer">Thrill Seeker</option>
                                    <option value="cultural">Cultural Immersion</option>
                                </select>
                            </div>

                            {/* Season */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Preferred Season
                                </label>
                                <select
                                    value={userPreferences.season}
                                    onChange={(e) => updatePreferences('season', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="spring">Spring (Mar-May)</option>
                                    <option value="summer">Summer (Jun-Aug)</option>
                                    <option value="autumn">Autumn (Sep-Nov)</option>
                                    <option value="winter">Winter (Dec-Feb)</option>
                                </select>
                            </div>

                            <button
                                onClick={loadRecommendations}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Update Recommendations
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Tabs */}
                        <div className="bg-white rounded-lg shadow-md mb-6">
                            <div className="flex border-b">
                                {[
                                    { id: 'personalized', name: '🎯 Personalized', count: 3 },
                                    { id: 'trending', name: '🔥 Trending', count: 2 },
                                    { id: 'seasonal', name: '🌸 Seasonal', count: 2 }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-4 px-6 text-center transition-colors ${activeTab === tab.id
                                            ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                                            : 'text-gray-600 hover:text-gray-800'
                                            }`}
                                    >
                                        <div className="font-medium">{tab.name}</div>
                                        <div className="text-xs text-gray-500">{tab.count} recommendations</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recommendations Grid */}
                        <div className="space-y-6">
                            {isLoading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Analyzing your preferences...</p>
                                </div>
                            ) : (
                                recommendations.map(rec => (
                                    <div key={rec.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center">
                                                    <div className="text-4xl mr-4">{rec.image}</div>
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                                            {rec.title}
                                                        </h3>
                                                        <p className="text-gray-600 mb-2">{rec.description}</p>
                                                        <div className="flex items-center">
                                                            <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded-full mr-2">
                                                                {rec.match}% Match
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {rec.duration} • {rec.difficulty} • {rec.price}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Why This Matches */}
                                                <div>
                                                    <h4 className="font-medium text-gray-800 mb-2">Why this matches you:</h4>
                                                    <ul className="space-y-1">
                                                        {rec.reasons.map((reason, index) => (
                                                            <li key={index} className="text-sm text-gray-600 flex items-center">
                                                                <span className="text-green-500 mr-2">✓</span>
                                                                {reason}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Highlights */}
                                                <div>
                                                    <h4 className="font-medium text-gray-800 mb-2">Experience highlights:</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {rec.highlights.map((highlight, index) => (
                                                            <span
                                                                key={index}
                                                                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                                                            >
                                                                {highlight}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                                                <button
                                                    onClick={() => handleBookTrip(rec)}
                                                    className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors font-semibold flex items-center justify-center"
                                                >
                                                    <span className="mr-2">🎯</span>
                                                    Book This Trip Now
                                                </button>
                                                <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                                                    View Details
                                                </button>
                                                <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
                                                    Add to Wishlist
                                                </button>
                                                <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
                                                    Share
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Smart Insights */}
                        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mt-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                🧠 Smart Insights
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="bg-white rounded-md p-3">
                                    <div className="font-medium text-purple-800 mb-1">Interest Analysis</div>
                                    <div className="text-gray-700">
                                        You prefer historical sites with adventure elements.
                                        Consider combining cultural tours with outdoor activities.
                                    </div>
                                </div>
                                <div className="bg-white rounded-md p-3">
                                    <div className="font-medium text-blue-800 mb-1">Seasonal Optimization</div>
                                    <div className="text-gray-700">
                                        Spring is perfect for your preferred activities.
                                        Temperatures are ideal and crowds are manageable.
                                    </div>
                                </div>
                                <div className="bg-white rounded-md p-3">
                                    <div className="font-medium text-green-800 mb-1">Budget Smart</div>
                                    <div className="text-gray-700">
                                        Your medium budget allows for premium experiences.
                                        Consider upgrading accommodations for better value.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartRecommendationsPage;
