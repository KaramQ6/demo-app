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
    sendMessage, 
    chatMessages, 
    isTyping,
    showChatbot,
    toggleChatbotVisibility 
  } = useApp();
  
  const [inputValue, setInputValue] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Simulated current location data for the prototype
  const currentLocationData = {
    name: { ar: 'جرش', en: 'Jerash' },
    temperature: 28,
    congestion: { ar: 'متوسط', en: 'Moderate' },
    congestionLevel: 'medium' // for styling
  };

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
                <h3 className="font-semibold text-white font-['Montserrat']">
                  {t({ ar: 'جواد', en: 'Jawad' })}
                </h3>
                <p className="text-xs text-muted-foreground font-['Open_Sans']">
                  {t({ ar: 'مرشدك الذكي', en: 'Your Smart Guide' })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {/* Power Toggle Button */}
              <button
                onClick={toggleChatbotVisibility}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors interactive-button"
                aria-label={t({ ar: 'إخفاء المساعد', en: 'Hide Assistant' })}
              >
                <Power className="w-4 h-4 text-muted-foreground hover:text-white" />
              </button>
              {/* Close Button */}
              <button
                onClick={closeChatbot}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors interactive-button"
                aria-label={t({ ar: 'إغلاق المحادثة', en: 'Close chat' })}
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-white" />
              </button>
            </div>
          </div>

          {/* NEW: Context Header - Current Location Data */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-b border-white/5">
            <div className="flex items-center justify-between text-sm">
              {/* Location */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span className="text-white font-medium font-['Open_Sans']">
                  {t({ ar: `أنت الآن في: ${currentLocationData.name.ar}`, en: `You are in: ${currentLocationData.name.en}` })}
                </span>
              </div>
              
              {/* Temperature */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Thermometer className="w-4 h-4 text-orange-400" />
                <span className="text-white font-medium font-['Open_Sans']">
                  {currentLocationData.temperature}°{t({ ar: 'م', en: 'C' })}
                </span>
              </div>
              
              {/* Congestion */}
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Activity className={`w-4 h-4 ${
                  currentLocationData.congestionLevel === 'low' ? 'text-green-400' :
                  currentLocationData.congestionLevel === 'medium' ? 'text-yellow-400' :
                  'text-red-400'
                }`} />
                <span className={`font-medium font-['Open_Sans'] ${
                  currentLocationData.congestionLevel === 'low' ? 'text-green-400' :
                  currentLocationData.congestionLevel === 'medium' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {t({ ar: `الازدحام: ${currentLocationData.congestion.ar}`, en: `Crowd: ${currentLocationData.congestion.en}` })}
                </span>
              </div>
            </div>
          </div>

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
                      {message.timestamp.toLocaleTimeString([], { 
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