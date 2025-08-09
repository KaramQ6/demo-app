import React, { Suspense } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { AppProvider } from "./contexts/AppContext";
import { Toaster } from "./components/ui/toaster";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import ProtectedRoute from "./components/ProtectedRoute";
import SmartToolsSidebar from "./components/SmartToolsSidebarSimple";
import GlobalError from "./components/GlobalError";

// Lazy-loaded Pages
const Homepage = React.lazy(() => import("./pages/Homepage"));
const Destinations = React.lazy(() => import("./pages/Destinations"));
const DestinationDetail = React.lazy(() => import("./pages/DestinationDetail"));
const DataHub = React.lazy(() => import("./pages/DataHub"));
const IoTHub = React.lazy(() => import("./pages/IoTHub"));
const About = React.lazy(() => import("./pages/About"));
const VoiceAgentPage = React.lazy(() => import("./pages/VoiceAgentPage"));
const UserProfile = React.lazy(() => import("./pages/UserProfile"));
const Itinerary = React.lazy(() => import("./pages/Itinerary"));
const MyPlan = React.lazy(() => import("./pages/MyPlan"));
const Demo = React.lazy(() => import('./pages/Demo'));
const ARView = React.lazy(() => import('./pages/ARView'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
const ResetPasswordConfirmPage = React.lazy(() => import('./pages/ResetPasswordConfirmPage'));
const PlanTripPlaceholder = React.lazy(() => import('./pages/PlanTripPlaceholder'));

// New scaffold pages
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const CommunityPage = React.lazy(() => import('./pages/CommunityPage'));
const BookingPage = React.lazy(() => import('./pages/BookingPage'));
const AdminDashboardPage = React.lazy(() => import('./pages/AdminDashboardPage'));

// IoT and Smart Features pages
const WeatherStationPage = React.lazy(() => import('./pages/WeatherStationPage'));
const CrowdPredictionPage = React.lazy(() => import('./pages/CrowdPredictionPage'));
const SmartRecommendationsPage = React.lazy(() => import('./pages/SmartRecommendationsPage'));

// Internal component to handle layout based on route
function AppContent() {
  const location = useLocation();
  const { language } = useLanguage();
  const isArPage = location.pathname === '/ar';
  const isVoiceAssistantPage = location.pathname === '/VoiceAgentPage';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/reset-password' || location.pathname === '/reset-password-confirm';

  return (
    <div className="App min-h-screen bg-gray-900 text-white" style={{ fontFamily: language === 'ar' ? "'Tajawal', sans-serif" : "'Inter', sans-serif" }}>
      <AppProvider>
        {!isArPage && !isAuthPage && !isVoiceAssistantPage && <Header />}
        {!isArPage && !isAuthPage && !isVoiceAssistantPage && <SmartToolsSidebar />}
        <main className={isArPage ? 'ar-main' : !isArPage && !isAuthPage && !isVoiceAssistantPage ? 'ml-0 md:ml-16 pt-16 transition-all duration-300' : 'pt-16'}>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:id" element={<DestinationDetail />} />
              <Route path="/data" element={<DataHub />} />
              <Route path="/iot-hub" element={<IoTHub />} />
              <Route path="/about" element={<About />} />
              <Route path="/voice-assistant" element={<VoiceAgentPage />} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/itinerary" element={<ProtectedRoute><Itinerary /></ProtectedRoute>} />
              <Route path="/my-plan" element={<ProtectedRoute><MyPlan /></ProtectedRoute>} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/ar" element={<ARView />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/reset-password-confirm" element={<ResetPasswordConfirmPage />} />
              <Route path="/plan-trip" element={<PlanTripPlaceholder />} />

              {/* New scaffold routes */}
              <Route path="/profile-page" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />

              {/* IoT and Smart Features routes */}
              <Route path="/weather" element={<VoiceAgentPage />} />
              <Route path="/crowd-prediction" element={<CrowdPredictionPage />} />
              <Route path="/smart-recommendations" element={<SmartRecommendationsPage />} />
              <Route path="/voice-assistant" element={<VoiceAgentPage />} />
            </Routes>
          </Suspense>
        </main>
        {!isArPage && !isAuthPage && !isVoiceAssistantPage && <Footer />}
        {!isArPage && !isAuthPage && !isVoiceAssistantPage && <Chatbot />}
        <GlobalError />
        <Toaster />
      </AppProvider>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;