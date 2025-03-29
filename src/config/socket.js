const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('./config');
const logger = require('./logger');
const { User } = require('../models');

const setupSocketIO = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: config.socketIO.corsOrigin.split(','),
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Socket.io auth middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }
      
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findById(decoded.sub);
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      // eslint-disable-next-line no-param-reassign
      socket.user = user;
      return next();
    } catch (error) {
      logger.error(`Socket authentication error: ${error.message}`);
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.user.email}`);
    
    // Join user to their own channel for private messages
    socket.join(`user:${socket.user.id}`);
    
    // Join mentorship rooms if user is part of mentorship sessions
    if (socket.user.role === 'mentor') {
      socket.join('mentors');
    }
    
    // Handle live session events
    socket.on('join-session', (sessionId) => {
      socket.join(`session:${sessionId}`);
      io.to(`session:${sessionId}`).emit('user-joined', {
        userId: socket.user.id,
        name: socket.user.name,
      });
    });
    
    socket.on('leave-session', (sessionId) => {
      socket.leave(`session:${sessionId}`);
      io.to(`session:${sessionId}`).emit('user-left', {
        userId: socket.user.id,
        name: socket.user.name,
      });
    });
    
    socket.on('session-message', (data) => {
      io.to(`session:${data.sessionId}`).emit('session-message', {
        userId: socket.user.id,
        name: socket.user.name,
        message: data.message,
        timestamp: new Date(),
      });
    });
    
    // Handle mentor-student direct messaging
    socket.on('direct-message', (data) => {
      io.to(`user:${data.recipientId}`).emit('direct-message', {
        senderId: socket.user.id,
        senderName: socket.user.name,
        message: data.message,
        timestamp: new Date(),
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user.email}`);
    });
  });

  return io;
};

module.exports = setupSocketIO;