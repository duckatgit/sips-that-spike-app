import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import multer from "multer";
import express from 'express';
import path from "path";
import { connectDB } from './config/db.js';
import logger from './config/logger.js';
import routes from './src/routes/index.js';



const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(process.cwd(), "public")));

//?temp
app.use('/uploads', express.static(path.join(process.cwd(), "uploads")));

app.use(express.urlencoded({ extended: true }));

// Other middlewares
app.use(express.json());
app.use(cors());

// API routes
app.use('/api', routes);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    // Other errors (like file type validation)
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});


// DB connection
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('API is running');
});

app.get('/api/ping', (req, res) => {
  logger.error('Ping test error logged!');
  res.json({ message: 'Ping received, error logged.' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
