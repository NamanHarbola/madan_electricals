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

// Load environment variables from .env file
dotenv.config();
// Connect to MongoDB
connectDB();

// Passport config (ensure this path is correct)
require('./config/passport')(passport);

const app = express();

// --- Middleware ---
app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  'https://madan-electricalsfrontend.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60 // = 14 days
  })
}));

app.use(passport.initialize());
app.use(passport.session());

// --- NEW: Add a root route for the keep-alive service ---
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

// Mount all v1 routes under the /api/v1 path
app.use('/api/v1', v1Routes);

// --- Error Handling Middleware ---
app.use(notFound);
app.use(errorHandler);

// --- Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend server is running on port ${PORT}`);
});