const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // CORS support for cross-origin requests
const morgan = require('morgan'); // Requirement: Structured Logging
const rateLimit = require('express-rate-limit'); // Requirement: Rate Limiting

const whatsappService = require('./src/services/whatsapp.service');
const whatsappRoutes = require('./src/routes/whatsapp.route');
const errorHandler = require('./src/utils/errorHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// 1. Logging Middleware (Development logs)
app.use(morgan('dev')); 

// 2. CORS Middleware (Allow cross-origin requests from frontend)
app.use(cors());

// 3. Body Parser
app.use(express.json());

// 4. Rate Limiting Middleware (Security)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { success: false, message: "Too many requests, please try again later." }
});
app.use('/api/', limiter);

// Initialize WhatsApp Logic
whatsappService.initialize(io);

// Routes Setup
app.use('/api/whatsapp', whatsappRoutes);

// Centralized Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Backend ready on port ${PORT}`));