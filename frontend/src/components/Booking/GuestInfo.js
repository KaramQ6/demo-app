import React from 'react';
import useBookingStore from '../../stores/bookingStore';

const GuestInfo = () => {
    const {
        guestList,
        bookingOptions,
        updateGuest,
        addGuest,
        removeGuest
    } = useBookingStore();

    const handleGuestChange = (guestId, field, value) => {
        updateGuest(guestId, { [field]: value });
    };

    const handleAddGuest = () => {
        if (guestList.length < bookingOptions.numberOfGuests) {
            addGuest();
        }
    };

    const handleRemoveGuest = (guestId) => {
        removeGuest(guestId);
    };

    const countries = [
        'Jordan', 'Saudi Arabia', 'UAE', 'Egypt', 'Lebanon', 'Syria', 'Palestine',
        'Iraq', 'Kuwait', 'Qatar', 'Bahrain', 'Oman', 'Yemen', 'United States',
        'United Kingdom', 'Germany', 'France', 'Canada', 'Australia', 'Other'
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Guest Information</h2>
                <p className="text-gray-600">
                    Please provide details for all travelers ({guestList.length} of {bookingOptions.numberOfGuests})
                </p>
            </div>

            <div className="space-y-6">
                {guestList.map((guest, index) => (
                    <div key={guest.id} className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                <span className="mr-3">
                                    {guest.isPrimary ? '👤' : '👥'}
                                </span>
                                {guest.isPrimary ? 'Primary Traveler' : `Traveler ${index + 1}`}
                            </h3>

                            {!guest.isPrimary && (
                                <button
                                    onClick={() => handleRemoveGuest(guest.id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    value={guest.firstName}
                                    onChange={(e) => handleGuestChange(guest.id, 'firstName', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={guest.lastName}
                                    onChange={(e) => handleGuestChange(guest.id, 'lastName', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter last name"
                                    required
                                />
                            </div>

                            {/* Email (Primary guest only) */}
                            {guest.isPrimary && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={guest.email}
                                        onChange={(e) => handleGuestChange(guest.id, 'email', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter email address"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Booking confirmation will be sent to this email
                                    </p>
                                </div>
                            )}

                            {/* Phone (Primary guest only) */}
                            {guest.isPrimary && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={guest.phone}
                                        onChange={(e) => handleGuestChange(guest.id, 'phone', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter phone number"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        For trip updates and emergency contact
                                    </p>
                                </div>
                            )}

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    value={guest.dateOfBirth}
                                    onChange={(e) => handleGuestChange(guest.id, 'dateOfBirth', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    max={new Date().toISOString().split('T')[0]}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Required for travel insurance and age-appropriate activities
                                </p>
                            </div>

                            {/* Nationality */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nationality
                                </label>
                                <select
                                    value={guest.nationality}
                                    onChange={(e) => handleGuestChange(guest.id, 'nationality', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {countries.map(country => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Special Requirements */}
                        {guest.isPrimary && (
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Special Requirements or Dietary Restrictions
                                </label>
                                <textarea
                                    value={guest.specialRequirements || ''}
                                    onChange={(e) => handleGuestChange(guest.id, 'specialRequirements', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                    placeholder="Please mention any allergies, dietary restrictions, mobility requirements, or special assistance needed..."
                                />
                            </div>
                        )}
                    </div>
                ))}

                {/* Add More Guests */}
                {guestList.length < bookingOptions.numberOfGuests && (
                    <div className="text-center">
                        <button
                            onClick={handleAddGuest}
                            className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
                        >
                            <span className="mr-2">➕</span>
                            Add Another Traveler ({guestList.length}/{bookingOptions.numberOfGuests})
                        </button>
                    </div>
                )}

                {/* Important Notes */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                        <span className="mr-2">📋</span>
                        Important Notes
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-2">
                        <li>• All travelers must carry valid identification during the trip</li>
                        <li>• Children under 12 must be accompanied by an adult</li>
                        <li>• Please inform us of any medical conditions or special requirements</li>
                        <li>• Contact information will be used for trip updates and emergency situations</li>
                        <li>• By proceeding, you agree to our terms and conditions</li>
                    </ul>
                </div>

                {/* Emergency Contact */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-3">🚨</span>
                        Emergency Contact
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Emergency Contact Name
                            </label>
                            <input
                                type="text"
                                value={guestList[0]?.emergencyContactName || ''}
                                onChange={(e) => handleGuestChange(1, 'emergencyContactName', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter emergency contact name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Emergency Contact Phone
                            </label>
                            <input
                                type="tel"
                                value={guestList[0]?.emergencyContactPhone || ''}
                                onChange={(e) => handleGuestChange(1, 'emergencyContactPhone', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter emergency contact phone"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Relationship to Primary Traveler
                            </label>
                            <select
                                value={guestList[0]?.emergencyContactRelation || ''}
                                onChange={(e) => handleGuestChange(1, 'emergencyContactRelation', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select relationship</option>
                                <option value="spouse">Spouse</option>
                                <option value="parent">Parent</option>
                                <option value="sibling">Sibling</option>
                                <option value="child">Child</option>
                                <option value="friend">Friend</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuestInfo;
