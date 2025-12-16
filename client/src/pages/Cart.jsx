import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react'; 
import { FaClock, FaCheckCircle } from 'react-icons/fa';

function Cart({ cart, removeFromCart, clearCart, colors }) { 
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(null); 
  const [user, setUser] = useState(null); 
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); 
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showBill, setShowBill] = useState(false); 
  const [lastOrderTotal, setLastOrderTotal] = useState(0); 
  const [lastOrderItems, setLastOrderItems] = useState([]);
  
  const SHOP_UPI_ID = "7358513173@kotak"; 

  useEffect(() => { const name = localStorage.getItem('userName'); if (name) setUser(name); }, []);

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) { timer = setInterval(() => { setTimeLeft((prev) => prev - 1); }, 1000); }
    else if (timeLeft === 0) { alert("Session Expired"); setIsTimerRunning(false); setPaymentMethod(null); setTimeLeft(300); }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' : ''}${seconds % 60}`;
  const currentTotal = cart.reduce((sum, item) => sum + item.price, 0);
  const upiString = `upi://pay?pa=${SHOP_UPI_ID}&pn=AishuPastry&am=${currentTotal}&cu=INR&tn=OrderPayment`;

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
    if (method === 'UPI') { setIsTimerRunning(true); setTimeLeft(300); } else { setIsTimerRunning(false); }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('screenshot', file);
    try {
      const res = await axios.post('https://pastry-server.onrender.com/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setScreenshotUrl(res.data.imageUrl);
      setUploading(false);
    } catch (err) { alert("Upload failed"); setUploading(false); }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Cart empty");
    if (!paymentMethod) return alert("⚠️ Select Payment Method");
    if (paymentMethod === 'UPI' && !screenshotUrl) return alert("⚠️ Upload Screenshot");

    setLastOrderTotal(currentTotal);
    setLastOrderItems([...cart]); 

    try {
      const orderData = {
        items: cart.map(item => ({ productName: item.name, price: item.price })),
        totalPrice: currentTotal,
        paymentMethod: paymentMethod,
        customerName: user || "Guest",
        paymentDetails: paymentMethod === 'UPI' ? { screenshotUrl: screenshotUrl } : {}
      };
      await axios.post('https://pastry-server.onrender.com/api/orders', orderData);
      if (typeof clearCart === 'function') clearCart(); 
      setTimeout(() => setShowBill(true), 500); 
    } catch (error) { alert("Error placing order."); }
  };

  // --- RESPONSIVE RECEIPT MODAL ---
  const ReceiptModal = () => (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ 
          width: '90%', maxWidth: '360px', // Responsive Width
          backgroundColor: '#fffaf0', padding: '0', borderRadius: '5px', 
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)', 
          animation: 'popIn 0.4s ease-out forwards', 
          fontFamily: "'Courier New', monospace", color: '#333' 
      }}>
        <div style={{ padding: '20px', borderBottom: '2px dashed #555', textAlign: 'center' }}>
          <h2 style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>AISHU'S PASTRY</h2>
          <p style={{ margin: '5px 0 0', fontSize: '12px' }}>BILL RECEIPT</p>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '15px' }}>
            <span><strong>Customer:</strong> {user}</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div style={{ maxHeight: '120px', overflowY: 'auto', borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
            {lastOrderItems.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                <span>{item.name}</span><span>₹{item.price}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', marginTop: '5px' }}>
            <span>TOTAL</span><span>₹{lastOrderTotal}</span>
          </div>
          <div style={{ position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%) rotate(-15deg)', border: '4px dashed #D32F2F', color: '#D32F2F', borderRadius: '10px', padding: '5px 20px', fontWeight: 'bold', fontSize: '20px', opacity: 0.7 }}>PENDING</div>
        </div>
        <button onClick={() => navigate('/profile')} style={{ width: '100%', padding: '15px', background: '#333', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>Done (Go to Profile)</button>
      </div>
      <style>{`@keyframes popIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );

  const btnStyle = (sel) => ({ flex:1, padding:'15px', border: sel?`2px solid ${colors.accent}`:`1px solid ${colors.border}`, borderRadius:'8px', background: sel?`${colors.accent}20`:'transparent', fontWeight: sel?'bold':'normal', color: colors.text, cursor:'pointer' });

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: colors.text, fontFamily: 'Helvetica' }}>
      {showBill && <ReceiptModal />}
      <h2 style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px' }}>🛒 Shopping Cart</h2>
      {cart.length === 0 && !showBill ? (
        <div style={{textAlign:'center', padding:'50px'}}><p>Cart is empty.</p><button onClick={()=>navigate('/')} style={{marginTop:'20px', padding:'10px 20px', background:colors.accent, color:'white', border:'none', borderRadius:'5px'}}>Menu</button></div>
      ) : (
        <div>
          {cart.map((item, idx) => (
             <div key={idx} style={{display:'flex', justifyContent:'space-between', padding:'15px', background:colors.cardBg, marginBottom:'10px', borderRadius:'8px', border:`1px solid ${colors.border}`}}>
               <span style={{fontWeight:'bold'}}>{item.name}</span><div><span>₹{item.price}</span> <button onClick={()=>removeFromCart(idx)} style={{color:'red', border:'none', background:'none', cursor:'pointer'}}>X</button></div>
             </div>
          ))}
          <h2 style={{textAlign:'right', marginTop:'20px'}}>Total: ₹{currentTotal}</h2>
          <div style={{ display: 'flex', gap: '15px', margin: '20px 0' }}>
            <div onClick={() => setPaymentMethod('COD')} style={btnStyle(paymentMethod === 'COD')}>Cash (COD)</div>
            <div onClick={() => { setPaymentMethod('UPI'); setTimeLeft(300); setIsTimerRunning(true); }} style={btnStyle(paymentMethod === 'UPI')}>UPI / QR</div>
          </div>
          {paymentMethod === 'UPI' && (
             <div style={{ textAlign:'center', background: colors.cardBg, padding:'25px', borderRadius:'15px', border:`2px solid ${colors.accent}` }}>
               <div style={{background:'white', padding:'10px', display:'inline-block', borderRadius:'10px'}}><QRCodeCanvas value={upiString} size={160} /></div>
               <p style={{fontSize:'12px', marginTop:'10px', color:colors.text}}>Scan & Pay: <strong>{SHOP_UPI_ID}</strong></p>
               <div style={{display:'flex', justifyContent:'center', gap:'5px', color:colors.accent, margin:'10px 0'}}><FaClock /> <b>{formatTime(timeLeft)}</b></div>
               <div style={{background:colors.bg, padding:'15px', borderRadius:'10px', textAlign:'left'}}>
                 <p style={{fontSize:'13px', fontWeight:'bold', marginBottom:'5px'}}>Upload Screenshot *</p>
                 <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <input type="file" onChange={handleFileChange} accept="image/*" style={{fontSize:'12px', color:colors.text, width:'100%'}} />
                    {uploading && <span style={{fontSize:'12px', color:'blue'}}>Uploading...</span>}
                    {screenshotUrl && <FaCheckCircle color="green" />}
                 </div>
               </div>
             </div>
          )}
          <button onClick={handleCheckout} style={{width:'100%', padding:'15px', background:colors.accent, color:'white', fontSize:'18px', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', marginTop:'20px', opacity: (paymentMethod==='UPI' && !screenshotUrl) ? 0.6 : 1}}>Place Order</button>
        </div>
      )}
    </div>
  );
}

export default Cart;