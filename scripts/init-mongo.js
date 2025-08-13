// MongoDB initialization script for SmartTour.Jo
// This script runs when the MongoDB container starts for the first time

// Switch to the smarttour_db database
db = db.getSiblingDB('smarttour_db');

// Create a user for the application
db.createUser({
  user: 'smarttour_user',
  pwd: 'smarttour_password_2025',
  roles: [
    {
      role: 'readWrite',
      db: 'smarttour_db'
    }
  ]
});

// Create collections with basic indexes
db.createCollection('destinations');
db.createCollection('status_checks');
db.createCollection('user_sessions');

// Create indexes for better performance
db.destinations.createIndex({ "name": 1 });
db.destinations.createIndex({ "category": 1 });
db.destinations.createIndex({ "location": "2dsphere" });

db.status_checks.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 86400 }); // 24 hours

db.user_sessions.createIndex({ "user_id": 1 });
db.user_sessions.createIndex({ "created_at": 1 }, { expireAfterSeconds: 604800 }); // 7 days

// Insert sample destinations data
db.destinations.insertMany([
  {
    "_id": "petra",
    "name": "Petra",
    "name_ar": "البتراء", 
    "description": "Ancient city carved into red sandstone cliffs",
    "description_ar": "مدينة أثرية محفورة في الصخر الرملي الأحمر",
    "latitude": 30.3285,
    "longitude": 35.4444,
    "category": "historical",
    "image_url": "https://images.unsplash.com/photo-1539650116574-75c0c6d73400?w=800",
    "rating": 4.9,
    "is_active": true,
    "created_at": new Date(),
    "location": {
      "type": "Point",
      "coordinates": [35.4444, 30.3285]
    }
  },
  {
    "_id": "wadi-rum",
    "name": "Wadi Rum",
    "name_ar": "وادي رم",
    "description": "Protected desert wilderness known as Valley of the Moon",
    "description_ar": "محمية صحراوية برية تُعرف باسم وادي القمر",
    "latitude": 29.5324,
    "longitude": 35.4206,
    "category": "nature",
    "image_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    "rating": 4.8,
    "is_active": true,
    "created_at": new Date(),
    "location": {
      "type": "Point", 
      "coordinates": [35.4206, 29.5324]
    }
  },
  {
    "_id": "dead-sea",
    "name": "Dead Sea",
    "name_ar": "البحر الميت",
    "description": "Salt lake bordered by Jordan and Israel",
    "description_ar": "بحيرة ملحية تحدها الأردن وإسرائيل",
    "latitude": 31.5590,
    "longitude": 35.4732,
    "category": "nature",
    "image_url": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800",
    "rating": 4.7,
    "is_active": true,
    "created_at": new Date(),
    "location": {
      "type": "Point",
      "coordinates": [35.4732, 31.5590]
    }
  },
  {
    "_id": "jerash",
    "name": "Jerash",
    "name_ar": "جرش",
    "description": "Well-preserved Roman provincial town",
    "description_ar": "مدينة رومانية محافظة بشكل جيد",
    "latitude": 32.2744,
    "longitude": 35.8906,
    "category": "historical",
    "image_url": "https://images.unsplash.com/photo-1609137147586-cd03d4ee7c87?w=800",
    "rating": 4.6,
    "is_active": true,
    "created_at": new Date(),
    "location": {
      "type": "Point",
      "coordinates": [35.8906, 32.2744]
    }
  },
  {
    "_id": "amman-citadel",
    "name": "Amman Citadel",
    "name_ar": "جبل القلعة",
    "description": "Historic site in the center of downtown Amman",
    "description_ar": "موقع تاريخي في وسط عمان",
    "latitude": 31.9539,
    "longitude": 35.9345,
    "category": "historical",
    "image_url": "https://images.unsplash.com/photo-1590155158638-6300af95aad5?w=800",
    "rating": 4.4,
    "is_active": true,
    "created_at": new Date(),
    "location": {
      "type": "Point",
      "coordinates": [35.9345, 31.9539]
    }
  }
]);

print('SmartTour.Jo database initialized successfully!');
print('Created collections: destinations, status_checks, user_sessions');
print('Inserted ' + db.destinations.count() + ' sample destinations');