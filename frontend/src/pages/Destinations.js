import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MapPin, Clock, Users, Activity, Star, Filter, Search } from 'lucide-react';
import { destinations } from '../mock';

const Destinations = () => {
  const { t, language } = useLanguage();
  const { openChatbot, iotData } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Simulate loading delay for skeleton implementation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 second delay as requested

    return () => clearTimeout(timer);
  }, []);

  // Filter destinations based on search and filter
  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = t(destination.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t(destination.shortDescription).toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         destination.features.includes(selectedFilter) ||
                         destination.crowdLevel === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const filterOptions = [
    { value: 'all', label: { ar: 'الكل', en: 'All' } },
    { value: 'historical', label: { ar: 'تاريخي', en: 'Historical' } },
    { value: 'nature', label: { ar: 'طبيعي', en: 'Nature' } },
    { value: 'adventure', label: { ar: 'مغامرة', en: 'Adventure' } },
    { value: 'low', label: { ar: 'هادئ', en: 'Quiet' } },
    { value: 'heritage', label: { ar: 'تراثي', en: 'Heritage' } }
  ];

  // Skeleton Card Component for loading state
  const SkeletonCard = ({ index }) => (
    <Card className="glass-card h-full overflow-hidden border-white/10 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="relative h-64 overflow-hidden">
        {/* Image skeleton with shimmer effect */}
        <div className="w-full h-full bg-gray-700/50 animate-pulse flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-r from-gray-700/50 via-gray-600/50 to-gray-700/50 animate-shimmer"></div>
        </div>
        
        {/* Badge skeletons */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <div className="bg-gray-600/50 rounded-full px-4 py-2 animate-pulse">
            <div className="w-12 h-4 bg-gray-500/50 rounded"></div>
          </div>
          <div className="bg-gray-600/50 rounded-full px-4 py-2 animate-pulse">
            <div className="w-8 h-4 bg-gray-500/50 rounded"></div>
          </div>
        </div>
        
        {/* Title skeleton */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-600/50 rounded h-6 mb-3 animate-pulse"></div>
          <div className="flex items-center justify-between">
            <div className="bg-gray-600/50 rounded h-4 w-16 animate-pulse"></div>
            <div className="bg-gray-600/50 rounded-full h-6 w-12 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        {/* Description skeleton */}
        <div className="space-y-2 mb-6">
          <div className="bg-gray-600/50 rounded h-4 animate-pulse"></div>
          <div className="bg-gray-600/50 rounded h-4 w-4/5 animate-pulse"></div>
        </div>
        
        {/* Features skeleton */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-gray-700/50 rounded-lg p-3 animate-pulse">
              <div className="bg-gray-600/50 rounded h-4 w-16"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const getCrowdLevel = (destinationId) => {
    const data = iotData[destinationId];
    if (data && data.crowdLevel !== undefined) {
      if (data.crowdLevel < 30) return { level: 'low', color: 'text-green-400', bg: 'bg-green-500/20' };
      if (data.crowdLevel < 70) return { level: 'medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
      return { level: 'high', color: 'text-red-400', bg: 'bg-red-500/20' };
    }
    
    // Fallback to static data
    const destination = destinations.find(d => d.id === destinationId);
    const level = destination?.crowdLevel || 'medium';
    return {
      level,
      color: level === 'low' ? 'text-green-400' : level === 'medium' ? 'text-yellow-400' : 'text-red-400',
      bg: level === 'low' ? 'bg-green-500/20' : level === 'medium' ? 'bg-yellow-500/20' : 'bg-red-500/20'
    };
  };

  const getCrowdColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold font-['Montserrat'] text-white mb-6">
            {t({ ar: 'اكتشف وجهات الأردن', en: 'Discover Jordan\'s Destinations' })}
          </h1>
          <p className="text-xl text-muted-foreground font-['Open_Sans'] max-w-3xl mx-auto">
            {t({ 
              ar: 'استكشف أجمل الوجهات السياحية في الأردن مع بيانات حية عن مستوى الازدحام والطقس',
              en: 'Explore the most beautiful tourist destinations in Jordan with live data on crowd levels and weather'
            })}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder={t({ ar: 'ابحث عن وجهة...', en: 'Search for a destination...' })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-['Open_Sans']"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="glass rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary font-['Open_Sans']"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-900">
                  {t(option.label)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {isLoading ? (
            // Show skeleton cards during loading
            Array.from({ length: 6 }, (_, index) => (
              <SkeletonCard key={`skeleton-${index}`} index={index} />
            ))
          ) : (
            // Show actual destination cards
            filteredDestinations.map((destination, index) => {
              const crowdData = getCrowdLevel(destination.id);
              
              return (
                <Link key={destination.id} to={`/destinations/${destination.id}`}>
                  <Card className="glass-card interactive-card h-full overflow-hidden border-white/10 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={destination.image}
                        alt={t(destination.name)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      {/* Rating Badge */}
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white text-sm font-semibold">{destination.rating}</span>
                        </div>
                      </div>
                      
                      {/* Crowd Level Badge */}
                      <div className="absolute top-4 right-4">
                        <div className={`${crowdData.bg} backdrop-blur-sm rounded-full px-3 py-1`}>
                          <span className={`text-xs font-semibold ${crowdData.color}`}>
                            {crowdData.level === 'low' ? t({ ar: 'هادئ', en: 'Quiet' }) :
                             crowdData.level === 'medium' ? t({ ar: 'متوسط', en: 'Moderate' }) :
                             t({ ar: 'مزدحم', en: 'Busy' })}
                          </span>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold font-['Montserrat'] text-white mb-2">
                          {t(destination.name)}
                        </h3>
                        <div className="flex items-center text-sm text-gray-300">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="font-['Open_Sans']">
                            {t({ ar: 'الأردن', en: 'Jordan' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <p className="text-muted-foreground font-['Open_Sans'] mb-4 leading-relaxed">
                        {t(destination.shortDescription)}
                      </p>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-2">
                        {destination.features.slice(0, 3).map((feature) => (
                          <Badge key={feature} variant="secondary" className="glass text-xs">
                            {feature.replace('-', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>

        {/* No Results */}
        {!isLoading && filteredDestinations.length === 0 && (
          <div className="text-center py-20 animate-fade-in-up">
            <h3 className="text-2xl font-bold font-['Montserrat'] text-white mb-4">
              {t({ ar: 'لم نجد أي نتائج', en: 'No results found' })}
            </h3>
            <p className="text-muted-foreground font-['Open_Sans'] mb-6">
              {t({ ar: 'جرب تغيير كلمات البحث أو الفلترة', en: 'Try changing your search terms or filters' })}
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              variant="outline"
              className="glass border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 interactive-button font-['Open_Sans']"
            >
              {t({ ar: 'مسح الفلاتر', en: 'Clear Filters' })}
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="glass-card rounded-3xl p-12 shadow-2xl max-w-3xl mx-auto border border-primary/20">
            <div className="mb-8">
              <h2 className="text-3xl font-bold font-['Montserrat'] text-white mb-4">
                {t({ ar: 'تحتاج مساعدة في التخطيط؟', en: 'Need Help Planning?' })}
              </h2>
              <p className="text-muted-foreground font-['Open_Sans'] text-lg">
                {t({ 
                  ar: 'دع جواد، مرشدك الذكي، يساعدك في اختيار أفضل الوجهات حسب اهتماماتك',
                  en: 'Let Jawad, your smart guide, help you choose the best destinations based on your interests'
                })}
              </p>
            </div>
            <Button
              onClick={() => openChatbot(t({ 
                ar: 'أريد نصائح لاختيار أفضل الوجهات السياحية في الأردن',
                en: 'I want advice on choosing the best tourist destinations in Jordan'
              }))}
              size="lg"
              className="gradient-purple text-white px-8 py-4 text-lg font-semibold font-['Open_Sans'] hover:scale-105 transition-all duration-300 interactive-button shadow-2xl"
            >
              {t({ ar: 'تحدث مع جواد', en: 'Talk to Jawad' })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destinations;