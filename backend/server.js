const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// CORS configuration for client URLs
const allowedOrigins = [
  'https://clicksansar.vercel.app',
  'https://clicksansar-behm.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(',').forEach(url => allowedOrigins.push(url.trim()));
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads Folder static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/pricing', require('./routes/pricingRoutes'));
app.use('/api/faqs', require('./routes/faqRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/chatbot', require('./routes/chatbotRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Root path fallback
app.get('/', (req, res) => {
  res.send('Click Sansar Backend API is running...');
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
