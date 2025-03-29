const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const setupSocketIO = require('./config/socket');

let server;

// Connect to MongoDB
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = http.createServer(app);
  
  // Setup Socket.IO
  setupSocketIO(server);
  
  // Listen on specified port
  server.listen(config.port, () => {
    logger.info(`Listening on port ${config.port}`);
  });
}).catch((error) => {
  logger.error('Failed to connect to MongoDB', error);
});

// Handle unexpected errors
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
