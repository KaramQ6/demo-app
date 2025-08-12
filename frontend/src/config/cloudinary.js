// ملف تكوين Cloudinary مع عناوين الصور
export const cloudinaryConfig = {
  cloudName: 'dn0vfbcmu',
  destinations: {
    'wadi-rum': 'smarttour/destinations/wadi-rum',
    'as-salt': 'smarttour/destinations/as-salt',
    'dead-sea': 'smarttour/destinations/dead-sea',
    'wadi-mujib': 'smarttour/destinations/wadi-mujib'
  }
};

// استخدم هذه الصور كبديل للصور المرفوعة
export const fallbackImages = {
  'smarttour/destinations/wadi-rum': 'https://res.cloudinary.com/demo/image/upload/c_fill,h_600,w_800/v1/samples/landscapes/nature-mountains.jpg',
  'smarttour/destinations/as-salt': 'https://res.cloudinary.com/demo/image/upload/c_fill,h_600,w_800/v1/samples/food/dessert.jpg',
  'smarttour/destinations/dead-sea': 'https://res.cloudinary.com/demo/image/upload/c_fill,h_600,w_800/v1/samples/landscapes/beach-boat.jpg',
  'smarttour/destinations/wadi-mujib': 'https://res.cloudinary.com/demo/image/upload/c_fill,h_600,w_800/v1/samples/landscapes/girl-urban-view.jpg'
};
