import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AppProvider } from "./contexts/AppContext";

const SimpleTest = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
      <h1>SmartTour.Jo - Context Test</h1>
      <p>Testing contexts and routing...</p>
    </div>
  );
};

const TestWithContexts = () => {
  return (
    <LanguageProvider>
      <AppProvider>
        <div style={{ backgroundColor: '#121212', color: '#fff', minHeight: '100vh' }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<SimpleTest />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AppProvider>
    </LanguageProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TestWithContexts />
  </React.StrictMode>,
);
