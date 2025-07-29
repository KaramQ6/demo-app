import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';
import { iotSensorData } from '../mock';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const getContextualGreeting = () => {
    if (liveData && liveData.cityName) {
      return t({
        ar: `أهلاً بك في ${liveData.cityName}! درجة الحرارة هنا ${liveData.temperature}°م. كيف يمكنني مساعدتك في استكشاف هذه المنطقة؟`,
        en: `Welcome to ${liveData.cityName}! The temperature is ${liveData.temperature}°C. How can I help you explore the area?`
      });
    } else if (userLocation) {
      return t({
        ar: `أهلاً بك! تم تحديد موقعك. كيف يمكنني أن أكون مرشدك السياحي في الأردن اليوم؟`,
        en: `Welcome! I've detected your location. How can I be your tour guide in Jordan today?`
      });
    } else {
      return t({
        ar: 'أهلاً بك في SmartTour.Jo! كيف يمكنني مساعدتك في التخطيط لمغامرتك القادمة في الأردن؟',
        en: 'Welcome to SmartTour.Jo! How can I help you plan your next adventure in Jordan?'
      });
    }
  };
  const location = useLocation();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatbot, setShowChatbot] = useState(true);

  // --- GPS and Live Data States ---
  const [userLocation, setUserLocation] = useState(null); // Store GPS coordinates
  const [locationError, setLocationError] = useState(null); // Store location errors
  const [liveData, setLiveData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // --- IoT Data State (missing from previous implementation) ---
  const [iotData, setIotData] = useState({});

  // --- GPS Location Setup (runs once on app load) ---
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        setLocationError(null);
        console.log(`GPS Location acquired: ${latitude}, ${longitude}`);
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError("User denied location access. Please enable location to see live data.");
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setLocationError("Location information is unavailable.");
        } else if (error.code === error.TIMEOUT) {
          setLocationError("Location request timed out.");
        } else {
          setLocationError("An unknown error occurred while retrieving location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, []);


  // --- Live Data Fetching (GPS-based, runs when chatbot opens) ---
  useEffect(() => {
    const fetchLiveData = async () => {
      // Don't fetch if we don't have user location yet
      if (!userLocation) {
        console.log("Waiting for user location before fetching live data...");
        return;
      }

      setIsLoadingData(true);
      const { lat, lon } = userLocation;
      const lang = language;
      // Updated URL to use real GPS coordinates
      const liveDataUrl = `https://karamq5.app.n8n.cloud/webhook/b6868914-36ea-4781-8b6d-21ddb4f44658?lat=${lat}&lon=${lon}&lang=${lang}`;

      try {
        console.log(`Fetching live data for coordinates: ${lat}, ${lon}`);
        const response = await fetch(liveDataUrl);
        if (!response.ok) throw new Error(`Failed to fetch live data: ${response.status}`);
        const data = await response.json();
        setLiveData(data);
        console.log("Live data fetched successfully:", data);
      } catch (error) {
        console.error("Live Data Fetch Error:", error);
        setLiveData(null);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isChatbotOpen) {
      fetchLiveData();
    }
  }, [isChatbotOpen, language, userLocation]);


  // --- Chat Message Handling ---
  const sendMessage = async (userInput) => {
    const userMessage = { id: Date.now(), text: userInput, type: 'user', timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    let sessionId = localStorage.getItem('chatSessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}`;
      localStorage.setItem('chatSessionId', sessionId);
    }
    const chatbotUrl = "https://karamq5.app.n8n.cloud/webhook/gemini-tour-chat";

    try {
      const response = await fetch(chatbotUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput, sessionId: sessionId })
      });
      if (!response.ok) throw new Error(`Network error: ${response.status}`);
      const data = await response.json();
      const botMessage = { id: Date.now() + 1, text: data.reply || "عذرًا، حدث خطأ ما.", type: 'bot', timestamp: new Date() };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat API Error:", error);
      const errorMessage = { id: Date.now() + 1, text: "❌ فشل الاتصال بالخادم.", type: 'bot', timestamp: new Date() };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- IoT Data Management Functions ---
  const updateIotData = (destinationId, newData) => {
    setIotData(prev => ({
      ...prev,
      [destinationId]: newData
    }));
  };

  // --- Chatbot Control Functions ---
  const openChatbot = (initialMessage = null) => {
    setIsChatbotOpen(true);

    if (chatMessages.length === 0) {
      const greeting = getContextualGreeting();
      const welcomeMessage = {
        id: Date.now(),
        type: 'bot',
        text: greeting,
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
    }

    if (initialMessage) {
      setTimeout(() => sendMessage(initialMessage), 500);
    }
  };

  const closeChatbot = () => setIsChatbotOpen(false);

  const toggleChatbotVisibility = () => {
    const isHidden = sessionStorage.getItem('isChatbotHidden') === 'true';
    sessionStorage.setItem('isChatbotHidden', !isHidden);
    setShowChatbot(isHidden);
    if (!isHidden) setIsChatbotOpen(false);
  };

  // --- Initialize chatbot visibility on app load ---
  useEffect(() => {
    const isHidden = sessionStorage.getItem('isChatbotHidden') === 'true';
    setShowChatbot(!isHidden);
  }, []);

  const value = {
    // Chatbot states
    isChatbotOpen,
    openChatbot,
    closeChatbot,
    chatMessages,
    setChatMessages,
    isTyping,
    setIsTyping,
    sendMessage,
    showChatbot,
    toggleChatbotVisibility,

    // GPS and live data states
    userLocation,
    locationError,
    liveData,
    isLoadingData,

    // IoT data states
    iotData,
    setIotData,
    updateIotData,

    // Router location
    location
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};