import React from 'react';

function Contact({ colors }) {
  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Georgia, serif', color: colors.text }}>
      {/* PINK GRADIENT HEADING */}
      <h1 style={{ 
        textAlign: 'center', 
        fontSize: '2.5rem', 
        marginBottom: '10px',
        // Pink Gradient Styles
        background: 'linear-gradient(to right, #FF1493, #FF69B4, #FFC0CB)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold'
      }}>
        AISHU'S PASTRY PANTRY
      </h1>
      
      <h2 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '20px', color: colors.accent }}>
        Contact Us
      </h2>

      <p style={{ textAlign: 'center', marginBottom: '40px', fontSize: '1.1rem' }}>Have a sweet question? We are here to help!</p>
      
      <div style={{ backgroundColor: colors.cardBg, padding: '30px', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', color: colors.text, border: `1px solid ${colors.border}` }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Your Name</label>
            <input type="text" placeholder="e.g. Aishu" style={{ ...inputStyle, backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }} />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Message</label>
            <textarea placeholder="Type here..." rows="5" style={{ ...inputStyle, backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }}></textarea>
          </div>
          <button style={{ padding: '15px', backgroundColor: colors.accent, color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>
            Send Message
          </button>
        </form>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h3 style={{ color: colors.accent }}>📍 Visit Our Kitchen</h3>
        <p>123 Brownie Lane</p>
      </div>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', outline: 'none' };

export default Contact;