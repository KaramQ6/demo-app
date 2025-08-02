import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AppProvider } from "./contexts/AppContext";
import { Toaster } from "./components/ui/toaster";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

// Pages
import Homepage from "./pages/Homepage";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import DataHub from "./pages/DataHub";
import UserProfile from "./pages/UserProfile";
import Itinerary from "./pages/Itinerary";
import Demo from './pages/Demo';
import ARView from './pages/ARView';

// Internal component to handle layout based on route
function AppContent() {
  const location = useLocation();
  const isArPage = location.pathname === '/ar';

  return (
    <div className="App min-h-screen bg-background text-foreground">
      <AppProvider>
        {!isArPage && <Header />}
        <main className={isArPage ? 'ar-main' : ''}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/data" element={<DataHub />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/ar" element={<ARView />} />
          </Routes>
        </main>
        {!isArPage && <Footer />}
        {!isArPage && <Chatbot />}
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