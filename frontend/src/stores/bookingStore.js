import { create } from 'zustand';

const useBookingStore = create((set, get) => ({
    // Current step in the booking wizard
    currentStep: 1,
    totalSteps: 4,

    // Trip details
    tripDetails: {
        id: null,
        title: '',
        description: '',
        image: '',
        price: 0,
        duration: '',
        difficulty: '',
        highlights: [],
        match: 0
    },

    // Selected booking options
    bookingOptions: {
        selectedDate: null,
        numberOfGuests: 1,
        totalPrice: 0
    },

    // Guest information
    guestList: [
        {
            id: 1,
            isPrimary: true,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            nationality: 'Jordan'
        }
    ],

    // Payment information (UI scaffolding only)
    paymentInfo: {
        cardholderName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvc: '',
        billingAddress: {
            country: 'Jordan',
            city: '',
            address: '',
            postalCode: ''
        }
    },

    // Booking confirmation details
    bookingConfirmation: {
        bookingReference: '',
        confirmationDate: null,
        status: 'pending'
    },

    // Actions
    setCurrentStep: (step) => set({ currentStep: step }),

    nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, state.totalSteps)
    })),

    previousStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1)
    })),

    setTripDetails: (trip) => set({
        tripDetails: trip,
        bookingOptions: {
            selectedDate: null,
            numberOfGuests: 1,
            totalPrice: trip.price || 0
        }
    }),

    updateBookingOptions: (options) => set((state) => ({
        bookingOptions: {
            ...state.bookingOptions,
            ...options,
            totalPrice: (options.numberOfGuests || state.bookingOptions.numberOfGuests) *
                (state.tripDetails.price || 0)
        }
    })),

    updateGuest: (guestId, guestData) => set((state) => ({
        guestList: state.guestList.map(guest =>
            guest.id === guestId ? { ...guest, ...guestData } : guest
        )
    })),

    addGuest: () => set((state) => {
        const newGuest = {
            id: state.guestList.length + 1,
            isPrimary: false,
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            nationality: 'Jordan'
        };
        return {
            guestList: [...state.guestList, newGuest]
        };
    }),

    removeGuest: (guestId) => set((state) => ({
        guestList: state.guestList.filter(guest => guest.id !== guestId && guest.isPrimary !== true)
    })),

    updatePaymentInfo: (paymentData) => set((state) => ({
        paymentInfo: { ...state.paymentInfo, ...paymentData }
    })),

    generateBookingReference: () => {
        const prefix = 'STJ';
        const suffix = Math.random().toString(36).substr(2, 6).toUpperCase();
        const reference = `${prefix}-${suffix}`;

        set((state) => ({
            bookingConfirmation: {
                ...state.bookingConfirmation,
                bookingReference: reference,
                confirmationDate: new Date(),
                status: 'confirmed'
            }
        }));

        return reference;
    },

    resetBooking: () => set({
        currentStep: 1,
        tripDetails: {
            id: null,
            title: '',
            description: '',
            image: '',
            price: 0,
            duration: '',
            difficulty: '',
            highlights: [],
            match: 0
        },
        bookingOptions: {
            selectedDate: null,
            numberOfGuests: 1,
            totalPrice: 0
        },
        guestList: [
            {
                id: 1,
                isPrimary: true,
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                dateOfBirth: '',
                nationality: 'Jordan'
            }
        ],
        paymentInfo: {
            cardholderName: '',
            cardNumber: '',
            expiryMonth: '',
            expiryYear: '',
            cvc: '',
            billingAddress: {
                country: 'Jordan',
                city: '',
                address: '',
                postalCode: ''
            }
        },
        bookingConfirmation: {
            bookingReference: '',
            confirmationDate: null,
            status: 'pending'
        }
    }),

    // Validation helpers
    canProceedFromStep: (step) => {
        const state = get();

        switch (step) {
            case 1: // Trip Selection
                return state.bookingOptions.selectedDate && state.bookingOptions.numberOfGuests > 0;

            case 2: // Guest Info
                const primaryGuest = state.guestList.find(guest => guest.isPrimary);
                return primaryGuest &&
                    primaryGuest.firstName &&
                    primaryGuest.lastName &&
                    primaryGuest.email &&
                    primaryGuest.phone;

            case 3: // Payment
                return state.paymentInfo.cardholderName &&
                    state.paymentInfo.cardNumber &&
                    state.paymentInfo.expiryMonth &&
                    state.paymentInfo.expiryYear &&
                    state.paymentInfo.cvc;

            default:
                return true;
        }
    }
}));

export default useBookingStore;
