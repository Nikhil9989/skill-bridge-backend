const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'SKILL BRIDGE API documentation',
    version,
    description: 'API documentation for the SKILL BRIDGE platform. The backend API supports a comprehensive domain-based learning solution that bridges the gap between education and industry requirements.',
    license: {
      name: 'MIT',
      url: 'https://github.com/Nikhil9989/skill-bridge-backend/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server',
    },
    {
      url: 'https://api.skillbridge.com/v1',
      description: 'Production Server',
    },
  ],
};

module.exports = swaggerDef;