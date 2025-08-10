// Mock data for the application
export const destinations = [
  // Original destinations
  {
    id: 1,
    name: { ar: 'البتراء', en: 'Petra' },
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: {
      ar: 'المدينة الوردية الساحرة وإحدى عجائب الدنيا السبع',
      en: 'The enchanting Rose City and one of the Seven Wonders of the World'
    },
    shortDescription: {
      ar: 'مدينة أثرية تاريخية تعود للعصر النبطي، تشتهر بمبانيها المنحوتة في الصخر الوردي',
      en: 'Historic archaeological city from the Nabataean era, famous for its buildings carved into pink rock'
    },
    location: 'Ma\'an',
    rating: 4.9,
    category: 'historical',
    crowdLevel: 'high',
    highlights: [
      { ar: 'الخزنة', en: 'Treasury' },
      { ar: 'الدير', en: 'Monastery' },
      { ar: 'السيق', en: 'The Siq' }
    ]
  },
  {
    id: 2,
    name: { ar: 'وادي رم', en: 'Wadi Rum' },
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: {
      ar: 'وادي القمر الساحر بصحرائه الحمراء وجباله الشامخة',
      en: 'The Valley of the Moon with its red desert and towering mountains'
    },
    shortDescription: {
      ar: 'صحراء حمراء ساحرة تضم جبالاً وتشكيلات صخرية فريدة، موقع تصوير العديد من الأفلام العالمية',
      en: 'Enchanting red desert with unique mountains and rock formations, filming location for many international movies'
    },
    location: 'Aqaba',
    rating: 4.8,
    category: 'nature',
    crowdLevel: 'high',
    highlights: [
      { ar: 'التخييم الصحراوي', en: 'Desert Camping' },
      { ar: 'رحلات الجمال', en: 'Camel Tours' },
      { ar: 'النقوش الصخرية', en: 'Rock Carvings' }
    ]
  },
  // Hidden gems from the north
  {
    id: 3,
    name: { ar: 'وادي الريان - إربد', en: 'Wadi Al-Rayyan - Irbid' },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: {
      ar: 'وادٍ ساحر في شمال الأردن يشتهر بشلالاته وخضرته وإنتاج الرمان المميز',
      en: 'A charming valley in northern Jordan famous for its waterfalls, greenery, and distinctive pomegranate production'
    },
    shortDescription: {
      ar: 'وادٍ خلاب في إربد يتميز بطبيعته السياحية وشلالاته ومزارع الرمان والتين والعنب',
      en: 'A stunning valley in Irbid with scenic nature, waterfalls, and pomegranate, fig, and grape farms'
    },
    location: 'Irbid',
    rating: 4.6,
    category: 'nature',
    crowdLevel: 'low',
    highlights: [
      { ar: 'الشلالات الطبيعية', en: 'Natural Waterfalls' },
      { ar: 'مزارع الرمان', en: 'Pomegranate Farms' },
      { ar: 'الاستراحات الريفية', en: 'Rural Retreats' }
    ]
  },
  {
    id: 4,
    name: { ar: 'غابات برقش - عجلون', en: 'Barqash Forests - Ajloun' },
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: {
      ar: 'إحدى أكبر الغابات في الأردن تحيط بتل برقش الأثري وتضم حياة برية متنوعة',
      en: 'One of Jordan\'s largest forests surrounding the historic Barqash hill with diverse wildlife'
    },
    shortDescription: {
      ar: 'غابات واسعة تضم أشجاراً عمرها آلاف السنين وحيوانات برية مثل الذئاب والخنازير البرية',
      en: 'Vast forests with thousands-year-old trees and wildlife including wolves and wild boars'
    },
    location: 'Ajloun',
    rating: 4.7,
    category: 'nature',
    crowdLevel: 'low',
    highlights: [
      { ar: 'الأشجار المعمرة', en: 'Ancient Trees' },
      { ar: 'الحياة البرية', en: 'Wildlife' },
      { ar: 'تل برقش الأثري', en: 'Barqash Archaeological Hill' }
    ]
  },
  {
    id: 5,
    name: { ar: 'عين البستان - كفرنجة', en: 'Ain Al-Bustan - Kufr Anja' },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: {
      ar: 'نبع ماء طبيعي في عجلون محاط بالأشجار والطبيعة الخلابة',
      en: 'A natural water spring in Ajloun surrounded by trees and stunning nature'
    },
    shortDescription: {
      ar: 'نبع مياه باردة متدفق من الجبال يحيط به أشجار التين والعنب والرمان',
      en: 'Cold water spring flowing from the mountains surrounded by fig, grape, and pomegranate trees'
    },
    location: 'Ajloun',
    rating: 4.5,
    category: 'nature',
    crowdLevel: 'low',
    highlights: [
      { ar: 'المياه الباردة', en: 'Cold Waters' },
      { ar: 'أشجار الفاكهة', en: 'Fruit Trees' },
      { ar: 'النزهات العائلية', en: 'Family Picnics' }
    ]
  },
  {
    id: 6,
    name: { ar: 'بركة العرائس - إربد', en: 'Bride\'s Pool - Irbid' },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: {
      ar: 'بحيرة طبيعية نادرة في إربد تضم حيوانات مهددة بالانقراض',
      en: 'A rare natural lake in Irbid home to endangered species'
    },
    shortDescription: {
      ar: 'بحيرة طبيعية تبلغ مساحتها 32 دونماً وعمقها أكثر من 50 متراً، تحتضن السلاحف المائية',
      en: 'Natural lake spanning 32 dunums with depth exceeding 50 meters, hosting aquatic turtles'
    },
    location: 'Irbid',
    rating: 4.8,
    category: 'nature',
    crowdLevel: 'low',
    highlights: [
      { ar: 'السلاحف المائية', en: 'Aquatic Turtles' },
      { ar: 'الطيور المهاجرة', en: 'Migratory Birds' },
      { ar: 'المناظر الطبيعية', en: 'Natural Scenery' }
    ]
  },
  // Hidden gems from central Jordan
  {
    id: 7,
    name: { ar: 'وادي شعيب - السلط', en: 'Wadi Shuaib - As-Salt' },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: {
      ar: 'وادٍ مقدس يُنسب للنبي شعيب عليه السلام مع ينابيع المياه العذبة',
      en: 'A sacred valley attributed to Prophet Shuaib with fresh water springs'
    },
    shortDescription: {
      ar: 'وادٍ مقدس بطبيعة خضراء وأرض خصبة مع ينابيع مياه دائمة الجريان',
      en: 'Sacred valley with green nature and fertile land with continuously flowing springs'
    },
    location: 'Balqa',
    rating: 4.6,
    category: 'religious',
    crowdLevel: 'medium',
    highlights: [
      { ar: 'مقام النبي شعيب', en: 'Prophet Shuaib Shrine' },
      { ar: 'الينابيع الطبيعية', en: 'Natural Springs' },
      { ar: 'البساتين الخضراء', en: 'Green Orchards' }
    ]
  },
  {
    id: 8,
    name: { ar: 'كهف لوط - الأغوار الجنوبية', en: 'Lot\'s Cave - Southern Ghors' },
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: {
      ar: 'موقع أثري وديني يُنسب للنبي لوط عليه السلام مع إطلالة على البحر الميت',
      en: 'Archaeological and religious site attributed to Prophet Lot overlooking the Dead Sea'
    },
    shortDescription: {
      ar: 'كهف أثري على منحدر جبلي مطل على البحر الميت مع بقايا كنيسة بيزنطية',
      en: 'Archaeological cave on a mountain slope overlooking the Dead Sea with Byzantine church remains'
    },
    location: 'Karak',
    rating: 4.4,
    category: 'religious',
    crowdLevel: 'low',
    highlights: [
      { ar: 'الكهف التاريخي', en: 'Historic Cave' },
      { ar: 'الكنيسة البيزنطية', en: 'Byzantine Church' },
      { ar: 'إطلالة البحر الميت', en: 'Dead Sea View' }
    ]
  },
  // Hidden gems from southern Jordan
  {
    id: 9,
    name: { ar: 'حمامات عفرا - الطفيلة', en: 'Afra Hot Springs - Tafilah' },
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: {
      ar: 'ينابيع مياه حارة طبيعية غنية بالمعادن للعلاج الطبيعي',
      en: 'Natural hot springs rich in minerals for natural healing'
    },
    shortDescription: {
      ar: 'أكثر من 15 نبع مياه حارة بدرجة حرارة 45-50 مئوية لعلاج الأمراض الجلدية والمفاصل',
      en: 'Over 15 hot water springs at 45-50°C for treating skin diseases and joint problems'
    },
    location: 'Tafilah',
    rating: 4.7,
    category: 'wellness',
    crowdLevel: 'medium',
    highlights: [
      { ar: 'المياه العلاجية', en: 'Therapeutic Waters' },
      { ar: 'المعادن الطبيعية', en: 'Natural Minerals' },
      { ar: 'الوادي الصخري', en: 'Rocky Valley' }
    ]
  },
  {
    id: 10,
    name: { ar: 'قرية ضانا التراثية', en: 'Dana Heritage Village' },
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: {
      ar: 'قرية تراثية عثمانية تطل على وادي ضانا ومحمية طبيعية',
      en: 'Ottoman heritage village overlooking Dana Valley and nature reserve'
    },
    shortDescription: {
      ar: 'قرية عثمانية قديمة بالطابع المعماري الحجري تشرف على أكبر محمية طبيعية في الأردن',
      en: 'Old Ottoman village with stone architecture overlooking Jordan\'s largest nature reserve'
    },
    location: 'Tafilah',
    rating: 4.8,
    category: 'heritage',
    crowdLevel: 'low',
    highlights: [
      { ar: 'العمارة العثمانية', en: 'Ottoman Architecture' },
      { ar: 'محمية ضانا', en: 'Dana Reserve' },
      { ar: 'غروب الشمس', en: 'Sunset Views' }
    ]
  },
  {
    id: 11,
    name: { ar: 'وادي الغوير - الكرك', en: 'Wadi Al-Ghuweir - Karak' },
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: {
      ar: 'وادٍ مائي خلاب بين الصخور الرملية الملونة والجدران العالية',
      en: 'Spectacular water valley between colorful sandstone rocks and high walls'
    },
    shortDescription: {
      ar: 'وادٍ بمسار مائي بين صخور ملونة وينابيع دائمة، مثالي لرياضة السير المائي',
      en: 'Valley with water trail between colorful rocks and permanent springs, perfect for canyoning'
    },
    location: 'Karak',
    rating: 4.9,
    category: 'adventure',
    crowdLevel: 'low',
    highlights: [
      { ar: 'المسارات المائية', en: 'Water Trails' },
      { ar: 'الصخور الملونة', en: 'Colorful Rocks' },
      { ar: 'رياضة السير المائي', en: 'Canyoning' }
    ]
  },
  // Urban cultural gems
  {
    id: 12,
    name: { ar: 'حي السلط القديم', en: 'Old As-Salt District' },
    image: 'https://images.unsplash.com/photo-1578582727169-ce5be2c1bf7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    description: {
      ar: 'حي تراثي عثماني مدرج في قائمة التراث العالمي لليونسكو',
      en: 'Ottoman heritage district listed in UNESCO World Heritage'
    },
    shortDescription: {
      ar: 'حي عثماني بالبيوت الحجرية الصفراء والعمارة المقوسة، رمز للتعايش الديني',
      en: 'Ottoman district with yellow stone houses and arched architecture, symbol of religious coexistence'
    },
    location: 'Balqa',
    rating: 4.5,
    category: 'heritage',
    crowdLevel: 'medium',
    highlights: [
      { ar: 'العمارة العثمانية', en: 'Ottoman Architecture' },
      { ar: 'التعايش الديني', en: 'Religious Coexistence' },
      { ar: 'الأسواق التراثية', en: 'Heritage Markets' }
    ]
  }
];

// Weather data for different cities
export const weatherData = {
  amman: {
    city: 'Amman',
    temperature: 22,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12
  },
  petra: {
    city: 'Petra',
    temperature: 18,
    condition: 'Clear',
    humidity: 45,
    windSpeed: 8
  },
  aqaba: {
    city: 'Aqaba',
    temperature: 28,
    condition: 'Sunny',
    humidity: 70,
    windSpeed: 15
  },
  deadsea: {
    city: 'Dead Sea',
    temperature: 32,
    condition: 'Hot',
    humidity: 40,
    windSpeed: 5
  },
  irbid: {
    city: 'Irbid',
    temperature: 20,
    condition: 'Mild',
    humidity: 60,
    windSpeed: 10
  },
  ajloun: {
    city: 'Ajloun',
    temperature: 18,
    condition: 'Cool',
    humidity: 70,
    windSpeed: 8
  },
  assalt: {
    city: 'As-Salt',
    temperature: 21,
    condition: 'Pleasant',
    humidity: 55,
    windSpeed: 9
  },
  tafilah: {
    city: 'Tafilah',
    temperature: 16,
    condition: 'Cool',
    humidity: 50,
    windSpeed: 12
  },
  karak: {
    city: 'Karak',
    temperature: 19,
    condition: 'Clear',
    humidity: 45,
    windSpeed: 11
  }
};

// Crowd data for popular destinations
export const crowdData = {
  petra: {
    current: 'high',
    percentage: 85,
    bestTime: '7:00 AM - 9:00 AM'
  },
  wadirum: {
    current: 'high',
    percentage: 80,
    bestTime: 'Sunset hours'
  },
  deadsea: {
    current: 'high',
    percentage: 85,
    bestTime: '6:00 AM - 9:00 AM'
  },
  jerash: {
    current: 'moderate',
    percentage: 55,
    bestTime: '9:00 AM - 11:00 AM'
  },
  // Hidden gems with lower crowd levels
  wadirayyan: {
    current: 'low',
    percentage: 25,
    bestTime: 'Morning hours'
  },
  barqashforests: {
    current: 'low',
    percentage: 20,
    bestTime: 'Early morning'
  },
  ainbustan: {
    current: 'low',
    percentage: 30,
    bestTime: 'All day'
  },
  bridespool: {
    current: 'low',
    percentage: 15,
    bestTime: 'Spring mornings'
  },
  wadishuaib: {
    current: 'moderate',
    percentage: 40,
    bestTime: '8:00 AM - 10:00 AM'
  },
  lotscave: {
    current: 'low',
    percentage: 20,
    bestTime: 'Morning visits'
  },
  afrasprings: {
    current: 'moderate',
    percentage: 50,
    bestTime: 'Weekdays'
  },
  danavillage: {
    current: 'low',
    percentage: 35,
    bestTime: 'Sunset time'
  },
  wadighuwair: {
    current: 'low',
    percentage: 10,
    bestTime: 'Adventure tours'
  },
  oldsalt: {
    current: 'moderate',
    percentage: 45,
    bestTime: 'Morning walks'
  }
};

// Hero images for the homepage carousel
export const heroImages = [
  'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
];

// Make sure we export both named exports and default export for compatibility
export default { destinations, weatherData, crowdData, heroImages };
