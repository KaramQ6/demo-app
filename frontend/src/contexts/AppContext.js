import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { language, t } = useLanguage();
  
  // --- States for Chatbot and Geolocation (Existing Logic - DO NOT CHANGE) ---
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatbot, setShowChatbot] = useState(true);
  const [liveData, setLiveData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true); // For user's location
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // --- NEW: States for Multi-City Data Page ---
  const [citiesData, setCitiesData] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(true);

  // Effect for user's geolocation (for chatbot)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude }),
      (error) => setLocationError("User denied location access.")
    );
  }, []);

  // Effect to fetch live data for the user's location (for chatbot)
  useEffect(() => {
    const fetchUserLiveData = async () => {
      if (!userLocation) return;
      setIsLoadingData(true);
      const { lat, lon } = userLocation;
      const liveDataUrl = `https://karamq5.app.n8n.cloud/webhook/b6868914-36ea-4781-8b6d-21ddb4f44658?lat=${lat}&lon=${lon}&lang=${language}`;
      try {
        const response = await fetch(liveDataUrl);
        if (!response.ok) throw new Error('Failed to fetch user live data');
        const data = await response.json();
        setLiveData(data);
      } catch (error) {
        console.error("User Live Data Fetch Error:", error);
        setLiveData(null);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchUserLiveData();
  }, [userLocation, language]);

  // --- NEW: Effect to fetch data for multiple cities (for /data page) ---
  useEffect(() => {
    const fetchCitiesData = async () => {
      const cities = ['Amman', 'Petra', 'Aqaba', 'Irbid', 'Jerash'];
      setIsCitiesLoading(true);
      try {
        const cityPromises = cities.map(city =>
          fetch(`https://karamq5.app.n8n.cloud/webhook/b6868914-36ea-4781-8b6d-21ddb4f44658?city=${city}&lang=${language}`).then(res => {
            if (!res.ok) {
              console.error(`Failed to fetch data for ${city}`);
              return null; // Return null for failed fetches
            }
            return res.json();
          })
        );
        const results = await Promise.all(cityPromises);
        setCitiesData(results.filter(Boolean)); // Filter out any null results
      } catch (error) {
        console.error("Cities Data Fetch Error:", error);
        setCitiesData([]);
      } finally {
        setIsCitiesLoading(false);
      }
    };
    fetchCitiesData();
  }, [language]);

  // (The rest of your functions: sendMessage, openChatbot, etc.)
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
        body: JSON.stringify({ message: userInput, sessionId: sessionId })
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
  const toggleChatbotVisibility = () => {
    const isHidden = sessionStorage.getItem('isChatbotHidden') === 'true';
    sessionStorage.setItem('isChatbotHidden', !isHidden);
    setShowChatbot(isHidden);
    if (!isHidden) setIsChatbotOpen(false);
  };

  useEffect(() => {
    const isHidden = sessionStorage.getItem('isChatbotHidden') === 'true';
    setShowChatbot(!isHidden);
  }, []);

  // Combine all values for the provider, including the new ones
  const value = {
    isChatbotOpen, openChatbot, closeChatbot, chatMessages, isTyping, sendMessage,
    showChatbot, toggleChatbotVisibility, liveData, isLoadingData, locationError,
    setChatMessages, setIsTyping,
    citiesData,       // NEW
    isCitiesLoading   // NEW
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};