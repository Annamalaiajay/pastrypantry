import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

function ProductDetails({ addToCart, colors }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const userName = localStorage.getItem('userName') || "Anonymous";

  useEffect(() => {
    axios.get(`https://pastry-server.onrender.com/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://pastry-server.onrender.com/api/products/${id}/reviews`, { user: userName, rating: reviewForm.rating, comment: reviewForm.comment });
      setProduct(res.data); setReviewForm({ rating: 5, comment: '' });
    } catch (err) { alert("Error adding review"); }
  };

  if (!product) return <div>Loading...</div>;

  // USE THE REAL IMAGES ARRAY
  // If old product (string image), wrap in array to be safe
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', color: colors.text, fontFamily: 'Arial, sans-serif' }}>
      
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px', background: 'none', border: 'none', color: colors.accent, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '16px' }}> <FaArrowLeft /> Back </button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '50px' }}>
        
        {/* LEFT: IMAGE GALLERY */}
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ border: `1px solid ${colors.border}`, borderRadius: '10px', overflow: 'hidden', marginBottom: '15px' }}>
            <img src={images[activeImg]} alt={product.name} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {images.map((img, idx) => (
              <img key={idx} src={img} onClick={() => setActiveImg(idx)} alt="angle" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px', cursor: 'pointer', border: activeImg === idx ? `2px solid ${colors.accent}` : `1px solid ${colors.border}` }} />
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div style={{ flex: '1 1 400px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{product.name}</h1>
          {product.isSignature && <span style={{ background: '#FFD700', color: 'black', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold' }}>⭐ Signature Selection</span>}
          
          <h2 style={{ fontSize: '2rem', color: colors.accent, margin: '20px 0' }}>₹{product.price}</h2>
          <p style={{ lineHeight: '1.6', fontSize: '1.1rem', marginBottom: '30px', opacity: 0.9 }}>{product.description}</p>

          <button onClick={() => addToCart(product)} style={{ padding: '15px 40px', fontSize: '18px', fontWeight: 'bold', borderRadius: '30px', border: 'none', background: colors.accent, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}> <FaShoppingCart /> Add to Cart </button>
        </div>
      </div>
      
      {/* (Review Section remains the same as previous step, omitted for brevity but include it!) */}
    </div>
  );
}

export default ProductDetails;