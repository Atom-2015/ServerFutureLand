// utils/logger.js
const winston = require('winston'); // you must install this: npm install winston

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console()
  ],
});

module.exports = logger;
