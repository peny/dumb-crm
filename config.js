require('dotenv').config();

const config = {
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db'
  },
  server: {
    port: parseInt(process.env.PORT) || 3000,
    host: process.env.HOST || '0.0.0.0'
  },
  environment: process.env.NODE_ENV || 'development'
};

module.exports = config;
