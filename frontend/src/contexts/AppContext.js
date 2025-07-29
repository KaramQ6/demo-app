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
  
  // --- START: تعديلات حالات البيانات الحية ---
  const [liveData, setLiveData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false); // تبدأ false
  const [userLocation, setUserLocation] = useState(null); // لتخزين إحداثيات المستخدم
  const [locationError, setLocationError] = useState(null); // لتخزين أخطاء تحديد الموقع
  // --- END: تعديلات حالات البيانات الحية ---

  // --- START: useEffect لطلب الموقع الجغرافي مرة واحدة عند تحميل التطبيق ---
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
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.error("User denied Geolocation.");
          setLocationError("User denied location access.");
        } else {
          console.error("Geolocation error:", error);
          setLocationError("Could not get location.");
        }
      }
    );
  }, []); // القوس الفارغ يضمن تشغيله مرة واحدة فقط
  // --- END: useEffect لطلب الموقع الجغرافي ---


  // --- START: useEffect لجلب البيانات الحية عند فتح الشات بوت (يعتمد الآن على userLocation) ---
  useEffect(() => {
    const fetchLiveData = async () => {
        // لا تفعل شيئاً إذا لم يكن الموقع متاحاً
        if (!userLocation) {
          console.log("Waiting for user location...");
          return;
        }

        setIsLoadingData(true);
        const { lat, lon } = userLocation;
        const lang = language;
        // الرابط الجديد يستخدم الإحداثيات
        const liveDataUrl = `https://karamq5.app.n8n.cloud/webhook/b6868914-36ea-4781-8b6d-21ddb4f44658?lat=${lat}&lon=${lon}&lang=${lang}`;

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
  }, [isChatbotOpen, language, userLocation]); // يتم إعادة الجلب إذا تغير الموقع أيضاً
  // --- END: useEffect لجلب البيانات الحية ---


  // --- دالة إرسال الرسائل (تبقى كما هي) ---
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
  
  // --- باقي الدوال (تبقى كما هي) ---
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
    liveData,
    isLoadingData,
    location,
    locationError // <-- تمرير خطأ تحديد الموقع للواجهة إذا أردت عرضه
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};