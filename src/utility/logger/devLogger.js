const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf((info) => {
  return `${info.level} [${info.timestamp}] : ${info.message}`;
});

const devLogger = () => {
  return createLogger({
  level: 'debug',
  format: combine(
    format(info => {
      info.level = info.level.toUpperCase()
      return info;
    })(),
    format.colorize(),
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console()],
});
}

module.exports = devLogger;