const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  if (stack) {
    // Nếu có stack trace, trả về cả stack
    return `${timestamp} [${level}]: ${message}\n${stack}`;
  }
  // Nếu không, chỉ log message
  return `${timestamp} [${level}]: ${JSON.stringify(message)}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new transports.File({ filename: "logs/express.log", level: "info" }),
    new transports.Console(),
  ],
});

module.exports = logger;
