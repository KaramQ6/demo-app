import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { MessageCircle, X, Send, Bot, Copy, Check, Power, Loader2, MapPin, Thermometer, AlertCircle } from 'lucide-react';

const Chatbot = () => {
  const { t, language, isRTL } = useLanguage();
  const {
    isChatbotOpen,
    openChatbot,
    closeChatbot,
    sendMessage,
    chatMessages,
    isTyping,
    showChatbot,
    toggleChatbotVisibility,
    // GPS and live data from enhanced context
    userLocation,
    locationError,
    liveData,
    isLoadingData,
  } = useApp();

  const [inputValue, setInputValue] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleCopyMessage = async (messageText, messageId) => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  if (!showChatbot) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isChatbotOpen && (
        <button
          onClick={openChatbot}
          className="fixed bottom-6 right-6 w-16 h-16 gradient-purple rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 interactive-button z-50"
          aria-label={t({ ar: 'فتح المحادثة مع جواد', en: 'Open chat with Jawad' })}
        >
          <MessageCircle className="w-7 h-7" />
        </button>
      )}

      {/* Chat Window */}
      {isChatbotOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[32rem] glass-card rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up border border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 gradient-purple rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white font-['Montserrat']">{t({ ar: 'جواد', en: 'Jawad' })}</h3>
                <p className="text-xs text-muted-foreground font-['Open_Sans']">{t({ ar: 'مرشدك الذكي', en: 'Your Smart Guide' })}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <button onClick={toggleChatbotVisibility} className="p-2 rounded-lg hover:bg-white/10" aria-label={t({ ar: 'إخفاء المساعد', en: 'Hide Assistant' })}>
                <Power className="w-4 h-4 text-muted-foreground hover:text-white" />
              </button>
              <button onClick={closeChatbot} className="p-2 rounded-lg hover:bg-white/10" aria-label={t({ ar: 'إغلاق المحادثة', en: 'Close chat' })}>
                <X className="w-4 h-4 text-muted-foreground hover:text-white" />
              </button>
            </div>
          </div>

          {/* Enhanced Context Header - GPS-based Live Data */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-b border-white/5 min-h-[50px]">
            {locationError ? (
              <div className="flex items-center justify-center text-center h-full">
                <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                <span className="text-red-400 text-xs font-medium">
                  {t({ ar: 'يرجى تفعيل الموقع لرؤية البيانات الحية', en: 'Please enable location for live data' })}
                </span>
              </div>
            ) : isLoadingData ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-4 h-4 text-white animate-spin mr-2" />
                <span className="text-white text-xs font-medium">
                  {t({ ar: 'جاري تحميل البيانات الحية...', en: 'Loading live data...' })}
                </span>
              </div>
            ) : liveData ? (
              <div className="flex items-center justify-between text-sm animate-fade-in">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-medium">
                    {liveData.cityName}
                  </span>
                </div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Thermometer className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-medium">
                    {liveData.temperature || '--'}°C
                  </span>
                </div>
                {liveData.weather && (
                  <div className="flex items-center space-x-1 rtl:space-x-reverse">
                    {liveData.weather.iconUrl && (
                      <img
                        src={liveData.weather.iconUrl}
                        alt={liveData.weather.description || 'Weather'}
                        className="w-6 h-6"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <span className="text-white font-medium text-xs">
                      {liveData.weather.description || t({ ar: 'طقس معتدل', en: 'Fair weather' })}
                    </span>
                  </div>
                )}
              </div>
            ) : userLocation ? (
              <div className="flex items-center justify-center text-center h-full">
                <MapPin className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-green-400 text-xs font-medium">
                  {t({
                    ar: `موقعك: ${userLocation.lat.toFixed(2)}, ${userLocation.lon.toFixed(2)}`,
                    en: `Location: ${userLocation.lat.toFixed(2)}, ${userLocation.lon.toFixed(2)}`
                  })}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center text-center h-full">
                <Loader2 className="w-4 h-4 text-yellow-400 animate-spin mr-2" />
                <span className="text-yellow-400 text-xs font-medium">
                  {t({ ar: 'جاري تحديد موقعك...', en: 'Getting your location...' })}
                </span>
              </div>
            )}
          </div>

          {/* --- START: الجزء الذي تم إصلاحه --- */}
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
            {chatMessages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className="relative group">
                  <div className={`max-w-xs px-4 py-3 rounded-xl ${message.type === 'user' ? 'gradient-purple text-white ml-4' : 'glass text-white mr-4'}`}>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <div className="text-xs opacity-60 mt-2">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  {message.type === 'bot' && (
                    <button onClick={() => handleCopyMessage(message.text, message.id)} className={`absolute ${isRTL ? 'left-1' : 'right-1'} top-1 opacity-0 group-hover:opacity-100 p-1`}>
                      {copiedMessageId === message.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start"><div className="glass text-white mr-4 px-4 py-3 rounded-xl"><div className="flex items-center space-x-2 rtl:space-x-reverse"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">{t({ ar: 'جواد يكتب...', en: 'Jawad is typing...' })}</span></div></div></div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
            <div className="flex space-x-2 rtl:space-x-reverse">
              <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={t({ ar: 'اسأل جواد...', en: 'Ask Jawad...' })} className="flex-1 px-4 py-2 glass rounded-lg" disabled={isTyping} />
              <button type="submit" disabled={!inputValue.trim() || isTyping} className="px-4 py-2 gradient-purple rounded-lg"><Send className="w-4 h-4" /></button>
            </div>
          </form>
          {/* --- END: الجزء الذي تم إصلاحه --- */}
        </div>
      )}
    </>
  );
};

export default Chatbot;