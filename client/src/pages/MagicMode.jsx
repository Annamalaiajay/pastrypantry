import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile({ colors }) {
  const [orders, setOrders] = useState([]);
  const [userName, setUserName] = useState("Guest");
  const [joinDate, setJoinDate] = useState(null);

  useEffect(() => {
    // 1. Get User Details from Local Storage
    const storedName = localStorage.getItem('userName');
    const storedDate = localStorage.getItem('userJoined');
    
    if (storedName) setUserName(storedName);
    if (storedDate) setJoinDate(new Date(storedDate));

    // 2. Fetch Orders
    axios.get('https://pastry-server.onrender.com/api/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  }, []);

  // --- LOGIC: CALCULATE MEMBERSHIP TIER ---
  const calculateTier = () => {
    if (!joinDate) return { label: "Guest", color: "#ccc" };

    // A. Check Age (Is account older than 30 days?)
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays <= 30) {
      return { label: "New User 🌱", color: "#4CAF50" }; // Green for New
    }

    // B. Calculate Spending (Only if older than 30 days)
    const totalSpent = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    if (totalSpent > 200) return { label: "Gold Member 🏆", color: "#FFD700" };
    if (totalSpent > 50) return { label: "Silver Member 🥈", color: "#C0C0C0" };
    return { label: "Bronze Member 🥉", color: "#CD7F32" };
  };

  const status = calculateTier();

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Helvetica, sans-serif', color: colors.text }}>
      
      {/* USER HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', paddingBottom: '20px', borderBottom: `2px solid ${colors.accent}` }}>
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '50%', 
          backgroundColor: status.color, // Circle matches status color
          color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', 
          fontSize: '30px', fontWeight: 'bold', textShadow: '0 2px 5px rgba(0,0,0,0.3)'
        }}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ margin: 0, textTransform: 'capitalize' }}>{userName}</h1>
          <p style={{ margin: '5px 0', opacity: 0.7 }}>Member since {joinDate ? joinDate.toLocaleDateString() : 'Recently'}</p>
          
          <span style={{ 
            backgroundColor: status.color, 
            color: status.label.includes("Gold") ? 'black' : 'white', 
            padding: '5px 15px', borderRadius: '15px', fontSize: '14px', fontWeight: 'bold',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}>
            {status.label}
          </span>
        </div>
      </div>

      {/* ORDER HISTORY */}
      <h2 style={{ marginBottom: '20px' }}>📜 Order History</h2>

      {orders.length === 0 ? (
        <p style={{ opacity: 0.6 }}>No orders yet. Your journey to Gold starts with the first brownie!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ 
              backgroundColor: colors.cardBg, padding: '20px', borderRadius: '10px', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderLeft: `5px solid ${colors.accent}`, color: colors.text
            }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold' }}>Order #{order._id.slice(-6).toUpperCase()}</span>
                <span style={{ 
                  backgroundColor: colors.bg, 
                  color: colors.accent,
                  padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold', fontSize: '12px',
                  border: `1px solid ${colors.accent}`
                }}>
                  {order.status || 'Baking...'} 🍪
                </span>
              </div>

              <div style={{ opacity: 0.8, fontSize: '14px', lineHeight: '1.6' }}>
                {order.items.map((item, idx) => (
                  <div key={idx}>• {item.productName} (${item.price})</div>
                ))}
              </div>

              <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: `1px dashed ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', opacity: 0.6 }}>Paid via {order.paymentMethod || 'COD'}</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: colors.accent }}>Total: ${order.totalPrice}</span>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;