import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { language, t } = useLanguage();
  const location = useLocation();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatbot, setShowChatbot] = useState(true);
  const [liveData, setLiveData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => setUserLocation({ lat: position.coords.latitude, lon: position.coords.longitude }),
      (error) => setLocationError("User denied or failed to get location.")
    );
  }, []);

  useEffect(() => {
    const fetchLiveData = async () => {
      if (!userLocation) return;
      setIsLoadingData(true);
      const { lat, lon } = userLocation;
      const liveDataUrl = `https://karamq5.app.n8n.cloud/webhook/b6868914-36ea-4781-8b6d-21ddb4f44658?lat=${lat}&lon=${lon}&lang=${language}`;
      try {
        const response = await fetch(liveDataUrl);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setLiveData(data);
      } catch (error) {
        console.error("Live Data Fetch Error:", error);
        setLiveData(null);
      } finally {
        setIsLoadingData(false);
      }
    };
    if (isChatbotOpen) fetchLiveData();
  }, [isChatbotOpen, language, userLocation]);

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

  const value = { isChatbotOpen, openChatbot, closeChatbot, chatMessages, isTyping, sendMessage, showChatbot, toggleChatbotVisibility, liveData, isLoadingData, locationError, setChatMessages, setIsTyping };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};