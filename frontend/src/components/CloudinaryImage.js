import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { format, quality } from '@cloudinary/url-gen/actions/delivery';

// إنشاء instance من Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: 'dn0vfbcmu'
  }
});

// قائمة الصور المتاحة على Cloudinary مع أسماءها الحقيقية
const cloudinaryImages = {
  'smarttour/destinations/wadi-rum': 'وادي_رم_z7dxau',
  'smarttour/destinations/as-salt': 'السلط_rgdgzg',
  'smarttour/destinations/dead-sea': 'البحر_الميت_okmqdh',
  'smarttour/destinations/wadi-mujib': 'وادي_الموجب_diemut'
};

// صور بديلة في حالة فشل تحميل Cloudinary
const fallbackImages = {
  'smarttour/destinations/wadi-rum': 'https://cdn.britannica.com/88/189788-050-9B5DB3A4/Al-Khaznah-Petra-Jordan.jpg',
  'smarttour/destinations/as-salt': 'https://cdn.britannica.com/24/153524-050-BA9D084B/Al-Dayr-Petra-Jordan.jpg',
  'smarttour/destinations/dead-sea': 'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg?auto=compress&cs=tinysrgb&w=1200&q=80',
  'smarttour/destinations/wadi-mujib': 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/00/f3/d8/oasis-fabuleuse.jpg?w=1400&h=-1&s=1'
};

const SmartImage = ({
  src,
  alt,
  className = '',
  width = 800,
  height = 600
}) => {
  // التحقق من وجود صورة Cloudinary
  const cloudinaryId = cloudinaryImages[src];
  const fallbackSrc = fallbackImages[src];

  if (cloudinaryId) {
    // إنشاء الصورة مع التحسينات من Cloudinary
    const myImage = cld
      .image(cloudinaryId)
      .format(format.auto())
      .quality(quality.auto())
      .resize(auto().gravity(autoGravity()).width(width).height(height));

    return (
      <AdvancedImage
        cldImg={myImage}
        alt={alt}
        className={className}
        loading="lazy"
        onError={(e) => {
          // في حالة فشل تحميل الصورة من Cloudinary، استخدم الصورة البديلة
          if (fallbackSrc) {
            e.target.src = fallbackSrc;
          }
        }}
      />
    );
  }

  // في حالة عدم وجود صورة Cloudinary، استخدم الصورة العادية
  return (
    <img
      src={src || fallbackSrc}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};

export default SmartImage;
