import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { destinations } from '../mock'; // Ensure this path is correct
import { Card, CardContent } from '../components/ui/card';
import { MapPin, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import DestinationCardSkeleton from '../components/DestinationCardSkeleton';

const Destinations = () => {
    const { t, isRTL } = useLanguage();
    const [loading, setLoading] = useState(true);

    // Simulate loading time for demonstration
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // 2 seconds loading simulation

        return () => clearTimeout(timer);
    }, []);

    // Defensive Check: Ensure destinations data is a valid array before rendering
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
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold font-['Montserrat'] text-white mb-6">
                        {t({ ar: 'استكشف وجهاتنا', en: 'Explore Our Destinations' })}
                    </h1>
                    <p className="text-xl text-muted-foreground font-['Open_Sans'] max-w-2xl mx-auto">
                        {t({ ar: 'اكتشف أروع الوجهات السياحية في الأردن مع بيانات حية ونصائح ذكية', en: 'Discover the most amazing tourist destinations in Jordan with live data and smart tips' })}
                    </p>
                </div>

                {loading ? (
                    // Skeleton Loading State
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 9 }, (_, index) => (
                            <DestinationCardSkeleton key={`skeleton-${index}`} />
                        ))}
                    </div>
                ) : (
                    // Actual Content
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map((destination, index) => (
                            <Link
                                key={destination.id}
                                to={`/destinations/${destination.id}`}
                                className="group animate-fade-in-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
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
                        ))}
                    </div>
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
