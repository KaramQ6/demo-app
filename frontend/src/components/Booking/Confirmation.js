import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useBookingStore from '../../stores/bookingStore';

const Confirmation = () => {
    const navigate = useNavigate();
    const {
        tripDetails,
        bookingOptions,
        guestList,
        bookingConfirmation,
        generateBookingReference,
        resetBooking
    } = useBookingStore();

    // Generate booking reference when component mounts
    useEffect(() => {
        if (!bookingConfirmation.bookingReference) {
            generateBookingReference();
        }
    }, [bookingConfirmation.bookingReference, generateBookingReference]);

    const primaryGuest = guestList.find(guest => guest.isPrimary);
    const totalAmount = bookingOptions.totalPrice + Math.round(bookingOptions.totalPrice * 0.05);

    const handleDownloadConfirmation = () => {
        // Mock PDF download - in real implementation, this would generate and download a PDF
        alert('PDF confirmation downloaded! (This is a mock implementation)');
    };

    const handleNewBooking = () => {
        resetBooking();
        navigate('/smart-recommendations');
    };

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Success Header */}
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">✅</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
                <p className="text-lg text-gray-600">
                    Your adventure is all set. Get ready for an amazing experience!
                </p>
            </div>

            {/* Booking Reference Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-8">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">Booking Reference</h2>
                    <div className="text-4xl font-bold font-mono tracking-wider">
                        {bookingConfirmation.bookingReference}
                    </div>
                    <p className="text-blue-100 mt-2">
                        Keep this reference number for your records
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Trip Details */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-3">🎯</span>
                        Trip Details
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <span className="text-2xl mr-4">{tripDetails.image}</span>
                            <div>
                                <h4 className="font-semibold text-gray-800">{tripDetails.title}</h4>
                                <p className="text-gray-600">{tripDetails.description}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-50 p-3 rounded-md">
                                <div className="font-medium text-gray-800">Duration</div>
                                <div className="text-gray-600">{tripDetails.duration}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md">
                                <div className="font-medium text-gray-800">Difficulty</div>
                                <div className="text-gray-600">{tripDetails.difficulty}</div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="font-medium text-gray-800 mb-2">Experience Highlights:</div>
                            <div className="flex flex-wrap gap-2">
                                {tripDetails.highlights?.map((highlight, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                                    >
                                        {highlight}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Information */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-3">📅</span>
                        Booking Information
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <div className="font-medium text-gray-800">Travel Date</div>
                            <div className="text-gray-600">
                                {new Date(bookingOptions.selectedDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="font-medium text-gray-800">Number of Travelers</div>
                            <div className="text-gray-600">{bookingOptions.numberOfGuests} guest(s)</div>
                        </div>

                        <div>
                            <div className="font-medium text-gray-800">Total Amount Paid</div>
                            <div className="text-2xl font-bold text-green-600">${totalAmount}</div>
                        </div>

                        <div>
                            <div className="font-medium text-gray-800">Confirmation Date</div>
                            <div className="text-gray-600">
                                {bookingConfirmation.confirmationDate?.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="font-medium text-gray-800">Status</div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {bookingConfirmation.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Traveler Information */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-3">👥</span>
                        Traveler Information
                    </h3>

                    <div className="space-y-4">
                        {guestList.map((guest, index) => (
                            <div key={guest.id} className={`p-4 rounded-md ${guest.isPrimary ? 'bg-blue-50' : 'bg-gray-50'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium text-gray-800">
                                            {guest.firstName} {guest.lastName}
                                            {guest.isPrimary && <span className="text-blue-600 ml-2">(Primary)</span>}
                                        </div>
                                        {guest.isPrimary && (
                                            <div className="text-sm text-gray-600">
                                                {guest.email} • {guest.phone}
                                            </div>
                                        )}
                                        <div className="text-sm text-gray-500">
                                            {guest.nationality}
                                            {guest.dateOfBirth && (
                                                <span> • {new Date().getFullYear() - new Date(guest.dateOfBirth).getFullYear()} years old</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Traveler {index + 1}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="mr-3">📋</span>
                        Next Steps
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                                1
                            </div>
                            <div>
                                <div className="font-medium text-gray-800">Check Your Email</div>
                                <div className="text-sm text-gray-600">
                                    Detailed confirmation sent to {primaryGuest?.email}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                                2
                            </div>
                            <div>
                                <div className="font-medium text-gray-800">Download SmartTour.Jo App</div>
                                <div className="text-sm text-gray-600">
                                    Get real-time updates and trip information on your mobile
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                                3
                            </div>
                            <div>
                                <div className="font-medium text-gray-800">Prepare for Your Trip</div>
                                <div className="text-sm text-gray-600">
                                    Bring comfortable shoes, sun protection, and water bottle
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                                4
                            </div>
                            <div>
                                <div className="font-medium text-gray-800">Meet Your Guide</div>
                                <div className="text-sm text-gray-600">
                                    Details will be provided 24 hours before your trip
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Important Information */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
                <h4 className="font-medium text-yellow-800 mb-3 flex items-center">
                    <span className="mr-2">⚠️</span>
                    Important Information
                </h4>
                <ul className="text-sm text-yellow-700 space-y-2">
                    <li>• Free cancellation up to 24 hours before your trip</li>
                    <li>• Please arrive 15 minutes early at the meeting point</li>
                    <li>• Contact us at +962 6 123 4567 for any questions</li>
                    <li>• Trip may be rescheduled due to weather conditions</li>
                    <li>• Keep your booking reference number handy</li>
                </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button
                    onClick={handleDownloadConfirmation}
                    className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                    <span className="mr-2">📄</span>
                    Download Confirmation PDF
                </button>

                <button
                    onClick={handleNewBooking}
                    className="border border-blue-600 text-blue-600 py-3 px-8 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                    <span className="mr-2">➕</span>
                    Book Another Trip
                </button>

                <button
                    onClick={handleGoHome}
                    className="border border-gray-300 text-gray-700 py-3 px-8 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                    <span className="mr-2">🏠</span>
                    Go to Homepage
                </button>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6 mt-8 text-center">
                <h4 className="font-medium text-gray-800 mb-3">Need Help?</h4>
                <div className="text-sm text-gray-600 space-y-1">
                    <p>📞 Phone: +962 6 123 4567</p>
                    <p>📧 Email: support@smarttour.jo</p>
                    <p>💬 WhatsApp: +962 77 123 4567</p>
                    <p>⏰ Available 24/7 for your assistance</p>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;
