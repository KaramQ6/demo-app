import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from './LanguageContext';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { language } = useLanguage();
  const location = useLocation();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatbot, setShowChatbot] = useState(true);
  
  // --- START: حالات جديدة للبيانات الحية ---
  const [liveData, setLiveData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  // --- END: حالات جديدة للبيانات الحية ---

  // --- START: دالة إرسال الرسائل الحقيقية (تتصل بـ n8n) ---
  const sendMessage = async (userInput) => {
    const userMessage = {
      id: Date.now(),
      text: userInput,
      type: 'user',
      timestamp: new Date(),
    };
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
      const botMessage = {
        id: Date.now() + 1,
        text: data.reply || "عذرًا، حدث خطأ ما.",
        type: 'bot',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat API Error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "❌ فشل الاتصال بالخادم.",
        type: 'bot',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  // --- END: دالة إرسال الرسائل الحقيقية ---

  const openChatbot = () => {
    setIsChatbotOpen(true);
  };
  
  const closeChatbot = () => {
    setIsChatbotOpen(false);
  };

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

  // --- START: useEffect لجلب البيانات الحية عند فتح الشات بوت ---
  useEffect(() => {
    const fetchLiveData = async () => {
        setIsLoadingData(true);
        const city = 'Amman';
        const lang = language;
        const liveDataUrl = `https://karamq5.app.n8n.cloud/webhook/b6868914-36ea-4781-8b6d-21ddb4f44658?city=${city}&lang=${lang}`;

        try {
            const response = await fetch(liveDataUrl);
            if (!response.ok) throw new Error('Failed to fetch live data');
            const data = await response.json();
            setLiveData(data);
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
  }, [isChatbotOpen, language]);
  // --- END: useEffect لجلب البيانات الحية ---

  const value = {
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
    liveData,        // <-- تمرير البيانات الحية
    isLoadingData,   // <-- تمرير حالة التحميل
    location,        // <-- تمرير معلومات الصفحة الحالية
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};