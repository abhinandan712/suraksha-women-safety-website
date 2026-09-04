const express = require("express");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/errorHandler");
const connectDB = require("./database/db");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const incRoutes = require("./routes/incidentRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const chatRoutes = require('./routes/chatRoutes')
const feedbackRoutes = require('./routes/feedbackRoutes')
const chatbotRoutes = require('./routes/chatbotRoutes')
const trackingRoutes = require('./routes/trackingRoutes')
const dataSourcesRoutes = require('./routes/dataSourcesRoutes')
const smsRoutes = require('./routes/smsRoutes')
const testEmergencyRoutes = require('./routes/testEmergencyRoutes')
const routeRoutes = require('./routes/routeRoutes')
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory');
}

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    console.log(`Mongo Connected!!!`);
  } catch (err) {
    console.log('MongoDB connection failed:', err.message);
    console.log('Server will start without database connection');
  }
  
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on port ${port}`);
    console.log(`Server accessible at http://10.52.33.225:${port}`);
  });
};

// Health check endpoint (does not require database connection)
app.get('/api/health', (req, res) => {
  const mongoUrl = process.env.MONGO_URL || '';
  res.json({
    status: 'online',
    environment: process.env.VERCEL ? 'vercel' : 'local',
    uptime: Math.floor(process.uptime()),
    database: {
      state: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
      configured: Boolean(mongoUrl),
      isAtlas: mongoUrl.includes('mongodb.net') || mongoUrl.startsWith('mongodb+srv:'),
      isLocalhost: mongoUrl.includes('localhost') || mongoUrl.includes('127.0.0.1')
    },
    services: {
      groqConfigured: Boolean(process.env.GROQ_API_KEY),
      jwtConfigured: Boolean(process.env.ACCESS_TOKEN_SECRET),
      smsConfigured: Boolean(process.env.FAST2SMS_API_KEY)
    }
  });
});

// Serverless database connection middleware for Vercel
let dbPromise = null;
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;

  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL environment variable is missing in Vercel. Please add your MongoDB Atlas connection string in Vercel Project Settings > Environment Variables.');
  }

  if (process.env.MONGO_URL.includes('localhost') || process.env.MONGO_URL.includes('127.0.0.1')) {
    throw new Error('MONGO_URL is set to localhost. Vercel runs in the cloud and cannot connect to your local computer. Please configure MongoDB Atlas (mongodb+srv://...).');
  }

  if (!dbPromise) {
    dbPromise = connectDB(process.env.MONGO_URL).catch((err) => {
      dbPromise = null;
      throw err;
    });
  }

  await dbPromise;
};

app.use(async (req, res, next) => {
  if (req.path === '/api/health') {
    return next();
  }

  if (process.env.VERCEL) {
    try {
      await connectToDatabase();
    } catch (err) {
      console.error('Serverless DB connection error:', err.message);
      return res.status(503).json({
        success: false,
        message: err.message
      });
    }
  }
  next();
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/incidents", incRoutes);
app.use("/api/v1/emergency", emergencyRoutes);
app.use('/api/v1/chats',chatRoutes)
app.use('/api/feedback',feedbackRoutes)
app.use('/api/v1/chatbot',chatbotRoutes)
app.use('/api/v1/tracking',trackingRoutes)
app.use('/api/v1/data-sources',dataSourcesRoutes)
app.use('/api/v1/sms',smsRoutes)
app.use('/api/v1/test-emergency',testEmergencyRoutes)
app.use('/api/v1/routes',routeRoutes)

app.use(errorHandler);

if (!process.env.VERCEL) {
  start();
}

module.exports = app;
