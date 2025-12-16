import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaCrown, FaUtensils } from 'react-icons/fa';
import ChatMascot from '../components/ChatMascot'; 

// --- HELPER: DETECT MOBILE ---
const useIsMobile = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width < 768;
};

// --- 1. BANNER SLIDER ---
const BannerSlider = ({ colors }) => {
  const isMobile = useIsMobile();
  const defaultSlides = [
    { title: "The Perfect Brownie", subtitle: "Baked fresh. Delivered fast. 🚚" },
    { title: "Weekend Special Offer!", subtitle: "Buy 2 Get 1 FREE on all Signature Boxes! 🎉" }
  ];

  const [slides, setSlides] = useState(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [usingDefaults, setUsingDefaults] = useState(true);

  useEffect(() => {
    axios.get('https://pastry-server.onrender.com/api/posters')
      .then(res => { 
          if (res.data.length > 0) { setSlides(res.data); setUsingDefaults(false); } 
          else { setUsingDefaults(true); }
      })
      .catch(err => { console.error(err); setUsingDefaults(true); });
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return; 
    const timer = setInterval(() => { setCurrent(prev => (prev + 1) % slides.length); }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  const currentSlide = slides[current];
  const hasImage = currentSlide.imageUrl && currentSlide.imageUrl.length > 10;
  const hasVideo = currentSlide.videoUrl && currentSlide.videoUrl.length > 10;
  const layout = currentSlide.layoutType || 'cover';
  const isTextOnly = !usingDefaults && !hasImage && !hasVideo;
  const fontStyle = currentSlide.fontFamily || 'Georgia, serif';
  const cropPos = currentSlide.cropPosition || 'center center';

  const renderBackground = () => {
      if (!usingDefaults && hasVideo) {
         return <video key={currentSlide.videoUrl} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: layout, objectPosition: cropPos, filter: 'brightness(0.6)', animation: 'panMove 20s infinite alternate linear' }}><source src={currentSlide.videoUrl} type="video/mp4" /></video>;
      }
      if (!usingDefaults && hasImage) {
         return <img src={currentSlide.imageUrl} alt="Banner" style={{ width: '100%', height: '100%', objectFit: layout, objectPosition: cropPos, filter: 'brightness(0.6)', animation: 'panMove 20s infinite alternate linear' }} onError={(e) => { e.target.style.display='none'; }} />;
      }
      if (isTextOnly) {
          return <div style={{ width: '100%', height: '100%', backgroundColor: colors.bg, transition: 'background 0.3s ease' }}></div>;
      }
      return <video autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.4)', animation: 'panMove 20s infinite alternate linear' }}><source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" type="video/mp4" /></video>;
  };

  return (
    <div style={{ position: 'relative', height: isMobile ? '50vh' : '60vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: colors.bg }}>
      <div key={current} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>{renderBackground()}</div>
      <div style={{ textAlign: 'center', zIndex: 2, padding: '20px', width: isMobile ? '95%' : '80%' }}>
        {currentSlide.title && <h2 key={current+"t"} style={{ fontSize: isMobile ? '2rem' : '3.5rem', fontFamily: fontStyle, margin: 0, color: isTextOnly ? colors.text : '#fff', textShadow: isTextOnly ? 'none' : '0 4px 15px rgba(0,0,0,0.9)', whiteSpace: 'pre-wrap', lineHeight: '1.2', animation: 'slideUpFade 1s forwards' }}>{currentSlide.title}</h2>}
        {currentSlide.subtitle && <p key={current+"s"} style={{ fontSize: isMobile ? '1rem' : '1.6rem', fontFamily: fontStyle, fontStyle: 'italic', letterSpacing: '1px', marginTop: '10px', color: isTextOnly ? colors.text : '#eee', opacity: isTextOnly ? 0.8 : 1, textShadow: isTextOnly ? 'none' : '0 2px 10px rgba(0,0,0,0.8)', whiteSpace: 'pre-wrap', animation: 'slideUpFade 1.2s forwards' }}>{currentSlide.subtitle}</p>}
      </div>
      <div style={{ position: 'absolute', bottom: '30px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '15px', zIndex: 10 }}>
        {slides.map((_, index) => (
          <button key={index} onClick={() => setCurrent(index)} style={{ width: '14px', height: '14px', borderRadius: '50%', border: `2px solid ${isTextOnly ? colors.text : '#fff'}`, backgroundColor: current === index ? colors.accent : 'transparent', cursor: 'pointer', transition: 'all 0.3s', padding: 0, boxShadow: '0 2px 5px rgba(0,0,0,0.3)' }} />
        ))}
      </div>
      <style>{`@keyframes panMove { 0% { transform: translateX(0); } 100% { transform: translateX(-3%); } } @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

// --- 2. TILT CARD WITH HEART EFFECT ---
const TiltCard = ({ p, addToCart, colors }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hearts, setHearts] = useState([]); // Store active hearts
  const isMobile = useIsMobile();

  const handleMouseMove = (e) => {
    if(isMobile) return;
    
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    
    // Tilt Math
    const rotateX = ((y - centerY) / centerY) * -10; 
    const rotateY = ((x - centerX) / centerX) * 10;
    setRotate({ x: rotateX, y: rotateY });
    setIsHovering(true);

    // --- HEART GENERATION LOGIC ---
    // Only add a heart 10% of the time (Small Frequency) to avoid bunching
    if (Math.random() > 0.90) {
        const newHeart = {
            id: Date.now(),
            x: x, // Spawn at cursor X
            y: y, // Spawn at cursor Y
        };
        setHearts((prev) => [...prev, newHeart]);

        // Remove heart after animation (1 second)
        setTimeout(() => {
            setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
        }, 1000);
    }
  };

  const handleMouseLeave = () => { setRotate({ x: 0, y: 0 }); setIsHovering(false); };

  return (
    <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ width: '260px', perspective: '1000px', cursor: 'pointer', margin: isMobile ? '0 auto' : '0', position:'relative' }}>
      <div style={{
        background: colors.cardBg, 
        borderRadius: '15px', 
        color: colors.text, 
        border: `2px solid ${colors.accent}`, 
        overflow: 'hidden',
        // 3D Transform
        transform: !isMobile ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(${isHovering ? 1.05 : 1})` : 'none',
        transition: 'transform 0.1s ease-out', 
        // SHADOW EFFECT: Gold glow on hover
        boxShadow: isHovering ? `0 20px 40px rgba(255, 215, 0, 0.4)` : '0 10px 20px rgba(0,0,0,0.1)',
        transformStyle: 'preserve-3d'
      }}>
        
        {/* HEARTS CONTAINER */}
        {hearts.map(h => (
            <span key={h.id} style={{
                position: 'absolute',
                left: h.x,
                top: h.y,
                pointerEvents: 'none',
                fontSize: '20px',
                animation: 'floatHeart 1s ease-out forwards', // Animation defined in CSS below
                zIndex: 100
            }}>
                ❤️
            </span>
        ))}

        <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit', display:'block' }}>
          <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'gold', padding: '5px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', color:'black', transform: 'translateZ(30px)', boxShadow:'0 5px 10px rgba(0,0,0,0.2)' }}>Signature</div>
          <img src={p.images?.[0] || p.image} alt={p.name} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
          <div style={{ padding: '15px', textAlign: 'center', transform: 'translateZ(20px)' }}><h3>{p.name}</h3><span style={{ fontWeight: 'bold', color: colors.accent, fontSize:'18px' }}>₹{p.price}</span></div>
        </Link>
        <div style={{ padding: '0 15px 15px', transform: 'translateZ(30px)' }}>
          <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} style={{ width: '100%', padding: '10px', background: colors.accent, color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight:'bold' }}>Add to Cart</button>
        </div>
      </div>
      
      {/* HEART ANIMATION CSS */}
      <style>{`
        @keyframes floatHeart {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-50px) scale(1.5); }
        }
      `}</style>
    </div>
  );
};

const KitchenCard = ({ p, addToCart, colors, isMobile }) => (
    <div style={{ width: isMobile ? '45%' : '200px', border: `1px solid ${colors.border}`, borderRadius: '10px', paddingBottom:'10px', textAlign:'center', overflow:'hidden', background: colors.cardBg, transition:'transform 0.2s', ':hover':{transform:'translateY(-5px)'} }}>
      <Link to={`/product/${p._id}`} style={{ textDecoration: 'none', color: colors.text }}>
          <img src={p.images?.[0] || p.image} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
          <h4 style={{margin:'10px 0 5px', fontSize: isMobile ? '14px' : '16px'}}>{p.name}</h4><p style={{margin:'0 0 10px', color:colors.accent}}>₹{p.price}</p>
      </Link>
      <button onClick={() => addToCart(p)} style={{ padding: '5px 15px', background: colors.text, color: colors.bg, border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize:'12px' }}>Add</button>
    </div>
);

function Shop({ addToCart, colors, searchTerm }) {
  const isMobile = useIsMobile();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://pastry-server.onrender.com/api/products').then(res => setProducts(res.data)).catch(console.error);
  }, []);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const signatureItems = filteredProducts.filter(p => p.isSignature === true);
  const kitchenPreview = filteredProducts.filter(p => p.isSignature === false).slice(0, 4);

  return (
    <div>
      <BannerSlider colors={colors} />
      <div style={{ padding: isMobile ? '20px' : '40px', backgroundColor: colors.bg, minHeight: '50vh' }}>
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '30px' : '50px' }}><h2 style={{ color: colors.text, fontSize: isMobile ? '1.8rem' : '2.5rem', fontFamily: 'serif' }}>Signature Selections</h2><div style={{ height: '4px', width: '100px', background: 'gold', margin: '15px auto' }}></div></div>
        
        {/* SIGNATURE GRID */}
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '60px' }}>
            {signatureItems.map(p => <TiltCard p={p} key={p._id} addToCart={addToCart} colors={colors} />)}
        </div>
        
        <h3 style={{ textAlign: 'center', fontSize: isMobile ? '1.5rem' : '2rem', color: colors.text, marginBottom:'30px' }}>From The Kitchen</h3>
        <div style={{ display: 'flex', gap: isMobile ? '10px' : '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>{kitchenPreview.map(p => <KitchenCard p={p} key={p._id} addToCart={addToCart} colors={colors} isMobile={isMobile} />)}</div>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}><Link to="/kitchen" style={{ textDecoration: 'none', borderBottom:`1px solid ${colors.text}`, color:colors.text }}>VIEW FULL MENU</Link></div>
        <ChatMascot themeMode={colors.bg === '#000000' ? 'dark' : 'light'} /> 
      </div>
    </div>
  );
}

export default Shop;