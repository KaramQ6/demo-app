// خدمة الحصول على بيانات الازدحام الحقيقية
// Real Crowd Data Service

class CrowdDataService {
    constructor() {
        // Google Places API Key - يجب الحصول عليه من Google Cloud Console
        this.googleApiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

        // تعريف معرفات الأماكن الحقيقية في جوردن
        this.jordanPlacesIds = {
            'petra': 'ChIJW_WKdJZQsBQR1Rn7jnhBwFk', // البتراء
            'jerash': 'ChIJKbzJ5q-7BhURKcfGvBmF1Gw', // جرش
            'wadi-rum': 'ChIJzwsHVjJKshQRBwzDfBJ6qGQ', // وادي رم
            'dead-sea': 'ChIJqVEcnN5XBhURlV_F6fSkV1w', // البحر الميت
            'amman-citadel': 'ChIJKzppGzk7BhURl3cE6B-q2j4', // قلعة عمان
            'ajloun-castle': 'ChIJ2-qfN7PNBhUR4qZ5ZQK2i9M', // قلعة عجلون
            'dana-reserve': 'ChIJI5jNGJxQsBQREQJ_5rlIoAc', // محمية دانا
            'karak-castle': 'ChIJHVE6YIWqshQRK6VH3xz3fvU', // قلعة الكرك
            'aqaba': 'ChIJVTZR0J9OshQR_KHXBY_i-bA', // العقبة
            'rainbow-street': 'ChIJHzJ7Zz48BhURhVVq8aZWJjQ' // رينبو ستريت
        };

        // النسخة الاحتياطية للبيانات عند عدم توفر الإنترنت
        this.fallbackData = {
            'petra': { crowdLevel: 85, busyTimes: ['10:00-12:00', '14:00-16:00'] },
            'jerash': { crowdLevel: 45, busyTimes: ['09:00-11:00', '15:00-17:00'] },
            'wadi-rum': { crowdLevel: 25, busyTimes: ['16:00-18:00'] },
            'dead-sea': { crowdLevel: 60, busyTimes: ['11:00-13:00', '15:00-17:00'] },
            'amman-citadel': { crowdLevel: 40, busyTimes: ['10:00-12:00'] },
            'ajloun-castle': { crowdLevel: 30, busyTimes: ['11:00-13:00'] },
            'dana-reserve': { crowdLevel: 20, busyTimes: ['08:00-10:00'] },
            'karak-castle': { crowdLevel: 35, busyTimes: ['10:00-12:00'] },
            'aqaba': { crowdLevel: 70, busyTimes: ['12:00-14:00', '18:00-20:00'] },
            'rainbow-street': { crowdLevel: 80, busyTimes: ['19:00-22:00'] }
        };
    }

    // الحصول على بيانات الازدحام من Google Places API
    async getRealCrowdData(destinationId) {
        try {
            const placeId = this.jordanPlacesIds[destinationId];
            if (!placeId) {
                console.warn(`No Place ID found for destination: ${destinationId}`);
                return this.getFallbackData(destinationId);
            }

            if (!this.googleApiKey) {
                console.warn('Google Places API key not configured');
                return this.getFallbackData(destinationId);
            }

            // استدعاء Google Places API للحصول على البيانات الحقيقية
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,opening_hours,photos,popular_times&key=${this.googleApiKey}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === 'OK' && data.result) {
                return this.processCrowdData(data.result, destinationId);
            } else {
                console.warn('Google Places API returned error:', data.status);
                return this.getFallbackData(destinationId);
            }

        } catch (error) {
            console.error('Error fetching real crowd data:', error);
            return this.getFallbackData(destinationId);
        }
    }

    // معالجة البيانات من Google Places API
    processCrowdData(placeData, destinationId) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

        let crowdLevel = 30; // مستوى افتراضي

        // تحليل popular_times إذا كانت متوفرة
        if (placeData.popular_times && placeData.popular_times.length > 0) {
            const todayData = placeData.popular_times.find(day => day.day === currentDay);
            if (todayData && todayData.data && todayData.data.length > currentHour) {
                crowdLevel = todayData.data[currentHour];
            }
        }

        // تحليل عدد التقييمات لتحديد الشعبية
        const ratingsCount = placeData.user_ratings_total || 0;
        let popularityBonus = 0;
        if (ratingsCount > 10000) popularityBonus = 20;
        else if (ratingsCount > 5000) popularityBonus = 15;
        else if (ratingsCount > 1000) popularityBonus = 10;

        crowdLevel = Math.min(100, crowdLevel + popularityBonus);

        // تعديل حسب الوقت (أوقات الذروة السياحية في الأردن)
        const peakHours = this.getPeakHours(destinationId);
        const isWeekend = currentDay === 5 || currentDay === 6; // الجمعة والسبت

        if (peakHours.includes(currentHour)) {
            crowdLevel += 15;
        }

        if (isWeekend) {
            crowdLevel += 10;
        }

        // تعديل حسب الموسم (الشتاء أكثر ازدحاماً في الأردن)
        const currentMonth = now.getMonth();
        if (currentMonth >= 10 || currentMonth <= 2) { // نوفمبر - فبراير
            crowdLevel += 10;
        }

        return {
            crowdLevel: Math.min(100, Math.max(0, crowdLevel)),
            currentVisitors: this.estimateVisitors(crowdLevel, destinationId),
            rating: placeData.rating || 4.0,
            totalRatings: ratingsCount,
            isOpen: this.checkIfOpen(placeData.opening_hours),
            lastUpdated: new Date().toISOString(),
            dataSource: 'google_places_api'
        };
    }

    // تحديد أوقات الذروة لكل وجهة
    getPeakHours(destinationId) {
        const peakTimes = {
            'petra': [10, 11, 14, 15], // 10-11 صباحاً، 2-3 عصراً
            'jerash': [9, 10, 15, 16], // 9-10 صباحاً، 3-4 عصراً
            'wadi-rum': [16, 17, 18], // المساء للغروب
            'dead-sea': [11, 12, 15, 16], // قبل وبعد الظهر
            'amman-citadel': [10, 11], // الصباح
            'ajloun-castle': [11, 12], // قبل الظهر
            'dana-reserve': [8, 9], // الصباح الباكر
            'karak-castle': [10, 11], // الصباح
            'aqaba': [12, 13, 18, 19], // الظهر والمساء
            'rainbow-street': [19, 20, 21] // المساء
        };

        return peakTimes[destinationId] || [10, 11, 15, 16];
    }

    // تقدير عدد الزوار الحاليين
    estimateVisitors(crowdLevel, destinationId) {
        const capacity = {
            'petra': 3000,
            'jerash': 800,
            'wadi-rum': 500,
            'dead-sea': 1500,
            'amman-citadel': 400,
            'ajloun-castle': 200,
            'dana-reserve': 150,
            'karak-castle': 300,
            'aqaba': 2000,
            'rainbow-street': 1000
        };

        const maxCapacity = capacity[destinationId] || 500;
        return Math.round((crowdLevel / 100) * maxCapacity);
    }

    // فحص إذا كان المكان مفتوح
    checkIfOpen(openingHours) {
        if (!openingHours || !openingHours.periods) return true;

        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = now.getHours() * 100 + now.getMinutes();

        const todayHours = openingHours.periods.find(period =>
            period.open && period.open.day === currentDay
        );

        if (!todayHours) return false;

        const openTime = todayHours.open.time;
        const closeTime = todayHours.close ? todayHours.close.time : 2400;

        return currentTime >= openTime && currentTime < closeTime;
    }

    // البيانات الاحتياطية
    getFallbackData(destinationId) {
        const fallback = this.fallbackData[destinationId] || { crowdLevel: 30 };

        return {
            crowdLevel: fallback.crowdLevel,
            currentVisitors: this.estimateVisitors(fallback.crowdLevel, destinationId),
            rating: 4.2,
            totalRatings: 1250,
            isOpen: true,
            lastUpdated: new Date().toISOString(),
            dataSource: 'fallback_data'
        };
    }

    // الحصول على بيانات متعددة الوجهات
    async getMultipleCrowdData(destinationIds) {
        const promises = destinationIds.map(id => this.getRealCrowdData(id));
        const results = await Promise.allSettled(promises);

        const crowdData = {};
        destinationIds.forEach((id, index) => {
            const result = results[index];
            if (result.status === 'fulfilled') {
                crowdData[id] = result.value;
            } else {
                crowdData[id] = this.getFallbackData(id);
            }
        });

        return crowdData;
    }

    // تحديث البيانات بشكل دوري
    startPeriodicUpdates(destinationIds, updateCallback, intervalMinutes = 15) {
        const updateInterval = intervalMinutes * 60 * 1000; // تحويل إلى مللي ثانية

        const update = async () => {
            try {
                const crowdData = await this.getMultipleCrowdData(destinationIds);
                updateCallback(crowdData);
                console.log('Crowd data updated successfully');
            } catch (error) {
                console.error('Error updating crowd data:', error);
            }
        };

        // تحديث فوري
        update();

        // تحديث دوري
        return setInterval(update, updateInterval);
    }
}

export default CrowdDataService;
