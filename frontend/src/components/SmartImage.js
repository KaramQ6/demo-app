import React from 'react';

// قائمة الصور المتاحة على Cloudinary مع أسماءها الحقيقية
const cloudinaryImages = {
  'smarttour/destinations/wadi-rum': 'https://res.cloudinary.com/dn0vfbcmu/image/upload/v1754976055/وادي_رم_z7dxau.jpg',
  'smarttour/destinations/as-salt': 'https://res.cloudinary.com/dn0vfbcmu/image/upload/v1754976056/السلط_rgdgzg.jpg',
  'smarttour/destinations/dead-sea': 'https://res.cloudinary.com/dn0vfbcmu/image/upload/v1754976056/البحر_الميت_okmqdh.jpg',
  'smarttour/destinations/wadi-mujib': 'https://res.cloudinary.com/dn0vfbcmu/image/upload/v1754976055/وادي_الموجب_diemut.jpg'
};

// صور بديلة في حالة فشل تحميل Cloudinary
const fallbackImages = {
  'smarttour/destinations/wadi-rum': 'https://cdn.britannica.com/88/189788-050-9B5DB3A4/Al-Khaznah-Petra-Jordan.jpg',
  'smarttour/destinations/as-salt': 'https://cdn.britannica.com/24/153524-050-BA9D084B/Al-Dayr-Petra-Jordan.jpg',
  'smarttour/destinations/dead-sea': 'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80',
  'smarttour/destinations/wadi-mujib': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/00/f3/d8/oasis-fabuleuse.jpg?w=1400&h=-1&s=1'
};

/**
 * مكون ذكي للصور يتعامل مع صور Cloudinary والصور العادية
 */
const SmartImage = ({
  src,
  alt,
  className = '',
  width = 800,
  height = 600,
  ...props
}) => {
  // التحقق من نوع الصورة
  const isCloudinaryImage = src && src.startsWith('smarttour/');
  const cloudinaryUrl = cloudinaryImages[src];
  const fallbackSrc = fallbackImages[src];

  if (isCloudinaryImage && cloudinaryUrl) {
    return (
      <img
        src={cloudinaryUrl}
        alt={alt}
        className={className}
        loading="lazy"
        onError={(e) => {
          // في حالة فشل تحميل الصورة من Cloudinary، استخدم الصورة البديلة
          if (fallbackSrc) {
            e.target.src = fallbackSrc;
          }
        }}
        {...props}
      />
    );
  }

  // صورة عادية
  return (
    <img
      src={src || fallbackSrc}
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};

export default SmartImage;
