import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
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

    const saveUserPreferences = (preferences) => {
        setUserPreferences(preferences);
        localStorage.setItem('userTravelPreferences', JSON.stringify(preferences));
        console.log("Preferences saved:", preferences);
    };

    // NEW: Effect to load preferences from localStorage on app start
    useEffect(() => {
        const savedPrefs = localStorage.getItem('userTravelPreferences');
        if (savedPrefs) {
            setUserPreferences(JSON.parse(savedPrefs));
            console.log("Preferences loaded from localStorage:", JSON.parse(savedPrefs));
        }
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
        setIsTyping(true);
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
        } finally {
            setIsTyping(false);
        }
    };
    const openChatbot = () => setIsChatbotOpen(true);
    const closeChatbot = () => setIsChatbotOpen(false);
    const toggleChatbotVisibility = () => { /* ...your existing logic... */ };

    // --- Updated Context Value ---
    const value = {
        isChatbotOpen, openChatbot, closeChatbot, chatMessages, isTyping, sendMessage, showChatbot,
        liveData, isLoadingData, locationError,
        citiesData, isCitiesLoading,
        // --- NEW Values to export ---
        userPreferences,
        saveUserPreferences
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};