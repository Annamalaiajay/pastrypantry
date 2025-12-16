import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Kitchen({ addToCart, colors, searchTerm }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://pastry-server.onrender.com/api/products')
      .then(res => setProducts(res.data))
      .catch(console.error);
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '40px', backgroundColor: colors.bg, minHeight: '100vh', color: colors.text }}>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '10px', fontFamily: 'Georgia, serif' }}>The Full Kitchen</h1>
      <p style={{ textAlign: 'center', marginBottom: '40px', color: colors.text, opacity: 0.8 }}>
        Every batch, every flavor, baked with love. Click any item for details!
      </p>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {filteredProducts.map(p => {
          // SAFEGUARD: Handle new array structure vs old string structure if DB wasn't fully cleared
          const mainImage = p.images && p.images.length > 0 ? p.images[0] : p.image;

          return (
            <div key={p._id} style={{ 
              background: colors.cardBg, borderRadius: '15px', width: '280px', color: colors.text,
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)', overflow: 'hidden', border: `2px solid ${colors.accent}`,
              transition: 'transform 0.2s', display: 'flex', flexDirection: 'column'
            }}>
              
              {/* CLICKABLE LINK TO DETAILS PAGE */}
              <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <img 
                  src={mainImage} 
                  alt={p.name} 
                  style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer' }} 
                />
                
                <div style={{ padding: '20px 20px 5px 20px', textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '1.4rem' }}>{p.name}</h3>
                  
                  {/* Show "Signature" badge if applicable */}
                  {p.isSignature && (
                    <span style={{ fontSize: '11px', background: '#FFD700', color: 'black', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                      ⭐ Signature
                    </span>
                  )}
                  
                  <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.7, fontStyle: 'italic' }}>
                    View Details & Reviews
                  </p>
                  
                  <div style={{ fontWeight: 'bold', fontSize: '20px', color: colors.accent, marginTop: '5px' }}>
                    ₹{p.price}
                  </div>
                </div>
              </Link>

              {/* ADD TO CART BUTTON (Separate from Link) */}
              <div style={{ padding: '15px 20px 20px 20px', textAlign: 'center' }}>
                <button 
                  onClick={() => addToCart(p)} 
                  style={{ 
                    width: '100%', padding: '10px 20px', background: colors.accent, 
                    color: 'white', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold',
                    transition: '0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = '0.9'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Kitchen;