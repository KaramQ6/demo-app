import React, { useState } from 'react';
import useBookingStore from '../../stores/bookingStore';

const Payment = () => {
    const {
        tripDetails,
        bookingOptions,
        guestList,
        paymentInfo,
        updatePaymentInfo
    } = useBookingStore();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');

    const handlePaymentInfoChange = (field, value) => {
        updatePaymentInfo({ [field]: value });
    };

    const handleBillingAddressChange = (field, value) => {
        updatePaymentInfo({
            billingAddress: {
                ...paymentInfo.billingAddress,
                [field]: value
            }
        });
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const getCardType = (number) => {
        const cleanNumber = number.replace(/\s/g, '');
        if (cleanNumber.startsWith('4')) return 'visa';
        if (cleanNumber.startsWith('5')) return 'mastercard';
        if (cleanNumber.startsWith('3')) return 'amex';
        return 'unknown';
    };

    const primaryGuest = guestList.find(guest => guest.isPrimary);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Information</h2>
                <p className="text-gray-600">
                    Secure payment processing - Your information is encrypted and protected
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payment Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Payment Method Selection */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === 'card'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="card"
                                    checked={selectedPaymentMethod === 'card'}
                                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                    className="sr-only"
                                />
                                <div className="text-center">
                                    <div className="text-2xl mb-2">💳</div>
                                    <div className="font-medium">Credit Card</div>
                                    <div className="text-sm text-gray-500">Visa, Mastercard</div>
                                </div>
                            </label>

                            <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === 'paypal'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="paypal"
                                    checked={selectedPaymentMethod === 'paypal'}
                                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                    className="sr-only"
                                />
                                <div className="text-center">
                                    <div className="text-2xl mb-2">📱</div>
                                    <div className="font-medium">PayPal</div>
                                    <div className="text-sm text-gray-500">Digital wallet</div>
                                </div>
                            </label>

                            <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${selectedPaymentMethod === 'bank'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="bank"
                                    checked={selectedPaymentMethod === 'bank'}
                                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                    className="sr-only"
                                />
                                <div className="text-center">
                                    <div className="text-2xl mb-2">🏦</div>
                                    <div className="font-medium">Bank Transfer</div>
                                    <div className="text-sm text-gray-500">Direct transfer</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Credit Card Form */}
                    {selectedPaymentMethod === 'card' && (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="mr-3">💳</span>
                                Credit Card Details
                            </h3>

                            {/* Accepted Cards */}
                            <div className="flex items-center space-x-4 mb-6 pb-4 border-b border-gray-200">
                                <span className="text-sm text-gray-600">We accept:</span>
                                <div className="flex space-x-2">
                                    <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">VISA</div>
                                    <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">MC</div>
                                    <div className="bg-blue-800 text-white px-2 py-1 rounded text-xs font-bold">AMEX</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Cardholder Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cardholder Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentInfo.cardholderName}
                                        onChange={(e) => handlePaymentInfoChange('cardholderName', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Full name as shown on card"
                                        required
                                    />
                                </div>

                                {/* Card Number */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Card Number *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={paymentInfo.cardNumber}
                                            onChange={(e) => handlePaymentInfoChange('cardNumber', formatCardNumber(e.target.value))}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                            required
                                        />
                                        {paymentInfo.cardNumber && (
                                            <div className="absolute right-3 top-3">
                                                {getCardType(paymentInfo.cardNumber) === 'visa' && (
                                                    <div className="bg-blue-600 text-white px-1 py-0.5 rounded text-xs font-bold">VISA</div>
                                                )}
                                                {getCardType(paymentInfo.cardNumber) === 'mastercard' && (
                                                    <div className="bg-red-600 text-white px-1 py-0.5 rounded text-xs font-bold">MC</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Expiry and CVC */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expiry Month *
                                            </label>
                                            <select
                                                value={paymentInfo.expiryMonth}
                                                onChange={(e) => handlePaymentInfoChange('expiryMonth', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            >
                                                <option value="">MM</option>
                                                {Array.from({ length: 12 }, (_, i) => (
                                                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                                        {String(i + 1).padStart(2, '0')}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Expiry Year *
                                            </label>
                                            <select
                                                value={paymentInfo.expiryYear}
                                                onChange={(e) => handlePaymentInfoChange('expiryYear', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            >
                                                <option value="">YYYY</option>
                                                {Array.from({ length: 10 }, (_, i) => (
                                                    <option key={i} value={new Date().getFullYear() + i}>
                                                        {new Date().getFullYear() + i}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CVC *
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentInfo.cvc}
                                            onChange={(e) => handlePaymentInfoChange('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="123"
                                            maxLength="4"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            3-digit code on back of card (4 digits for Amex)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Billing Address */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <span className="mr-3">🏠</span>
                            Billing Address
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Country
                                </label>
                                <select
                                    value={paymentInfo.billingAddress.country}
                                    onChange={(e) => handleBillingAddressChange('country', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Jordan">Jordan</option>
                                    <option value="Saudi Arabia">Saudi Arabia</option>
                                    <option value="UAE">UAE</option>
                                    <option value="Egypt">Egypt</option>
                                    <option value="Lebanon">Lebanon</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={paymentInfo.billingAddress.city}
                                    onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter city"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={paymentInfo.billingAddress.address}
                                    onChange={(e) => handleBillingAddressChange('address', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Street address"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    value={paymentInfo.billingAddress.postalCode}
                                    onChange={(e) => handleBillingAddressChange('postalCode', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Postal code"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h4 className="font-medium text-green-800 mb-3 flex items-center">
                            <span className="mr-2">🔒</span>
                            Secure Payment
                        </h4>
                        <ul className="text-sm text-green-700 space-y-2">
                            <li>• Your payment information is encrypted using 256-bit SSL</li>
                            <li>• We never store your credit card details on our servers</li>
                            <li>• This transaction is processed by our secure payment partner</li>
                            <li>• You will receive a confirmation email after payment</li>
                        </ul>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>

                        {/* Trip Details */}
                        <div className="space-y-3 pb-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">{tripDetails.image}</span>
                                <div>
                                    <h4 className="font-medium text-gray-800">{tripDetails.title}</h4>
                                    <p className="text-sm text-gray-600">{tripDetails.duration}</p>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600">
                                <p><strong>Date:</strong> {new Date(bookingOptions.selectedDate).toLocaleDateString()}</p>
                                <p><strong>Travelers:</strong> {guestList.length} guest(s)</p>
                                {primaryGuest && (
                                    <p><strong>Primary:</strong> {primaryGuest.firstName} {primaryGuest.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-2 py-4 border-b border-gray-200">
                            <div className="flex justify-between text-sm">
                                <span>Trip price (per person)</span>
                                <span>${tripDetails.price}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Number of travelers</span>
                                <span>{bookingOptions.numberOfGuests}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>${bookingOptions.totalPrice}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Service fee</span>
                                <span>${Math.round(bookingOptions.totalPrice * 0.05)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Travel insurance (optional)</span>
                                <span>$0</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="pt-4">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Total</span>
                                <span className="text-blue-600">
                                    ${bookingOptions.totalPrice + Math.round(bookingOptions.totalPrice * 0.05)}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Includes all taxes and fees
                            </p>
                        </div>

                        {/* Terms */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <label className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    required
                                />
                                <span className="text-xs text-gray-600">
                                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and{' '}
                                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
