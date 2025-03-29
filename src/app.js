const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const config = require('./config/config');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Sanitize data against XSS attacks
app.use(xss());

// Sanitize data against NoSQL injection
app.use(mongoSanitize());

// Compress response bodies
app.use(compression());

// Enable CORS
app.use(cors({
  origin: config.cors.origin.split(','),
  credentials: true,
}));

// JWT authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// Rate limiting
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// Request logging
if (config.env !== 'test') {
  app.use(morgan('dev'));
}

// Set API rate limit
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: 'Too many requests from this IP, please try again after some time',
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// API v1 routes
app.use('/v1', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(httpStatus.OK).send({ status: 'UP' });
});

// Send 404 error for any unknown API request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Convert error to ApiError, if needed
app.use(errorConverter);

// Handle error
app.use(errorHandler);

module.exports = app;
