const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// Helper: Calculate Delivery Date (Today + 2 Days)
const getDeliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
};

// ==========================================
// 1. SEND OTP
// ==========================================
const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: `"Aishu's Pastry Pantry" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Login OTP',
    html: `<div style="font-family:Arial; text-align:center; padding:20px;"><h2>Aishu's Pastry Pantry</h2><p>Your OTP is:</p><h1 style="color:#FF69B4;">${otp}</h1></div>`
  };
  try { await transporter.sendMail(mailOptions); } catch (e) {}
};

// ==========================================
// 2. SEND PENDING E-BILL (Initial Order)
// ==========================================
const sendEBill = async (order, userEmail) => {
  const shortId = order._id.toString().slice(-6).toUpperCase();
  const deliveryDate = getDeliveryDate();
  
  const itemsHtml = order.items.map(i => 
    `<div style="display:flex; justify-content:space-between; border-bottom:1px dashed #ddd; padding:8px 0;">
       <span>${i.productName}</span> <span>₹${i.price}</span>
     </div>`
  ).join('');

  const html = `
    <div style="font-family: 'Courier New', monospace; max-width: 500px; margin: 0 auto; padding: 30px; background: #fffaf0; border: 1px solid #ccc; color: #333;">
      
      <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 24px;">AISHU'S PASTRY PANTRY</h2>
        <p style="margin: 5px 0 0;">Freshly Baked Goodness</p>
      </div>

      <div style="margin-bottom: 20px; font-size: 14px;">
        <p><strong>Bill No:</strong> #${shortId}</p>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p style="color: #d35400;"><strong>Exp. Delivery:</strong> ${deliveryDate}</p>
      </div>

      <div style="background: #fff; padding: 15px; border: 1px solid #eee;">
        ${itemsHtml}
        <div style="display:flex; justify-content:space-between; margin-top:15px; padding-top:10px; border-top:2px solid #333; font-weight:bold; font-size:18px;">
          <span>TOTAL</span> <span>₹${order.totalPrice}</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 40px;">
        <div style="display: inline-block; padding: 10px 20px; border: 3px dashed #e67e22; color: #e67e22; font-weight: bold; font-size: 20px; transform: rotate(-10deg); opacity: 0.8;">
          PENDING APPROVAL
        </div>
        <p style="margin-top: 10px; font-size: 11px; color: #666;">* Verifying Payment Screenshot *</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER, to: userEmail, subject: `🧾 Bill #${shortId} (Pending)`, html });
  } catch (e) {}
};

// ==========================================
// 3. ADMIN ALERT
// ==========================================
const sendOrderAlert = async (order) => {
  const adminEmail = "dsharmiaishu17@gmail.com"; 
  let mailOptions = {
    from: process.env.EMAIL_USER, to: adminEmail, 
    subject: `🔔 New Order: ₹${order.totalPrice}`,
    html: `<h2>New Order #${order._id.toString().slice(-6)}</h2><p>Check dashboard to verify.</p>`,
    attachments: []
  };

  if (order.paymentDetails?.screenshotUrl) {
    try {
      const filename = order.paymentDetails.screenshotUrl.split('/').pop();
      const filePath = path.join(__dirname, 'uploads', filename);
      if (fs.existsSync(filePath)) mailOptions.attachments.push({ filename: 'Proof.jpg', path: filePath });
    } catch (e) {}
  }
  await transporter.sendMail(mailOptions);
};

// ==========================================
// 4. APPROVED BILL (Official Invoice)
// ==========================================
const sendPaymentSuccessEmail = async (order, userEmail) => {
  const shortId = order._id.toString().slice(-6).toUpperCase();
  const deliveryDate = getDeliveryDate();

  const itemsHtml = order.items.map(i => 
    `<div style="display:flex; justify-content:space-between; border-bottom:1px dashed #ddd; padding:8px 0;">
       <span>${i.productName}</span> <span>₹${i.price}</span>
     </div>`
  ).join('');

  const html = `
    <div style="font-family: 'Courier New', monospace; max-width: 500px; margin: 0 auto; padding: 30px; background: #fff; border: 2px solid #27ae60; color: #333;">
      
      <div style="text-align: center; border-bottom: 2px solid #27ae60; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 24px; color: #27ae60;">AISHU'S PASTRY PANTRY</h2>
        <p style="margin: 5px 0 0;">PAYMENT RECEIPT</p>
      </div>

      <div style="margin-bottom: 20px; font-size: 14px;">
        <p><strong>Bill No:</strong> #${shortId}</p>
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p style="color: #27ae60;"><strong>Exp. Delivery:</strong> ${deliveryDate}</p>
        <p><strong>Payment Mode:</strong> ${order.paymentMethod} (Verified)</p>
      </div>

      <div style="background: #f9f9f9; padding: 15px; border: 1px solid #eee;">
        ${itemsHtml}
        <div style="display:flex; justify-content:space-between; margin-top:15px; padding-top:10px; border-top:2px solid #333; font-weight:bold; font-size:18px;">
          <span>PAID TOTAL</span> <span>₹${order.totalPrice}</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 40px;">
        <div style="display: inline-block; padding: 10px 30px; border: 4px solid #27ae60; color: #27ae60; font-weight: bold; font-size: 24px; transform: rotate(-5deg); border-radius: 5px;">
          PAID
        </div>
        <p style="margin-top: 15px;">Thank you! Your order is being baked.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({ from: process.env.EMAIL_USER, to: userEmail, subject: `✅ Paid Invoice #${shortId}`, html });
};

module.exports = { sendOTP, sendEBill, sendOrderAlert, sendPaymentSuccessEmail };