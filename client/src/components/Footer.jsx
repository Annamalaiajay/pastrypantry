import React, { useState, useEffect } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaWhatsapp, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// --- 3D ROTATING CUBE COMPONENT (Pure CSS) ---
const RotatingCube = ({ accent }) => (
  <div className="cube-container">
    <div className="cube">
      <div className="face front" style={{borderColor: accent}}>A</div>
      <div className="face back" style={{borderColor: accent}}>P</div>
      <div className="face right" style={{borderColor: accent}}>✨</div>
      <div className="face left" style={{borderColor: accent}}>🍪</div>
      <div className="face top" style={{borderColor: accent}}></div>
      <div className="face bottom" style={{borderColor: accent}}></div>
    </div>
    <style>{`
      .cube-container { width: 30px; height: 30px; perspective: 400px; margin-right: 15px; }
      .cube { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; animation: spinCube 5s infinite linear; }
      .face { position: absolute; width: 30px; height: 30px; background: rgba(255,255,255,0.1); border: 1px solid; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: inherit; }
      .front  { transform: rotateY(0deg) translateZ(15px); }
      .back   { transform: rotateY(180deg) translateZ(15px); }
      .right  { transform: rotateY(90deg) translateZ(15px); }
      .left   { transform: rotateY(-90deg) translateZ(15px); }
      .top    { transform: rotateX(90deg) translateZ(15px); }
      .bottom { transform: rotateX(-90deg) translateZ(15px); }
      @keyframes spinCube { from { transform: rotateX(0deg) rotateY(0deg); } to { transform: rotateX(360deg) rotateY(360deg); } }
    `}</style>
  </div>
);

const Footer = ({ colors }) => {
  const isDarkMode = colors.bg === '#000000';
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const isMobile = width < 768;

  // --- COMPACT STYLES ---
  const footerContainerStyle = {
    position: 'relative',
    marginTop: '30px', // Reduced margin
    padding: isMobile ? '20px 10px' : '30px 20px 10px', // Reduced padding
    backgroundColor: isDarkMode ? '#0a0a0a' : '#f0f0f0',
    color: colors.text,
    borderTop: `1px solid ${colors.border}`,
    overflow: 'hidden',
    perspective: isMobile ? 'none' : '1000px', // Enable 3D space
    minHeight: 'auto'
  };

  const card3DStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    maxWidth: '900px', // More compact width
    margin: '0 auto',
    background: isDarkMode ? 'rgba(20,20,20,0.6)' : 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(8px)',
    borderRadius: '15px',
    padding: isMobile ? '15px' : '25px', // Tighter padding
    boxShadow: isDarkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.05)',
    
    // 3D TILT EFFECT (Desktop Only)
    transform: isMobile ? 'none' : 'rotateX(5deg)',
    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
    transformStyle: 'preserve-3d',
    
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '20px' : '0',
    alignItems: 'flex-start'
  };

  const columnStyle = {
    flex: '1 1 200px',
    margin: isMobile ? '0' : '0 10px',
    transform: isMobile ? 'none' : 'translateZ(20px)', // Pop out effect
    textAlign: isMobile ? 'center' : 'left'
  };

  const linkStyle = {
    display: 'flex', alignItems: 'center', gap: '8px',
    marginBottom: '6px', color: colors.text, textDecoration: 'none', opacity: 0.7,
    fontSize: '13px',
    justifyContent: isMobile ? 'center' : 'flex-start',
    transition: 'all 0.2s',
    cursor: 'pointer'
  };

  const headerStyle = {
    fontSize: '1rem', 
    marginBottom: '10px', 
    fontWeight:'bold', 
    textTransform:'uppercase', 
    letterSpacing:'1px',
    color: colors.text
  };

  return (
    <footer style={footerContainerStyle}>
      
      {/* 3D CARD */}
      <div 
        className="footer-card"
        style={card3DStyle}
        onMouseEnter={(e) => { if(!isMobile) {
            e.currentTarget.style.transform = 'rotateX(0deg) scale(1.02)';
            e.currentTarget.style.boxShadow = `0 20px 40px ${colors.accent}20`;
        }}}
        onMouseLeave={(e) => { if(!isMobile) {
            e.currentTarget.style.transform = 'rotateX(5deg) scale(1)';
            e.currentTarget.style.boxShadow = 'none';
        }}}
      >
        
        {/* COLUMN 1: BRAND + 3D CUBE */}
        <div style={columnStyle}>
          <div style={{display:'flex', alignItems:'center', justifyContent: isMobile ? 'center' : 'flex-start', marginBottom:'10px'}}>
            <RotatingCube accent={colors.accent} />
            <h2 style={{fontSize: '1.4rem', fontFamily: 'serif', margin:0, color: colors.accent, fontWeight:'bold'}}>
              Aishu's Pastry
            </h2>
          </div>
          <p style={{ lineHeight: '1.4', opacity: 0.6, fontSize:'12px', maxWidth: isMobile?'100%':'200px' }}>
            Baked fresh daily. Experience the magic of sweetness.
          </p>
          <div style={{ marginTop: '15px', display:'flex', gap:'15px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <FaInstagram size={18} color={colors.accent} style={{cursor:'pointer'}} />
            <FaFacebook size={18} color={colors.accent} style={{cursor:'pointer'}} />
            <FaWhatsapp size={18} color={colors.accent} style={{cursor:'pointer'}} />
          </div>
        </div>

        {/* COLUMN 2: QUICK LINKS */}
        <div style={columnStyle}>
          <h3 style={headerStyle}>Explore</h3>
          <Link to="/" style={linkStyle}>🏠 Home</Link>
          <Link to="/kitchen" style={linkStyle}>🍪 Menu</Link>
          <Link to="/about" style={linkStyle}>👩‍🍳 Baker</Link>
        </div>

        {/* COLUMN 3: CONTACT */}
        <div style={columnStyle}>
          <h3 style={headerStyle}>Contact</h3>
          <a href="tel:7358513173" style={linkStyle}><FaPhone size={12} color={colors.accent} /> +91 7358513173</a>
          <a href="mailto:dsharmiaishu17@gmail.com" style={linkStyle}><FaEnvelope size={12} color={colors.accent} /> Email Us</a>
          <div style={linkStyle}><FaMapMarkerAlt size={12} color={colors.accent} /> Chennai, India</div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <div style={{ textAlign: 'center', marginTop: '20px', opacity: 0.4, fontSize: '10px' }}>
        <p>© {new Date().getFullYear()} Aishu's Pastry Pantry. All Rights Reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;