import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { FaMoon, FaSun, FaBars, FaSignOutAlt, FaSearch, FaUser, FaCube, FaUtensils, FaShoppingCart, FaInfoCircle, FaWhatsapp, FaTimes } from 'react-icons/fa'; 
import logo from './assets/logo.png'; 

// Components
import Intro from './components/Intro';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer'; 

// Pages
import Login from './pages/Login';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import Profile from './pages/Profile'; 
import MagicMode from './pages/MagicMode';
import Kitchen from './pages/Kitchen'; 
import Shop from './pages/Shop.jsx';             
import ProductDetails from './pages/ProductDetails'; 
import Queries from './pages/Queries'; 
import About from './pages/About';     
import Contact from './pages/Contact'; 
import Help from './pages/Help';       

const theme = {
  light: { bg: '#F5F5F5', text: '#000000', navBg: '#E0E0E0', navText: '#000000', cardBg: '#FFFFFF', accent: '#000000', heroText: '#000000', inputBg: '#FFFFFF', border: '#BDBDBD' },
  dark: { bg: '#000000', text: '#FFFFFF', navBg: '#111111', navText: '#FF69B4', cardBg: '#1A1A1A', accent: '#FF69B4', heroText: '#FFFFFF', inputBg: '#333333', border: '#333333' }
};

const useIsMobile = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width < 768;
};

const safeGetItem = (key) => { try { return localStorage.getItem(key); } catch (e) { return null; } };
const safeSetItem = (key, val) => { try { localStorage.setItem(key, val); } catch (e) {} };
const safeClear = () => { try { localStorage.clear(); } catch (e) {} };

function HeaderTitle({ isDarkMode, isMobile }) {
  const [currentFont, setCurrentFont] = useState('Arial');
  useEffect(() => { const timer = setTimeout(() => { setCurrentFont("'Arial Black', 'Verdana', sans-serif"); }, 100); return () => clearTimeout(timer); }, []);
  
  return (
    <h1 style={{ 
      fontFamily: currentFont, 
      fontSize: isMobile ? '1.2rem' : '2rem', 
      margin: '0 0 0 10px', whiteSpace: 'nowrap', transition: 'all 0.5s ease', fontWeight: 'bold', 
      background: isDarkMode ? 'linear-gradient(90deg, #FF1493, #FF69B4, #FFC0CB, #FF1493)' : 'linear-gradient(90deg, #000000, #434343, #B0BEC5, #000000)', 
      backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmerMove 3s linear infinite', display: 'inline-block' 
    }}>
      {isMobile ? "Aishu's Pastry" : "AISHU'S PASTRY PANTRY"}
    </h1>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(() => !safeGetItem('introPlayed'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!safeGetItem('token'));
  const [userRole, setUserRole] = useState(() => safeGetItem('userRole') || 'guest');
  const [cart, setCart] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); 
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mobile Notice State
  const [showMobileNotice, setShowMobileNotice] = useState(false);
  
  const isMobile = useIsMobile(); 
  const currentTheme = darkMode ? 'dark' : 'light';
  const colors = theme[currentTheme];

  useEffect(() => { document.body.style.backgroundColor = colors.bg; document.body.style.color = colors.text; }, [colors]);

  // Logic: Show notice if Mobile + Logged In + Not seen yet
  useEffect(() => {
    if (isAuthenticated && isMobile) {
        const hasSeenNotice = sessionStorage.getItem('seenMobileNotice');
        if (!hasSeenNotice) {
            setShowMobileNotice(true);
        }
    }
  }, [isAuthenticated, isMobile]);

  const handleCloseNotice = () => {
      sessionStorage.setItem('seenMobileNotice', 'true');
      setShowMobileNotice(false);
  };

  const handleLogin = (role) => { setUserRole(role); setIsAuthenticated(true); };
  const handleLogout = () => { if(window.confirm("Logout?")) { safeClear(); setIsAuthenticated(false); setUserRole('guest'); setShowIntro(true); } };
  const addToCart = (product) => { setCart([...cart, product]); alert(`${product.name} added!`); };
  const clearCart = () => { setCart([]); };

  // --- MOBILE NOTICE POPUP ---
  const MobileNoticeModal = () => (
    <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.9)', zIndex: 99999,
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px',
        backdropFilter: 'blur(5px)'
    }}>
        <div style={{
            background: colors.cardBg, color: colors.text,
            padding: '30px', borderRadius: '20px', textAlign: 'center',
            border: `2px solid ${colors.accent}`,
            boxShadow: '0 0 40px rgba(0,0,0,0.8)',
            maxWidth: '350px',
            position: 'relative',
            animation: 'popIn 0.3s ease-out'
        }}>
            
            {/* 1. CLOSE ICON (Top Right) */}
            <button onClick={handleCloseNotice} style={{position:'absolute', top:'10px', right:'10px', background:'none', border:'none', color:colors.text, fontSize:'18px', cursor:'pointer'}}>
                <FaTimes />
            </button>

            <FaInfoCircle size={40} color={colors.accent} style={{marginBottom:'15px'}} />
            <h3 style={{marginBottom:'10px', fontFamily:'serif'}}>Development Notice</h3>
            <p style={{fontSize:'13px', lineHeight:'1.5', opacity:0.8, marginBottom:'20px'}}>
                This website is optimized for PC/Laptop. <br/>
                For the best mobile experience, use our <strong>AI WhatsApp Assistant</strong> to order instantly! 🤖
            </p>
            
            {/* 2. WHATSAPP AI AGENT BUTTON */}
            <a 
                // ⚠️ REPLACE '917358513173' WITH YOUR ACTUAL WHATSAPP BUSINESS NUMBER
                href="https://wa.me/917358513173?text=Hi!%20I%20want%20to%20order%20using%20the%20AI%20Assistant.%20🤖"
                target="_blank"
                rel="noreferrer"
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    width: '100%', padding: '12px', 
                    background: '#25D366', color: 'white', textDecoration:'none',
                    border: 'none', borderRadius: '30px', 
                    fontWeight: 'bold', fontSize: '15px', cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
                    marginBottom: '15px'
                }}
            >
                <FaWhatsapp size={20} /> Order via WhatsApp AI
            </a>

            {/* 3. CLOSE TEXT (Bottom) */}
            <p 
                onClick={handleCloseNotice}
                style={{
                    fontSize:'12px', textDecoration:'underline', cursor:'pointer', opacity:0.6, marginTop:'10px'
                }}
            >
                Continue to Website (Beta View)
            </p>

            <p style={{fontSize:'12px', fontStyle:'italic', marginTop:'20px', color:colors.accent}}>
                Warm regards,<br/><strong>PASTRY PANTRY</strong>
            </p>
        </div>
        <style>{`@keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );

  if (showIntro) return <Intro onFinish={() => { safeSetItem('introPlayed', 'true'); setShowIntro(false); }} />;
  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div style={{ fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: colors.bg, color: colors.text, minHeight: '100vh', display:'flex', flexDirection:'column' }}>
      
      {showMobileNotice && <MobileNoticeModal />}

      <nav style={{ padding: isMobile ? '10px 15px' : '10px 30px', backgroundColor: colors.navBg, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100, borderBottom: `2px solid ${colors.accent}` }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/"><img src={logo} alt="Logo" style={{ height: isMobile ? '40px' : '70px', borderRadius: '50%', border: `2px solid ${colors.accent}`, backgroundColor: colors.bg }} /></Link>
          <HeaderTitle isDarkMode={darkMode} isMobile={isMobile} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '15px' : '20px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <FaSearch style={{ position: 'absolute', left: '10px', color: colors.accent }} />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '8px 10px 8px 35px', borderRadius: '20px', border: `1px solid ${colors.accent}`, outline: 'none', backgroundColor: colors.inputBg, color: colors.text, fontWeight: 'bold', width: isMobile ? '100px' : '150px', fontSize: isMobile ? '12px' : '14px' }} />
          </div>
          {!isMobile && (
            <>
              <Link to="/" style={{ color: colors.text, textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
              <Link to="/kitchen" style={{ color: colors.text, textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}><FaUtensils /> Kitchen</Link>
              <Link to="/cart" style={{ color: colors.text, textDecoration: 'none', fontWeight: 'bold' }}>🛒 ({cart.length})</Link>
              <Link to="/profile" style={{ color: colors.text, fontSize: '20px' }}><FaUser /></Link>
              <Link to="/magic" style={{ color: colors.text, fontSize: '22px' }}><FaCube /></Link>
            </>
          )}
          {isMobile && (
             <Link to="/cart" style={{ color: colors.text, textDecoration: 'none', fontWeight: 'bold', position:'relative' }}>
               <FaShoppingCart size={20} />
               <span style={{position:'absolute', top:'-8px', right:'-8px', background:'red', color:'white', borderRadius:'50%', fontSize:'10px', width:'15px', height:'15px', display:'flex', justifyContent:'center', alignItems:'center'}}>{cart.length}</span>
             </Link>
          )}
          <button onClick={() => setDarkMode(!darkMode)} style={{ background: 'none', border: 'none', color: colors.text, fontSize: '20px', cursor: 'pointer' }}>{darkMode ? <FaSun /> : <FaMoon />}</button>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: colors.text, fontSize: '20px', cursor: 'pointer' }}><FaBars /></button>
          {!isMobile && <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: colors.accent, fontSize: '20px', cursor: 'pointer' }}><FaSignOutAlt /></button>}
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} colors={colors} userRole={userRole} />

      <div style={{ flex: 1 }}> 
        <Routes>
          <Route path="/" element={<Shop addToCart={addToCart} colors={colors} searchTerm={searchTerm} />} />
          <Route path="/kitchen" element={<Kitchen addToCart={addToCart} colors={colors} searchTerm={searchTerm} />} />
          <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} colors={colors} />} />
          <Route path="/admin" element={userRole === 'admin' ? <Admin colors={colors} /> : <Navigate to="/" replace />} />
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={(idx) => setCart(cart.filter((_, i) => i !== idx))} clearCart={clearCart} colors={colors} />} />
          <Route path="/profile" element={<Profile colors={colors} />} />
          <Route path="/queries" element={<Queries colors={colors} />} />
          <Route path="/about" element={<About colors={colors} />} />
          <Route path="/contact" element={<Contact colors={colors} />} />
          <Route path="/help" element={<Help colors={colors} />} />
          <Route path="/magic" element={<MagicMode />} />
        </Routes>
      </div>
      <Footer colors={colors} />
    </div>
  );
}

export default App;