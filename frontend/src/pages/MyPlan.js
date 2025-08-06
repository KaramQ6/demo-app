// src/pages/MyPlan.js
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../supabaseClient';
import { destinations } from '../mock'; // تأكد من أن المسار صحيح
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin, Star, Users, Trash2, Loader2, Bot } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const MyPlan = () => {
    const { t, language } = useLanguage(); //  <-- أضف language هنا
    const { user } = useApp();
    const { toast } = useToast();
    const [itineraryItems, setItineraryItems] = useState([]); //  <-- لتخزين items من supabase
    const [itineraryDestinations, setItineraryDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    // حالات جديدة للمخطط الذكي
    const [smartPlan, setSmartPlan] = useState(null);
    const [isPlanning, setIsPlanning] = useState(false);

    const fetchUserItinerary = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('itineraries')
                .select('id, destination_id') //  <-- جلب الـ id أيضًا للحذف
                .eq('user_id', user.id);

            if (error) throw error;

            setItineraryItems(data); //  <-- حفظ البيانات الأصلية
            const userDestinationIds = data.map(item => item.destination_id);
            const userDestinations = destinations.filter(dest =>
                userDestinationIds.includes(dest.id)
            );
            setItineraryDestinations(userDestinations);
        } catch (error) {
            console.error('Error fetching itinerary:', error);
            toast({ title: t({ ar: "خطأ", en: "Error" }), description: t({ ar: "فشل في جلب الخطة", en: "Failed to fetch plan" }), variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const removeFromItinerary = async (destinationId) => {
        if (!user) return;

        setDeletingId(destinationId);

        try {
            const { error } = await supabase
                .from('itineraries')
                .delete()
                .eq('user_id', user.id)
                .eq('destination_id', destinationId);

            if (error) {
                console.error('Error removing destination:', error);
                toast({
                    title: t({ ar: "خطأ", en: "Error" }),
                    description: t({ ar: "فشل في حذف الوجهة", en: "Failed to remove destination" }),
                    variant: "destructive"
                });
                return;
            }

            // تحديث القائمة محلياً
            setItineraryDestinations(prev =>
                prev.filter(dest => dest.id !== destinationId)
            );

            toast({
                title: t({ ar: "تم الحذف", en: "Removed" }),
                description: t({ ar: "تم حذف الوجهة من خطتك", en: "Destination removed from your plan" }),
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setDeletingId(null);
        }
    };

    //  <<<<< الدالة الجديدة والمهمة >>>>>
    const handleGenerateSmartPlan = async () => {
        setIsPlanning(true);
        setSmartPlan(null);

        const webhookUrl = 'https://n8n.smart-tour.app/webhook/generateSmartPlan'; //  <-- تأكد من أن هذا هو رابط الـ Webhook الصحيح

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destinations: itineraryDestinations })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const plan = await response.json();

            // تحقق من أن الرد يحتوي على itinerary
            if (plan.itinerary) {
                setSmartPlan(plan.itinerary);
                toast({ title: t({ ar: "تم إنشاء الخطة!", en: "Plan Generated!" }) });
            } else {
                throw new Error("Invalid plan format received from server.");
            }

        } catch (error) {
            console.error("Error generating smart plan:", error);
            toast({ title: t({ ar: 'حدث خطأ', en: 'An error occurred' }), description: t({ ar: "لم يتمكن جواد من التخطيط الآن، حاول مرة أخرى.", en: "Jawad couldn't plan right now, please try again." }), variant: "destructive" });
        } finally {
            setIsPlanning(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUserItinerary();
        } else {
            setLoading(false);
            setItineraryDestinations([]);
        }
    }, [user?.id]);

    if (!user) {
        return (
            <div className="relative min-h-screen pt-20">
                <div className="container mx-auto px-6 py-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-3xl font-bold text-white mb-4">
                            {t({ ar: 'خطتي', en: 'My Plan' })}
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            {t({ ar: 'يجب تسجيل الدخول لعرض خطتك', en: 'Please login to view your plan' })}
                        </p>
                        <Button onClick={() => window.location.href = '/login'}>
                            {t({ ar: 'تسجيل الدخول', en: 'Login' })}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pt-20">
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {t({ ar: 'خطتي', en: 'My Travel Plan' })}
                        </h1>
                        <p className="text-muted-foreground">
                            {t({ ar: 'الوجهات التي أضفتها إلى خطتك', en: 'Destinations you\'ve added to your plan' })}
                        </p>
                    </div>

                    {/*  <<<<< الزر الجديد للمخطط الذكي >>>>> */}
                    {itineraryDestinations.length > 1 && !smartPlan && (
                        <div className="text-center my-8">
                            <Button
                                onClick={handleGenerateSmartPlan}
                                disabled={isPlanning}
                                className="gradient-purple px-8 py-6 text-lg"
                            >
                                {isPlanning ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        {t({ ar: 'جواد يخطط لك...', en: 'Jawad is planning...' })}
                                    </>
                                ) : (
                                    <>
                                        <Bot className="w-5 h-5 mr-2" />
                                        {t({ ar: 'خطط لي يا جواد!', en: 'Plan for me, Jawad!' })}
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                            <span className="ml-3 text-white">
                                {t({ ar: 'جاري التحميل...', en: 'Loading...' })}
                            </span>
                        </div>
                    ) : itineraryDestinations.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto flex items-center justify-center mb-6">
                                <MapPin className="w-12 h-12 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {t({ ar: 'لا توجد وجهات في خطتك بعد', en: 'No destinations in your plan yet' })}
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {t({ ar: 'ابدأ بالدردشة مع جواد لاكتشاف وجهات مذهلة!', en: 'Start chatting with Jawad to discover amazing destinations!' })}
                            </p>
                            <Button onClick={() => window.location.href = '/'}>
                                {t({ ar: 'استكشف الوجهات', en: 'Explore Destinations' })}
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {itineraryDestinations.map((destination) => (
                                <Card key={destination.id} className="glass-card border-white/10 overflow-hidden">
                                    <div className="relative h-48">
                                        <img
                                            src={destination.image}
                                            alt={destination.name.ar}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => removeFromItinerary(destination.id)}
                                                disabled={deletingId === destination.id}
                                                className="rounded-full w-8 h-8 p-0"
                                            >
                                                {deletingId === destination.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="text-white">
                                            {destination.name.ar}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {destination.shortDescription.ar}
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm mb-4">
                                            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-white">{destination.rating}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                                <Users className="w-4 h-4 text-blue-400" />
                                                <span className="text-muted-foreground capitalize">
                                                    {destination.crowdLevel}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-3">
                                            {destination.description.ar}
                                        </p>
                                        <Button
                                            className="w-full mt-4"
                                            variant="outline"
                                            onClick={() => window.location.href = `/destinations/${destination.id}`}
                                        >
                                            {t({ ar: 'عرض التفاصيل', en: 'View Details' })}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/*  <<<<< القسم الجديد لعرض الخطة الذكية >>>>> */}
                    {isPlanning && (
                        <div className="text-center py-10">
                            <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
                        </div>
                    )}

                    {smartPlan && (
                        <div className="mt-12 animate-fade-in-up">
                            <h2 className="text-2xl font-bold text-white text-center mb-6">{t({ ar: 'خطتك الذكية المقترحة', en: 'Your Suggested Smart Plan' })}</h2>
                            <div className="space-y-6">
                                {Object.keys(smartPlan).sort().map(day => (
                                    <div key={day} className="glass-card p-6 rounded-lg border-white/10">
                                        <h3 className="text-xl font-semibold text-purple-400 mb-4 border-b border-white/10 pb-3">
                                            {t({ ar: `اليوم ${day}`, en: `Day ${day}` })}
                                        </h3>
                                        <ul className="space-y-4">
                                            {smartPlan[day].map(destination => (
                                                <li key={destination.id} className="text-white flex items-center">
                                                    <MapPin className="w-4 h-4 mr-3 text-purple-400" />
                                                    {destination.name[language]}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 pointer-events-none" />
            <div className="absolute top-40 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
    );
};

export default MyPlan;
