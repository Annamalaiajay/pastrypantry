const express = require('express');
const router = express.Router();
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');
const Poster = require('./models/Poster'); // ✅ This requires the file you just created

const { sendOrderAlert, sendEBill, sendPaymentSuccessEmail } = require('./emailService');

// ==========================================
// 1. POSTER ROUTES (For Admin Banners)
// ==========================================
router.get('/posters', async (req, res) => {
  try {
    const posters = await Poster.find();
    res.json(posters);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/posters', async (req, res) => {
  try {
    const newPoster = new Poster(req.body);
    await newPoster.save();
    res.status(201).json(newPoster);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.delete('/posters/:id', async (req, res) => {
  try {
    await Poster.findByIdAndDelete(req.params.id);
    res.json({ message: 'Poster Deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

// ==========================================
// 2. PRODUCT ROUTES
// ==========================================
router.get('/products', async (req, res) => {
  try { const products = await Product.find(); res.json(products); } 
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/products/:id', async (req, res) => {
  try { const product = await Product.findById(req.params.id); res.json(product); } 
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/products', async (req, res) => {
  try { const newProduct = new Product(req.body); await newProduct.save(); res.status(201).json(newProduct); } 
  catch (error) { res.status(400).json({ message: error.message }); }
});

// ==========================================
// 3. ORDER ROUTES (Instant & Background Email)
// ==========================================
router.get('/orders', async (req, res) => {
  try { const orders = await Order.find().sort({ date: -1 }); res.json(orders); } 
  catch (err) { res.status(500).json({message: err.message}); }
});

router.post('/orders', async (req, res) => {
  try {
    // 1. Save Order
    const newOrder = new Order({ ...req.body, status: "Pending" });
    await newOrder.save();
    
    // 2. Respond Fast
    res.status(201).json(newOrder);

    // 3. Background Emails
    (async () => {
        try {
            if (req.io) req.io.emit('new_order', newOrder);
            await sendOrderAlert(newOrder); 
            const user = await User.findOne({ name: newOrder.customerName });
            if(user && user.email) await sendEBill(newOrder, user.email);
        } catch(e) { console.error("Email Error:", e.message); }
    })();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/orders/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status;
      await order.save();
      if (status === "Paid") {
        (async () => {
            const user = await User.findOne({ name: order.customerName });
            if (user && user.email) await sendPaymentSuccessEmail(order, user.email);
        })();
      }
      res.json(order);
    } else { res.status(404).json({ message: 'Order not found' }); }
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;