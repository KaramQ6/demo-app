// Centralized API utility file for SmartTour.Jo
// All API calls should be managed through this file

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Generic API request helper
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Authentication APIs
export const authAPI = {
    login: (credentials) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    register: (userData) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    logout: () => apiRequest('/auth/logout', { method: 'POST' }),
    resetPassword: (email) => apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
    }),
};

// User Profile APIs
export const profileAPI = {
    getUserProfile: (userId) => apiRequest(`/users/${userId}`),
    updateUserProfile: (userId, profileData) => apiRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
    }),
    updateUserPreferences: (userId, preferences) => apiRequest(`/users/${userId}/preferences`, {
        method: 'PUT',
        body: JSON.stringify(preferences),
    }),
    getTravelHistory: (userId) => apiRequest(`/users/${userId}/travel-history`),
    getWishlist: (userId) => apiRequest(`/users/${userId}/wishlist`),
    addToWishlist: (userId, destinationId) => apiRequest(`/users/${userId}/wishlist`, {
        method: 'POST',
        body: JSON.stringify({ destinationId }),
    }),
    removeFromWishlist: (userId, destinationId) => apiRequest(`/users/${userId}/wishlist/${destinationId}`, {
        method: 'DELETE',
    }),
};

// Destinations APIs
export const destinationsAPI = {
    getAllDestinations: () => apiRequest('/destinations'),
    getDestinationById: (id) => apiRequest(`/destinations/${id}`),
    searchDestinations: (query) => apiRequest(`/destinations/search?q=${encodeURIComponent(query)}`),
    getRecommendedDestinations: (userId) => apiRequest(`/destinations/recommended/${userId}`),
};

// AI & Prediction APIs
export const aiAPI = {
    getPredictedTrip: (preferences) => apiRequest('/ai/predict-trip', {
        method: 'POST',
        body: JSON.stringify(preferences),
    }),
    getCrowdPredictionData: (destinationId) => apiRequest(`/ai/crowd-prediction/${destinationId}`),
    processNaturalLanguage: (query) => apiRequest('/ai/nlp', {
        method: 'POST',
        body: JSON.stringify({ query }),
    }),
    getChatbotResponse: (message, context) => apiRequest('/ai/chatbot', {
        method: 'POST',
        body: JSON.stringify({ message, context }),
    }),
};

// Booking APIs
export const bookingAPI = {
    processBooking: (bookingData) => apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
    }),
    getUserBookings: (userId) => apiRequest(`/bookings/user/${userId}`),
    getBookingById: (bookingId) => apiRequest(`/bookings/${bookingId}`),
    cancelBooking: (bookingId) => apiRequest(`/bookings/${bookingId}/cancel`, {
        method: 'PUT',
    }),
    updateBooking: (bookingId, updates) => apiRequest(`/bookings/${bookingId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    }),
};

// Partnership & Marketplace APIs
export const partnershipAPI = {
    getPartners: (category = 'all') => apiRequest(`/partners?category=${category}`),
    getPartnerById: (partnerId) => apiRequest(`/partners/${partnerId}`),
    getPartnerServices: (partnerId) => apiRequest(`/partners/${partnerId}/services`),
    bookPartnerService: (serviceData) => apiRequest('/partners/book', {
        method: 'POST',
        body: JSON.stringify(serviceData),
    }),
};

// Community APIs
export const communityAPI = {
    getCommunityPosts: (page = 1) => apiRequest(`/community/posts?page=${page}`),
    createPost: (postData) => apiRequest('/community/posts', {
        method: 'POST',
        body: JSON.stringify(postData),
    }),
    likePost: (postId) => apiRequest(`/community/posts/${postId}/like`, {
        method: 'POST',
    }),
    commentOnPost: (postId, comment) => apiRequest(`/community/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ comment }),
    }),
    getUserPosts: (userId) => apiRequest(`/community/posts/user/${userId}`),
};

// Admin APIs
export const adminAPI = {
    getDashboardData: () => apiRequest('/admin/dashboard'),
    getUsers: (page = 1) => apiRequest(`/admin/users?page=${page}`),
    getBookings: (page = 1) => apiRequest(`/admin/bookings?page=${page}`),
    getPartners: (page = 1) => apiRequest(`/admin/partners?page=${page}`),
    approvePartner: (partnerId) => apiRequest(`/admin/partners/${partnerId}/approve`, {
        method: 'PUT',
    }),
    rejectPartner: (partnerId) => apiRequest(`/admin/partners/${partnerId}/reject`, {
        method: 'PUT',
    }),
    updateUserStatus: (userId, status) => apiRequest(`/admin/users/${userId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    }),
};

// Itinerary APIs
export const itineraryAPI = {
    createItinerary: (itineraryData) => apiRequest('/itineraries', {
        method: 'POST',
        body: JSON.stringify(itineraryData),
    }),
    getUserItineraries: (userId) => apiRequest(`/itineraries/user/${userId}`),
    getItineraryById: (itineraryId) => apiRequest(`/itineraries/${itineraryId}`),
    updateItinerary: (itineraryId, updates) => apiRequest(`/itineraries/${itineraryId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    }),
    deleteItinerary: (itineraryId) => apiRequest(`/itineraries/${itineraryId}`, {
        method: 'DELETE',
    }),
    shareItinerary: (itineraryId, shareData) => apiRequest(`/itineraries/${itineraryId}/share`, {
        method: 'POST',
        body: JSON.stringify(shareData),
    }),
};

// Voice Agent APIs
export const voiceAPI = {
    processVoiceCommand: (audioData) => apiRequest('/voice/process', {
        method: 'POST',
        body: audioData,
        headers: {
            'Content-Type': 'audio/wav',
        },
    }),
    getVoiceResponse: (text) => apiRequest('/voice/synthesize', {
        method: 'POST',
        body: JSON.stringify({ text }),
    }),
};

// Error handler for API calls
export const handleAPIError = (error) => {
    console.error('API Error:', error);
    // Add global error handling logic here
    // e.g., show toast notifications, redirect to login, etc.
};

export default {
    auth: authAPI,
    profile: profileAPI,
    destinations: destinationsAPI,
    ai: aiAPI,
    booking: bookingAPI,
    partnership: partnershipAPI,
    community: communityAPI,
    admin: adminAPI,
    itinerary: itineraryAPI,
    voice: voiceAPI,
    handleError: handleAPIError,
};
