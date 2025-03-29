const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    MONGODB_URI: Joi.string().required().description('MongoDB connection URI'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('JWT access token expiration in minutes'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('JWT refresh token expiration in days'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number().default(10).description('JWT reset password token expiration in minutes'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number().default(10).description('JWT verify email token expiration in minutes'),
    AWS_ACCESS_KEY_ID: Joi.string().description('AWS access key id'),
    AWS_SECRET_ACCESS_KEY: Joi.string().description('AWS secret access key'),
    AWS_REGION: Joi.string().description('AWS region'),
    AWS_BUCKET_NAME: Joi.string().description('AWS S3 bucket name'),
    SMTP_HOST: Joi.string().description('SMTP host for sending emails'),
    SMTP_PORT: Joi.number().description('SMTP port'),
    SMTP_USERNAME: Joi.string().description('SMTP username'),
    SMTP_PASSWORD: Joi.string().description('SMTP password'),
    EMAIL_FROM: Joi.string().description('Email sender address'),
    ADMIN_EMAIL: Joi.string().email().description('Admin user email'),
    ADMIN_PASSWORD: Joi.string().description('Admin user password'),
    MAX_FILE_UPLOAD_SIZE: Joi.number().default(5).description('Maximum file upload size in MB'),
    RATE_LIMIT_WINDOW_MS: Joi.number().default(900000).description('Rate limiting window in milliseconds'),
    RATE_LIMIT_MAX: Joi.number().default(100).description('Maximum requests per rate limit window'),
    CORS_ORIGIN: Joi.string().description('Allowed CORS origins'),
    SOCKET_IO_CORS_ORIGIN: Joi.string().description('Allowed Socket.IO CORS origins'),
    CLIENT_URL: Joi.string().description('Client application URL for email links'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  aws: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    region: envVars.AWS_REGION,
    bucketName: envVars.AWS_BUCKET_NAME,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  admin: {
    email: envVars.ADMIN_EMAIL,
    password: envVars.ADMIN_PASSWORD,
  },
  fileUpload: {
    maxSize: envVars.MAX_FILE_UPLOAD_SIZE * 1024 * 1024, // Convert MB to bytes
  },
  rateLimit: {
    windowMs: envVars.RATE_LIMIT_WINDOW_MS,
    max: envVars.RATE_LIMIT_MAX,
  },
  cors: {
    origin: envVars.CORS_ORIGIN || 'http://localhost:3000',
  },
  socketIO: {
    corsOrigin: envVars.SOCKET_IO_CORS_ORIGIN || 'http://localhost:3000',
  },
  clientUrl: envVars.CLIENT_URL || 'http://localhost:3000',
};
