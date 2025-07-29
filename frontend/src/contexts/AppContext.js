import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { MessageCircle, X, Send, Bot, Copy, Check, Power, Loader2, MapPin, Thermometer, Activity } from 'lucide-react';

const Chatbot = () => {
  const { t, language, isRTL } = useLanguage();
  const { 
    isChatbotOpen, 
    openChatbot,
    closeChatbot, 
    // sendMessage, // <-- لن نستخدم الدالة القديمة من الـ Context
    chatMessages,
    setChatMessages, // <-- سنحتاج للوصول المباشر لهذه الدالة
    isTyping,
    setIsTyping, // <-- سنحتاج للوصول المباشر لهذه الدالة
    showChatbot,
    toggleChatbotVisibility 
  } = useApp();
  
  const [inputValue, setInputValue] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // --- START: إضافة حالات جديدة للبيانات الحية ---
  const [liveData, setLiveData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  // --- END: إضافة حالات جديدة للبيانات الحية ---

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (isChatbotOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatbotOpen]);

  // --- START: useEffect لجلب البيانات الحية عند فتح الشات بوت ---
  useEffect(() => {
    const fetchLiveData = async () => {
        setIsLoadingData(true);
        const city = 'Amman'; // يمكن تطويرها لاحقاً لتكون ديناميكية
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

  // --- START: تعديل دالة handleSubmit لترسل الطلب إلى n8n ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInput = inputValue.trim();
    if (!userInput) return;

    // 1. إضافة رسالة المستخدم فوراً للواجهة
    const userMessage = {
      id: Date.now(),
      text: userInput,
      type: 'user',
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // 2. تجهيز وإرسال الطلب لـ n8n
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
        const botResponseText = data.reply || "عذرًا، حدث خطأ ما.";

        // 3. إضافة رد البوت الحقيقي للواجهة
        const botMessage = {
          id: Date.now() + 1,
          text: botResponseText,
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
  // --- END: تعديل دالة handleSubmit ---

  const handleCopyMessage = async (messageText, messageId) => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopiedMessageId(messageId);
      
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  if (!showChatbot) {
    return null;
  }

  return (
    <>
      {/* ... (الجزء الخاص بـ Floating Action Button يبقى كما هو) ... */}
      {!isChatbotOpen && (
        <button
          onClick={openChatbot}
          className="fixed bottom-6 right-6 w-16 h-16 gradient-purple rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 interactive-button z-50"
          aria-label={t({ ar: 'فتح المحادثة مع جواد', en: 'Open chat with Jawad' })}
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {isChatbotOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[32rem] glass-card rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up border border-white/20">
          {/* ... (الجزء الخاص بـ Header يبقى كما هو) ... */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 gradient-purple rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white font-['Montserrat']">
                  {t({ ar: 'جواد', en: 'Jawad' })}
                </h3>
                <p className="text-xs text-muted-foreground font-['Open_Sans']">
                  {t({ ar: 'مرشدك الذكي', en: 'Your Smart Guide' })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button
                onClick={toggleChatbotVisibility}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors interactive-button"
                aria-label={t({ ar: 'إخفاء المساعد', en: 'Hide Assistant' })}
              >
                <Power className="w-4 h-4 text-muted-foreground hover:text-white" />
              </button>
              <button
                onClick={closeChatbot}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors interactive-button"
                aria-label={t({ ar: 'إغلاق المحادثة', en: 'Close chat' })}
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-white" />
              </button>
            </div>
          </div>

          {/* --- START: تحديث شريط البيانات الحية --- */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-b border-white/5 min-h-[50px]">
            {isLoadingData ? (
              <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
            ) : liveData ? (
              <div className="flex items-center justify-between text-sm animate-fade-in">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">
                          {isRTL ? liveData.locationName.ar : liveData.locationName.en}
                      </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <Thermometer className="w-4 h-4 text-orange-400" />
                      <span className="text-white font-medium">
                          {liveData.temperature}°م
                      </span>
                  </div>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    <img src={liveData.weather.iconUrl} alt={liveData.weather.description} className="w-6 h-6" />
                    <span className="text-white font-medium text-xs">
                        {liveData.weather.description}
                    </span>
                  </div>
              </div>
            ) : (
              <div className="text-center text-xs text-red-400">فشل تحميل البيانات الحية</div>
            )}
          </div>
          {/* --- END: تحديث شريط البيانات الحية --- */}

          {/* ... (الجزء الخاص بـ Messages Area و Input Form يبقى كما هو) ... */}
           {/* Messages Area */}
           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className="relative group">
                  <div
                    className={`max-w-xs px-4 py-3 rounded-xl font-['Open_Sans'] ${
                      message.type === 'user'
                        ? 'gradient-purple text-white ml-4'
                        : 'glass text-white mr-4'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    
                    {/* Timestamp */}
                    <div className="text-xs opacity-60 mt-2">
                      {new Date(message.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                  
                  {/* Copy Button - Only for bot messages */}
                  {message.type === 'bot' && (
                    <button
                      onClick={() => handleCopyMessage(message.text, message.id)}
                      className={`absolute ${isRTL ? 'left-1' : 'right-1'} top-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-md hover:bg-white/10 interactive-button`}
                      aria-label={t({ ar: 'نسخ الرسالة', en: 'Copy message' })}
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-muted-foreground hover:text-white" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="glass text-white mr-4 px-4 py-3 rounded-xl">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm font-['Open_Sans']">
                      {t({ ar: 'جواد يكتب...', en: 'Jawad is typing...' })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
            <div className="flex space-x-2 rtl:space-x-reverse">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t({ ar: 'اسأل جواد...', en: 'Ask Jawad...' })}
                className="flex-1 px-4 py-2 glass rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-['Open_Sans']"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-2 gradient-purple rounded-lg text-white hover:opacity-90 transition-opacity interactive-button disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t({ ar: 'إرسال', en: 'Send' })}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;