// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

dotenv.config();

// **CRITICAL FIX: Add Environment Variable Checks**
const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'SESSION_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'BACKEND_URL',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ FATAL ERROR: Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1); // Stop the server from starting
}


connectDB();

require('./config/passport')(passport);

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://madan-electricalsfrontend.vercel.app',
    'https://www.madanelectricals.com'
  ],
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.status(200).json({ message: "Server is awake and running." });
});

// --- API Routes ---
const v1Routes = express.Router();
v1Routes.use('/products', require('./routes/productRoutes'));
v1Routes.use('/users', require('./routes/userRoutes'));
v1Routes.use('/auth', require('./routes/authRoutes'));
v1Routes.use('/upload', require('./routes/uploadRoutes'));
v1Routes.use('/orders', require('./routes/orderRoutes'));
v1Routes.use('/banners', require('./routes/bannerRoutes'));
v1Routes.use('/categories', require('./routes/categoryRoutes'));
v1Routes.use('/payment', require('./routes/paymentRoutes'));
v1Routes.use('/profile', require('./routes/profileRoutes'));
v1Routes.use('/admin', require('./routes/adminRoutes'));
v1Routes.use('/about', require('./routes/aboutRoutes'));
v1Routes.use('/analytics', require('./routes/analyticsRoutes')); 

app.use('/api/v1', v1Routes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server is running on port ${PORT}`);
});