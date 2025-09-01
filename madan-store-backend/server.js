// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const passport = require('passport');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Load environment variables from .env file
dotenv.config();
// Connect to MongoDB
connectDB();

// Passport config (ensure this path is correct)
require('./config/passport')(passport);

const app = express();

// --- Middleware ---

// Basic security headers
app.use(helmet());

// Rate limiting (optional, but good for production)
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use(limiter);


// --- CRITICAL DEPLOYMENT CONFIGURATION: CORS ---
// This list defines which frontend URLs are allowed to make requests to your API
const allowedOrigins = [
  'http://localhost:5173', // Your local frontend for development
  'https://madan-electricalsfrontend.vercel.app' // <<<< ADD YOUR VERCEL URL HERE ONCE DEPLOYED
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


// Middleware to parse JSON request bodies
app.use(express.json());

// Express session middleware (required for passport session)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport middleware for authentication strategies
app.use(passport.initialize());
app.use(passport.session());


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

// Mount all v1 routes under the /api/v1 path
app.use('/api/v1', v1Routes);


// --- Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler);


// --- Server Initialization ---

// DEPLOYMENT-READY PORT: Uses the port provided by the hosting service (Render),
// or falls back to 5000 for local development.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend server is running on port ${PORT}`);
});