// SmartTour.Jo API Functions
// Centralized API layer for all backend interactions

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
};

// ===== USER PROFILE API =====

export const getUserProfile = async (userId) => {
    try {
        // Placeholder implementation - will connect to real backend
        console.log('Fetching user profile for:', userId);

        // Mock data for development
        return {
            id: userId || '1',
            name: 'Ahmed Al-Zahra',
            email: 'ahmed@smarttour.jo',
            avatar: '/images/default-avatar.png',
            location: 'Amman, Jordan',
            joinDate: '2024-01-15',
            preferences: {
                travelStyle: 'adventure',
                budget: 'medium',
                interests: ['history', 'culture', 'nature'],
                language: 'en'
            },
            stats: {
                tripsCompleted: 12,
                placesVisited: 47,
                points: 2840,
                level: 'Explorer'
            }
        };
    } catch (error) {
        throw new Error(`Failed to get user profile: ${error.message}`);
    }
};

export const updateUserProfile = async (userId, profileData) => {
    try {
        console.log('Updating user profile:', userId, profileData);

        // Mock implementation
        return {
            success: true,
            message: 'Profile updated successfully',
            data: { ...profileData, id: userId, updatedAt: new Date().toISOString() }
        };
    } catch (error) {
        throw new Error(`Failed to update user profile: ${error.message}`);
    }
};

export const getTravelHistory = async (userId) => {
    try {
        console.log('Fetching travel history for:', userId);

        // Mock travel history data
        return {
            trips: [
                {
                    id: 'trip_1',
                    destination: 'Petra',
                    date: '2024-06-15',
                    duration: 3,
                    rating: 5,
                    images: ['/images/petra_1.jpg', '/images/petra_2.jpg'],
                    highlights: ['Treasury', 'Monastery', 'Siq walkway']
                },
                {
                    id: 'trip_2',
                    destination: 'Wadi Rum',
                    date: '2024-05-20',
                    duration: 2,
                    rating: 5,
                    images: ['/images/wadi_rum_1.jpg'],
                    highlights: ['Desert camping', 'Camel riding', 'Star gazing']
                },
                {
                    id: 'trip_3',
                    destination: 'Dead Sea',
                    date: '2024-04-10',
                    duration: 1,
                    rating: 4,
                    images: ['/images/dead_sea_1.jpg'],
                    highlights: ['Floating experience', 'Mud therapy', 'Resort spa']
                }
            ],
            totalTrips: 12,
            totalDays: 45,
            favoriteDestination: 'Petra'
        };
    } catch (error) {
        throw new Error(`Failed to get travel history: ${error.message}`);
    }
};

export const getWishlist = async (userId) => {
    try {
        console.log('Fetching wishlist for:', userId);

        // Mock wishlist data
        return {
            destinations: [
                {
                    id: 'wish_1',
                    name: 'Jerash',
                    description: 'Ancient Roman city with spectacular ruins',
                    image: '/images/jerash.jpg',
                    estimatedBudget: 150,
                    bestTimeToVisit: 'Spring',
                    priority: 'high',
                    addedDate: '2024-07-01'
                },
                {
                    id: 'wish_2',
                    name: 'Aqaba',
                    description: 'Red Sea diving and marine life',
                    image: '/images/aqaba.jpg',
                    estimatedBudget: 300,
                    bestTimeToVisit: 'Year-round',
                    priority: 'medium',
                    addedDate: '2024-06-20'
                },
                {
                    id: 'wish_3',
                    name: 'Dana Biosphere',
                    description: 'Nature reserve with hiking trails',
                    image: '/images/dana.jpg',
                    estimatedBudget: 200,
                    bestTimeToVisit: 'Fall',
                    priority: 'medium',
                    addedDate: '2024-06-15'
                }
            ],
            totalItems: 3
        };
    } catch (error) {
        throw new Error(`Failed to get wishlist: ${error.message}`);
    }
};

// ===== COMMUNITY API =====

export const getCommunityPosts = async (filters = {}) => {
    try {
        console.log('Fetching community posts with filters:', filters);

        // Mock community posts
        return {
            posts: [
                {
                    id: 'post_1',
                    author: {
                        id: 'user_1',
                        name: 'Layla Al-Hashemi',
                        avatar: '/images/user_1.jpg',
                        level: 'Expert'
                    },
                    content: 'Just visited the incredible Petra by Night experience! The Treasury illuminated by candlelight is absolutely magical. Highly recommend booking in advance! 🕯️✨',
                    images: ['/images/petra_night_1.jpg', '/images/petra_night_2.jpg'],
                    destination: 'Petra',
                    timestamp: '2024-07-05T18:30:00Z',
                    likes: 47,
                    comments: 12,
                    tags: ['petra', 'night', 'treasury', 'magical']
                },
                {
                    id: 'post_2',
                    author: {
                        id: 'user_2',
                        name: 'Omar Mansouri',
                        avatar: '/images/user_2.jpg',
                        level: 'Explorer'
                    },
                    content: 'Wadi Rum desert camping was life-changing! Three days of silence, stars, and stunning red landscapes. Our Bedouin guide Mohammed was incredible - shared so many stories and traditions.',
                    images: ['/images/wadi_rum_camp.jpg'],
                    destination: 'Wadi Rum',
                    timestamp: '2024-07-04T14:20:00Z',
                    likes: 35,
                    comments: 8,
                    tags: ['wadi-rum', 'camping', 'bedouin', 'desert']
                },
                {
                    id: 'post_3',
                    author: {
                        id: 'user_3',
                        name: 'Sarah Johnson',
                        avatar: '/images/user_3.jpg',
                        level: 'Adventurer'
                    },
                    content: 'Dead Sea float and mud therapy day! The mineral-rich mud left my skin feeling amazing. Pro tip: bring water shoes - the salt crystals can be sharp!',
                    images: ['/images/dead_sea_float.jpg'],
                    destination: 'Dead Sea',
                    timestamp: '2024-07-03T11:15:00Z',
                    likes: 28,
                    comments: 6,
                    tags: ['dead-sea', 'spa', 'relaxation', 'tips']
                }
            ],
            totalPosts: 156,
            currentPage: 1,
            totalPages: 16
        };
    } catch (error) {
        throw new Error(`Failed to get community posts: ${error.message}`);
    }
};

export const createCommunityPost = async (postData) => {
    try {
        console.log('Creating community post:', postData);

        // Mock post creation
        const newPost = {
            id: `post_${Date.now()}`,
            author: {
                id: 'current_user',
                name: 'Current User',
                avatar: '/images/default-avatar.png',
                level: 'Explorer'
            },
            ...postData,
            timestamp: new Date().toISOString(),
            likes: 0,
            comments: 0
        };

        return {
            success: true,
            message: 'Post created successfully',
            post: newPost
        };
    } catch (error) {
        throw new Error(`Failed to create community post: ${error.message}`);
    }
};

// ===== BOOKING API =====

export const getBookingAvailability = async (destinationId, dates) => {
    try {
        console.log('Checking booking availability:', destinationId, dates);

        // Mock availability data
        return {
            destination: {
                id: destinationId,
                name: 'Petra Archaeological Park',
                description: 'Full-day guided tour of Petra including Treasury, Royal Tombs, and Monastery'
            },
            availability: [
                {
                    date: '2024-08-10',
                    slots: [
                        { time: '08:00', available: true, price: 75, guide: 'Mohammad Al-Bdoul' },
                        { time: '10:00', available: true, price: 75, guide: 'Fatima Al-Zahra' },
                        { time: '14:00', available: false, price: 75, guide: null }
                    ]
                },
                {
                    date: '2024-08-11',
                    slots: [
                        { time: '08:00', available: true, price: 75, guide: 'Ahmad Salameh' },
                        { time: '10:00', available: true, price: 75, guide: 'Layla Al-Hashemi' },
                        { time: '14:00', available: true, price: 75, guide: 'Omar Mansouri' }
                    ]
                }
            ],
            priceRange: { min: 65, max: 85 },
            includes: ['Professional guide', 'Entry tickets', 'Transportation', 'Lunch', 'Water'],
            duration: '8 hours',
            difficulty: 'Moderate',
            groupSize: { min: 1, max: 15 }
        };
    } catch (error) {
        throw new Error(`Failed to get booking availability: ${error.message}`);
    }
};

export const processBooking = async (bookingData) => {
    try {
        console.log('Processing booking:', bookingData);

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock booking processing
        const booking = {
            id: `booking_${Date.now()}`,
            confirmationCode: `ST${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
            ...bookingData,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            totalAmount: bookingData.totalPrice + Math.round(bookingData.totalPrice * 0.05), // Add service fee
            paymentStatus: 'paid'
        };

        return {
            success: true,
            message: 'Booking confirmed successfully',
            booking: booking,
            nextSteps: [
                'Check your email for detailed confirmation',
                'Download the SmartTour.Jo app for trip updates',
                'Meet your guide at the designated location 15 minutes early',
                'Bring comfortable walking shoes and sun protection'
            ]
        };
    } catch (error) {
        throw new Error(`Failed to process booking: ${error.message}`);
    }
};

export const validatePaymentInfo = async (paymentData) => {
    try {
        console.log('Validating payment info (mock)');

        // Mock payment validation - in real implementation would validate with payment processor
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Basic validation checks
        const errors = [];

        if (!paymentData.cardholderName || paymentData.cardholderName.length < 2) {
            errors.push('Cardholder name is required');
        }

        if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 15) {
            errors.push('Valid card number is required');
        }

        if (!paymentData.expiryMonth || !paymentData.expiryYear) {
            errors.push('Card expiry date is required');
        }

        if (!paymentData.cvc || paymentData.cvc.length < 3) {
            errors.push('Valid CVC is required');
        }

        if (errors.length > 0) {
            return {
                valid: false,
                errors: errors
            };
        }

        return {
            valid: true,
            message: 'Payment information validated successfully'
        };
    } catch (error) {
        throw new Error(`Failed to validate payment info: ${error.message}`);
    }
};

export const generateBookingPDF = async (bookingData) => {
    try {
        console.log('Generating booking PDF (mock)');

        // Mock PDF generation - in real implementation would generate actual PDF
        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
            success: true,
            pdfUrl: `https://smarttour.jo/confirmations/${bookingData.confirmationCode}.pdf`,
            message: 'PDF generated successfully'
        };
    } catch (error) {
        throw new Error(`Failed to generate PDF: ${error.message}`);
    }
};

// ===== ADMIN API =====

export const getAdminUsers = async (filters = {}) => {
    try {
        console.log('Fetching admin users with filters:', filters);

        // Mock admin users data
        return {
            users: [
                {
                    id: 'user_1',
                    name: 'Ahmed Al-Zahra',
                    email: 'ahmed@example.com',
                    joinDate: '2024-01-15',
                    status: 'active',
                    tripsCount: 12,
                    totalSpent: 1200,
                    level: 'Explorer'
                },
                {
                    id: 'user_2',
                    name: 'Layla Al-Hashemi',
                    email: 'layla@example.com',
                    joinDate: '2024-02-01',
                    status: 'active',
                    tripsCount: 25,
                    totalSpent: 2800,
                    level: 'Expert'
                },
                {
                    id: 'user_3',
                    name: 'Omar Mansouri',
                    email: 'omar@example.com',
                    joinDate: '2024-03-10',
                    status: 'inactive',
                    tripsCount: 8,
                    totalSpent: 650,
                    level: 'Explorer'
                }
            ],
            totalUsers: 1247,
            activeUsers: 1156,
            newUsersThisMonth: 89
        };
    } catch (error) {
        throw new Error(`Failed to get admin users: ${error.message}`);
    }
};

export const getAdminBookings = async (filters = {}) => {
    try {
        console.log('Fetching admin bookings with filters:', filters);

        // Mock admin bookings data
        return {
            bookings: [
                {
                    id: 'booking_001',
                    confirmationCode: 'ST7A9B2C1D',
                    user: {
                        id: 'user_1',
                        name: 'Ahmed Al-Zahra',
                        email: 'ahmed@example.com'
                    },
                    destination: 'Petra',
                    date: '2024-08-10',
                    guests: 2,
                    amount: 150,
                    status: 'confirmed',
                    createdAt: '2024-07-05T10:30:00Z',
                    guide: 'Mohammad Al-Bdoul'
                },
                {
                    id: 'booking_002',
                    confirmationCode: 'ST9X8Y7Z6W',
                    user: {
                        id: 'user_2',
                        name: 'Layla Al-Hashemi',
                        email: 'layla@example.com'
                    },
                    destination: 'Wadi Rum',
                    date: '2024-08-12',
                    guests: 4,
                    amount: 300,
                    status: 'pending',
                    createdAt: '2024-07-06T14:20:00Z',
                    guide: 'Fatima Al-Zahra'
                },
                {
                    id: 'booking_003',
                    confirmationCode: 'ST5Q4R3S2T',
                    user: {
                        id: 'user_3',
                        name: 'Omar Mansouri',
                        email: 'omar@example.com'
                    },
                    destination: 'Dead Sea',
                    date: '2024-08-08',
                    guests: 1,
                    amount: 85,
                    status: 'cancelled',
                    createdAt: '2024-07-04T16:45:00Z',
                    guide: null
                }
            ],
            totalBookings: 2890,
            totalRevenue: 245670,
            averageBookingValue: 85,
            bookingsThisMonth: 234
        };
    } catch (error) {
        throw new Error(`Failed to get admin bookings: ${error.message}`);
    }
};

// Export all functions
export default {
    getUserProfile,
    updateUserProfile,
    getTravelHistory,
    getWishlist,
    getCommunityPosts,
    createCommunityPost,
    getBookingAvailability,
    processBooking,
    validatePaymentInfo,
    generateBookingPDF,
    getAdminUsers,
    getAdminBookings
};
