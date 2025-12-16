const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  items: [
    {
      productName: String,
      price: Number
    }
  ],
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // 'Pending', 'Paid', 'Baking', 'Delivered'
  date: { type: Date, default: Date.now },
  
  // --- PAYMENT DETAILS (Screenshot & UTR) ---
  paymentDetails: {
    transactionId: { type: String, default: '' },
    screenshotUrl: { type: String, default: '' },
    userVPA: { type: String, default: '' }
  }
});

module.exports = mongoose.model('Order', orderSchema);