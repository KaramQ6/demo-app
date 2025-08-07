import React from 'react';
import useBookingStore from '../../stores/bookingStore';

const TripSelection = () => {
    const {
        tripDetails,
        bookingOptions,
        updateBookingOptions
    } = useBookingStore();

    const handleDateChange = (e) => {
        updateBookingOptions({ selectedDate: e.target.value });
    };

    const handleGuestsChange = (e) => {
        const numberOfGuests = parseInt(e.target.value);
        updateBookingOptions({ numberOfGuests });
    };

    // Generate date options (next 60 days)
    const generateDateOptions = () => {
        const dates = [];
        const today = new Date();

        for (let i = 1; i <= 60; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }

        return dates;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateValue = (date) => {
        return date.toISOString().split('T')[0];
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Your Trip Details</h2>
                <p className="text-gray-600">Choose your travel date and number of guests</p>
            </div>

            {/* Trip Summary Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="md:flex">
                    <div className="md:w-1/3">
                        <div className="h-48 md:h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-6xl">{tripDetails.image}</span>
                        </div>
                    </div>
                    <div className="md:w-2/3 p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                    {tripDetails.title}
                                </h3>
                                <p className="text-gray-600 mb-3">{tripDetails.description}</p>
                            </div>
                            {tripDetails.match && (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {tripDetails.match}% Match
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-gray-50 rounded-md">
                                <div className="font-semibold text-gray-800">{tripDetails.duration}</div>
                                <div className="text-xs text-gray-500">Duration</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-md">
                                <div className="font-semibold text-gray-800">{tripDetails.difficulty}</div>
                                <div className="text-xs text-gray-500">Difficulty</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-md">
                                <div className="font-semibold text-gray-800">${tripDetails.price}</div>
                                <div className="text-xs text-gray-500">Per Person</div>
                            </div>
                        </div>

                        {/* Highlights */}
                        {tripDetails.highlights && tripDetails.highlights.length > 0 && (
                            <div>
                                <h4 className="font-medium text-gray-800 mb-2">Experience Highlights:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {tripDetails.highlights.map((highlight, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                                        >
                                            {highlight}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Booking Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-3">📅</span>
                        Select Travel Date
                    </h3>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Choose Date
                        </label>
                        <select
                            value={bookingOptions.selectedDate || ''}
                            onChange={handleDateChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="">Select a date...</option>
                            {generateDateOptions().map((date, index) => (
                                <option key={index} value={formatDateValue(date)}>
                                    {formatDate(date)}
                                </option>
                            ))}
                        </select>

                        {bookingOptions.selectedDate && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-md">
                                <p className="text-sm text-blue-700">
                                    <strong>Selected:</strong> {formatDate(new Date(bookingOptions.selectedDate))}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Guest Count */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-3">👥</span>
                        Number of Travelers
                    </h3>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            How many guests?
                        </label>
                        <select
                            value={bookingOptions.numberOfGuests}
                            onChange={handleGuestsChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? 'Guest' : 'Guests'}
                                </option>
                            ))}
                        </select>

                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <div className="flex justify-between items-center text-sm">
                                <span>Price per person:</span>
                                <span className="font-medium">${tripDetails.price}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span>Number of guests:</span>
                                <span className="font-medium">{bookingOptions.numberOfGuests}</span>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between items-center font-semibold">
                                <span>Total Price:</span>
                                <span className="text-lg text-blue-600">${bookingOptions.totalPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Important Information */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-medium text-yellow-800 mb-3 flex items-center">
                    <span className="mr-2">ℹ️</span>
                    Important Information
                </h4>
                <ul className="text-sm text-yellow-700 space-y-2">
                    <li>• Free cancellation up to 24 hours before the trip</li>
                    <li>• Professional guide and transportation included</li>
                    <li>• Comfortable walking shoes recommended</li>
                    <li>• Bring sun protection and water bottle</li>
                    <li>• Trip may be rescheduled due to weather conditions</li>
                </ul>
            </div>
        </div>
    );
};

export default TripSelection;
