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
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        console.log("Preferences saved to localStorage:", preferences);

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
        const checkUserAndProfile = async () => {
            setLoading(true); // ابدأ التحميل هنا

            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;

                const currentUser = session?.user;
                setUser(currentUser ?? null);

                if (currentUser) {
                    console.log("User found, attempting to fetch profile...");
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('preferences')
                        .eq('id', currentUser.id)
                        .single();

                    if (profileError && profileError.code !== 'PGRST116') {
                        // PGRST116 means "No rows found", which is not a critical error for new users.
                        // We only throw for other, more serious errors.
                        throw profileError;
                    }

                    if (profile && profile.preferences) {
                        console.log("Profile found, setting preferences:", profile.preferences);
                        setUserPreferences(profile.preferences);
                        localStorage.setItem('userPreferences', JSON.stringify(profile.preferences));
                    } else {
                        console.log("No profile found for this user yet.");
                    }
                } else {
                    console.log("No user session found.");
                }

            } catch (error) {
                console.error("Critical error in AppContext useEffect:", error);
                // يمكنك عرض رسالة خطأ للمستخدم هنا إذا أردت
            } finally {
                // **هذا هو الجزء الأهم**
                // سيتم تنفيذ هذا السطر دائمًا، سواء نجح الكود أو فشل
                console.log("Finished auth check, setting loading to false.");
                setLoading(false);
            }
        };

        checkUserAndProfile();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
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
            const chatbotApiUrl = `https://karamq6.app.n8n.cloud/webhook/Simple-Weather-API-ChatBot?lat=${userLocation.lat}&lon=${userLocation.lon}&lang=${language}`;
            try {
                const response = await fetch(chatbotApiUrl);
                if (!response.ok) throw new Error(`API Error: ${response.status}`);

                const text = await response.text();
                if (!text || text.trim() === '') {
                    console.warn("Received empty response from weather API");
                    setLiveData(null);
                    return;
                }

                try {
                    const data = JSON.parse(text);
                    setLiveData(data);
                } catch (jsonError) {
                    console.error("JSON parsing error:", jsonError, "Response text:", text);
                    setLiveData(null);
                }
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
                const liveDataApiUrl = `https://karamq6.app.n8n.cloud/webhook/Simple-Weather-API-Live-Data?city=${city}&lang=${language}`;
                try {
                    const response = await fetch(liveDataApiUrl);
                    if (!response.ok) {
                        console.warn(`API Error for ${city}: ${response.status}`);
                        return null;
                    }

                    const text = await response.text();
                    if (!text || text.trim() === '') {
                        console.warn(`Received empty response for ${city}`);
                        return null;
                    }

                    try {
                        return JSON.parse(text);
                    } catch (jsonError) {
                        console.error(`JSON parsing error for ${city}:`, jsonError, "Response:", text.substring(0, 100));
                        return null;
                    }
                } catch (error) {
                    console.error(`Network error fetching data for ${city}:`, error);
                    return null;
                }
            });

            try {
                const results = await Promise.all(cityPromises);
                const validResults = results.filter(Boolean);
                setCitiesData(validResults);
                console.log(`Successfully loaded data for ${validResults.length}/${cities.length} cities`);
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
        const chatbotUrl = "https://karamq6.app.n8n.cloud/webhook/gemini-tour-chat";

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

            if (!response.ok) {
                throw new Error(`Chatbot API Error: ${response.status}`);
            }

            const text = await response.text();
            if (!text || text.trim() === '') {
                throw new Error('Empty response from chatbot');
            }

            let data;
            try {
                data = JSON.parse(text);
            } catch (jsonError) {
                console.error("Chatbot JSON parsing error:", jsonError, "Response:", text);
                throw new Error('Invalid JSON response from chatbot');
            }

            const botMessage = {
                id: Date.now() + 1,
                text: data.reply || "عذراً، لم أتمكن من الحصول على رد صحيح",
                type: 'bot',
                timestamp: new Date()
            };
            setChatMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Chat API Error:", error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "❌ عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.",
                type: 'bot',
                timestamp: new Date()
            };
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