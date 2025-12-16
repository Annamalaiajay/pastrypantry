const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  // Allow multiple images
  images: { type: [String], default: [] }, 
  image: { type: String }, // Keep for backward compatibility
  // New Video Field
  video: { type: String, default: '' }, 
  isSignature: { type: Boolean, default: false }
});

module.exports = mongoose.model('Product', productSchema);