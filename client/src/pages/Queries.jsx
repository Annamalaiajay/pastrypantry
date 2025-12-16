import React from 'react';

function Queries() {
  const faqs = [
    { q: "Are your brownies completely homemade?", a: "Yes! All our brownies are made fresh at home by Sharmila." },
    { q: "What makes your brownies special?", a: "Our brownies are baked in small batches to ensure the perfect fudgy texture." },
    { q: "Do you use preservatives?", a: "No. Our brownies contain zero preservatives." },
    { q: "Do you offer delivery?", a: "Yes. We provide delivery within our local area." }
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Helvetica, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Frequently Asked Questions</h1>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '40px' }}>Everything you need to know about our brownies.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {faqs.map((item, index) => (
          <div key={index} style={{ 
            backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', 
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderLeft: '6px solid #FF69B4'
          }}>
            <div style={{ 
              backgroundColor: '#FF69B4', color: 'white', padding: '15px 20px', 
              fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center'
            }}>
              <span style={{ color: 'white', marginRight: '10px', fontSize: '1.5rem' }}>Q{index + 1}.</span> 
              {item.q}
            </div>
            <div style={{ padding: '20px', color: '#333', fontSize: '1rem', lineHeight: '1.6', backgroundColor: '#fff' }}>
              {item.a}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Queries;