import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { supabase } from '../supabaseClient'; // استيراد Supabase

export const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    // --- States for Authentication ---
    const [user, setUser] = useState(null); // حالة جديدة لتخزين معلومات المستخدم
    const [loading, setLoading] = useState(true); // حالة جديدة لمعرفة ما إذا كان يتم التحقق من المستخدم

    // --- States for Chatbot and Geolocation ---
    const { language, t } = useLanguage();
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [showChatbot, setShowChatbot] = useState(true);
    const [liveData, setLiveData] = useState(null);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);

    // --- States for Multi-City Data Page ---
    const [citiesData, setCitiesData] = useState([]);
    const [isCitiesLoading, setIsCitiesLoading] = useState(true);

    // --- NEW: State and functions for User Preferences ---
    const [userPreferences, setUserPreferences] = useState(null);

    const saveUserPreferences = async (preferences) => {
        setUserPreferences(preferences);
        localStorage.setItem('userTravelPreferences', JSON.stringify(preferences));
        console.log("Preferences saved:", preferences);

        // حفظ التفضيلات في Supabase إذا كان المستخدم مسجل دخوله
        if (user) {
            try {
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        preferences: preferences
                    });

                if (error) {
                    console.error('Error saving preferences to database:', error.message);
                } else {
                    console.log('Preferences saved to Supabase successfully');
                }
            } catch (error) {
                console.error('Error saving preferences to Supabase:', error);
            }
        }
    };

    // --- Effect for Supabase Authentication ---
    useEffect(() => {
        // تحقق من المستخدم وجلب التفضيلات
        const checkUserAndProfile = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user;
            setUser(currentUser ?? null);

            if (currentUser) {
                // إذا كان هناك مستخدم، اجلب تفضيلاته من Supabase
                try {
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('preferences')
                        .eq('id', currentUser.id)
                        .single();

                    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
                        console.error("Error fetching profile:", error.message);
                    }

                    if (profile && profile.preferences) {
                        // إذا وجدنا تفضيلات في Supabase، نحدث الحالة و localStorage
                        setUserPreferences(profile.preferences);
                        localStorage.setItem('userTravelPreferences', JSON.stringify(profile.preferences));
                        console.log("Preferences loaded from Supabase:", profile.preferences);
                    } else {
                        // إذا لم نجد تفضيلات في Supabase، نحاول تحميلها من localStorage
                        const savedPrefs = localStorage.getItem('userTravelPreferences');
                        if (savedPrefs) {
                            const localPrefs = JSON.parse(savedPrefs);
                            setUserPreferences(localPrefs);
                            console.log("Preferences loaded from localStorage:", localPrefs);

                            // احفظ التفضيلات المحلية في Supabase للمزامنة
                            const { error: upsertError } = await supabase
                                .from('profiles')
                                .upsert({
                                    id: currentUser.id,
                                    preferences: localPrefs
                                });

                            if (upsertError) {
                                console.error('Error syncing preferences to Supabase:', upsertError.message);
                            } else {
                                console.log('Local preferences synced to Supabase');
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error loading preferences:', error);
                }
            }

            setLoading(false);
        };

        checkUserAndProfile();

        // استمع لتغييرات حالة المصادقة (تسجيل دخول/خروج)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user;
            setUser(currentUser ?? null);

            if (currentUser) {
                // عند تسجيل دخول جديد، اجلب التفضيلات
                try {
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('preferences')
                        .eq('id', currentUser.id)
                        .single();

                    if (profile && profile.preferences) {
                        setUserPreferences(profile.preferences);
                        localStorage.setItem('userTravelPreferences', JSON.stringify(profile.preferences));
                    }
                } catch (error) {
                    console.error('Error loading preferences on auth change:', error);
                }
            } else {
                // عند تسجيل الخروج، امسح التفضيلات
                setUserPreferences(null);
                localStorage.removeItem('userTravelPreferences');
            }
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);


    // Effect for user's geolocation (for chatbot)
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude }),
            (error) => setLocationError("User denied location access.")
        );
    }, []);

    // Effect to fetch live data for the user's location (for chatbot)
    useEffect(() => {
        if (!userLocation) return;
        const fetchUserLiveData = async () => {
            setIsLoadingData(true);
            const chatbotApiUrl = `https://karamq5.app.n8n.cloud/webhook/Simple-Weather-API-ChatBot?lat=${userLocation.lat}&lon=${userLocation.lon}&lang=${language}`;
            try {
                const response = await fetch(chatbotApiUrl);
                if (!response.ok) throw new Error('Chatbot API fetch failed');
                const data = await response.json();
                setLiveData(data);
            } catch (error) {
                console.error("Chatbot Live Data Fetch Error:", error);
                setLiveData(null);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchUserLiveData();
    }, [userLocation, language]);

    // Effect to fetch data for multiple cities for the DATAHUB page
    useEffect(() => {
        const fetchCitiesData = async () => {
            const cities = ['Amman', 'Petra', 'Aqaba', 'Irbid', 'Jerash', 'Ajloun'];
            setIsCitiesLoading(true);

            const cityPromises = cities.map(async (city) => {
                const liveDataApiUrl = `https://karamq5.app.n8n.cloud/webhook/Simple-Weather-API-Live-Data?city=${city}&lang=${language}`;
                try {
                    const response = await fetch(liveDataApiUrl);
                    if (response.ok) {
                        const text = await response.text();
                        if (text) {
                            return JSON.parse(text);
                        }
                    }
                    console.error(`Received empty response for ${city}`);
                    return null;
                } catch (error) {
                    console.error(`Error fetching data for ${city}:`, error);
                    return null;
                }
            });

            try {
                const results = await Promise.all(cityPromises);
                setCitiesData(results.filter(Boolean));
            } catch (error) {
                console.error("An error occurred while processing city data:", error);
                setCitiesData([]);
            } finally {
                setIsCitiesLoading(false);
            }
        };

        fetchCitiesData();
    }, [language]);


    // --- Other Functions ---
    const sendMessage = async (userInput) => {
        const userMessage = { id: Date.now(), text: userInput, type: 'user', timestamp: new Date() };
        setChatMessages(prev => [...prev, userMessage]);

        let sessionId = localStorage.getItem('chatSessionId') || `session_${Date.now()}`;
        localStorage.setItem('chatSessionId', sessionId);
        const chatbotUrl = "https://karamq5.app.n8n.cloud/webhook/gemini-tour-chat";

        try {
            const response = await fetch(chatbotUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userInput,
                    sessionId: sessionId,
                    preferences: userPreferences || {} // Add the user preferences here
                })
            });
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            const botMessage = { id: Date.now() + 1, text: data.reply || "Error", type: 'bot', timestamp: new Date() };
            setChatMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat API Error:", error);
            const errorMessage = { id: Date.now() + 1, text: "❌ Connection Error", type: 'bot', timestamp: new Date() };
            setChatMessages(prev => [...prev, errorMessage]);
        }
    };
    const openChatbot = () => setIsChatbotOpen(true);
    const closeChatbot = () => setIsChatbotOpen(false);
    const toggleChatbotVisibility = () => setShowChatbot(prev => !prev);

    // --- Authentication Functions ---
    const login = (email, password) => supabase.auth.signInWithPassword({ email, password });
    const register = (email, password) => supabase.auth.signUp({ email, password });
    const logout = () => supabase.auth.signOut();

    // --- Updated Context Value ---
    const value = {
        // Authentication
        user,
        loading,
        login,
        register,
        logout,
        // Chatbot and other existing functionality
        isChatbotOpen, openChatbot, closeChatbot, chatMessages, sendMessage, showChatbot,
        liveData, isLoadingData, locationError,
        citiesData, isCitiesLoading,
        // User Preferences
        userPreferences,
        saveUserPreferences,
        toggleChatbotVisibility
    };

    return (
        <AppContext.Provider value={value}>
            {!loading && children}
        </AppContext.Provider>
    );
};