import React from 'react';

const CommunityPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">SmartTour.Jo Community</h1>

                    {/* Community Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">1,247</div>
                            <div className="text-sm text-gray-600">Active Members</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">3,892</div>
                            <div className="text-sm text-gray-600">Travel Stories</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600">156</div>
                            <div className="text-sm text-gray-600">This Week</div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-yellow-600">4.8/5</div>
                            <div className="text-sm text-gray-600">Community Rating</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Feed */}
                        <div className="lg:col-span-2">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Travel Stories</h2>

                                {/* Sample Posts */}
                                <div className="space-y-4">
                                    {/* Post 1 */}
                                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                                L
                                            </div>
                                            <div className="ml-3">
                                                <div className="font-semibold text-gray-800">Layla Al-Hashemi</div>
                                                <div className="text-sm text-gray-500">Expert Traveler • Petra</div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-3">
                                            Just visited the incredible Petra by Night experience! The Treasury illuminated by candlelight is absolutely magical. Highly recommend booking in advance! 🕯️✨
                                        </p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>❤️ 47 likes</span>
                                            <span>💬 12 comments</span>
                                            <span>📍 Petra</span>
                                        </div>
                                    </div>

                                    {/* Post 2 */}
                                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                                O
                                            </div>
                                            <div className="ml-3">
                                                <div className="font-semibold text-gray-800">Omar Mansouri</div>
                                                <div className="text-sm text-gray-500">Explorer • Wadi Rum</div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-3">
                                            Wadi Rum desert camping was life-changing! Three days of silence, stars, and stunning red landscapes. Our Bedouin guide Mohammed was incredible - shared so many stories and traditions.
                                        </p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>❤️ 35 likes</span>
                                            <span>💬 8 comments</span>
                                            <span>📍 Wadi Rum</span>
                                        </div>
                                    </div>

                                    {/* Post 3 */}
                                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                S
                                            </div>
                                            <div className="ml-3">
                                                <div className="font-semibold text-gray-800">Sarah Johnson</div>
                                                <div className="text-sm text-gray-500">Adventurer • Dead Sea</div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-3">
                                            Dead Sea float and mud therapy day! The mineral-rich mud left my skin feeling amazing. Pro tip: bring water shoes - the salt crystals can be sharp!
                                        </p>
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>❤️ 28 likes</span>
                                            <span>💬 6 comments</span>
                                            <span>📍 Dead Sea</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Create Post */}
                            <div className="bg-white border rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Share Your Experience</h3>
                                <textarea
                                    placeholder="Tell the community about your Jordan adventure..."
                                    className="w-full p-3 border rounded-md resize-none"
                                    rows="3"
                                ></textarea>
                                <button className="mt-2 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                                    Share Story
                                </button>
                            </div>

                            {/* Trending Topics */}
                            <div className="bg-white border rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Trending Topics</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-blue-600 cursor-pointer hover:underline">#PetraByNight</span>
                                        <span className="text-sm text-gray-500">47 posts</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-600 cursor-pointer hover:underline">#WadiRumCamping</span>
                                        <span className="text-sm text-gray-500">32 posts</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-600 cursor-pointer hover:underline">#DeadSeaSpa</span>
                                        <span className="text-sm text-gray-500">28 posts</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-600 cursor-pointer hover:underline">#JerashRuins</span>
                                        <span className="text-sm text-gray-500">19 posts</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-600 cursor-pointer hover:underline">#AqabaDiving</span>
                                        <span className="text-sm text-gray-500">15 posts</span>
                                    </div>
                                </div>
                            </div>

                            {/* Active Travelers */}
                            <div className="bg-white border rounded-lg p-4">
                                <h3 className="font-semibold text-gray-800 mb-3">Active Travelers</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            A
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-medium text-sm">Ahmed Al-Zahra</div>
                                            <div className="text-xs text-gray-500">Explorer Level</div>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            M
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-medium text-sm">Maya Khoury</div>
                                            <div className="text-xs text-gray-500">Expert Level</div>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                            K
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-medium text-sm">Khalil Ahmad</div>
                                            <div className="text-xs text-gray-500">Adventurer Level</div>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="w-2 h-2 bg-yellow-400 rounded-full inline-block"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Community Guidelines */}
                            <div className="bg-blue-50 border rounded-lg p-4">
                                <h3 className="font-semibold text-blue-800 mb-2">Community Guidelines</h3>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Share authentic travel experiences</li>
                                    <li>• Be respectful to all members</li>
                                    <li>• Help fellow travelers with tips</li>
                                    <li>• No spam or commercial posts</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon Notice */}
                    <div className="mt-8 bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Enhanced Community Features Coming Soon!</h3>
                                <p className="text-gray-600 mt-1">Photo uploads, video sharing, travel buddy matching, group trip planning, and expert Q&A sessions.</p>
                            </div>
                            <div className="text-4xl">🌟</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
