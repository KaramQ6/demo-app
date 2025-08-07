import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';

const GlobalError = () => {
    const { globalError, clearGlobalError } = useApp();
    const { t } = useLanguage();

    if (!globalError) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={clearGlobalError}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="bg-gray-900/95 backdrop-blur-md border border-red-500/30 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <AlertCircle className="w-6 h-6 text-red-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">
                                {t({
                                    ar: 'عذراً، حدث خطأ!',
                                    en: 'Oops! Something went wrong!'
                                })}
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                {globalError}
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={clearGlobalError}
                                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-colors duration-200 text-sm font-medium border border-red-500/30"
                                >
                                    {t({ ar: 'إغلاق', en: 'Dismiss' })}
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={clearGlobalError}
                            className="flex-shrink-0 p-1 hover:bg-gray-800 rounded-full transition-colors duration-200 text-gray-400 hover:text-gray-300"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GlobalError;
