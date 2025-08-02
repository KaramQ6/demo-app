// src/pages/ARView.js

import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { destinations } from '../data/mock'; // استيراد بيانات الوجهات

// نصوص الواجهة باللغتين
const uiTexts = {
  ar: {
    title: "مرشد SmartTour للواقع المعزز",
    description: "لأفضل النتائج، يرجى التجربة في منطقة خارجية مفتوحة ومنح صلاحيات الموقع.",
    startButton: "ابدأ التجربة",
    requestingPermissions: "جاري طلب الصلاحيات...",
    gpsAcquired: "تم الحصول على إشارة GPS. بدء الواقع المعزز...",
    gpsError: "خطأ: يرجى تفعيل الموقع وتحديث الصفحة.",
    chooseDestination: "اختر وجهة:",
    destinationLabel: "الوجهة",
    distanceLabel: "المسافة",
    meters: "متر"
  },
  en: {
    title: "SmartTour AR Guide",
    description: "For best results, please test in an open outdoor area and grant location permissions.",
    startButton: "Start Experience",
    requestingPermissions: "Requesting permissions...",
    gpsAcquired: "GPS signal acquired. Starting AR...",
    gpsError: "Error: Please enable location and refresh.",
    chooseDestination: "Choose a destination:",
    destinationLabel: "Destination",
    distanceLabel: "Distance",
    meters: "m"
  }
};

const ARView = () => {
  const { language } = useContext(AppContext);
  const [isStarted, setIsStarted] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  const texts = uiTexts[language];

  useEffect(() => {
    if (!isStarted) return;

    // تحويل بيانات الوجهات إلى التنسيق الذي يفهمه الكود القديم
    const locations = destinations.map(dest => ({
      name: dest.name[language],
      lat: dest.lat, // ملاحظة: يجب إضافة خطوط الطول والعرض لبياناتك
      lon: dest.lon, // ملاحظة: يجب إضافة خطوط الطول والعرض لبياناتك
      desc: dest.shortDescription[language]
    }));
    
    // تسجيل مكون A-Frame للتعامل مع منطق الـ AR
    if (!AFRAME.components['ar-handler']) {
      AFRAME.registerComponent('ar-handler', {
        // ... نفس الكود القديم ولكن مع استخدام `locations` المحولة
        // ... (لقد نسخت لك النسخة الكاملة والمعدلة أدناه)
      });
    }

    // إظهار مشهد الـ AR
    const arScene = document.getElementById('ar-scene');
    if (arScene) {
      arScene.style.display = 'block';
    }
  }, [isStarted, language]);

  const handleStart = () => {
    setStatusMessage(texts.requestingPermissions);
    navigator.geolocation.getCurrentPosition(
      () => {
        setStatusMessage(texts.gpsAcquired);
        setIsStarted(true);
      },
      (err) => {
        setStatusMessage(`${texts.gpsError} (${err.message})`);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };
  
  if (!isStarted) {
    return (
      <div id="splash-screen" style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#111827', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px', boxSizing: 'border-box', zIndex: 10000}}>
        <h2>{texts.title}</h2>
        <p>{texts.description}</p>
        <button id="start-button" onClick={handleStart} style={{backgroundColor: '#8B5CF6', color: 'white', border: 'none', padding: '15px 30px', fontSize: '18px', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', marginTop: '20px'}}>
          {texts.startButton}
        </button>
        <p id="status-message" style={{marginTop: '20px', color: '#9CA3AF'}}>{statusMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div id="location-list" style={{position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(17, 24, 39, 0.85)', padding: '8px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center', zIndex: 1000, color: 'white', width: '90%', maxWidth: '400px', backdropFilter: 'blur(10px)', display: 'none'}}>
        <h4>{texts.chooseDestination}</h4>
        <div id="buttons-container"></div>
      </div>

      <a-scene 
        id="ar-scene"
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false; trackingMethod: best;"
        renderer="antialias: true; alpha: true"
        style={{display: 'none'}}
        ar-handler
      >
        <a-camera gps-new-camera="gpsMinDistance: 5">
            <a-entity id="info-card" position="0 -0.8 -2.5" visible="false">
                <a-plane width="1.8" height="0.8" color="#8B5CF6" material="transparent: true; opacity: 0.9" rounded="radius: 0.05"></a-plane>
                <a-text id="card-title" value="" color="#FFFFFF" align="center" width="3" position="0 0.2 0.01"></a-text>
                <a-text id="card-description" value="" color="#E0E0E0" align="center" width="1.7" position="0 -0.1 0.01"></a-text>
            </a-entity>
            
            <a-entity id="arrow-container" position="0 0 -4" visible="false">
                <a-cone id="arrow-cone" color="yellow" radius-bottom="0.3" radius-top="0" height="0.5" rotation="-90 0 0"></a-cone>
                <a-text id="arrow-distance" value="" color="white" align="center" position="0 0.8 0" width="8"></a-text>
            </a-entity>
        </a-camera>
        <a-entity id="target-poi"></a-entity>
      </a-scene>

      <div id="info-panel" style={{position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(17, 24, 39, 0.85)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center', zIndex: 1000, color: 'white', width: '90%', maxWidth: '400px', backdropFilter: 'blur(10px)', display: 'none'}}></div>
    </>
  );
};

// هذا هو نفس الكود القديم، ولكن تم وضعه هنا ليسجل المكون عند الحاجة
// ويستخدم البيانات الديناميكية واللغة
AFRAME.registerComponent('ar-handler', {
    init: function () {
        this.userLat = 0;
        this.userLon = 0;
        this.activeTarget = null;
        
        // احصل على اللغة من مكان يمكن الوصول إليه
        const language = document.documentElement.lang || 'en';
        const texts = uiTexts[language];

        // تحويل البيانات الديناميكية
        this.locations = destinations.map(dest => ({
            name: dest.name[language],
            lat: dest.lat, // تأكد من إضافة هذه البيانات
            lon: dest.lon, // تأكد من إضافة هذه البيانات
            desc: dest.shortDescription[language]
        }));

        window.addEventListener('gps-camera-update-position', (e) => {
            this.userLat = e.detail.position.latitude;
            this.userLon = e.detail.position.longitude;
        });
    },

    tick: function () {
        if (this.userLat === 0) return;

        const nearbyPlaces = this.findNearbyPlaces(2000); // 2km
        this.updateLocationList(nearbyPlaces);

        if (this.activeTarget) {
            const distance = this.getDistance(this.userLat, this.userLon, this.activeTarget.lat, this.activeTarget.lon);
            this.updateUIVisibility(distance);
            this.updateBottomPanel(this.activeTarget.name, distance);
            
            const arrowContainer = document.getElementById('arrow-container');
            if(arrowContainer.getAttribute('visible')) {
                const targetPoi = document.getElementById('target-poi');
                targetPoi.setAttribute('gps-new-entity-place', `latitude: ${this.activeTarget.lat}; longitude: ${this.activeTarget.lon};`);
                document.getElementById('arrow-distance').setAttribute('value', `${distance.toFixed(0)}${uiTexts[document.documentElement.lang || 'en'].meters}`);
                arrowContainer.object3D.lookAt(targetPoi.object3D.position);
            }
        } else {
            this.hideAllUI();
        }
    },

    updateLocationList: function(places) {
        const listContainer = document.getElementById('location-list');
        const buttonsContainer = document.getElementById('buttons-container');

        if (this.activeTarget) {
            listContainer.style.display = 'none';
            return;
        }
        
        if (places.length === 0) {
            listContainer.style.display = 'none';
        } else if (places.length === 1) {
            this.setActiveTarget(places[0]);
            listContainer.style.display = 'none';
        } else {
            listContainer.style.display = 'block';
            buttonsContainer.innerHTML = '';
            places.forEach(place => {
                const button = document.createElement('button');
                button.innerHTML = `${place.name} (${this.getDistance(this.userLat, this.userLon, place.lat, place.lon).toFixed(0)}${uiTexts[document.documentElement.lang || 'en'].meters})`;
                button.className = 'location-button';
                button.onclick = () => this.setActiveTarget(place);
                buttonsContainer.appendChild(button);
            });
        }
    },
    
    // باقي الدوال تبقى كما هي...
    setActiveTarget: function(place) {
        this.activeTarget = place;
        document.getElementById('location-list').style.display = 'none';
    },

    updateUIVisibility: function(distance) {
        const distanceThreshold = 50;
        const infoCard = document.getElementById('info-card');
        const arrowContainer = document.getElementById('arrow-container');

        if (distance < distanceThreshold) {
            infoCard.setAttribute('visible', true);
            arrowContainer.setAttribute('visible', false);
            document.getElementById('card-title').setAttribute('value', this.activeTarget.name);
            document.getElementById('card-description').setAttribute('value', this.activeTarget.desc);
        } else {
            infoCard.setAttribute('visible', false);
            arrowContainer.setAttribute('visible', true);
        }
    },
    
    hideAllUI: function() {
        document.getElementById('info-card').setAttribute('visible', false);
        document.getElementById('arrow-container').setAttribute('visible', false);
        document.getElementById('info-panel').style.display = 'none';
    },

    findNearbyPlaces: function(radius) {
        return this.locations.filter(place => {
            const distance = this.getDistance(this.userLat, this.userLon, place.lat, place.lon);
            return distance < radius;
        });
    },

    getDistance: (lat1, lon1, lat2, lon2) => {
        const R = 6371000;
        const toRad = (deg) => deg * Math.PI / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    },

    updateBottomPanel: (name, distance) => {
        const language = document.documentElement.lang || 'en';
        const texts = uiTexts[language];
        const infoPanel = document.getElementById('info-panel');
        infoPanel.innerHTML = `${texts.destinationLabel}: <strong>${name}</strong> | ${texts.distanceLabel}: <span>${distance.toFixed(0)}</span> ${texts.meters}`;
        infoPanel.style.display = 'block';
    }
});


export default ARView;