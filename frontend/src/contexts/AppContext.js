import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { language } = useLanguage();
  
  // --- States for the whole app ---
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatbot, setShowChatbot] = useState(true);
  
  // --- States for Chatbot's Live Geolocation Data ---
  const [liveData, setLiveData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // --- States for the Multi-City DataHub Page ---
  const [citiesData, setCitiesData] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(true);

  // Effect to get user's geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude }),
      (error) => setLocationError("User denied location access.")
    );
  }, []);

  // Effect to fetch live data for the CHATBOT
  useEffect(() => {
    if (!userLocation) return;
    const fetchUserLiveData = async () => {
      setIsLoadingData(true);
      const { lat, lon } = userLocation;
      const chatbotApiUrl = `https://karamq5.app.n8n.cloud/webhook/Simple-Weather-API-ChatBot?lat=${lat}&lon=${lon}&lang=${language}`;
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

  // Effect to fetch data for the DATAHUB page
  useEffect(() => {
    const fetchCitiesData = async () => {
      const cities = ['Amman', 'Petra', 'Aqaba', 'Irbid', 'Jerash', 'Ajloun'];
      setIsCitiesLoading(true);
      try {
        const cityPromises = cities.map(city => {
          const liveDataApiUrl = `https://karamq5.app.n8n.cloud/webhook/Simple-Weather-API-Live-Data?city=${city}&lang=${language}`;
          return fetch(liveDataApiUrl).then(res => res.json());
        });
        const results = await Promise.all(cityPromises);
        setCitiesData(results.filter(Boolean)); // Filter out any failed requests
      } catch (error) {
        console.error("Cities Data Fetch Error:", error);
        setCitiesData([]);
      } finally {
        setIsCitiesLoading(false);
      }
    };
    fetchCitiesData();
  }, [language]);

  // --- (Rest of the functions) ---
  const sendMessage = async (userInput) => { /* ... your existing sendMessage logic ... */ };
  const openChatbot = () => setIsChatbotOpen(true);
  const closeChatbot = () => setIsChatbotOpen(false);
  const toggleChatbotVisibility = () => { /* ... */ };

  const value = {
    isChatbotOpen, openChatbot, closeChatbot, chatMessages, isTyping, sendMessage, showChatbot,
    liveData, isLoadingData, locationError,
    citiesData, isCitiesLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};