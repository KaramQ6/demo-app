// src/mock.js

export const destinations = [
  // ENHANCED: الوصف أصبح أكثر ثراءً من النص الجديد
  {
    id: 'jerash',
    name: { ar: 'جرش', en: 'Jerash' },
    shortDescription: {
      ar: 'صدى روما في الشرق',
      en: 'Rome’s Eastern Echo'
    },
    description: {
      ar: 'ادخل إلى جرش وسيطوي الزمن نفسه. هنا، تقف شوارع الأعمدة والمسارح والمعابد من العصر اليوناني الروماني بفخر تحت شمس الأردن. بينما تندفع الحشود جنوبًا، يمكنك التجول في هذه المدينة القديمة في هدوء ودهشة - متخيلًا المصارعين والفلاسفة والتجار الذين ملأوا شوارعها ذات يوم. جرش ليست منسية - إنها ببساطة تنتظر.',
      en: 'Step into Jerash and time folds away. Here, colonnaded streets, theatres, and temples from the Greco-Roman era stand proud beneath Jordan’s sun. While crowds rush south, you can wander this ancient city in calm wonder — imagining gladiators, philosophers, and merchants who once filled its streets. Jerash is not forgotten — it’s simply waiting.'
    },
    image: 'https://images.pexels.com/photos/32111981/pexels-photo-32111981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    crowdLevel: 'medium',
    features: ['historical', 'archaeological', 'guided-tours', 'photography', 'roman'],
    lat: 32.2724,
    lon: 35.8916
  },
  // KEPT AS IS: وصفها الأصلي ممتاز
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
    image: 'https://images.pexels.com/photos/13458329/pexels-photo-13458329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    crowdLevel: 'high',
    features: ['world-heritage', 'hiking', 'photography', 'adventure'],
    lat: 30.3285,
    lon: 35.4444
  },
  // KEPT AS IS: وصفها الأصلي ممتاز
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
    image: 'https://images.pexels.com/photos/13458331/pexels-photo-13458331.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    crowdLevel: 'low',
    features: ['desert', 'adventure', 'camping', 'stargazing'],
    lat: 29.5731,
    lon: 35.4207
  },
  // ENHANCED: الوصف أصبح أكثر جاذبية
  {
    id: 'umm-qais',
    name: { ar: 'أم قيس', en: 'Umm Qais' },
    shortDescription: {
      ar: 'حيث يهمس الصمت بالتاريخ',
      en: 'Where Silence Speaks History'
    },
    description: {
      ar: 'تتربع أم قيس على تلال خضراء تطل على بحيرة طبريا ومرتفعات الجولان، وهي موطن مدينة جدارا الرومانية القديمة. توفر سحرًا هادئًا بعيدًا عن زحمة السياح. امشِ على الدروب الحجرية القديمة، احتسِ القهوة مع السكان المحليين، واشعر بصدى التاريخ في كل أثر. أم قيس ليست مجرد مكان تراه - إنها قصة تدخل إليها.',
      en: 'Perched on green hills overlooking the Sea of Galilee and the Golan Heights, Umm Qais is home to the ancient Roman city of Gadara. It offers panoramic views and peaceful charm far from the tourist rush. Walk ancient stone paths, sip coffee with locals, and feel history echo through every ruin. Umm Qais isn’t just a place to see — it’s a story you step into.'
    },
    image: 'https://images.pexels.com/photos/106606/pexels-photo-106606.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.5,
    crowdLevel: 'low',
    features: ['historical', 'scenic-views', 'peaceful', 'photography', 'roman'],
    lat: 32.6560,
    lon: 35.6800
  },
  // ENHANCED: الوصف يجمع بين الطبيعة والتاريخ بشكل أفضل
  {
    id: 'ajloun',
    name: { ar: 'عجلون', en: 'Ajloun' },
    shortDescription: {
      ar: 'حيث تهمس الطبيعة بالسكينة',
      en: 'Where Nature Whispers'
    },
    description: {
      ar: 'تغطيها غابات الصنوبر وتقع بين التلال الشمالية، تقدم عجلون ملاذًا هادئًا إلى الطبيعة. تطل قلعتها التي تعود للقرون الوسطى على المناظر الطبيعية الخصبة، بينما تدعو المسارات البيئية المجاورة المتنزهين لاستكشاف الجانب الأكثر خضرة في الأردن. في عجلون، تمتزج الطبيعة والتاريخ بهدوء، مما يوفر السلام والمنظور بعيدًا عن ضوضاء المدينة.',
      en: 'Covered in pine forests and nestled among the northern hills, Ajloun offers a serene escape into nature. Its medieval castle overlooks the lush landscape, while nearby eco-trails invite hikers to explore Jordan’s greener side. In Ajloun, nature and history blend quietly, offering peace and perspective far from city noise.'
    },
    image: 'https://images.pexels.com/photos/206701/pexels-photo-206701.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.3,
    crowdLevel: 'low',
    features: ['castle', 'nature', 'hiking', 'eco-tourism'],
    lat: 32.3275,
    lon: 35.7533
  },
  // ENHANCED: وصف أغنى بالتفاصيل
  {
    id: 'salt',
    name: { ar: 'السلط', en: 'As-Salt' },
    shortDescription: {
      ar: 'الأصالة في كل زاوية',
      en: 'Authenticity in Every Corner'
    },
    description: {
      ar: 'تحكي السلط قصة تراث الأردن من خلال بيوتها المصنوعة من الحجر الرملي الأصفر، وعمارتها العثمانية، وأسواقها المحلية النابضة بالحياة. هذه المدينة الدافئة والمرحبة، التي أُدرجت مؤخرًا على قائمة اليونسكو للتراث العالمي، تحتفل بالتعايش الثقافي والحرف التقليدية. زيارة السلط تعني اكتشاف الأردن الحقيقي - حيث يجتمع التاريخ والمجتمع والضيافة في كل زقاق.',
      en: 'As-Salt tells the story of Jordan’s heritage through its yellow sandstone houses, Ottoman architecture, and vibrant local markets. Recently named a UNESCO World Heritage site, this warm, welcoming city celebrates cultural coexistence and traditional craftsmanship. A visit to As-Salt means discovering the real Jordan — where history, community, and hospitality come together in every alley.'
    },
    image: 'https://images.pexels.com/photos/4388165/pexels-photo-4388165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.4,
    crowdLevel: 'medium',
    features: ['heritage', 'architecture', 'cultural', 'ottoman', 'unesco'],
    lat: 32.0384,
    lon: 35.7292
  },
  // ADDED: إدخال جديد من النص
  {
    id: 'dana',
    name: { ar: 'محمية ضانا', en: 'Dana Biosphere Reserve' },
    shortDescription: {
      ar: 'برية الأردن الخالدة',
      en: 'Jordan’s Timeless Wilderness'
    },
    description: {
      ar: 'ضانا هي أكثر من مجرد محمية طبيعية - إنها منظر طبيعي حي من المنحدرات والوديان الصحراوية التي تروي قصص الحياة القديمة. يمكن للزوار التنزه لساعات أو قضاء الليلة في نزل بيئية تديرها عائلات محلية. إنه مكان سكون، حيث تلتقي الاستدامة والجمال الخام.',
      en: 'Dana is more than a nature reserve — it’s a living landscape of cliffs, canyons, and desert valleys that tell stories of ancient life. Visitors can hike for hours or spend the night in eco-lodges run by local families. It’s a place of stillness, where sustainability and raw beauty meet.'
    },
    image: 'https://images.pexels.com/photos/2179666/pexels-photo-2179666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Placeholder image
    rating: 4.6,
    crowdLevel: 'low',
    features: ['nature-reserve', 'hiking', 'eco-tourism', 'canyons', 'stargazing'],
    lat: 30.6728,
    lon: 35.6121
  },
  // ADDED: إدخال جديد من النص
  {
    id: 'madaba',
    name: { ar: 'مادبا', en: 'Madaba' },
    shortDescription: {
      ar: 'مدينة الفسيفساء',
      en: 'The City of Mosaics'
    },
    description: {
      ar: 'جوهرة مخفية من الثقافة والحرف، تشتهر مادبا بخريطتها الفسيفسائية القديمة للأراضي المقدسة. ولكن وراء ذلك تكمن مدينة مليئة بالفن والتقاليد وروح المجتمع الدافئة. تجول في كنائسها ومحلات الحرفيين وأسواقها - واكتشف مدينة حافظت على الجمال لقرون.',
      en: 'A hidden gem of culture and craft, Madaba is best known for its ancient mosaic map of the Holy Land. But beyond that lies a city filled with art, tradition, and warm community spirit. Walk through its churches, artisan shops, and markets — and discover a town that has preserved beauty for centuries.'
    },
    image: 'https://images.pexels.com/photos/3293854/pexels-photo-3293854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Placeholder image
    rating: 4.5,
    crowdLevel: 'medium',
    features: ['mosaics', 'cultural', 'history', 'artisan-shops'],
    lat: 31.7175,
    lon: 35.7942
  },
  // ADDED: إدخال جديد من النص
  {
    id: 'karak',
    name: { ar: 'قلعة الكرك', en: 'Karak Castle' },
    shortDescription: {
      ar: 'حصن الأساطير الصليبية',
      en: 'Fortress of Legends'
    },
    description: {
      ar: 'تسيطر قلعة الكرك على الأفق، وهي واحدة من أكبر القلاع الصليبية في المنطقة. لكن سحر الكرك لا يكمن فقط في أحجارها الشاهقة، بل في القصص التي يرويها السكان المحليون، والإطلالات الشاملة على الوديان أدناه. إنه مكان لا يكون فيه التاريخ خلف زجاج - بل يحيط بك.',
      en: 'Dominating the skyline, Karak Castle is one of the largest Crusader fortresses in the region. But the magic of Karak lies not only in its towering stones, but in the stories told by locals, and the sweeping views of the valleys below. It’s a place where history isn’t behind glass — it surrounds you.'
    },
    image: 'https://images.pexels.com/photos/946435/pexels-photo-946435.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Placeholder image
    rating: 4.2,
    crowdLevel: 'low',
    features: ['castle', 'history', 'crusader', 'scenic-views'],
    lat: 31.1811,
    lon: 35.7025
  },
  // ADDED: إدخال جديد من النص
  {
    id: 'shobak',
    name: { ar: 'قلعة الشوبك', en: 'Shobak Castle' },
    shortDescription: {
      ar: 'الحارس الوحيد على التل',
      en: 'The Lonely Guardian'
    },
    description: {
      ar: 'تقف قلعة الشوبك على تل تجتاحه الرياح، حارسة للمناظر الطبيعية الوعرة في جنوب الأردن. كونها أقل زيارة من قريبتها في الكرك، تبدو كحصن سري من حكاية منسية. تجول في أنفاقها، تسلق أبراجها، وتأمل في البرية - هذه هي العزلة المغلفة بالحجر.',
      en: 'Perched on a wind-swept hill, Shobak Castle stands watch over the rugged landscape of southern Jordan. Less visited than its cousin in Karak, it feels like a secret fortress from a forgotten tale. Wander its tunnels, climb its towers, and gaze out across the wilderness — this is solitude wrapped in stone.'
    },
    image: 'https://images.pexels.com/photos/3250591/pexels-photo-3250591.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Placeholder image
    rating: 4.1,
    crowdLevel: 'low',
    features: ['castle', 'history', 'crusader', 'solitude'],
    lat: 30.5319,
    lon: 35.5594
  },
  // ADDED: إدخال جديد من النص
  {
    id: 'wadi-mujib',
    name: { ar: 'وادي الموجب', en: 'Wadi Al-Mujib' },
    shortDescription: {
      ar: 'جراند كانيون الأردن',
      en: 'Jordan’s Grand Canyon'
    },
    description: {
      ar: 'عالم نحتته المياه والزمن، يغوص وادي الموجب بين منحدرات شاهقة في جداول فيروزية. تنزه، اسبح، أو ببساطة استمتع بالدهشة - يقدم هذا الوادي واحدة من أكثر المغامرات البيئية إثارة في الشرق الأوسط. هنا، تغني برية الأردن بأعلى صوتها، يتردد صداها في كل رشة ماء وحجر.',
      en: 'A world carved by water and time, Wadi Al-Mujib plunges between towering cliffs into turquoise streams. Hike, swim, or simply marvel — this canyon offers one of the most thrilling eco-adventures in the Middle East. Here, the wildness of Jordan sings loudest, echoing through every splash and stone.'
    },
    image: 'https://images.pexels.com/photos/30889867/pexels-photo-30889867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Placeholder image
    rating: 4.8,
    crowdLevel: 'medium',
    features: ['adventure', 'hiking', 'canyoning', 'nature', 'water'],
    lat: 31.4655,
    lon: 35.5724
  },
  // ADDED: البحر الميت - وجهة مهمة مفقودة
  {
    id: 'dead-sea',
    name: { ar: 'البحر الميت', en: 'Dead Sea' },
    shortDescription: {
      ar: 'أخفض نقطة على سطح الأرض',
      en: 'The Lowest Point on Earth'
    },
    description: {
      ar: 'البحر الميت هو بحيرة مالحة تقع في أخفض نقطة على سطح الأرض. مياهه الغنية بالأملاح والمعادن تجعل الجسم يطفو بسهولة، وتوفر فوائد علاجية للبشرة. تجربة فريدة لا تُنسى في أحد أكثر الأماكن الطبيعية إعجازاً في العالم.',
      en: 'The Dead Sea is a salt lake located at the lowest point on Earth\'s surface. Its mineral-rich waters make the body float effortlessly and provide therapeutic benefits for the skin. It\'s a unique, unforgettable experience in one of the world\'s most miraculous natural places.'
    },
    image: 'https://images.pexels.com/photos/1194408/pexels-photo-1194408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    crowdLevel: 'medium',
    features: ['natural-wonder', 'therapeutic', 'floating', 'minerals', 'spa'],
    lat: 31.5590,
    lon: 35.4732
  }
];

// <<<<< هذا هو الجزء الذي كان ناقصًا >>>>>
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
  },
  {
    id: 'dead-sea-iot', name: { ar: 'البحر الميت', en: 'Dead Sea' }, status: 'Operational',
    temperature: 32, crowdLevel: 'medium', powerUsage: 140
  }
];

export const heroImages = {
  demo: 'https://images.pexels.com/photos/33280395/pexels-photo-33280395.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
};