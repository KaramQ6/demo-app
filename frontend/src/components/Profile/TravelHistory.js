import React from 'react';

const TravelHistory = () => {
    // Static destination data
    const travelHistory = [
        {
            id: 'trip_1',
            destination: 'Petra',
            date: '2024-06-15',
            duration: 3,
            rating: 5,
            image: '/images/petra_1.jpg',
            highlights: ['Treasury', 'Monastery', 'Siq walkway'],
            cost: 225,
            guide: 'Mohammad Al-Bdoul'
        },
        {
            id: 'trip_2',
            destination: 'Wadi Rum',
            date: '2024-05-20',
            duration: 2,
            rating: 5,
            image: '/images/wadi_rum_1.jpg',
            highlights: ['Desert camping', 'Camel riding', 'Star gazing'],
            cost: 190,
            guide: 'Fatima Al-Zahra'
        },
        {
            id: 'trip_3',
            destination: 'Dead Sea',
            date: '2024-04-10',
            duration: 1,
            rating: 4,
            image: '/images/dead_sea_1.jpg',
            highlights: ['Floating experience', 'Mud therapy', 'Resort spa'],
            cost: 85,
            guide: 'Ahmad Salameh'
        },
        {
            id: 'trip_4',
            destination: 'Jerash',
            date: '2024-03-22',
            duration: 1,
            rating: 5,
            image: '/images/jerash_1.jpg',
            highlights: ['Roman Theater', 'Oval Plaza', 'Cardo Street'],
            cost: 65,
            guide: 'Layla Al-Hashemi'
        },
        {
            id: 'trip_5',
            destination: 'Aqaba',
            date: '2024-02-14',
            duration: 4,
            rating: 4,
            image: '/images/aqaba_1.jpg',
            highlights: ['Red Sea diving', 'Coral reefs', 'Marine life'],
            cost: 320,
            guide: 'Omar Mansouri'
        },
        {
            id: 'trip_6',
            destination: 'Dana Biosphere',
            date: '2024-01-28',
            duration: 2,
            rating: 5,
            image: '/images/dana_1.jpg',
            highlights: ['Nature hiking', 'Wildlife spotting', 'Eco lodge'],
            cost: 180,
            guide: 'Sarah Al-Khouri'
        }
    ];

    const renderStars = (rating) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const totalTrips = travelHistory.length;
    const totalDays = travelHistory.reduce((sum, trip) => sum + trip.duration, 0);
    const totalCost = travelHistory.reduce((sum, trip) => sum + trip.cost, 0);
    const averageRating = (travelHistory.reduce((sum, trip) => sum + trip.rating, 0) / totalTrips).toFixed(1);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Travel History</h2>

            {/* Travel Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalTrips}</div>
                    <div className="text-sm text-gray-600">Total Trips</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{totalDays}</div>
                    <div className="text-sm text-gray-600">Days Traveled</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">${totalCost}</div>
                    <div className="text-sm text-gray-600">Total Spent</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">{averageRating}</div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                </div>
            </div>

            {/* Travel History Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {travelHistory.map((trip) => (
                    <div key={trip.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Trip Image */}
                        <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-lg font-bold">{trip.destination}</span>
                        </div>

                        {/* Trip Details */}
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">{trip.destination}</h3>
                                <div className="text-yellow-500 text-sm">
                                    {renderStars(trip.rating)}
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 mb-3">
                                <div className="mb-1">📅 {formatDate(trip.date)}</div>
                                <div className="mb-1">⏰ {trip.duration} {trip.duration === 1 ? 'day' : 'days'}</div>
                                <div className="mb-1">👨‍🏫 {trip.guide}</div>
                                <div className="font-medium text-green-600">💰 ${trip.cost}</div>
                            </div>

                            {/* Highlights */}
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Highlights:</div>
                                <div className="flex flex-wrap gap-1">
                                    {trip.highlights.map((highlight, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                        >
                                            {highlight}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm hover:bg-blue-200 transition-colors">
                                    View Details
                                </button>
                                <button className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded text-sm hover:bg-green-200 transition-colors">
                                    Book Again
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Trip Timeline */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Travel Timeline</h3>
                <div className="space-y-2">
                    {travelHistory
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((trip, index) => (
                            <div key={trip.id} className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <div className="flex-1 text-sm">
                                    <span className="font-medium">{trip.destination}</span>
                                    <span className="text-gray-500 ml-2">{formatDate(trip.date)}</span>
                                </div>
                                <div className="text-sm text-gray-500">{trip.duration}d</div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Export Options */}
            <div className="mt-6 flex gap-3">
                <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded hover:bg-gray-200 transition-colors text-sm">
                    Export PDF
                </button>
                <button className="bg-blue-100 text-blue-700 py-2 px-4 rounded hover:bg-blue-200 transition-colors text-sm">
                    Share Timeline
                </button>
                <button className="bg-green-100 text-green-700 py-2 px-4 rounded hover:bg-green-200 transition-colors text-sm">
                    Plan Next Trip
                </button>
            </div>
        </div>
    );
};

export default TravelHistory;
