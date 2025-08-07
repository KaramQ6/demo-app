import React from 'react';

const ProfilePage = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Profile Information Section */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-blue-800 mb-3">Profile Information</h2>
                            <p className="text-gray-600">Personal details, preferences, and settings</p>
                            <div className="mt-4 space-y-2">
                                <div className="text-sm text-gray-500">• Personal Information</div>
                                <div className="text-sm text-gray-500">• Travel Preferences</div>
                                <div className="text-sm text-gray-500">• Language & Currency</div>
                                <div className="text-sm text-gray-500">• Privacy Settings</div>
                            </div>
                        </div>

                        {/* Travel History Section */}
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-green-800 mb-3">Travel History</h2>
                            <p className="text-gray-600">Your past trips and experiences</p>
                            <div className="mt-4 space-y-2">
                                <div className="text-sm text-gray-500">• Completed Trips</div>
                                <div className="text-sm text-gray-500">• Photo Gallery</div>
                                <div className="text-sm text-gray-500">• Trip Reviews</div>
                                <div className="text-sm text-gray-500">• Favorite Destinations</div>
                            </div>
                        </div>

                        {/* Gamification Section */}
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-purple-800 mb-3">Achievements</h2>
                            <p className="text-gray-600">Points, badges, and travel milestones</p>
                            <div className="mt-4 space-y-2">
                                <div className="text-sm text-gray-500">• Travel Points: 2,840</div>
                                <div className="text-sm text-gray-500">• Current Level: Explorer</div>
                                <div className="text-sm text-gray-500">• Badges Earned: 12</div>
                                <div className="text-sm text-gray-500">• Next Milestone: Expert</div>
                            </div>
                        </div>

                        {/* Wishlist Section */}
                        <div className="bg-yellow-50 p-4 rounded-lg md:col-span-2">
                            <h2 className="text-xl font-semibold text-yellow-800 mb-3">Travel Wishlist</h2>
                            <p className="text-gray-600">Places you want to visit in Jordan</p>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-white p-3 rounded border">
                                    <div className="font-medium">Jerash</div>
                                    <div className="text-sm text-gray-500">Ancient Roman ruins</div>
                                </div>
                                <div className="bg-white p-3 rounded border">
                                    <div className="font-medium">Aqaba</div>
                                    <div className="text-sm text-gray-500">Red Sea diving</div>
                                </div>
                                <div className="bg-white p-3 rounded border">
                                    <div className="font-medium">Dana Reserve</div>
                                    <div className="text-sm text-gray-500">Nature hiking</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Quick Actions</h2>
                            <div className="space-y-2">
                                <button className="w-full text-left p-2 bg-blue-100 hover:bg-blue-200 rounded text-blue-800 transition-colors">
                                    Edit Profile
                                </button>
                                <button className="w-full text-left p-2 bg-green-100 hover:bg-green-200 rounded text-green-800 transition-colors">
                                    View Trip History
                                </button>
                                <button className="w-full text-left p-2 bg-purple-100 hover:bg-purple-200 rounded text-purple-800 transition-colors">
                                    Manage Wishlist
                                </button>
                                <button className="w-full text-left p-2 bg-red-100 hover:bg-red-200 rounded text-red-800 transition-colors">
                                    Account Settings
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon Notice */}
                    <div className="mt-8 bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Full Profile Experience Coming Soon!</h3>
                                <p className="text-gray-600 mt-1">Interactive profile management, detailed travel analytics, and personalized recommendations.</p>
                            </div>
                            <div className="text-4xl">🚀</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
