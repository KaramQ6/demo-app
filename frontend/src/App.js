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

// Lazy-loaded Pages
const Homepage = React.lazy(() => import("./pages/Homepage"));
const Destinations = React.lazy(() => import("./pages/Destinations"));
const DestinationDetail = React.lazy(() => import("./pages/DestinationDetail"));
const DataHub = React.lazy(() => import("./pages/DataHub"));
const UserProfile = React.lazy(() => import("./pages/UserProfile"));
const Itinerary = React.lazy(() => import("./pages/Itinerary"));
const Demo = React.lazy(() => import('./pages/Demo'));
const ARView = React.lazy(() => import('./pages/ARView'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));

// Internal component to handle layout based on route
function AppContent() {
  const location = useLocation();
  const isArPage = location.pathname === '/ar';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App min-h-screen bg-background text-foreground">
      <AppProvider>
        {!isArPage && !isAuthPage && <Header />}
        <main className={isArPage ? 'ar-main' : ''}>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-lg">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destinations/:id" element={<DestinationDetail />} />
              <Route path="/data" element={<DataHub />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/ar" element={<ARView />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </Suspense>
        </main>
        {!isArPage && !isAuthPage && <Footer />}
        {!isArPage && !isAuthPage && <Chatbot />}
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