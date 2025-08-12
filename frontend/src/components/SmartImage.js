import React from 'react';
import CloudinaryImage from './CloudinaryImage';

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

  if (isCloudinaryImage) {
    return (
      <CloudinaryImage
        publicId={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        {...props}
      />
    );
  }

  // صورة عادية
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};

export default SmartImage;
