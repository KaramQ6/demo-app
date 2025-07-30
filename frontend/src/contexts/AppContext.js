import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { language } = useLanguage();

  // --- All App States ---
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatbot, setShowChatbot] = useState(true);
  
  // States for Chatbot's Live Geolocation Data
  const [liveData, setLiveData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // States for the Multi-City DataHub Page
  const [citiesData, setCitiesData] = useState([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(true);

  // Effect to get user's geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude }),
      (error) => setLocationError("User denied location access.")
    );
  }, []);

  // Effect to fetch live data for the CHATBOT (This one works correctly)
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

  // --- NEW ROBUST Effect for the DATAHUB page ---
  useEffect(() => {
    const fetchCitiesData = async () => {
      const cities = ['Amman', 'Petra', 'Aqaba', 'Irbid', 'Jerash', 'Ajloun'];
      setIsCitiesLoading(true);
      
      const cityPromises = cities.map(async (city) => {
        const liveDataApiUrl = `https://karamq5.app.n8n.cloud/webhook/a5be8642-6a92-407c-b537-9bd4bda4dcdc?city=${city}&lang=${language}`;
        try {
          const response = await fetch(liveDataApiUrl);
          // Check if the response is ok AND has content
          if (response.ok) {
            // Clone the response to be able to read it twice (for text and json)
            const responseClone = response.clone();
            const text = await responseClone.text();
            if (text) {
              return response.json(); // If there is text, parse it as JSON
            }
          }
          console.error(`Failed to fetch or received empty response for ${city}`);
          return null; // Return null for failed or empty responses
        } catch (error) {
          console.error(`Error fetching data for ${city}:`, error);
          return null; // Return null if any other error occurs
        }
      });

      try {
        const results = await Promise.all(cityPromises);
        // Filter out any null results from failed fetches
        setCitiesData(results.filter(Boolean)); 
      } catch (error) {
        console.error("An error occurred while processing city data:", error);
        setCitiesData([]); // Set to empty array on final error
      } finally {
        setIsCitiesLoading(false);
      }
    };

    fetchCitiesData();
  }, [language]);


  // (The rest of your functions remain the same)
  const sendMessage = async (userInput) => { /* ...your existing logic... */ };
  const openChatbot = () => setIsChatbotOpen(true);
  const closeChatbot = () => setIsChatbotOpen(false);
  const toggleChatbotVisibility = () => { /* ...your existing logic... */ };

  const value = {
    isChatbotOpen, openChatbot, closeChatbot, chatMessages, isTyping, sendMessage, showChatbot,
    liveData, isLoadingData, locationError,
    citiesData, isCitiesLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};