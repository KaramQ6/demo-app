import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { MessageCircle, X, Send, Bot, MapPin, Star, Clock, Loader2, HelpCircle, Copy, Check } from 'lucide-react';
import { destinations } from '../mock';

const Chatbot = () => {
  const { t, language } = useLanguage();
  const { 
    isChatbotOpen, 
    chatMessages, 
    isTyping,
    currentPage,
    openChatbot,
    closeChatbot, 
    sendChatMessage,
    isLoading,
    showNotification 
  } = useApp();
  
  const [inputValue, setInputValue] = useState('');
  const [showDataHelper, setShowDataHelper] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    // Focus input when chatbot opens
    if (isChatbotOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isChatbotOpen]);

  // Show IoT data helper on IoT Hub page
  useEffect(() => {
    if (currentPage === '/iot-hub' && !isChatbotOpen) {
      const timer = setTimeout(() => {
        setShowDataHelper(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setShowDataHelper(false);
    }
  }, [currentPage, isChatbotOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading.chatbot) return;

    const message = inputValue.trim();
    setInputValue('');
    
    await sendChatMessage(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDestinationClick = (destination) => {
    const message = t({ 
      ar: `أريد معرفة المزيد عن ${t(destination.name)}`,
      en: `I want to know more about ${t(destination.name)}`
    });
    
    sendChatMessage(message);
  };

  const handleDataHelperClick = () => {
    const message = t({
      ar: 'هل تحتاج مساعدة في فهم هذه البيانات؟',
      en: 'Do you need help understanding this data?'
    });
    setShowDataHelper(false);
    openChatbot(message);
  };

  // Copy to clipboard functionality
  const handleCopyMessage = async (messageText, messageId) => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopiedMessageId(messageId);
      
      // Reset copy indicator after 2 seconds
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
      
      // Optional: Show toast notification
      if (showNotification) {
        showNotification(
          t({ ar: 'تم نسخ الرسالة!', en: 'Message copied!' }),
          'success'
        );
      }
    } catch (err) {
      console.error('Failed to copy message:', err);
      if (showNotification) {
        showNotification(
          t({ ar: 'فشل في نسخ الرسالة', en: 'Failed to copy message' }),
          'error'
        );
      }
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 rtl:space-x-reverse text-muted-foreground text-sm animate-fade-in">
      <Bot className="w-4 h-4 text-primary" />
      <span className="font-['Open_Sans']">{t({ ar: 'جواد يكتب...', en: 'Jawad is typing...' })}</span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );

  const DestinationCard = ({ destination, onClick }) => (
    <div 
      onClick={() => onClick(destination)}
      className="glass-card p-3 cursor-pointer hover:bg-white/10 transition-all duration-200 group interactive-card rounded-lg"
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick(destination)}
      aria-label={t({ 
        ar: `اضغط لمعرفة المزيد عن ${t(destination.name)}`,
        en: `Click to learn more about ${t(destination.name)}`
      })}
    >
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <img
          src={destination.image}
          alt={t(destination.name)}
          className="w-12 h-12 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-white text-sm font-semibold font-['Montserrat'] group-hover:text-primary transition-colors">
            {t(destination.name)}
          </h4>
          <p className="text-muted-foreground text-xs font-['Open_Sans'] truncate">
            {t(destination.shortDescription)}
          </p>
          <div className="flex items-center space-x-1 rtl:space-x-reverse mt-1">
            <MapPin className="w-3 h-3 text-primary" />
            <Star className="w-3 h-3 text-yellow-500" />
            <Clock className="w-3 h-3 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* IoT Data Helper Notification */}
      {showDataHelper && (
        <div className="fixed bottom-32 right-6 z-45 animate-scale-in">
          <div className="glass-card p-4 rounded-xl border border-primary/30 max-w-xs">
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 gradient-purple rounded-full flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                <HelpCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-['Open_Sans'] mb-3">
                  {t({ 
                    ar: 'هل تحتاج مساعدة في فهم هذه البيانات؟',
                    en: 'Need help understanding this data?'
                  })}
                </p>
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <button
                    onClick={handleDataHelperClick}
                    className="text-xs bg-primary hover:bg-primary/80 text-white px-3 py-1 rounded-full transition-colors duration-200"
                  >
                    {t({ ar: 'نعم', en: 'Yes' })}
                  </button>
                  <button
                    onClick={() => setShowDataHelper(false)}
                    className="text-xs text-muted-foreground hover:text-white px-3 py-1 transition-colors duration-200"
                  >
                    {t({ ar: 'لا شكراً', en: 'No thanks' })}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowDataHelper(false)}
                className="text-muted-foreground hover:text-white transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => isChatbotOpen ? closeChatbot() : openChatbot()}
        className="fixed bottom-6 right-6 z-50 gradient-purple text-white p-4 rounded-full shadow-2xl interactive-button animate-pulse-glow"
        aria-label={t({ ar: isChatbotOpen ? 'إغلاق المحادثة' : 'فتح المحادثة', en: isChatbotOpen ? 'Close Chat' : 'Open Chat' })}
      >
        {isChatbotOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isChatbotOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 h-96 glass-strong rounded-2xl shadow-2xl border border-primary/20 flex flex-col animate-scale-in">
          {/* Header */}
          <div className="gradient-purple text-white p-4 rounded-t-2xl flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse-glow">
              <Bot className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold font-['Montserrat']">
                {t({ ar: 'جواد', en: 'Jawad' })}
              </h3>
              <p className="text-sm text-white/80 font-['Open_Sans']">
                {t({ ar: 'مرشدك الذكي', en: 'Your Smart Guide' })}
              </p>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-glow"></div>
              <span className="text-xs text-white/60 font-['Open_Sans']">
                {t({ ar: 'متصل', en: 'Online' })}
              </span>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-xl font-['Open_Sans'] ${
                    message.type === 'user'
                      ? 'gradient-purple text-white ml-4'
                      : 'glass text-white mr-4'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  
                  {/* Destination Cards */}
                  {message.showDestinations && (
                    <div className="mt-3 space-y-2">
                      {destinations.slice(0, 3).map((dest) => (
                        <DestinationCard
                          key={dest.id}
                          destination={dest}
                          onClick={handleDestinationClick}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Timestamp */}
                  <div className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="glass px-4 py-3 rounded-xl mr-4">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-4 border-t border-white/10 bg-black/20 rounded-b-2xl">
            <div className="flex space-x-2 rtl:space-x-reverse">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t({ ar: 'اسأل جواد...', en: 'Ask Jawad...' })}
                disabled={isLoading.chatbot || isTyping}
                className="flex-1 px-3 py-2 glass text-white placeholder-muted-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm font-['Open_Sans'] disabled:opacity-50"
                aria-label={t({ ar: 'اكتب رسالتك', en: 'Type your message' })}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading.chatbot || isTyping}
                className="gradient-purple hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-white p-2 rounded-lg interactive-button flex items-center justify-center min-w-[40px]"
                aria-label={t({ ar: 'إرسال الرسالة', en: 'Send message' })}
              >
                {isLoading.chatbot ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            
            {/* Context-aware Suggestions */}
            {chatMessages.length === 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {currentPage === '/iot-hub' ? [
                  { ar: 'تحليل البيانات الحالية', en: 'Analyze current data' },
                  { ar: 'أفضل وقت للزيارة', en: 'Best time to visit' }
                ] : currentPage.includes('/destinations/') ? [
                  { ar: 'نصائح للزيارة', en: 'Visiting tips' },
                  { ar: 'أفضل الأوقات', en: 'Best times' }
                ] : [
                  { ar: 'خطط لرحلتي', en: 'Plan my trip' },
                  { ar: 'الوجهات السياحية', en: 'Tourist destinations' }
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(t(suggestion))}
                    className="text-xs px-3 py-1 glass hover:bg-white/10 rounded-full text-white transition-colors duration-200 font-['Open_Sans'] interactive-button"
                  >
                    {t(suggestion)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;