import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

// ✅ RESTORED: Using your local asset image
import mascotImg from '../assets/image_11.png'; 

const ChatMascot = ({ themeMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  // --- STYLES ---
  const containerStyle = {
    position: 'fixed', // Fixed to screen
    bottom: '0',       // Flush bottom
    left: '0',         // Flush left
    zIndex: 9999,      
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    // Adds a nice shadow behind the image
    filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4))' 
  };

  const imageStyle = {
    width: '120px',    // Adjust size here if needed
    height: 'auto',
    cursor: 'pointer',
    transformOrigin: 'bottom center',
    animation: 'floatBot 4s ease-in-out infinite', // Moving Animation
    marginLeft: '-10px', // Pull tight to left edge
    marginBottom: '-5px', // Pull tight to bottom edge
    transition: 'transform 0.2s'
  };

  const bubbleStyle = {
    background: themeMode === 'dark' ? '#333' : '#fff',
    color: themeMode === 'dark' ? '#fff' : '#000',
    padding: '15px',
    borderRadius: '15px 15px 15px 0', 
    maxWidth: '220px',
    marginBottom: '-10px', // Connects visually to the head
    marginLeft: '30px',    // Push bubble slightly right
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    display: isOpen ? 'block' : 'none',
    border: `2px solid ${themeMode === 'dark' ? '#FF69B4' : '#000'}`,
    animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    position: 'relative',
    zIndex: 10000
  };

  const closeBtnStyle = {
    float: 'right', cursor: 'pointer', opacity: 0.6, fontSize: '12px'
  };

  return (
    <div style={containerStyle}>
      
      {/* CHAT BUBBLE */}
      <div style={bubbleStyle}>
        <div style={{marginBottom:'5px'}}>
          <strong>Aishu's Helper</strong>
          <span onClick={() => setIsOpen(false)} style={closeBtnStyle}><FaTimes /></span>
        </div>
        <p style={{fontSize:'13px', margin:0, lineHeight:'1.4'}}>
          Hi! 👋 Need help with an order? <br/>
          <a href="/help" style={{color:'#FF69B4', fontWeight:'bold', textDecoration:'none'}}>Chat with us!</a>
        </p>
      </div>

      {/* AVATAR IMAGE (Using your local file) */}
      <img 
        src={mascotImg} 
        alt="Help Bot"
        onClick={() => setIsOpen(!isOpen)} 
        style={imageStyle}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      />

      {/* ANIMATIONS */}
      <style>{`
        @keyframes floatBot {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.5) translate(-20px, 20px); }
          to { opacity: 1; transform: scale(1) translate(0, 0); }
        }
      `}</style>
    </div>
  );
};

export default ChatMascot;