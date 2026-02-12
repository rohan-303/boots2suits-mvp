import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
// import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
// import xss from 'xss-clean';

import authRoutes from './routes/authRoutes';
import resumeRoutes from './routes/resumeRoutes';
import userRoutes from './routes/userRoutes';
import jobRoutes from './routes/jobRoutes';
import applicationRoutes from './routes/applicationRoutes';
import storyRoutes from './routes/storyRoutes';
import partnerRoutes from './routes/partnerRoutes';
import messageRoutes from './routes/messageRoutes';
import companyRoutes from './routes/companyRoutes';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import { mongoSanitize, xssSanitize } from './middleware/securityMiddleware';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Allow configured client URL or all for dev
  credentials: true
}));
app.use(morgan('dev'));

// Security Middleware
app.use(helmet());

// Body Parser (Must be before sanitization)
app.use(express.json({ limit: '10kb' }));

// Data Sanitization
app.use(mongoSanitize); // Prevent NoSQL injection (Custom Middleware)
app.use(xssSanitize); // Prevent XSS attacks (Custom Middleware)
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000, // Increased limit for polling
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/companies', companyRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
