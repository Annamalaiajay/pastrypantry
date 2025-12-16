const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const path = require('path');
const fs = require('fs');
const multer = require('multer');
const http = require('http'); // <--- ADD THIS
const { Server } = require('socket.io'); // <--- ADD THIS

// Import Routes
const authRoutes = require('./authRoutes');
const routes = require('./routes');

dotenv.config();
const app = express();

// 1. SOCKET.IO SETUP
import io from 'socket.io-client';

// ⚠️ MUST be your Render Server URL (no slash at the end)
const socket = io("https://pastry-server.onrender.com", {
  transports: ['websocket', 'polling'], // Add this to force connection
  withCredentials: true
});

export default socket;
// 2. MIDDLEWARE
app.use(cors());
app.use(express.json());

// Inject Socket.io into requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 3. FILE UPLOAD CONFIGURATION (Multer)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});

const upload = multer({ storage: storage });

// Serve 'uploads' folder as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload Route
app.post('/api/upload', upload.single('screenshot'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const imageUrl = `https://pastry-server.onrender.com/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
});

// ... (After your app.use routes) ...

// Create the HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all connections
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
});

// START THE SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});