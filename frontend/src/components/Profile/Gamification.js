import React from 'react';

const Gamification = () => {
    // Static user achievement data
    const userLevel = {
        current: 5,
        title: "Jordan Explorer",
        points: 2840,
        nextLevel: 6,
        nextTitle: "Desert Master",
        pointsToNext: 360,
        totalPointsForNext: 3200
    };

    const badges = [
        {
            id: 'petra_master',
            name: 'Petra Master',
            description: 'Visited Petra 3 times',
            icon: '🏛️',
            earned: true,
            earnedDate: '2024-06-15',
            rarity: 'rare'
        },
        {
            id: 'desert_nomad',
            name: 'Desert Nomad',
            description: 'Camped in Wadi Rum for 5+ nights',
            icon: '🏜️',
            earned: true,
            earnedDate: '2024-05-20',
            rarity: 'epic'
        },
        {
            id: 'floating_expert',
            name: 'Floating Expert',
            description: 'Floated in the Dead Sea',
            icon: '🌊',
            earned: true,
            earnedDate: '2024-04-10',
            rarity: 'common'
        },
        {
            id: 'history_buff',
            name: 'History Buff',
            description: 'Visited 5 historical sites',
            icon: '📜',
            earned: true,
            earnedDate: '2024-03-22',
            rarity: 'uncommon'
        },
        {
            id: 'underwater_explorer',
            name: 'Underwater Explorer',
            description: 'Went scuba diving in Aqaba',
            icon: '🤿',
            earned: true,
            earnedDate: '2024-02-14',
            rarity: 'rare'
        },
        {
            id: 'nature_lover',
            name: 'Nature Lover',
            description: 'Visited 3 nature reserves',
            icon: '🌿',
            earned: true,
            earnedDate: '2024-01-28',
            rarity: 'uncommon'
        },
        {
            id: 'castle_keeper',
            name: 'Castle Keeper',
            description: 'Visited all Jordan castles',
            icon: '🏰',
            earned: false,
            earnedDate: null,
            rarity: 'legendary'
        },
        {
            id: 'photo_master',
            name: 'Photo Master',
            description: 'Share 50 travel photos',
            icon: '📸',
            earned: false,
            earnedDate: null,
            rarity: 'rare'
        },
        {
            id: 'social_butterfly',
            name: 'Social Butterfly',
            description: 'Connect with 25 travelers',
            icon: '🦋',
            earned: false,
            earnedDate: null,
            rarity: 'uncommon'
        }
    ];

    const achievements = [
        {
            id: 'trips_completed',
            name: 'Trips Completed',
            current: 12,
            target: 20,
            icon: '✈️',
            unit: 'trips'
        },
        {
            id: 'places_visited',
            name: 'Places Visited',
            current: 47,
            target: 50,
            icon: '📍',
            unit: 'places'
        },
        {
            id: 'photos_shared',
            name: 'Photos Shared',
            current: 23,
            target: 50,
            icon: '📷',
            unit: 'photos'
        },
        {
            id: 'reviews_written',
            name: 'Reviews Written',
            current: 8,
            target: 15,
            icon: '⭐',
            unit: 'reviews'
        }
    ];

    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return 'border-gray-300 bg-gray-50';
            case 'uncommon': return 'border-green-300 bg-green-50';
            case 'rare': return 'border-blue-300 bg-blue-50';
            case 'epic': return 'border-purple-300 bg-purple-50';
            case 'legendary': return 'border-yellow-300 bg-yellow-50';
            default: return 'border-gray-300 bg-gray-50';
        }
    };

    const getRarityTextColor = (rarity) => {
        switch (rarity) {
            case 'common': return 'text-gray-600';
            case 'uncommon': return 'text-green-600';
            case 'rare': return 'text-blue-600';
            case 'epic': return 'text-purple-600';
            case 'legendary': return 'text-yellow-600';
            default: return 'text-gray-600';
        }
    };

    const progressPercentage = (userLevel.points / userLevel.totalPointsForNext) * 100;
    const earnedBadges = badges.filter(badge => badge.earned);
    const upcomingBadges = badges.filter(badge => !badge.earned);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Achievements</h2>

            {/* User Level Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-3xl font-bold">Level {userLevel.current}</div>
                        <div className="text-xl opacity-90">{userLevel.title}</div>
                    </div>
                    <div className="text-6xl">🏆</div>
                </div>

                <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                        <span>{userLevel.points.toLocaleString()} Points</span>
                        <span>{userLevel.pointsToNext} to Level {userLevel.nextLevel}</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                        <div
                            className="bg-white rounded-full h-3 transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="text-sm opacity-90">
                    Next: <span className="font-semibold">{userLevel.nextTitle}</span>
                </div>
            </div>

            {/* Progress Achievements */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Milestones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                        <div key={achievement.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl">{achievement.icon}</span>
                                    <div>
                                        <div className="font-medium text-gray-800">{achievement.name}</div>
                                        <div className="text-sm text-gray-600">
                                            {achievement.current} / {achievement.target} {achievement.unit}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-blue-600">
                                        {Math.round((achievement.current / achievement.target) * 100)}%
                                    </div>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                                    style={{ width: `${(achievement.current / achievement.target) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Earned Badges */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Earned Badges</h3>
                    <div className="text-sm text-gray-600">
                        {earnedBadges.length} of {badges.length} badges earned
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {earnedBadges.map((badge) => (
                        <div
                            key={badge.id}
                            className={`border-2 rounded-lg p-4 text-center transition-transform hover:scale-105 ${getRarityColor(badge.rarity)}`}
                        >
                            <div className="text-4xl mb-2">{badge.icon}</div>
                            <div className="font-semibold text-gray-800 text-sm mb-1">{badge.name}</div>
                            <div className="text-xs text-gray-600 mb-2">{badge.description}</div>
                            <div className={`text-xs font-medium ${getRarityTextColor(badge.rarity)}`}>
                                {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                            </div>
                            {badge.earnedDate && (
                                <div className="text-xs text-gray-500 mt-1">
                                    {new Date(badge.earnedDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Upcoming Badges */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Badges</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {upcomingBadges.map((badge) => (
                        <div
                            key={badge.id}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center opacity-60 hover:opacity-80 transition-opacity"
                        >
                            <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                            <div className="font-semibold text-gray-600 text-sm mb-1">{badge.name}</div>
                            <div className="text-xs text-gray-500 mb-2">{badge.description}</div>
                            <div className={`text-xs font-medium ${getRarityTextColor(badge.rarity)}`}>
                                {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Not earned yet</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leaderboard Teaser */}
            <div className="mt-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Community Ranking</h3>
                        <div className="text-gray-600">
                            <div className="mb-1">🏆 Rank #23 out of 1,247 travelers</div>
                            <div className="mb-1">📈 +5 positions this month</div>
                            <div>⚡ Top 10% most active explorers</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                            View Leaderboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gamification;
