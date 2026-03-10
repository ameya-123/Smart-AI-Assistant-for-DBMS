import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// --- Shared Components ---
import Header from './components/Header';

// --- Pages ---
import LandingPage from './pages/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import SignupPage from './pages/SignupPage'; 
import SignInPage from './pages/SignInPage'; 
import ChatInterfacePage from './pages/ChatInterfacePage';
import SqlSandboxPage from './pages/SqlSandboxPage';
import FeatureDetailPage from './pages/FeatureDetailPage';

// --- Placeholder pages ---
const AboutPage = () => (
  <div className="min-h-screen flex items-center justify-center text-2xl text-blue-800 bg-blue-50">
    About Page Coming Soon...
  </div>
);

// Scroll To Top component to ensure pages start at the top on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
        
        {/* CONDITIONAL HEADER: 
          Hides navigation on core app/auth pages. 
          The '*' route ensures Header shows on Landing and Detail pages.
        */}
        <Routes>
          <Route path="/signup" element={null} />
          <Route path="/signin" element={null} />
          <Route path="/tutor" element={null} />
          <Route path="/sandbox" element={null} />
          <Route path="*" element={<Header />} />
        </Routes>
        
        {/* MAIN CONTENT */}
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* DYNAMIC FEATURE ROUTE: 
              This replaces the old static FeaturesPage. 
              The cards on LandingPage should navigate here.
            */}
            <Route path="/features/:featureId" element={<FeatureDetailPage />} />
            
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/about" element={<AboutPage />} />
            
            {/* Auth Routes */}
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signin" element={<SignInPage />} />
            
            {/* Main Application Routes */}
            <Route path="/tutor" element={<ChatInterfacePage />} />
            <Route path="/sandbox" element={<SqlSandboxPage />} />
          </Routes>
        </main>

        {/* CONDITIONAL FOOTER */}
        <Routes>
          <Route path="/signup" element={null} />
          <Route path="/signin" element={null} />
          <Route path="/tutor" element={null} />
          <Route path="/sandbox" element={null} />
          <Route path="*" element={
            <footer className="py-10 text-center text-gray-400 text-xs font-medium uppercase tracking-widest border-t border-gray-100 bg-white">
              <p>© 2026 Smart AI Tutor. Education Reimagined.</p>
            </footer>
          } />
        </Routes>

      </div>
    </Router>
  );
}

export default App;