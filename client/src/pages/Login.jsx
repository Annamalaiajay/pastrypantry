import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock, FaUser, FaKey, FaArrowLeft, FaWhatsapp, FaInfoCircle, FaTimes } from 'react-icons/fa';

// ✅ IMPORT LOCAL VIDEO (Make sure intro.mp4 exists in src/assets/)
import introVideo from '../assets/intro.mp4'; 

function Login({ onLogin }) {
  const [step, setStep] = useState(1); 
  const [isRegistering, setIsRegistering] = useState(false); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); 
  
  // NOTICE STATE
  const [showNotice, setShowNotice] = useState(true);

  const showMessage = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async () => {
    if (!email || !password) return showMessage('error', "Please fill in all fields.");
    setLoading(true);
    try {
      const res = await axios.post('https://pastry-server.onrender.com/api/auth/login', { email, password });
      const { token, user } = res.data;
      completeLogin(token, user);
    } catch (err) {
      showMessage('error', err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterInit = async () => {
    if (!email || !name || !password) return showMessage('error', "Please fill in all fields.");
    setLoading(true);
    try {
      await axios.post('https://pastry-server.onrender.com/api/auth/register-init', { email });
      showMessage('success', `OTP sent to ${email}`);
      setStep(2); 
    } catch (err) {
      showMessage('error', err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterComplete = async () => {
    if (otp.length < 4) return showMessage('error', "Enter the 4-digit code.");
    setLoading(true);
    try {
      const res = await axios.post('https://pastry-server.onrender.com/api/auth/register-complete', { email, otp, name, password });
      const { token, user } = res.data;
      showMessage('success', "Account Created Successfully!");
      setTimeout(() => completeLogin(token, user), 1000); 
    } catch (err) {
      showMessage('error', "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const completeLogin = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userName', user.name || user.email.split('@')[0]);
    onLogin(user.role);
  };

  // --- BETA NOTICE MODAL COMPONENT ---
  const BetaNoticeModal = () => (
    <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.85)', zIndex: 99999,
        display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px',
        backdropFilter: 'blur(8px)'
    }}>
        <div style={{
            background: '#ffffff', color: '#000',
            padding: '30px', borderRadius: '20px', textAlign: 'center',
            border: '3px solid #FF69B4',
            boxShadow: '0 0 50px rgba(255, 105, 180, 0.6)',
            maxWidth: '400px', width: '100%',
            position: 'relative',
            animation: 'popIn 0.4s ease-out'
        }}>
            
            {/* CLOSE BUTTON */}
            <button onClick={() => setShowNotice(false)} style={{position:'absolute', top:'10px', right:'10px', background:'none', border:'none', color:'#333', fontSize:'20px', cursor:'pointer'}}>
                <FaTimes />
            </button>

            <FaInfoCircle size={50} color="#FF69B4" style={{marginBottom:'15px'}} />
            
            <h2 style={{marginBottom:'10px', fontFamily:'serif', fontWeight:'bold'}}>Welcome to Pastry Pantry!</h2>
            
            <p style={{fontSize:'16px', lineHeight:'1.5', opacity:0.8, marginBottom:'20px', background:'#f9f9f9', padding:'10px', borderRadius:'10px'}}>
                🚧 <strong>Beta Version</strong><br/>
                This website is currently in <strong>Development & Testing</strong> mode. Some features might be limited.
            </p>
            
            <p style={{fontSize:'14px', marginBottom:'15px', fontWeight:'bold'}}>
                Want to place an order instantly?
            </p>

            {/* WHATSAPP ORDER BUTTON */}
            <a 
                href="https://wa.me/918015556082?text=Hi!%20I%20visited%20your%20website%20and%20want%20to%20place%20an%20order.%20🍪"
                target="_blank"
                rel="noreferrer"
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    width: '100%', padding: '15px', 
                    background: '#25D366', color: 'white', textDecoration:'none',
                    border: 'none', borderRadius: '30px', 
                    fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
                    boxShadow: '0 5px 15px rgba(37, 211, 102, 0.4)',
                    marginBottom: '10px',
                    transition: 'transform 0.2s'
                }}
            >
                <FaWhatsapp size={24} /> Order via WhatsApp
            </a>

            <button 
                onClick={() => setShowNotice(false)}
                style={{
                    background: 'none', border: 'none', color: '#555', 
                    textDecoration: 'underline', cursor: 'pointer', fontSize: '13px', marginTop: '10px'
                }}
            >
                Continue to Login
            </button>
        </div>
        <style>{`@keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', overflow:'hidden' }}>
      
      {/* SHOW NOTICE AUTOMATICALLY */}
      {showNotice && <BetaNoticeModal />}

      {/* --- LOCAL VIDEO BACKGROUND --- */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        src={introVideo} 
        style={{ 
            position: 'absolute', 
            top: 0, left: 0, width: '100%', height: '100%', 
            objectFit: 'cover', 
            opacity: 0.8, 
            zIndex: 0,
            filter: 'blur(8px)' 
        }} 
      />

      {/* --- DARK OVERLAY --- */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)', zIndex: 1 }}></div>

      {/* --- LOGIN CARD --- */}
      <div style={{ 
          position: 'relative', 
          zIndex: 10, 
          background: 'rgba(0, 0, 0, 0.65)', 
          padding: '40px', 
          borderRadius: '20px', 
          border: '2px solid #FF69B4', 
          textAlign: 'center', 
          width: '380px', 
          boxShadow: '0 0 40px rgba(255, 105, 180, 0.4)', 
          backdropFilter: 'blur(5px)'
      }}>
        
        <h1 style={{ color: '#FF69B4', marginBottom: '10px', fontFamily: 'sans-serif' }}>
          {step === 2 ? 'Verify Email' : (isRegistering ? 'Create Account' : 'Welcome Back')}
        </h1>

        {notification && (
          <div style={{ padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold', backgroundColor: notification.type === 'success' ? '#d4edda' : '#f8d7da', color: notification.type === 'success' ? '#155724' : '#721c24', border: notification.type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb' }}>
            {notification.type === 'success' ? '✅ ' : '⚠️ '} {notification.text}
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {isRegistering && (
              <div style={inputContainer}>
                <FaUser style={icon} />
                <input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={input} />
              </div>
            )}

            <div style={inputContainer}>
              <FaEnvelope style={icon} />
              <input placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} style={input} />
            </div>

            <div style={inputContainer}>
              <FaLock style={icon} />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={input} />
            </div>

            <button onClick={isRegistering ? handleRegisterInit : handleLogin} style={btnPink} disabled={loading}>
              {loading ? "Processing..." : (isRegistering ? "Verify & Register" : "Login")}
            </button>

            <p style={{ color: '#ccc', fontSize: '14px', marginTop: '10px' }}>
              {isRegistering ? "Already have an account?" : "New to Pastry Pantry?"}
              <span onClick={() => { setIsRegistering(!isRegistering); setNotification(null); }} style={linkStyle}>
                {isRegistering ? " Login" : " Sign Up"}
              </span>
            </p>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{color:'#fff', fontSize:'14px'}}>Enter the code sent to <strong>{email}</strong></p>
            <div style={inputContainer}>
              <FaKey style={icon} />
              <input placeholder="4-Digit OTP" value={otp} onChange={e => setOtp(e.target.value)} style={input} maxLength="4" />
            </div>
            <button onClick={handleRegisterComplete} style={btnPink} disabled={loading}>
              {loading ? "Verifying..." : "Confirm & Login"}
            </button>
            <div onClick={() => setStep(1)} style={{ ...linkStyle, marginTop:'10px', display:'flex', alignItems:'center', justifyContent:'center', gap:'5px' }}>
              <FaArrowLeft /> Back
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const inputContainer = { display: 'flex', alignItems: 'center', backgroundColor: '#222', borderRadius: '10px', border: '1px solid #FF69B4', padding: '0 15px' };
const icon = { color: '#FF69B4', fontSize: '18px' };
const input = { width: '100%', padding: '15px', backgroundColor: 'transparent', border: 'none', color: 'white', fontSize: '16px', outline: 'none' };
const btnPink = { width: '100%', padding: '15px', backgroundColor: '#FF69B4', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '5px', transition: '0.3s' };
const linkStyle = { color: '#FF69B4', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px', textDecoration: 'underline' };

export default Login;