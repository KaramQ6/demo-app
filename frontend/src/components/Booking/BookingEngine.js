import React from 'react';
import useBookingStore from '../../stores/bookingStore';
import TripSelection from './TripSelection';
import GuestInfo from './GuestInfo';
import Payment from './Payment';
import Confirmation from './Confirmation';

const BookingEngine = () => {
    const {
        currentStep,
        totalSteps,
        nextStep,
        previousStep,
        canProceedFromStep,
        tripDetails
    } = useBookingStore();

    const stepComponents = {
        1: TripSelection,
        2: GuestInfo,
        3: Payment,
        4: Confirmation
    };

    const stepTitles = {
        1: 'Trip Selection',
        2: 'Guest Information',
        3: 'Payment',
        4: 'Confirmation'
    };

    const stepIcons = {
        1: '🎯',
        2: '👥',
        3: '💳',
        4: '✅'
    };

    const CurrentStepComponent = stepComponents[currentStep];

    const handleNext = () => {
        if (canProceedFromStep(currentStep)) {
            nextStep();
        }
    };

    const handlePrevious = () => {
        previousStep();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Progress Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Complete Your Booking</h1>
                            <p className="text-gray-600">
                                {tripDetails.title && `Booking: ${tripDetails.title}`}
                            </p>
                        </div>
                        <div className="text-sm text-gray-500">
                            Step {currentStep} of {totalSteps}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center space-x-4">
                        {Array.from({ length: totalSteps }, (_, index) => {
                            const stepNumber = index + 1;
                            const isActive = stepNumber === currentStep;
                            const isCompleted = stepNumber < currentStep;
                            const isAvailable = stepNumber <= currentStep;

                            return (
                                <div key={stepNumber} className="flex items-center flex-1">
                                    <div className="flex items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${isCompleted
                                                    ? 'bg-green-600 text-white'
                                                    : isActive
                                                        ? 'bg-blue-600 text-white'
                                                        : isAvailable
                                                            ? 'bg-gray-200 text-gray-600'
                                                            : 'bg-gray-100 text-gray-400'
                                                }`}
                                        >
                                            {isCompleted ? '✓' : stepIcons[stepNumber]}
                                        </div>
                                        <div className="ml-3 min-w-0 flex-1">
                                            <div
                                                className={`text-sm font-medium ${isActive
                                                        ? 'text-blue-600'
                                                        : isCompleted
                                                            ? 'text-green-600'
                                                            : 'text-gray-500'
                                                    }`}
                                            >
                                                {stepTitles[stepNumber]}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                Step {stepNumber}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Connector Line */}
                                    {stepNumber < totalSteps && (
                                        <div
                                            className={`flex-1 h-0.5 mx-4 ${stepNumber < currentStep ? 'bg-green-600' : 'bg-gray-200'
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="py-8">
                <CurrentStepComponent />
            </div>

            {/* Navigation Footer */}
            {currentStep < totalSteps && (
                <div className="bg-white border-t border-gray-200 sticky bottom-0">
                    <div className="max-w-4xl mx-auto px-6 py-4">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className={`py-2 px-6 rounded-md font-medium transition-colors ${currentStep === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                ← Previous
                            </button>

                            <div className="flex items-center space-x-4">
                                {/* Validation Status */}
                                <div className="text-sm text-gray-600">
                                    {canProceedFromStep(currentStep) ? (
                                        <span className="text-green-600">✓ Ready to continue</span>
                                    ) : (
                                        <span className="text-orange-600">⚠ Please complete all required fields</span>
                                    )}
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={!canProceedFromStep(currentStep)}
                                    className={`py-2 px-6 rounded-md font-medium transition-colors ${canProceedFromStep(currentStep)
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {currentStep === totalSteps - 1 ? 'Complete Booking' : 'Next →'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Security Badge */}
            <div className="fixed bottom-4 left-4 z-10">
                <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                    <div className="flex items-center space-x-2 text-sm">
                        <span className="text-green-600">🔒</span>
                        <span className="text-gray-600 font-medium">SSL Secured</span>
                    </div>
                </div>
            </div>

            {/* Help Button */}
            <div className="fixed bottom-4 right-4 z-10">
                <button className="bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <span className="text-lg">💬</span>
                </button>
            </div>
        </div>
    );
};

export default BookingEngine;
