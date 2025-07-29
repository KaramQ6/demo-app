import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { useLocation } from 'react-router-dom';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { language } = useLanguage();
  const location = useLocation();
  
  // Chatbot state
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPage, setCurrentPage] = useState('/');

  // IoT data state - persistent with localStorage
  const [iotData, setIotData] = useState({});
  const [userFeedback, setUserFeedback] = useState({});

  // Loading states
  const [isLoading, setIsLoading] = useState({});

  // Toast notifications
  const [notifications, setNotifications] = useState([]);

  // Update current page when location changes
  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  // Initialize data from localStorage on mount
  useEffect(() => {
    const savedIotData = localStorage.getItem('smarttour_iot_data');
    const savedFeedback = localStorage.getItem('smarttour_user_feedback');
    
    if (savedIotData) {
      try {
        setIotData(JSON.parse(savedIotData));
      } catch (e) {
        console.error('Error parsing IoT data from localStorage:', e);
      }
    }
    
    if (savedFeedback) {
      try {
        setUserFeedback(JSON.parse(savedFeedback));
      } catch (e) {
        console.error('Error parsing user feedback from localStorage:', e);
      }
    }
  }, []);

  // Save IoT data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(iotData).length > 0) {
      localStorage.setItem('smarttour_iot_data', JSON.stringify(iotData));
    }
  }, [iotData]);

  // Save user feedback to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(userFeedback).length > 0) {
      localStorage.setItem('smarttour_user_feedback', JSON.stringify(userFeedback));
    }
  }, [userFeedback]);

  // Get contextual greeting based on current page
  const getContextualGreeting = () => {
    const isArabic = language === 'ar';
    
    if (currentPage.includes('/destinations/')) {
      const destinationId = currentPage.split('/destinations/')[1];
      const destinationNames = {
        'jerash': { ar: 'جرش', en: 'Jerash' },
        'petra': { ar: 'البتراء', en: 'Petra' },
        'umm-qais': { ar: 'أم قيس', en: 'Umm Qais' },
        'salt': { ar: 'السلط', en: 'As-Salt' },
        'ajloun': { ar: 'عجلون', en: 'Ajloun' },
        'wadi-rum': { ar: 'وادي رم', en: 'Wadi Rum' }
      };
      
      const destinationName = destinationNames[destinationId];
      if (destinationName) {
        return isArabic 
          ? `أهلاً بك في صفحة ${destinationName.ar}! هل لديك أي سؤال محدد عن هذه الوجهة العريقة؟`
          : `Welcome to the ${destinationName.en} page! Do you have any specific questions about this amazing destination?`;
      }
    }
    
    if (currentPage === '/iot-hub') {
      return isArabic 
        ? 'أرى أنك مهتم بالبيانات الحية. هل أحلل لك وضع الازدحام اليوم وأساعدك في اختيار أفضل وقت للزيارة؟'
        : 'I see you\'re interested in live data. Should I analyze today\'s crowd situation and help you choose the best time to visit?';
    }
    
    if (currentPage === '/destinations') {
      return isArabic 
        ? 'مرحباً! أرى أنك تتصفح الوجهات السياحية. أي نوع من التجارب تبحث عنه؟ تاريخية، طبيعية، أم ثقافية؟'
        : 'Hello! I see you\'re browsing tourist destinations. What kind of experiences are you looking for? Historical, natural, or cultural?';
    }
    
    if (currentPage === '/demo') {
      return isArabic 
        ? 'أهلاً بك في التجربة التفاعلية! هل تريد معرفة المزيد عن تقنياتنا المتطورة أم لديك أسئلة حول كيفية عمل النظام؟'
        : 'Welcome to the interactive experience! Would you like to know more about our advanced technologies or do you have questions about how the system works?';
    }
    
    if (currentPage === '/about') {
      return isArabic 
        ? 'أهلاً بك! أرى أنك تتعرف على مشروعنا. هل لديك أسئلة حول رؤيتنا أو التقنيات التي نستخدمها؟'
        : 'Welcome! I see you\'re learning about our project. Do you have questions about our vision or the technologies we use?';
    }
    
    // Default homepage greeting
    return isArabic 
      ? 'مرحباً! أنا جواد، مرشدك الذكي في الأردن. كيف يمكنني مساعدتك في التخطيط لرحلتك؟'
      : 'Hello! I\'m Jawad, your smart guide in Jordan. How can I help you plan your trip?';
  };

  // Chatbot functions
  const openChatbot = (initialMessage = null) => {
    setIsChatbotOpen(true);
    if (chatMessages.length === 0) {
      // Add contextual greeting
      const greeting = {
        type: 'bot',
        text: getContextualGreeting(),
        timestamp: new Date(),
        id: Date.now()
      };
      
      if (initialMessage) {
        const userMsg = {
          type: 'user',
          text: initialMessage,
          timestamp: new Date(),
          id: Date.now() + 1
        };

        setChatMessages([greeting, userMsg]);
        
        // Get bot response after delay
        setTimeout(() => {
          const response = getBotResponse(initialMessage);
          const botResponse = {
            type: 'bot',
            ...response,
            timestamp: new Date(),
            id: Date.now() + 2
          };
          setChatMessages(prev => [...prev, botResponse]);
        }, 1500);
      } else {
        setChatMessages([greeting]);
      }
    }
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
  };

  // Enhanced intelligent chatbot response system with specific keyword responses
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    const isArabic = language === 'ar';

    // **PRIORITY RESPONSES - As specifically requested**
    
    // Check for planning keywords (خطة/plan)
    if (message.includes('خطة') || message.includes('plan')) {
      return {
        type: 'text',
        text: isArabic 
          ? 'بالتأكيد! لتصميم خطة مثالية، هل تفضل الأماكن التاريخية أم الطبيعية؟'
          : 'Certainly! To design a perfect plan, do you prefer historical places or natural ones?'
      };
    }

    // Check for thanks keywords (شكرا/thanks)
    if (message.includes('شكرا') || message.includes('شكراً') || message.includes('thanks') || message.includes('thank you')) {
      return {
        type: 'text',
        text: isArabic 
          ? 'على الرحب والسعة! أنا هنا للمساعدة في أي وقت.'
          : 'You\'re welcome! I\'m here to help anytime.'
      };
    }

    // Check for greeting keywords (مرحبا/hello) - Returns contextual greeting
    if (message.includes('مرحبا') || message.includes('مرحباً') || message.includes('hello') || message.includes('hi')) {
      return {
        type: 'text',
        text: getContextualGreeting()
      };
    }

    // Context-aware responses based on current page
    if (currentPage === '/iot-hub') {
      if (message.includes('ازدحام') || message.includes('crowd') || message.includes('busy')) {
        return {
          type: 'text',
          text: isArabic 
            ? 'بناءً على البيانات الحية الحالية، أنصحك بزيارة أم قيس أو عجلون حيث مستوى الازدحام منخفض. البتراء وجرش مزدحمتان حالياً. هل تريد تفاصيل أكثر عن وجهة معينة؟'
            : 'Based on current live data, I recommend visiting Umm Qais or Ajloun where crowd levels are low. Petra and Jerash are currently crowded. Would you like more details about a specific destination?'
        };
      }
    }

    // Extended keyword matching logic
    const destinationKeywords = ['وجهة', 'مكان', 'سياحة', 'زيارة', 'destination', 'place', 'visit', 'tourist'];
    const weatherKeywords = ['طقس', 'جو', 'حرارة', 'weather', 'temperature', 'climate'];
    const foodKeywords = ['طعام', 'أكل', 'مطعم', 'food', 'eat', 'restaurant'];
    const transportKeywords = ['مواصلات', 'سيارة', 'حافلة', 'transport', 'car', 'bus'];
    const crowdKeywords = ['ازدحام', 'زحمة', 'مزدحم', 'crowd', 'busy', 'crowded'];
    const iotKeywords = ['بيانات', 'استشعار', 'iot', 'sensor', 'data', 'live'];

    // Check for destination inquiry
    if (destinationKeywords.some(keyword => message.includes(keyword))) {
      return {
        type: 'destinations',
        text: isArabic 
          ? 'إليك أفضل الوجهات السياحية في الأردن مع البيانات الحية:'
          : 'Here are the best tourist destinations in Jordan with live data:',
        showDestinations: true
      };
    }

    // Check for IoT/data inquiry
    if (iotKeywords.some(keyword => message.includes(keyword))) {
      return {
        type: 'text',
        text: isArabic 
          ? 'نستخدم أكثر من 150 جهاز استشعار IoT منتشرة في جميع الوجهات السياحية لتوفير بيانات حية عن الازدحام، مواقف السيارات، الطقس، وجودة الهواء. يمكنك زيارة مركز البيانات الحية لرؤية هذه المعلومات في الوقت الفعلي!'
          : 'We use over 150 IoT sensors deployed across all tourist destinations to provide live data on crowds, parking, weather, and air quality. You can visit the Live Data Hub to see this information in real-time!'
      };
    }

    // Check for weather inquiry
    if (weatherKeywords.some(keyword => message.includes(keyword))) {
      return {
        type: 'text',
        text: isArabic 
          ? 'الطقس في الأردن معتدل معظم أيام السنة. أفضل وقت للزيارة هو الربيع (مارس-مايو) والخريف (سبتمبر-نوفمبر). يمكنني إعطاءك تحديثات الطقس الحية لأي وجهة تريد زيارتها!'
          : 'Jordan\'s weather is moderate most of the year. The best time to visit is spring (March-May) and autumn (September-November). I can give you live weather updates for any destination you want to visit!'
      };
    }

    // Check for food inquiry
    if (foodKeywords.some(keyword => message.includes(keyword))) {
      return {
        type: 'text',
        text: isArabic 
          ? 'الأردن مشهور بأطباقه اللذيذة! لا تفوت تجربة المنسف (الطبق الوطني)، الكنافة، الفلافل، والمسخن. كل منطقة لها أطباقها المميزة. أي نوع من الطعام تفضل؟'
          : 'Jordan is famous for its delicious dishes! Don\'t miss trying Mansaf (national dish), Knafeh, Falafel, and Musakhan. Each region has its special dishes. What type of food do you prefer?'
      };
    }

    // Check for transport inquiry
    if (transportKeywords.some(keyword => message.includes(keyword))) {
      return {
        type: 'text',
        text: isArabic 
          ? 'للتنقل في الأردن، يمكنك استخدام التاكسي، الحافلات، أو استئجار سيارة. أنصح بالسيارة للتنقل بين المدن للحصول على حرية أكبر. يمكنني مساعدتك في التخطيط لأفضل طرق النقل حسب خطة رحلتك!'
          : 'For transportation in Jordan, you can use taxis, buses, or rent a car. I recommend a car for traveling between cities for more freedom. I can help you plan the best transportation according to your trip plan!'
      };
    }

    // Check for thanks
    if (thanksKeywords.some(keyword => message.includes(keyword))) {
      return {
        type: 'text',
        text: isArabic 
          ? 'على الرحب والسعة! أنا هنا للمساعدة في أي وقت. هل تحتاج لمساعدة أخرى في تخطيط رحلتك أو تريد معلومات عن البيانات الحية؟'
          : 'You\'re very welcome! I\'m here to help anytime. Do you need any other help planning your trip or want information about live data?'
      };
    }

    // Check for crowd information
    if (crowdKeywords.some(keyword => message.includes(keyword))) {
      return {
        type: 'text',
        text: isArabic 
          ? 'يمكنك مراجعة البيانات الحية للازدحام في صفحة "مركز البيانات الحية". نستخدم أجهزة استشعار IoT لتقديم معلومات فورية عن مستوى الازدحام في كل موقع! هل تريد مني تحليل الوضع الحالي؟'
          : 'You can check live crowd data in the "Live Data Hub" page. We use IoT sensors to provide real-time information about crowd levels at each location! Would you like me to analyze the current situation?'
      };
    }

    // Default response with context awareness
    return {
      type: 'text',
      text: isArabic 
        ? 'عذراً، لم أفهم طلبك بوضوح. يمكنك أن تسألني عن:\n• تخطيط رحلة\n• الوجهات السياحية\n• البيانات الحية\n• الطقس\n• الطعام والمطاعم\n• المواصلات\n\nكيف يمكنني مساعدتك؟'
        : 'Sorry, I didn\'t understand your request clearly. You can ask me about:\n• Trip planning\n• Tourist destinations\n• Live data\n• Weather\n• Food and restaurants\n• Transportation\n\nHow can I help you?'
    };
  };

  // Send message function
  const sendChatMessage = async (message) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: message.trim(),
      timestamp: new Date(),
      id: Date.now()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(() => {
      const response = getBotResponse(message);
      const botMessage = {
        type: 'bot',
        ...response,
        timestamp: new Date(),
        id: Date.now() + 1
      };

      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800); // Random delay between 1.2-2.0 seconds
  };

  // IoT data functions
  const updateIotData = (destinationId, data) => {
    setIotData(prev => ({
      ...prev,
      [destinationId]: {
        ...prev[destinationId],
        ...data,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  const updateUserFeedback = (destinationId, feedbackType, value) => {
    setUserFeedback(prev => ({
      ...prev,
      [destinationId]: {
        ...prev[destinationId],
        [feedbackType]: value,
        timestamp: new Date().toISOString()
      }
    }));
    
    // Show animated success notification
    showNotification(
      language === 'ar' ? 'شكراً لمساهمتك! 🎉' : 'Thanks for your contribution! 🎉',
      'success'
    );
  };

  // Loading state functions
  const setLoadingState = (key, isLoadingState) => {
    setIsLoading(prev => ({
      ...prev,
      [key]: isLoadingState
    }));
  };

  // Notification functions
  const showNotification = (message, type = 'info', duration = 5000) => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, notification]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, duration);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const value = {
    // Chatbot
    isChatbotOpen,
    chatMessages,
    isTyping,
    currentPage,
    openChatbot,
    closeChatbot,
    sendChatMessage,
    
    // IoT Data
    iotData,
    userFeedback,
    updateIotData,
    updateUserFeedback,
    
    // Loading states
    isLoading,
    setLoadingState,
    
    // Notifications
    notifications,
    showNotification,
    removeNotification
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};