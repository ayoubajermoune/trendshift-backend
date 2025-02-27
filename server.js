import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ 
  path: path.resolve(__dirname, '.env') 
});

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import axios from 'axios';

// Set mongoose strictQuery option
mongoose.set('strictQuery', false);

// Middleware
const app = express();

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://trendshift.netlify.app', 
      'http://localhost:3000', 
      process.env.CORS_ORIGIN
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Routes
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Keep Glitch from sleeping
const keepAlive = () => {
  setInterval(async () => {
    try {
      const domain = process.env.PROJECT_DOMAIN 
        ? `https://${process.env.PROJECT_DOMAIN}.glitch.me` 
        : 'http://localhost:5000';
      
      await axios.get(domain);
      console.log('Keep alive ping sent');
    } catch (error) {
      console.error('Keep alive ping failed', error.message);
    }
  }, 280000); // every 4.7 minutes
};

// MongoDB Connection Options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

// MongoDB Connection
mongoose.set('debug', true); // Enable Mongoose debug mode

import createInitialAdmin from './config/initialAdmin.js';

mongoose.connect(process.env.MONGODB_URI, mongoOptions)
  .then(async () => {
    console.log('✅ Connected to MongoDB Atlas successfully');
    await createInitialAdmin();
    
    // Start keep alive only after successful MongoDB connection
    if (process.env.PROJECT_DOMAIN) {
      keepAlive();
    }
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    console.error('Connection URI:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));
    process.exit(1); // Exit if MongoDB connection fails
  });

// Mongoose Connection Event Listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to database');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Health Check Route
app.get('/', (req, res) => {
  res.json({
    message: 'TrendShift API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    mongoStatus: mongoose.connection.readyState
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
