// src/pages/ARView.js

import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { destinations } from '../mock';

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

  const texts = uiTexts[language] || uiTexts.en;

  useEffect(() => {
    // Load A-Frame and AR.js scripts dynamically
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const initAR = async () => {
      try {
        setStatusMessage('تحميل مكتبات الواقع المعزز...');

        // Load A-Frame first
        await loadScript('https://aframe.io/releases/1.5.0/aframe.min.js');

        // Then load AR.js
        await loadScript('https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js');

        // Wait for A-Frame to be fully ready
        if (window.AFRAME) {
          console.log('A-Frame loaded successfully');
          registerARHandler();
        }

        setStatusMessage('جاهز للبدء!');
      } catch (error) {
        console.error('Failed to load AR scripts:', error);
        setStatusMessage(`خطأ في تحميل مكتبات الواقع المعزز: ${error.message}`);
      }
    };

    initAR();
  }, []);

  const registerARHandler = () => {
    window.AFRAME.registerComponent('ar-handler', {
      init: function () {
        this.userLat = 0;
        this.userLon = 0;
        this.activeTarget = null;

        // تحويل بيانات الوجهات إلى التنسيق المطلوب مع تضمين إحداثيات افتراضية
        this.locations = destinations.map((dest, index) => ({
          name: dest.name[language] || dest.name.en,
          // إحداثيات افتراضية للاختبار - يجب استبدالها بالإحداثيات الحقيقية
          lat: dest.lat || (32.4841 + (index * 0.01)), // جامعة جدارا كنقطة مرجعية
          lon: dest.lon || (35.8890 + (index * 0.01)),
          desc: dest.shortDescription[language] || dest.shortDescription.en || dest.description[language] || dest.description.en
        }));

        // إضافة بعض المواقع الثابتة للاختبار
        this.locations = [
          ...this.locations,
          { name: 'Jadara University - Building A', lat: 32.4841, lon: 35.8890, desc: "Main administration building." },
          { name: 'Irbid Clock Tower', lat: 32.5539, lon: 35.8587, desc: "A prominent landmark in Irbid." },
          { name: 'Amman Citadel', lat: 31.9545, lon: 35.9344, desc: "A famous historical site in Amman." },
          { name: 'Calma Space Irbid', lat: 32.5400, lon: 35.8500, desc: "A popular coworking space in Irbid." }
        ];

        window.addEventListener('gps-camera-update-position', (e) => {
          this.userLat = e.detail.position.latitude;
          this.userLon = e.detail.position.longitude;
        });
      },

      tick: function () {
        if (this.userLat === 0) return;

        const nearbyPlaces = this.findNearbyPlaces(2000); // 2km radius
        this.updateLocationList(nearbyPlaces);

        if (this.activeTarget) {
          const distance = this.getDistance(this.userLat, this.userLon, this.activeTarget.lat, this.activeTarget.lon);
          this.updateUIVisibility(distance);
          this.updateBottomPanel(this.activeTarget.name, distance);

          const arrowContainer = document.getElementById('arrow-container');
          if (arrowContainer && arrowContainer.getAttribute('visible') === 'true') {
            const targetPoi = document.getElementById('target-poi');
            if (targetPoi) {
              targetPoi.setAttribute('gps-new-entity-place', `latitude: ${this.activeTarget.lat}; longitude: ${this.activeTarget.lon};`);
              const arrowDistance = document.getElementById('arrow-distance');
              if (arrowDistance) {
                arrowDistance.setAttribute('value', `${distance.toFixed(0)}${uiTexts[language]?.meters || 'm'}`);
              }
              // Point arrow towards target
              if (targetPoi.object3D) {
                arrowContainer.object3D.lookAt(targetPoi.object3D.position);
              }
            }
          }
        } else {
          this.hideAllUI();
        }
      },

      updateLocationList: function (places) {
        const listContainer = document.getElementById('location-list');
        const buttonsContainer = document.getElementById('buttons-container');

        if (!listContainer || !buttonsContainer) return;

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
            const distance = this.getDistance(this.userLat, this.userLon, place.lat, place.lon);
            button.innerHTML = `${place.name} (${distance.toFixed(0)}${uiTexts[language]?.meters || 'm'})`;
            button.className = 'location-button';
            button.style.cssText = `
              background-color: #8B5CF6;
              color: white;
              border: none;
              padding: 12px;
              width: 100%;
              border-radius: 8px;
              font-size: 16px;
              font-weight: bold;
              margin-top: 8px;
              cursor: pointer;
            `;
            if (button === buttonsContainer.firstChild) {
              button.style.marginTop = '0';
            }
            button.onclick = () => this.setActiveTarget(place);
            buttonsContainer.appendChild(button);
          });
        }
      },

      setActiveTarget: function (place) {
        this.activeTarget = place;
        const listContainer = document.getElementById('location-list');
        if (listContainer) {
          listContainer.style.display = 'none';
        }
      },

      updateUIVisibility: function (distance) {
        const distanceThreshold = 50; // meters
        const infoCard = document.getElementById('info-card');
        const arrowContainer = document.getElementById('arrow-container');

        if (distance < distanceThreshold) {
          // Show info card when close
          if (infoCard) {
            infoCard.setAttribute('visible', 'true');
            const cardTitle = document.getElementById('card-title');
            const cardDescription = document.getElementById('card-description');
            if (cardTitle) cardTitle.setAttribute('value', this.activeTarget.name);
            if (cardDescription) cardDescription.setAttribute('value', this.activeTarget.desc);
          }
          if (arrowContainer) arrowContainer.setAttribute('visible', 'false');
        } else {
          // Show arrow when far
          if (infoCard) infoCard.setAttribute('visible', 'false');
          if (arrowContainer) arrowContainer.setAttribute('visible', 'true');
        }
      },

      hideAllUI: function () {
        const infoCard = document.getElementById('info-card');
        const arrowContainer = document.getElementById('arrow-container');
        const infoPanel = document.getElementById('info-panel');

        if (infoCard) infoCard.setAttribute('visible', 'false');
        if (arrowContainer) arrowContainer.setAttribute('visible', 'false');
        if (infoPanel) infoPanel.style.display = 'none';
      },

      findNearbyPlaces: function (radius) {
        return this.locations.filter(place => {
          const distance = this.getDistance(this.userLat, this.userLon, place.lat, place.lon);
          return distance < radius;
        });
      },

      getDistance: function (lat1, lon1, lat2, lon2) {
        const R = 6371000; // Earth's radius in meters
        const toRad = (deg) => deg * Math.PI / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      },

      updateBottomPanel: function (name, distance) {
        const infoPanel = document.getElementById('info-panel');
        if (infoPanel) {
          const texts = uiTexts[language] || uiTexts.en;
          infoPanel.innerHTML = `${texts.destinationLabel}: <strong>${name}</strong> | ${texts.distanceLabel}: <span>${distance.toFixed(0)}</span> ${texts.meters}`;
          infoPanel.style.display = 'block';
        }
      }
    });
  };

  const handleStart = async () => {
    setStatusMessage(texts.requestingPermissions);

    // Check if device supports required features
    if (!navigator.geolocation) {
      setStatusMessage('خطأ: الجهاز لا يدعم خدمات الموقع');
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatusMessage('خطأ: الجهاز لا يدعم الكاميرا');
      return;
    }

    try {
      // Request camera permission first
      await navigator.mediaDevices.getUserMedia({ video: true });
      setStatusMessage('تم الحصول على إذن الكاميرا...');

      // Then request location permission
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatusMessage(`${texts.gpsAcquired} (دقة: ${position.coords.accuracy.toFixed(0)}م)`);
          setIsStarted(true);

          // Show AR scene after initialization
          setTimeout(() => {
            const arScene = document.getElementById('ar-scene');
            if (arScene) {
              arScene.style.display = 'block';
              console.log('AR Scene activated');
            }
          }, 1000);
        },
        (err) => {
          console.error('GPS Error:', err);
          setStatusMessage(`${texts.gpsError} - ${err.message}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0
        }
      );
    } catch (err) {
      console.error('Camera Error:', err);
      setStatusMessage(`خطأ في الكاميرا: ${err.message}`);
    }
  };

  if (!isStarted) {
    return (
      <div id="splash-screen" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#111827',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        zIndex: 10000
      }}>
        <h2>{texts.title}</h2>
        <p>{texts.description}</p>
        <button
          id="start-button"
          onClick={handleStart}
          style={{
            backgroundColor: '#8B5CF6',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '50px',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          {texts.startButton}
        </button>
        <p id="status-message" style={{ marginTop: '20px', color: '#9CA3AF' }}>
          {statusMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Location selection list */}
      <div
        id="location-list"
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(17, 24, 39, 0.85)',
          padding: '8px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          zIndex: 1000,
          color: 'white',
          width: '90%',
          maxWidth: '400px',
          backdropFilter: 'blur(10px)',
          display: 'none'
        }}
      >
        <h4>{texts.chooseDestination}</h4>
        <div id="buttons-container"></div>
      </div>

      {/* A-Frame AR Scene */}
      <a-scene
        id="ar-scene"
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false; trackingMethod: best; sourceWidth: 1280; sourceHeight: 960; displayWidth: 1280; displayHeight: 960;"
        renderer="antialias: true; alpha: true; precision: medium; logarithmicDepthBuffer: true; colorManagement: true;"
        device-orientation-permission-ui="enabled: false"
        loading-screen="enabled: false"
        style={{ display: 'none' }}
        ar-handler
        embedded
      >
        <a-camera
          gps-camera="gpsMinDistance: 5; maxDistance: 5000; alert: false; simulateLatitude: 32.4841; simulateLongitude: 35.8890"
          look-controls="enabled: false"
          wasd-controls="enabled: false"
          rotation-reader
        >
          {/* Info card for close destinations */}
          <a-entity id="info-card" position="0 -0.8 -2.5" visible="false">
            <a-plane
              width="1.8"
              height="0.8"
              color="#8B5CF6"
              material="transparent: true; opacity: 0.9"
              geometry="primitive: plane"
            ></a-plane>
            <a-text
              id="card-title"
              value=""
              color="#FFFFFF"
              align="center"
              width="3"
              position="0 0.2 0.01"
            ></a-text>
            <a-text
              id="card-description"
              value=""
              color="#E0E0E0"
              align="center"
              width="1.7"
              position="0 -0.1 0.01"
            ></a-text>
          </a-entity>

          {/* Direction arrow for distant destinations */}
          <a-entity id="arrow-container" position="0 0 -4" visible="false">
            <a-cone
              id="arrow-cone"
              color="yellow"
              radius-bottom="0.3"
              radius-top="0"
              height="0.5"
              rotation="-90 0 0"
            ></a-cone>
            <a-text
              id="arrow-distance"
              value=""
              color="white"
              align="center"
              position="0 0.8 0"
              width="8"
            ></a-text>
          </a-entity>
        </a-camera>

        {/* Target point of interest */}
        <a-entity id="target-poi"></a-entity>
      </a-scene>

      {/* Bottom info panel */}
      <div
        id="info-panel"
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(17, 24, 39, 0.85)',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
          zIndex: 1000,
          color: 'white',
          width: '90%',
          maxWidth: '400px',
          backdropFilter: 'blur(10px)',
          display: 'none'
        }}
      ></div>
    </>
  );
};

export default ARView;