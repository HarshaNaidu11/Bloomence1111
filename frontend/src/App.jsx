// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import './i18n';
import { useTranslation } from 'react-i18next';

// 🟢 FIX 1: Standard Imports to ensure SplitText and TextType work
import Signup from "./components/Signup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import Questionnaires from "./pages/Questionnaires/Questionnaires";
import AIRecommendation from "./pages/AIRecommendation/AIRecommendation";
import EmergencyContact from "./pages/EmergencyContact/EmergencyContact";
import PHQ9 from "./pages/Questionnaires/PHQ9";
import GAD7 from "./pages/Questionnaires/GAD7";
import LightRays from "./components/Lightrays/Lightrays";
import AboutSection from "./components/AboutSection/AboutSection";
import ValueSection from "./components/ValueSection/ValueSection";
import TestimonialScroller from "./components/TestimonialScroller/TestimonialScroller";
import Footer from "./components/Footer/Footer";
import SplitText from "./components/SplitText/SplitText"; // Explicitly imported
import TextType from "./components/TextType/TextType"; // Explicitly imported
import FAQ from "./components/FAQ/FAQ";
import FAQPage from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AboutUs from "./pages/AboutUs";
import TermsOfUse from "./pages/TermsOfUse";
import "./App.css";
import bloomLogo from "../bloomlogo.png";
import CookieConsent from "./components/CookieConsent/CookieConsent";
import ExploreCommunity from "./pages/Community/Explore";
import ChatRoom from "./pages/Community/ChatRoom";
import Analytics from "./pages/Analytics/Analytics";
import Lifestyle from "./pages/Lifestyle/Lifestyle";

// Firebase/Auth Imports
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { useAuth } from './context/AuthContext';


// Removed the old try/catch blocks as imports are now direct

// HoverButton component 
function HoverButton({ children, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: "none",
        background: hover ? "rgba(0, 200, 83, 0.1)" : "none",
        color: hover ? "#00c853" : "inherit",
        cursor: "pointer",
        padding: "6px 8px",
        borderRadius: "5px",
        transition: "color 0.3s ease, background 0.3s ease",
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        fontWeight: 600,
        fontSize: '0.85rem',
      }}
    >
      {children}
    </button>
  );
}

// PROTECTED ROUTE COMPONENT (unchanged behavior for authed users, but now remembers target route)
const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', paddingTop: '50vh' }}>Loading...</div>;
  }

  if (currentUser) {
    return <Component {...rest} />;
  }

  // Remember the route the user was trying to access
  return <Navigate to="/signup" replace state={{ from: location }} />;
};


// Profile Avatar with Dropdown Menu (unchanged)
function ProfileDropdown() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // --- Dynamic Color and Name Logic ---
  const userName = currentUser.displayName || currentUser.email.split('@')[0];
  const userNameInitial = userName[0].toUpperCase();
  const userEmail = currentUser.email;

  // Simple Hash Function to generate a stable, random color based on email
  const stringToHslColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let h = hash % 360;
    return 'hsl(' + h + ', 60%, 45%)';
  };

  const dynamicColor = stringToHslColor(userEmail || 'user');
  const borderHighlightColor = dynamicColor;
  // ------------------------------------

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 100 }}>
      {/* 1. Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: dynamicColor,
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          border: isOpen ? `2px solid ${borderHighlightColor}` : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s'
        }}
      >
        {userNameInitial}
      </button>

      {/* 2. Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '45px',
            right: '0',
            backgroundColor: '#1c2b3a',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
            minWidth: '200px',
            padding: '8px 0',
            textAlign: 'left'
          }}
        >
          <div style={{ padding: '8px 16px', borderBottom: '1px solid #334155' }}>
            {/* Display Name */}
            <div style={{ color: dynamicColor, fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '4px' }}>
              {userName}
            </div>
            {/* Display Email */}
            <div style={{ color: '#c0c0c0', fontSize: '0.8rem' }}>
              {userEmail}
            </div>
          </div>

          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              padding: '10px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#e0e0e0',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}


// HomePage Component (Now fully functional with LightRays)
function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Get current user state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const LanguageSwitcher = () => {
    const [open, setOpen] = useState(false);
    const langs = [
      { code: 'en', label: 'EN' },
      { code: 'hi', label: 'हिं' },
      { code: 'te', label: 'TE' },
      { code: 'ta', label: 'TA' },
      { code: 'kn', label: 'KN' },
      { code: 'ml', label: 'ML' }
    ];
    const saveLang = (lng) => {
      i18n.changeLanguage(lng);
      try {
        localStorage.setItem('i18n:lang', lng);
        if (currentUser?.uid) localStorage.setItem(`i18n:lang:${currentUser.uid}`, lng);
      } catch { }
      setOpen(false);
    };
    return (
      <div style={{ position: 'relative' }}>
        <button onClick={() => setOpen(!open)} style={{ background: 'transparent', color: '#e5e7eb', border: '1px solid #334155', padding: '6px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
          {i18n.language?.toUpperCase() || 'EN'}
        </button>
        {open && (
          <div style={{ position: 'absolute', right: 0, top: '110%', background: '#0b1622', border: '1px solid #1f2a37', borderRadius: 8, padding: 6, display: 'flex', gap: 6 }}>
            {langs.map(l => (
              <button key={l.code} onClick={() => saveLang(l.code)} style={{ background: i18n.language === l.code ? '#10b981' : 'transparent', color: '#e5e7eb', border: '1px solid #334155', padding: '6px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                {l.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAuthWidget = () => {
    if (currentUser) {
      return <ProfileDropdown />;
    }
    return (
      <HoverButton onClick={() => navigate("/signup")}>Get Started</HoverButton>
    );
  };

  return (
    <div className="homepage-body">
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <div className="logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src={bloomLogo} alt="Bloomence logo" className="logo-icon" />
            <span>BLOOMENCE</span>
          </div>
          <button
            className="hamburger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span />
            <span />
            <span />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto', position: 'relative' }}>
            <LanguageSwitcher />
            <div className="desktop-menu-wrapper" style={{ position: 'relative' }}>
              <button
                className="desktop-menu-button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                Menu
              </button>
              {menuOpen && (
                <div className="desktop-menu-dropdown" style={{ position: 'absolute', right: 0, top: '110%', background: '#0b1622', border: '1px solid #1f2a37', borderRadius: 10, padding: 8, minWidth: 200, boxShadow: '0 12px 30px rgba(0,0,0,0.6)', zIndex: 200 }}>
                  <button onClick={() => { setMenuOpen(false); navigate('/dashboard'); }} className="desktop-menu-item">
                    {t('nav.dashboard')}
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate('/questionnaires'); }} className="desktop-menu-item">
                    {t('nav.questionnaires')}
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate('/ai-recommendation'); }} className="desktop-menu-item">
                    {t('nav.ai_recommendation')}
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate('/emergency-contact'); }} className="desktop-menu-item">
                    {t('nav.emergency_contact')}
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate('/lifestyle'); }} className="desktop-menu-item">
                    {t('nav.lifestyle')}
                  </button>
                  <button onClick={() => { setMenuOpen(false); navigate('/analytics'); }} className="desktop-menu-item">
                    {t('nav.analytics')}
                  </button>
                </div>
              )}
            </div>
            {renderAuthWidget()}
          </div>
        </nav>
        {/* Responsive nav controls */}
        <style>{`
          .navbar { padding: 8px 12px; background: transparent; position: sticky; top: 0; z-index: 30; box-shadow: none; }
          .logo { font-size: 1.4rem; font-weight: 800; letter-spacing: 0.18em; }
          .desktop-menu-button {
            padding: 6px 12px;
            border-radius: 999px;
            border: 1px solid #1f2937;
            background: rgba(15,23,42,0.9);
            color: #e5e7eb;
            font-size: 0.8rem;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            cursor: pointer;
            transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          }
          .desktop-menu-button:hover {
            background: rgba(16,185,129,0.12);
            border-color: #10b981;
            color: #a7f3d0;
            box-shadow: 0 0 0 1px rgba(16,185,129,0.35);
          }
          .desktop-menu-dropdown {
            background: radial-gradient(circle at top left, rgba(16,185,129,0.16), #020617 55%);
          }
          .desktop-menu-item {
            width: 100%;
            text-align: left;
            padding: 10px 12px;
            background: transparent;
            border: none;
            color: #e5e7eb;
            font-size: 0.85rem;
            cursor: pointer;
            border-radius: 8px;
            transition: background 0.18s ease, color 0.18s ease, transform 0.12s ease;
          }
          .desktop-menu-item:hover {
            background: rgba(16,185,129,0.18);
            color: #ecfdf5;
            transform: translateX(2px);
          }
          .hamburger { display: none; background: none; border: 0; }
          .hamburger span { display:block; width:20px; height:2px; background:#e5e7eb; margin:4px 0; }
          header, .topbar { background: transparent; box-shadow:none; position: sticky; top: 0; z-index: 30; }
          .nav-menu button, .nav-menu .hover-button { box-shadow:none !important; }
          .hero-section { position: relative; z-index: 1; padding-top: 56px; }
          /* Ensure any background effects do not overlap header */
          .hero-section::before { content:''; display:block; height:0; }
          @media (max-width: 900px) {
            .nav-menu { display: none !important; }
            .hamburger { display: inline-flex; }
          }
        `}</style>
        {mobileOpen && (
          <div className="mobile-menu" role="dialog" aria-modal="true">
            <button className="mobile-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}>✕</button>
            <ul>
              <li><button onClick={() => { setMobileOpen(false); navigate('/dashboard'); }}>{t('nav.dashboard')}</button></li>
              <li><button onClick={() => { setMobileOpen(false); navigate('/questionnaires'); }}>{t('nav.questionnaires')}</button></li>
              <li><button onClick={() => { setMobileOpen(false); navigate('/ai-recommendation'); }}>{t('nav.ai_recommendation')}</button></li>
              <li><button onClick={() => { setMobileOpen(false); navigate('/emergency-contact'); }}>{t('nav.emergency_contact')}</button></li>
              <li><button onClick={() => { setMobileOpen(false); navigate('/lifestyle'); }}>{t('nav.lifestyle')}</button></li>
              <li><button onClick={() => { setMobileOpen(false); navigate('/analytics'); }}>{t('nav.analytics')}</button></li>
            </ul>
            <div className="mobile-auth">
              {renderAuthWidget()}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00d9a5"
          raysSpeed={0.5}
          lightSpread={0.8}
          rayLength={1.5}
          followMouse={true}
          mouseInfluence={0.2}
          distortion={0.03}
        />
        <div className="hero-content">
          <SplitText text="MASTER YOUR MIND, TRANSFORM YOUR LIFE" />
          <TextType
            text="Discover your mental health score, track your growth, and take control of your emotional well-being."
            typingSpeed={50}
            deletingSpeed={30}
            pauseDuration={2000}
            loop={true}
          />
        </div>
      </main>

      {/* Sections */}
      <AboutSection />
      <div className="scroller-wrapper">
        <TestimonialScroller />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <button
          onClick={() => navigate('/community')}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            letterSpacing: '0.02em',
            boxShadow: '0 6px 18px rgba(16,185,129,0.35)'
          }}
        >
          Explore Community
        </button>
      </div>
      {/* Why Choose Us Section (moved above ValueSection) */}
      <section style={{ padding: '32px 16px' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '420px 1fr',
          gap: 16,
          alignItems: 'stretch'
        }}>
          {/* Left: Bold title only */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: 20
          }}>
            <div style={{ color: '#10b981', fontWeight: 900, fontSize: 36, lineHeight: 1 }}>Why Choose Us?</div>
          </div>

          {/* Right: 4 equal cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            justifySelf: 'end'
          }}>
            <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>🔒 Privacy & Security</div>
              <p style={{ color: '#9ca3af', margin: 0 }}>Your data stays yours. Secure auth and safe storage designed for peace of mind.</p>
            </div>
            <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>🧠 Evidence‑based Insights</div>
              <p style={{ color: '#9ca3af', margin: 0 }}>PHQ‑9/GAD‑7 tracking with clear interpretation to understand trends over time.</p>
            </div>
            <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>🤝 Community Support</div>
              <p style={{ color: '#9ca3af', margin: 0 }}>Topic‑based rooms with @mention email alerts—share, learn, and support safely.</p>
            </div>
            <div style={{ border: '1px solid #1f2a37', borderRadius: 12, padding: 16, background: '#0b1622' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>✨ Personalised Guidance</div>
              <p style={{ color: '#9ca3af', margin: 0 }}>Actionable AI recommendations and lifestyle tools tailored to your goals.</p>
            </div>
          </div>
        </div>
        {/* Responsive for small screens */}
        <style>{`
          @media (max-width: 900px) {
            section > div { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>
      <ValueSection />
      <CookieConsent />
    </div>
  );
}

// App Routes (unchanged)
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />

      {/* SECURED ROUTES */}
      <Route path="/dashboard" element={<ProtectedRoute element={Dashboard} />} />
      <Route path="/questionnaires" element={<ProtectedRoute element={Questionnaires} />} />
      <Route path="/ai-recommendation" element={<ProtectedRoute element={AIRecommendation} />} />
      <Route path="/emergency-contact" element={<ProtectedRoute element={EmergencyContact} />} />
      <Route path="/phq9" element={<ProtectedRoute element={PHQ9} />} />
      <Route path="/gad7" element={<ProtectedRoute element={GAD7} />} />
      <Route path="/AboutUs" element={<AboutUs />} />
      <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
      <Route path="/TermsOfUse" element={<TermsOfUse />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/community" element={<ExploreCommunity />} />
      <Route path="/community/:category/:problem" element={<ProtectedRoute element={ChatRoom} />} />
      <Route path="/lifestyle" element={<ProtectedRoute element={Lifestyle} />} />
      <Route path="/analytics" element={<ProtectedRoute element={Analytics} />} />
    </Routes>
  );
}

export default App;
