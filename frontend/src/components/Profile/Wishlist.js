import React, { useState } from 'react';

const Wishlist = () => {
    // Initial wishlist state with local state management
    const [wishlistItems, setWishlistItems] = useState([
        {
            id: 'wish_1',
            name: 'Jerash',
            description: 'Ancient Roman city with spectacular ruins and well-preserved colonnaded streets',
            estimatedBudget: 150,
            bestTimeToVisit: 'Spring (March-May)',
            priority: 'high',
            addedDate: '2024-07-01',
            image: '/images/jerash.jpg',
            duration: '1 day',
            difficulty: 'Easy'
        },
        {
            id: 'wish_2',
            name: 'Aqaba',
            description: 'Red Sea diving paradise with vibrant coral reefs and marine life',
            estimatedBudget: 300,
            bestTimeToVisit: 'Year-round',
            priority: 'medium',
            addedDate: '2024-06-20',
            image: '/images/aqaba.jpg',
            duration: '3-4 days',
            difficulty: 'Moderate'
        },
        {
            id: 'wish_3',
            name: 'Dana Biosphere Reserve',
            description: 'Nature reserve with hiking trails and diverse ecosystems',
            estimatedBudget: 200,
            bestTimeToVisit: 'Fall (September-November)',
            priority: 'medium',
            addedDate: '2024-06-15',
            image: '/images/dana.jpg',
            duration: '2-3 days',
            difficulty: 'Moderate'
        },
        {
            id: 'wish_4',
            name: 'Ajloun Castle',
            description: 'Medieval Islamic fortress with panoramic views of the Jordan Valley',
            estimatedBudget: 80,
            bestTimeToVisit: 'Spring & Fall',
            priority: 'low',
            addedDate: '2024-05-30',
            image: '/images/ajloun.jpg',
            duration: '1 day',
            difficulty: 'Easy'
        },
        {
            id: 'wish_5',
            name: 'Kerak Castle',
            description: 'Crusader castle with fascinating history and underground passages',
            estimatedBudget: 120,
            bestTimeToVisit: 'Spring & Fall',
            priority: 'medium',
            addedDate: '2024-05-15',
            image: '/images/kerak.jpg',
            duration: '1-2 days',
            difficulty: 'Easy'
        }
    ]);

    const [filter, setFilter] = useState('all');
    const [sortBy, setSortBy] = useState('priority');

    // Remove item from wishlist
    const removeFromWishlist = (id) => {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
    };

    // Update priority
    const updatePriority = (id, newPriority) => {
        setWishlistItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, priority: newPriority } : item
            )
        );
    };

    // Filter and sort logic
    const filteredAndSortedItems = wishlistItems
        .filter(item => filter === 'all' || item.priority === filter)
        .sort((a, b) => {
            if (sortBy === 'priority') {
                const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            } else if (sortBy === 'budget') {
                return a.estimatedBudget - b.estimatedBudget;
            } else if (sortBy === 'date') {
                return new Date(b.addedDate) - new Date(a.addedDate);
            }
            return 0;
        });

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700 border-red-200';
            case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const totalBudget = wishlistItems.reduce((sum, item) => sum + item.estimatedBudget, 0);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h2>

            {/* Wishlist Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{wishlistItems.length}</div>
                    <div className="text-sm text-gray-600">Destinations</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">${totalBudget}</div>
                    <div className="text-sm text-gray-600">Est. Total Cost</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">
                        {wishlistItems.filter(item => item.priority === 'high').length}
                    </div>
                    <div className="text-sm text-gray-600">High Priority</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        ${Math.round(totalBudget / wishlistItems.length)}
                    </div>
                    <div className="text-sm text-gray-600">Avg. Cost</div>
                </div>
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex gap-2">
                    <label className="text-sm font-medium text-gray-700">Filter by Priority:</label>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                        <option value="all">All Priorities</option>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                    </select>
                </div>

                <div className="flex gap-2">
                    <label className="text-sm font-medium text-gray-700">Sort by:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                        <option value="priority">Priority</option>
                        <option value="budget">Budget (Low to High)</option>
                        <option value="date">Date Added</option>
                    </select>
                </div>
            </div>

            {/* Wishlist Items */}
            <div className="space-y-4">
                {filteredAndSortedItems.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">📍</div>
                        <div className="text-lg font-medium mb-2">No destinations match your filter</div>
                        <div className="text-sm">Try adjusting your filter settings</div>
                    </div>
                ) : (
                    filteredAndSortedItems.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Destination Image */}
                                <div className="w-full md:w-48 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">{item.name}</span>
                                </div>

                                {/* Destination Details */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                                            <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                                            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                                        <div>
                                            <span className="font-medium">Budget:</span> ${item.estimatedBudget}
                                        </div>
                                        <div>
                                            <span className="font-medium">Duration:</span> {item.duration}
                                        </div>
                                        <div>
                                            <span className="font-medium">Difficulty:</span> {item.difficulty}
                                        </div>
                                        <div>
                                            <span className="font-medium">Best Time:</span> {item.bestTimeToVisit}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-gray-500">
                                            Added {formatDate(item.addedDate)}
                                        </div>

                                        <div className="flex gap-2">
                                            {/* Priority Selector */}
                                            <select
                                                value={item.priority}
                                                onChange={(e) => updatePriority(item.id, e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1 text-xs"
                                            >
                                                <option value="high">High Priority</option>
                                                <option value="medium">Medium Priority</option>
                                                <option value="low">Low Priority</option>
                                            </select>

                                            {/* Action Buttons */}
                                            <button className="bg-blue-100 text-blue-700 py-1 px-3 rounded text-xs hover:bg-blue-200 transition-colors">
                                                Book Now
                                            </button>
                                            <button className="bg-green-100 text-green-700 py-1 px-3 rounded text-xs hover:bg-green-200 transition-colors">
                                                Share
                                            </button>
                                            <button
                                                onClick={() => removeFromWishlist(item.id)}
                                                className="bg-red-100 text-red-700 py-1 px-3 rounded text-xs hover:bg-red-200 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add New Destination */}
            <div className="mt-8 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <div className="text-4xl mb-2">➕</div>
                <div className="font-medium text-gray-700 mb-1">Add New Destination</div>
                <div className="text-sm text-gray-500 mb-4">Discover more amazing places in Jordan</div>
                <button className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">
                    Browse Destinations
                </button>
            </div>

            {/* Wishlist Actions */}
            <div className="mt-6 flex gap-3">
                <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition-colors text-sm">
                    Export Wishlist
                </button>
                <button className="bg-purple-100 text-purple-700 py-2 px-4 rounded hover:bg-purple-200 transition-colors text-sm">
                    Plan Trip from Wishlist
                </button>
                <button className="bg-green-100 text-green-700 py-2 px-4 rounded hover:bg-green-200 transition-colors text-sm">
                    Share Wishlist
                </button>
            </div>
        </div>
    );
};

export default Wishlist;
