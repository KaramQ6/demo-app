# نظام بيانات الازدحام الحقيقية | Real Crowd Data System

## نظرة عامة | Overview

تم تطوير نظام لجلب بيانات الازدحام الحقيقية للأماكن السياحية في الأردن باستخدام Google Places API.

A system developed to fetch real crowd data for tourist attractions in Jordan using Google Places API.

## المميزات | Features

### 🔄 بيانات حقيقية في الوقت الفعلي
- اتصال مباشر بـ Google Places API
- تحديث البيانات كل 15 دقيقة
- بيانات احتياطية عند انقطاع الاتصال

### 📊 معلومات شاملة لكل وجهة
- مستوى الازدحام (0-100%)
- عدد الزوار التقديري الحالي
- حالة المكان (مفتوح/مغلق)
- التقييم وعدد المراجعات
- مصدر البيانات (حقيقي/تقديري)

### 🏛️ الأماكن المشمولة
- البتراء (Petra)
- جرش (Jerash)
- وادي رم (Wadi Rum)
- البحر الميت (Dead Sea)
- قلعة عمان (Amman Citadel)
- قلعة عجلون (Ajloun Castle)
- محمية دانا (Dana Reserve)
- قلعة الكرك (Karak Castle)
- العقبة (Aqaba)
- رينبو ستريت (Rainbow Street)

## متطلبات الإعداد | Setup Requirements

### 1. Google Cloud Console Setup

1. **إنشاء مشروع جديد**
   - اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
   - أنشئ مشروع جديد أو استخدم مشروع موجود

2. **تفعيل APIs المطلوبة**
   ```
   - Places API
   - Places API (New)
   - Maps JavaScript API (اختياري للخرائط)
   ```

3. **إنشاء API Key**
   - اذهب إلى APIs & Services > Credentials
   - اضغط "Create Credentials" > "API Key"
   - قم بتقييد المفتاح للأمان (اختياري)

### 2. تكوين التطبيق | Application Configuration

1. **إنشاء ملف البيئة**
   ```bash
   # في مجلد frontend/
   cp .env.example .env
   ```

2. **إضافة API Key**
   ```env
   # في ملف .env
   REACT_APP_GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
   ```

3. **إعادة تشغيل التطبيق**
   ```bash
   npm restart
   ```

## كيفية الاستخدام | How to Use

### في واجهة المستخدم

1. **زيارة صفحة تفاصيل أي وجهة**
   - ستجد قسم "بيانات الازدحام الحقيقية"
   - يعرض المستوى الحالي وعدد الزوار

2. **صفحة إعدادات البيانات**
   - اذهب إلى `/crowd-settings`
   - تحقق من حالة الاتصال بـ API
   - اختبر مفتاح API الخاص بك

### في الكود

```javascript
import { useApp } from '../contexts/AppContext';

const MyComponent = () => {
    const { 
        realCrowdData, 
        getRealCrowdData, 
        initializeRealCrowdData 
    } = useApp();

    // الحصول على بيانات وجهة معينة
    const petarData = realCrowdData['petra'];
    
    // تحديث بيانات وجهة معينة
    await getRealCrowdData('petra');
    
    // إعادة تهيئة جميع البيانات
    await initializeRealCrowdData();
};
```

## هيكل البيانات | Data Structure

```javascript
{
    "petra": {
        "crowdLevel": 85,           // مستوى الازدحام (0-100)
        "currentVisitors": 2550,    // عدد الزوار التقديري
        "rating": 4.6,              // التقييم
        "totalRatings": 15420,      // عدد المراجعات
        "isOpen": true,             // حالة المكان
        "lastUpdated": "2024-01-10T14:30:00Z",
        "dataSource": "google_places_api" // مصدر البيانات
    }
}
```

## الملفات المضافة | Added Files

```
frontend/
├── src/
│   ├── services/
│   │   └── crowdDataService.js      # خدمة Google Places API
│   ├── components/
│   │   └── RealCrowdDisplay.js      # مكون عرض البيانات
│   └── pages/
│       └── CrowdDataSettings.js     # صفحة الإعدادات
└── .env.example                     # مثال متغيرات البيئة
```

## استكشاف الأخطاء | Troubleshooting

### 🔴 API Key لا يعمل
```
المشكلة: "API Error: REQUEST_DENIED"
الحل:
1. تأكد من تفعيل Places API في Google Cloud
2. تحقق من صحة API Key
3. تأكد من عدم تجاوز الحد اليومي
```

### 🔴 مشكلة CORS
```
المشكلة: "CORS policy error"
الحل:
1. استخدم proxy server في التطوير
2. في الإنتاج، قم بإعداد backend proxy
3. أو استخدم Google Places API من الخادم
```

### 🔴 بيانات غير محدثة
```
المشكلة: البيانات لا تتحدث تلقائياً
الحل:
1. تحقق من اتصال الإنترنت
2. تأكد من أن API Key لم ينته
3. استخدم زر التحديث اليدوي
```

## تحسينات مستقبلية | Future Enhancements

- [ ] ربط مع كاميرات المراقبة
- [ ] تحليل بيانات وسائل التواصل الاجتماعي
- [ ] إشعارات للمستخدمين عن الأوقات الهادئة
- [ ] توقع مستويات الازدحام المستقبلية
- [ ] ربط مع بيانات الطقس والأحداث

## التكلفة | Cost

### Google Places API Pricing
- **Place Details**: $17 لكل 1000 طلب
- **التحديث كل 15 دقيقة**: ~96 طلب/يوم لكل وجهة
- **10 وجهات**: ~960 طلب/يوم = $16.32/يوم

### تقليل التكلفة
1. زيادة فترة التحديث إلى 30 دقيقة
2. التحديث فقط في ساعات العمل
3. استخدام cache ذكي
4. تقليل عدد الحقول المطلوبة

---

## المساعدة والدعم | Support

إذا واجهت أي مشاكل أو لديك اقتراحات، يرجى فتح issue في GitHub أو التواصل مع فريق التطوير.

**تم التطوير بواسطة:** Smart Tourism Jordan Team  
**التحديث الأخير:** يناير 2025
