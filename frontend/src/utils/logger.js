// Logger utility للإنتاج - تقليل console.error في الإنتاج
const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
    // للأخطاء الحرجة فقط في الإنتاج
    error: (message, ...args) => {
        if (!isProduction) {
            console.error(message, ...args);
        } else {
            // في الإنتاج، نسجل فقط للمطورين
            console.warn(`[System]: ${message}`);
        }
    },

    // للتحذيرات - تظهر في التطوير فقط
    warn: (message, ...args) => {
        if (!isProduction) {
            console.warn(message, ...args);
        }
    },

    // للمعلومات - تظهر في التطوير فقط
    info: (message, ...args) => {
        if (!isProduction) {
            console.info(message, ...args);
        }
    },

    // للـ debug - تظهر في التطوير فقط
    debug: (message, ...args) => {
        if (!isProduction) {
            console.log(`[DEBUG]: ${message}`, ...args);
        }
    }
};
