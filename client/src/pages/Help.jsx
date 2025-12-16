import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaCircle } from 'react-icons/fa';
import stringSimilarity from 'string-similarity';

// --- FREE KNOWLEDGE BASE (Updated with Rupees) ---
const knowledgeBase = [
  { 
    questions: ["hi", "hello", "hey", "good morning"], 
    answer: "Hello! 👋 Welcome to Aishu's Pastry Pantry. How can I help you today?" 
  },
  { 
    questions: ["what is the price?", "how much?", "rate card", "cost"], 
    answer: "Our brownies start at ₹50! 🍫 \n• Box of 4: ₹180 \n• Box of 6: ₹250 \n• Party Pack: ₹450" 
  },
  { 
    questions: ["do you deliver?", "shipping time", "delivery"], 
    answer: "We bake fresh! 🚚 Local delivery takes 24-48 hours. Bulk orders need 2 days notice." 
  },
  { 
    questions: ["menu", "flavors", "options", "what do you have"], 
    answer: "Menu: 🧁 \n1. Triple Choco (Best Seller) \n2. Walnut Special \n3. Creamy Delight" 
  },
  { 
    questions: ["eggless?", "vegan?", "pure veg"], 
    answer: "Yes! 🌱 We have 'Vegan Fudgy' brownies available. Select 'Vegan' at checkout." 
  },
  { 
    questions: ["contact", "human", "call", "owner"], 
    answer: "Call Sharmila directly at +91 98765 43210. 📞" 
  }
];

const getBotResponse = (userInput) => {
  if (!userInput) return "";
  let bestMatch = { rating: 0, answer: "" };

  knowledgeBase.forEach(topic => {
    const matches = stringSimilarity.findBestMatch(userInput.toLowerCase(), topic.questions);
    if (matches.bestMatch.rating > bestMatch.rating) {
      bestMatch = { rating: matches.bestMatch.rating, answer: topic.answer };
    }
  });

  return bestMatch.rating > 0.3 ? bestMatch.answer : "I'm not sure about that. 🤔 Try asking about 'Price', 'Menu', or 'Delivery'.";
};

function Help({ colors }) {
  const [messages, setMessages] = useState([{ sender: 'bot', text: "Hello! I'm BrownieBot. Ask me anything! 🤖" }]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: inputValue }]);
    
    setTimeout(() => {
      const reply = getBotResponse(inputValue);
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 500);
    setInputValue("");
  };

  return (
    <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', backgroundColor: colors.bg, color: colors.text, fontFamily: 'Helvetica, sans-serif' }}>
      <div style={{ padding: '15px 20px', backgroundColor: colors.navBg, borderBottom: `1px solid ${colors.accent}`, display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '24px' }}><FaRobot /></div>
          <FaCircle style={{ position: 'absolute', bottom: '2px', right: '2px', color: '#00C853', border: '2px solid white', borderRadius: '50%' }} size={14} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: colors.text }}>BrownieBot</h2>
          <span style={{ fontSize: '0.8rem', color: colors.accent }}>Online | Automated</span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ 
              maxWidth: '75%', padding: '12px 18px', borderRadius: '20px', fontSize: '15px', lineHeight: '1.5', whiteSpace: 'pre-line',
              backgroundColor: msg.sender === 'user' ? colors.accent : colors.cardBg,
              color: msg.sender === 'user' ? 'white' : colors.text,
              borderBottomRightRadius: msg.sender === 'user' ? '0' : '20px',
              borderBottomLeftRadius: msg.sender === 'bot' ? '0' : '20px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '20px', backgroundColor: colors.navBg, borderTop: `1px solid ${colors.border}`, display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Type a message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} style={{ flex: 1, padding: '15px', borderRadius: '30px', border: 'none', outline: 'none', backgroundColor: colors.inputBg, color: colors.text, fontSize: '16px' }} />
        <button onClick={handleSend} style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: colors.accent, color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaPaperPlane size={20} /></button>
      </div>
    </div>
  );
}

export default Help;