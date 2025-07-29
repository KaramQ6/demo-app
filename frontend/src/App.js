import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AppProvider } from "./contexts/AppContext";
import { Toaster } from "./components/ui/toaster";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";
import NotificationSystem from "./components/NotificationSystem";

// Pages
import Homepage from "./pages/Homepage";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import IoTHub from "./pages/IoTHub";
import Demo from "./pages/Demo";
import About from "./pages/About";

function App() {
  return (
    <LanguageProvider>
      <div className="App min-h-screen bg-background text-foreground">
        <BrowserRouter>
          <AppProvider>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/destinations/:id" element={<DestinationDetail />} />
                <Route path="/iot-hub" element={<IoTHub />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
            <NotificationSystem />
            <Toaster />
          </AppProvider>
        </BrowserRouter>
      </div>
    </LanguageProvider>
  );
}

export default App;