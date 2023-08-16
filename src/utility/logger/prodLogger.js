const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf((info) => {
  return `${info.level} [${info.timestamp}] : ${info.message}`;
});

const prodLogger = () => {
  return createLogger({
  level: 'debug',
  format: combine(
    format(info => {
      info.level = info.level.toUpperCase()
      return info;
    })(),
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console()],
});
}

module.exports = prodLogger;