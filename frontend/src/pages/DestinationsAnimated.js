import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { destinations } from '../mock';
import { Card, CardContent } from '../components/ui/card';
import { MapPin, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import DestinationCardSkeleton from '../components/DestinationCardSkeleton';

const Destinations = () => {
    const { t, isRTL } = useLanguage();
    const [loading, setLoading] = useState(true);

    // Animation variants for container
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    // Animation variants for each card
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        hover: {
            y: -8,
            scale: 1.02,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        }
    };

    // Simulate loading time for demonstration
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Defensive Check: Ensure destinations data is a valid array
    if (!destinations || !Array.isArray(destinations)) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Error: Could not load destination data.
            </div>
        );
    }

    return (
        <div className="relative min-h-screen py-20 px-6">
            <div className="container mx-auto max-w-6xl relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold font-['Montserrat'] text-white mb-6">
                        {t({ ar: 'استكشف وجهاتنا', en: 'Explore Our Destinations' })}
                    </h1>
                    <p className="text-xl text-muted-foreground font-['Open_Sans'] max-w-2xl mx-auto">
                        {t({ ar: 'اكتشف أروع الوجهات السياحية في الأردن مع بيانات حية ونصائح ذكية', en: 'Discover the most amazing tourist destinations in Jordan with live data and smart tips' })}
                    </p>
                </motion.div>

                {loading ? (
                    // Skeleton Loading State
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {Array.from({ length: 9 }, (_, index) => (
                            <DestinationCardSkeleton key={`skeleton-${index}`} />
                        ))}
                    </motion.div>
                ) : (
                    // Actual Content with Animations
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {destinations.map((destination, index) => (
                            <motion.div
                                key={destination.id}
                                variants={cardVariants}
                                whileHover="hover"
                            >
                                <Link
                                    to={`/destinations/${destination.id}`}
                                    className="group block h-full"
                                >
                                    <Card className="glass-card interactive-card h-full overflow-hidden border-white/10">
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={destination.image}
                                                alt={t(destination.name)}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                            <div className="absolute top-4 right-4">
                                                <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="text-white text-sm font-semibold">{destination.rating}</span>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-4 left-4 right-4">
                                                <h3 className="text-xl font-bold font-['Montserrat'] text-white mb-2">
                                                    {t(destination.name)}
                                                </h3>
                                            </div>
                                        </div>
                                        <CardContent className="p-6">
                                            <p className="text-muted-foreground font-['Open_Sans'] mb-4 leading-relaxed">
                                                {t(destination.shortDescription)}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="font-['Open_Sans']">
                                                        {t({ ar: 'الأردن', en: 'Jordan' })}
                                                    </span>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${destination.crowdLevel === 'low' ? 'bg-green-500/20 text-green-400' :
                                                        destination.crowdLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {t({
                                                        ar: destination.crowdLevel === 'low' ? 'هادئ' : destination.crowdLevel === 'medium' ? 'متوسط' : 'مزدحم',
                                                        en: destination.crowdLevel
                                                    })}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 pointer-events-none" />
            <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
    );
};

export default Destinations;
