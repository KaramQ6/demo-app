import React, { Suspense } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AppProvider } from "./contexts/AppContext";
import { Toaster } from "./components/ui/toaster";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import ProtectedRoute from "./components/ProtectedRoute";
import SmartToolsSidebar from "./components/SmartToolsSidebar";

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

// Internal component to handle layout based on route
function AppContent() {
  const location = useLocation();
  const isArPage = location.pathname === '/ar';
  const isVoiceAgentPage = location.pathname === '/voice-agent';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/reset-password' || location.pathname === '/reset-password-confirm';

  return (
    <div className="App min-h-screen bg-background text-foreground">
      <AppProvider>
        {!isArPage && !isAuthPage && !isVoiceAgentPage && <Header />}
        {!isArPage && !isAuthPage && !isVoiceAgentPage && <SmartToolsSidebar />}
        <main className={isArPage ? 'ar-main' : !isArPage && !isAuthPage && !isVoiceAgentPage ? 'ml-0 md:ml-16 transition-all duration-300' : ''}>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:id" element={<DestinationDetail />} />
              <Route path="/data" element={<DataHub />} />
              <Route path="/iot-hub" element={<IoTHub />} />
              <Route path="/about" element={<About />} />
              <Route path="/voice-agent" element={<VoiceAgentPage />} />
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
            </Routes>
          </Suspense>
        </main>
        {!isArPage && !isAuthPage && !isVoiceAgentPage && <Footer />}
        {!isArPage && !isAuthPage && !isVoiceAgentPage && <Chatbot />}
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