// Mock data for SmartTour.Jo application

export const destinations = [
  {
    id: 'jerash',
    name: { ar: 'مدينة جرش الأثرية', en: 'Ancient City of Jerash' },
    shortDescription: { 
      ar: 'مدينة أثرية رومانية محفوظة بشكل استثنائي', 
      en: 'Exceptionally preserved Roman archaeological city' 
    },
    description: { 
      ar: 'تُعد مدينة جرش الأثرية واحدة من أفضل المدن الرومانية المحفوظة في العالم. تضم مجموعة رائعة من الآثار الرومانية والبيزنطية والإسلامية، بما في ذلك المسارح والشوارع المرصوفة بالأعمدة والمعابد.', 
      en: 'The ancient city of Jerash is one of the best-preserved Roman cities in the world. It features an amazing collection of Roman, Byzantine, and Islamic ruins, including theaters, colonnaded streets, and temples.' 
    },
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    rating: 4.8,
    crowdLevel: 'medium',
    features: ['historical', 'archaeological', 'guided-tours', 'photography']
  },
  {
    id: 'petra',
    name: { ar: 'البتراء', en: 'Petra' },
    shortDescription: { 
      ar: 'المدينة الوردية المنحوتة في الصخر', 
      en: 'The rose-red city carved from rock' 
    },
    description: {
      ar: 'البتراء هي موقع تراث عالمي لليونسكو وإحدى عجائب الدنيا السبع الجديدة. هذه المدينة الأثرية المذهلة منحوتة بالكامل في الصخر الوردي وتعتبر أهم وجهة سياحية في الأردن.', 
      en: 'Petra is a UNESCO World Heritage Site and one of the New Seven Wonders of the World. This stunning archaeological city is carved entirely from rose-red sandstone and is Jordan\'s most visited tourist attraction.' 
    },
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e',
    rating: 4.9,
    crowdLevel: 'high',
    features: ['world-heritage', 'hiking', 'photography', 'adventure']
  },
  {
    id: 'wadi-rum',
    name: { ar: 'وادي رم', en: 'Wadi Rum' },
    shortDescription: { 
      ar: 'وادي القمر الصحراوي الخلاب', 
      en: 'Spectacular desert valley of the moon' 
    },
    description: { 
      ar: 'وادي رم، المعروف أيضاً باسم "وادي القمر"، هو وادي صحراوي مذهل يتميز بتشكيلات صخرية رائعة ومناظر طبيعية خلابة. يوفر تجارب سفاري صحراوية لا تُنسى ونوم تحت النجوم.', 
      en: 'Wadi Rum, also known as the "Valley of the Moon," is a spectacular desert valley featuring stunning rock formations and breathtaking landscapes. It offers unforgettable desert safari experiences and stargazing under pristine skies.' 
    },
    image: 'https://images.unsplash.com/photo-1574082512734-8336f25bb9d8',
    rating: 4.7,
    crowdLevel: 'low',
    features: ['desert', 'adventure', 'camping', 'stargazing']
  },
  {
    id: 'umm-qais',
    name: { ar: 'أم قيس', en: 'Umm Qais' },
    shortDescription: { 
      ar: 'مدينة الديكابوليس مع إطلالات خلابة', 
      en: 'Decapolis city with breathtaking views' 
    },
    description: { 
      ar: 'أم قيس هي موقع مدينة جادارا القديمة، إحدى مدن الديكابوليس الرومانية. تطل على بحيرة طبريا ومرتفعات الجولان وتوفر مزيجاً رائعاً من التاريخ والمناظر الطبيعية الخلابة.', 
      en: 'Umm Qais is the site of ancient Gadara, one of the Roman Decapolis cities. Overlooking the Sea of Galilee and Golan Heights, it offers a stunning blend of history and breathtaking natural scenery.' 
    },
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144',
    rating: 4.5,
    crowdLevel: 'low',
    features: ['historical', 'scenic-views', 'peaceful', 'photography']
  },
  {
    id: 'ajloun',
    name: { ar: 'عجلون', en: 'Ajloun' },
    shortDescription: { 
      ar: 'قلعة تاريخية وسط غابات خضراء', 
      en: 'Historic castle amid green forests' 
    },
    description: { 
      ar: 'عجلون تضم قلعة الرابض التاريخية التي بناها صلاح الدين الأيوبي، وتتميز بطبيعتها الخضراء ومحمية عجلون الطبيعية المليئة بأشجار البلوط والنباتات المتوسطية.', 
      en: 'Ajloun features the historic Ajloun Castle built by Saladin, and is characterized by its green nature and Ajloun Nature Reserve filled with oak trees and Mediterranean vegetation.' 
    },
    image: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277',
    rating: 4.3,
    crowdLevel: 'low',
    features: ['castle', 'nature', 'hiking', 'eco-tourism']
  },
  {
    id: 'salt',
    name: { ar: 'السلط', en: 'As-Salt' },
    shortDescription: { 
      ar: 'مدينة التراث العثماني الأصيل', 
      en: 'Authentic Ottoman heritage city' 
    },
    description: { 
      ar: 'السلط هي موقع تراث عالمي لليونسكو وتُعرف بـ"مدينة التسامح والحضارة العمرانية". تتميز بعمارتها العثمانية الأصيلة وتاريخها الثقافي الغني والتنوع الديني.', 
      en: 'As-Salt is a UNESCO World Heritage Site known as the "City of Tolerance and Urban Hospitality." It features authentic Ottoman architecture, rich cultural history, and religious diversity.' 
    },
    image: 'https://images.unsplash.com/photo-1578309770804-bc9e5dc24e5d',
    rating: 4.4,
    crowdLevel: 'medium',
    features: ['heritage', 'architecture', 'cultural', 'ottoman']
  }
];

export const iotData = [
  { 
    id: 'jerash-iot', name: { ar: 'جرش', en: 'Jerash' }, status: 'Operational',
    temperature: 25, crowdLevel: 'medium', powerUsage: 120 
  },
  { 
    id: 'petra-iot', name: { ar: 'البتراء', en: 'Petra' }, status: 'Operational',
    temperature: 28, crowdLevel: 'high', powerUsage: 150 
  },
  { 
    id: 'wadi-rum-iot', name: { ar: 'وادي رم', en: 'Wadi Rum' }, status: 'Maintenance',
    temperature: 30, crowdLevel: 'low', powerUsage: 80 
  },
  { 
    id: 'umm-qais-iot', name: { ar: 'أم قيس', en: 'Umm Qais' }, status: 'Operational',
    temperature: 22, crowdLevel: 'medium', powerUsage: 100 
  },
  { 
    id: 'ajloun-iot', name: { ar: 'عجلون', en: 'Ajloun' }, status: 'Operational',
    temperature: 20, crowdLevel: 'low', powerUsage: 90 
  },
  { 
    id: 'salt-iot', name: { ar: 'السلط', en: 'As-Salt' }, status: 'Operational',
    temperature: 23, crowdLevel: 'medium', powerUsage: 110 
  }
];

export const heroImages = {
  demo: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e',
};
