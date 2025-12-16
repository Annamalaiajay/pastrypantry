const mongoose = require('mongoose');

const posterSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  layoutType: { type: String, default: 'cover' },
  templateStyle: { type: String, default: 'classic' },
  fontFamily: { type: String, default: 'Arial' },
  
  // ✅ THIS LINE IS MISSING IN YOUR CURRENT FILE:
  cropPosition: { type: String, default: 'center center' } 
});

module.exports = mongoose.model('Poster', posterSchema);