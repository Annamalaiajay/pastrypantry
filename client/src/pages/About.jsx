import React, { useState, useEffect } from 'react';
import founderImage from '../assets/founder.png'; // Ensure this matches your file

// --- TYPEWRITER COMPONENT ---
const Typewriter = ({ text, speed = 50, color }) => {
  const [displayText, setDisplayText] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span style={{ borderRight: `2px solid ${color}`, paddingRight: '5px' }}>{displayText}</span>;
};

function About({ colors }) {
  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Georgia, serif', color: colors.text }}>
      
      {/* HEADER SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: colors.accent, fontWeight: 'bold' }}>
          Welcome to Aishu Pastry Pantry
        </h1>
        <h3 style={{ fontSize: '1.3rem', fontStyle: 'italic', minHeight: '60px', fontWeight: 'normal', lineHeight: '1.5' }}>
          <Typewriter 
            text="The home of the richest, fudgiest, melt-in-your-mouth brownies in town!" 
            speed={40} 
            color={colors.accent} 
          />
        </h3>
      </div>

      {/* FOUNDER STORY */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
        
        {/* FOUNDER IMAGE */}
        <img 
          src={founderImage} 
          alt="Sharmila, Founder" 
          style={{ 
            flex: '1 1 300px', 
            borderRadius: '20px', 
            boxShadow: `0 0 20px ${colors.accent}50`, // Soft Glow
            height: '400px', 
            objectFit: 'contain', 
            backgroundColor: colors.cardBg,
            border: `2px solid ${colors.accent}` 
          }} 
        />
        
        <div style={{ flex: '2 1 400px', fontSize: '1.1rem', lineHeight: '1.8' }}>
          <h2 style={{ color: colors.accent, borderBottom: `3px solid ${colors.accent}`, display: 'inline-block', marginBottom: '15px' }}>Meet the Founder</h2>
          <p>
            Founded and led by <strong>Sharmila</strong>, a 20-year-old young entrepreneur, our bakery is built on passion, perfection, and pure love for baking.
          </p>
          <p style={{ marginTop: '15px' }}>
            After completing her UG in Arts, Sharmila turned her childhood passion for brownies into a thriving home-based brand. Today, 
            <strong> Aishu Pastry Pantry</strong> has proudly completed <strong>200+ brownie and pastry orders</strong> and is currently handling 
            <strong> 50+ active orders</strong>, thanks to the trust and love of our customers.
          </p>
        </div>
      </div>

      {/* SPECIALTY SECTION */}
      <div style={{ backgroundColor: colors.cardBg, padding: '40px', borderRadius: '15px', boxShadow: `0 5px 15px ${colors.text}10`, marginBottom: '40px', border: `1px solid ${colors.border}` }}>
        <h2 style={{ textAlign: 'center', color: colors.accent, marginBottom: '20px' }}>Brownies That Make Your Soul Happy</h2>
        
        <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '750px', margin: '0 auto 20px auto', lineHeight: '1.8' }}>
          From classic fudgy brownies to nutty, chewy, gooey, and flavor-loaded varieties, Sharmila ensures each batch is mixed, baked, and packed with utmost care. 
          Every brownie is crafted in small batches to maintain the perfect texture — crisp edges, soft centers, and a divine chocolate aroma you can never forget.
        </p>

        <p style={{ fontSize: '1.1rem', textAlign: 'center', maxWidth: '750px', margin: '0 auto 30px auto', lineHeight: '1.8' }}>
          At Aishu Pastry Pantry, everything is <strong>100% homemade</strong> with top-quality ingredients sourced fresh every time. We never compromise on taste, texture, or quality — because your happiness matters to us.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px', textAlign: 'center' }}>
          <div style={{ backgroundColor: colors.bg, border: `2px solid ${colors.accent}`, padding: '15px 25px', borderRadius: '30px', fontWeight: 'bold', color: colors.accent }}>🍪 100% Homemade</div>
          <div style={{ backgroundColor: colors.bg, border: `2px solid ${colors.accent}`, padding: '15px 25px', borderRadius: '30px', fontWeight: 'bold', color: colors.accent }}>✨ Fresh Ingredients</div>
          <div style={{ backgroundColor: colors.bg, border: `2px solid ${colors.accent}`, padding: '15px 25px', borderRadius: '30px', fontWeight: 'bold', color: colors.accent }}>❤️ Made with Love</div>
        </div>
      </div>

      {/* CLOSING */}
      <div style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: 'bold', marginTop: '50px', color: colors.accent, fontStyle: 'italic' }}>
        "Whether you're craving a quick chocolate fix, planning a celebration, or surprising someone special, our brownies are made to bring joy in every bite."
      </div>

    </div>
  );
}

export default About;