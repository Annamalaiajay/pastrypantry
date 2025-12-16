import React from 'react';
import { FaTimes, FaInfoCircle, FaPhone, FaQuestionCircle, FaHeadset, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 

function Sidebar({ isOpen, onClose, colors, userRole }) { // <--- Receiving userRole
  const navigate = useNavigate(); 

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    navigate(path); 
    onClose();      
  };

  // Safe fallback for colors
  const bg = colors ? colors.bg : '#fff';
  const text = colors ? colors.text : '#000';
  const accent = colors ? colors.accent : 'red';
  const border = colors ? colors.border : '#ccc';

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, 
      height: '100vh', width: '300px', 
      backgroundColor: bg,
      color: text,
      boxShadow: '-5px 0 15px rgba(0,0,0,0.2)',
      padding: '20px', zIndex: 1000,
      transition: 'transform 0.3s ease-in-out',
      borderLeft: `4px solid ${accent}`
    }}>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: text, fontSize: '24px', cursor: 'pointer' }}>
          <FaTimes />
        </button>
      </div>

      <h2 style={{ borderBottom: `1px solid ${text}`, paddingBottom: '10px', marginTop: '0', color: accent }}>Menu</h2>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
        
        <li style={{...liStyle, borderBottom: `1px solid ${border}`}} onClick={() => handleNavigate('/about')}>
          <FaInfoCircle style={{ marginRight: '15px', color: accent }} /> About Us
        </li>

        <li style={{...liStyle, borderBottom: `1px solid ${border}`}} onClick={() => handleNavigate('/queries')}>
          <FaQuestionCircle style={{ marginRight: '15px', color: accent }} /> Queries
        </li>

        <li style={{...liStyle, borderBottom: `1px solid ${border}`}} onClick={() => handleNavigate('/contact')}>
          <FaPhone style={{ marginRight: '15px', color: accent }} /> Contact Us
        </li>

        <li style={{...liStyle, borderBottom: `1px solid ${border}`}} onClick={() => handleNavigate('/help')}>
          <FaHeadset style={{ marginRight: '15px', color: accent }} /> 24/7 Help
        </li>

        {/* --- SECURITY CHECK --- */}
        {/* ONLY show this if the logged-in person is the ADMIN */}
        {userRole === 'admin' && (
          <li style={{...liStyle, borderBottom: 'none', marginTop: '20px', fontWeight: 'bold'}} onClick={() => handleNavigate('/admin')}>
            <FaUser style={{ marginRight: '15px', color: '#FFD700' }} /> Admin Dashboard
          </li>
        )}

      </ul>

    </div>
  );
}

const liStyle = {
  padding: '15px 0', 
  cursor: 'pointer', 
  display: 'flex', 
  alignItems: 'center', 
  fontSize: '18px',
  transition: '0.2s'
};

export default Sidebar;