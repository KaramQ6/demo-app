import React from 'react';
import PreferenceEngine from './PreferenceEngine';
import TravelHistory from './TravelHistory';
import Wishlist from './Wishlist';
import Gamification from './Gamification';

const UserProfile = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            AZ
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Ahmed Al-Zahra</h1>
                            <p className="text-lg text-gray-600">Level 5: Jordan Explorer</p>
                            <p className="text-sm text-gray-500">Member since January 2024 • Amman, Jordan</p>
                            <div className="flex items-center space-x-4 mt-2">
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                    ✓ Verified Traveler
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    🏆 2,840 Points
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Navigation */}
                <div className="mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <a href="#preferences" className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
                                My Preferences
                            </a>
                            <a href="#history" className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                My Travel History
                            </a>
                            <a href="#wishlist" className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                My Wishlist
                            </a>
                            <a href="#achievements" className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                                My Achievements
                            </a>
                        </nav>
                    </div>
                </div>

                {/* Profile Sections */}
                <div className="space-y-8">
                    {/* My Preferences Section */}
                    <section id="preferences">
                        <PreferenceEngine />
                    </section>

                    {/* My Travel History Section */}
                    <section id="history">
                        <TravelHistory />
                    </section>

                    {/* My Wishlist Section */}
                    <section id="wishlist">
                        <Wishlist />
                    </section>

                    {/* My Achievements Section */}
                    <section id="achievements">
                        <Gamification />
                    </section>
                </div>

                {/* Profile Actions */}
                <div className="mt-12 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Edit Profile Information
                        </button>
                        <button className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium">
                            Plan New Trip
                        </button>
                        <button className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                            Share Profile
                        </button>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">Privacy Settings</h3>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" defaultChecked />
                                    <span className="text-sm">Make profile public</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" defaultChecked />
                                    <span className="text-sm">Allow travel buddy requests</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <span className="text-sm">Share travel history</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-700 mb-3">Notifications</h3>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" defaultChecked />
                                    <span className="text-sm">Trip reminders</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" defaultChecked />
                                    <span className="text-sm">Community updates</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    <span className="text-sm">Marketing emails</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                        <button className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors">
                            Save Settings
                        </button>
                        <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
