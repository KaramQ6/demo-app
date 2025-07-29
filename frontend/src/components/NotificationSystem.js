import React, { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const NotificationSystem = () => {
  const { notifications, removeNotification } = useApp();
  const { isRTL } = useLanguage();

  useEffect(() => {
    // Auto-remove notifications after their duration
    notifications.forEach(notification => {
      if (!notification.autoRemoved) {
        notification.autoRemoved = true;
        setTimeout(() => {
          removeNotification(notification.id);
        }, 5000);
      }
    });
  }, [notifications, removeNotification]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'info':
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className={`fixed top-20 z-40 space-y-3 ${isRTL ? 'left-6' : 'right-6'}`}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`glass-card border-2 ${getNotificationStyles(notification.type)} p-4 rounded-xl shadow-2xl animate-slide-up max-w-sm`}
        >
          <div className="flex items-start space-x-3 rtl:space-x-reverse">
            <div className="flex-shrink-0 mt-0.5">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium font-['Open_Sans']">
                {notification.message}
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                {notification.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-muted-foreground hover:text-white transition-colors duration-200"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;