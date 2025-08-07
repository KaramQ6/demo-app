import React, { useState } from 'react';

const PreferenceEngine = () => {
    const [interests, setInterests] = useState({
        history: false,
        nature: false,
        adventure: false,
        food: false,
        culture: false
    });

    const [preferences, setPreferences] = useState({
        budget: 'medium',
        travelStyle: 'balanced',
        groupSize: 'small',
        duration: 'weekend'
    });

    const handleInterestChange = (interest) => {
        setInterests(prev => ({
            ...prev,
            [interest]: !prev[interest]
        }));
    };

    const handlePreferenceChange = (key, value) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Preferences</h2>

            {/* Travel Interests */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Travel Interests</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(interests).map(([interest, checked]) => (
                        <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => handleInterestChange(interest)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700 capitalize">
                                {interest}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Travel Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Budget Preference */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                    </label>
                    <select
                        value={preferences.budget}
                        onChange={(e) => handlePreferenceChange('budget', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="budget">Budget ($50-100/day)</option>
                        <option value="medium">Medium ($100-200/day)</option>
                        <option value="luxury">Luxury ($200+/day)</option>
                    </select>
                </div>

                {/* Travel Style */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Travel Style
                    </label>
                    <select
                        value={preferences.travelStyle}
                        onChange={(e) => handlePreferenceChange('travelStyle', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="relaxed">Relaxed Pace</option>
                        <option value="balanced">Balanced</option>
                        <option value="packed">Action Packed</option>
                    </select>
                </div>

                {/* Group Size */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Group Size
                    </label>
                    <select
                        value={preferences.groupSize}
                        onChange={(e) => handlePreferenceChange('groupSize', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="solo">Solo Travel</option>
                        <option value="small">Small Group (2-5)</option>
                        <option value="medium">Medium Group (6-12)</option>
                        <option value="large">Large Group (13+)</option>
                    </select>
                </div>

                {/* Trip Duration */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Typical Trip Duration
                    </label>
                    <select
                        value={preferences.duration}
                        onChange={(e) => handlePreferenceChange('duration', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="day">Day Trip</option>
                        <option value="weekend">Weekend (2-3 days)</option>
                        <option value="week">Week (4-7 days)</option>
                        <option value="extended">Extended (8+ days)</option>
                    </select>
                </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
                    Save Preferences
                </button>
            </div>

            {/* Preference Summary */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Your Travel Profile:</h4>
                <div className="text-sm text-blue-700">
                    <p><strong>Interests:</strong> {Object.entries(interests).filter(([_, checked]) => checked).map(([interest, _]) => interest).join(', ') || 'None selected'}</p>
                    <p><strong>Budget:</strong> {preferences.budget.charAt(0).toUpperCase() + preferences.budget.slice(1)}</p>
                    <p><strong>Style:</strong> {preferences.travelStyle.charAt(0).toUpperCase() + preferences.travelStyle.slice(1)}</p>
                    <p><strong>Group Size:</strong> {preferences.groupSize.charAt(0).toUpperCase() + preferences.groupSize.slice(1)}</p>
                    <p><strong>Duration:</strong> {preferences.duration.charAt(0).toUpperCase() + preferences.duration.slice(1)}</p>
                </div>
            </div>
        </div>
    );
};

export default PreferenceEngine;
