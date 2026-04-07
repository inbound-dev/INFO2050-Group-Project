const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs.json');

const writeLog = (logEntry) => {
  let logs = [];

  if (fs.existsSync(logFilePath)) {
    try {
      const fileData = fs.readFileSync(logFilePath, 'utf-8');
      logs = JSON.parse(fileData);
    } catch (err) {
      logs = [];
    }
  }

  logs.push(logEntry);

  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
};

const logEvent = (eventData) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...eventData
  };

  writeLog(logEntry);
};

const logger = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      route: req.originalUrl,
      status: res.statusCode,
      ip: req.ip,
      userAgent: req.headers['user-agent'] || '',
      duration: `${Date.now() - startTime}ms`,
    };

    writeLog(logEntry);
  });

  next();
};

module.exports = { logger, logEvent };