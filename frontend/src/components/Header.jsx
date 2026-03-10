import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper to style active links
  const getLinkClass = (path) => {
    const baseClass = "font-semibold transition-all";
    return location.pathname === path 
      ? `${baseClass} text-indigo-600` 
      : `${baseClass} text-gray-500 hover:text-indigo-600`;
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="flex justify-between items-center px-8 py-5 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 font-sans">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
        <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
          🧠
        </div>
        <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">Smart AI Tutor</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link to="/how-it-works" className={getLinkClass('/how-it-works')}>How it Works</Link>
        
        <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>

        <Link to="/signin" className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
          Sign In
        </Link>
        
        <Link to="/signup">
          <button className="bg-indigo-600 text-white px-7 py-2.5 rounded-xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-xl shadow-indigo-100 active:scale-95">
            Get Started
          </button>
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-gray-600" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-2xl flex flex-col items-center py-8 space-y-6 md:hidden border-t border-gray-50 animate-fade-in">
           <Link to="/how-it-works" className={getLinkClass('/how-it-works')} onClick={closeMobileMenu}>How it Works</Link>
           <Link to="/signin" className="font-bold text-gray-400 text-sm uppercase tracking-widest" onClick={closeMobileMenu}>Sign In</Link>
           <Link to="/signup" onClick={closeMobileMenu} className="w-full px-10">
             <button className="bg-indigo-600 text-white py-4 rounded-2xl w-full font-bold shadow-lg">Get Started</button>
           </Link>
        </div>
      )}
    </header>
  );
};

export default Header;