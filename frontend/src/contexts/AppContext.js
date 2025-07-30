import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { language, t } = useLanguage();
  
  // States
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatbot, setShowChatbot] = useState(true);
  
  // State for user's location data (for the Chatbot)
  const [liveData, setLiveData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // States for multi-city data (for the DataHub page)
  const [citiesData, setCitiesData] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(true);

  // Effect for user's geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude }),
      (error) => setLocationError("User denied location access.")
    );
  }, []);

  // Effect to fetch live data for the CHATBOT using its own URL
  useEffect(() => {
    const fetchUserLiveData = async () => {
      if (!userLocation) return;
      setIsLoadingData(true);
      const { lat, lon } = userLocation;
      // --- UPDATED URL FOR CHATBOT ---
      const chatbotApiUrl = `https://karamq5.app.n8n.cloud/webhook/Simple-Weather-API-ChatBot?lat=${lat}&lon=${lon}&lang=${language}`;
      try {
        const response = await fetch(chatbotApiUrl);
        if (!response.ok) throw new Error('Failed to fetch user live data');
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

  // Effect to fetch data for multiple cities for the DATAHUB page using its own URL
  useEffect(() => {
    const fetchCitiesData = async () => {
      const cities = ['Amman', 'Petra', 'Aqaba', 'Irbid', 'Jerash', 'Ajloun'];
      setIsCitiesLoading(true);
      try {
        const cityPromises = cities.map(city => {
          // --- UPDATED URL FOR LIVE DATA PAGE ---
          const liveDataApiUrl = `https://karamq5.app.n8n.cloud/webhook/Simple-Weather-API-Live-Data?city=${city}&lang=${language}`;
          return fetch(liveDataApiUrl).then(res => {
            if (!res.ok) {
              console.error(`Failed to fetch data for ${city}`);
              return null;
            }
            return res.json();
          });
        });
        const results = await Promise.all(cityPromises);
        setCitiesData(results.filter(Boolean));
      } catch (error) {
        console.error("Cities Data Fetch Error:", error);
        setCitiesData([]);
      } finally {
        setIsCitiesLoading(false);
      }
    };
    fetchCitiesData();
  }, [language]);

  // --- (Rest of the functions remain the same) ---
  const sendMessage = async (userInput) => {
    // ... (no changes needed here)
  };
  
  const openChatbot = () => setIsChatbotOpen(true);
  const closeChatbot = () => setIsChatbotOpen(false);
  // ... (etc.)

  const value = {
    // All your existing values
    isChatbotOpen, openChatbot, closeChatbot, chatMessages, isTyping, sendMessage,
    showChatbot, liveData, isLoadingData, locationError,
    // Plus the new values for the data page
    citiesData, isCitiesLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};