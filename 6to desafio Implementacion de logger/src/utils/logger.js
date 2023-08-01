import winston from "winston";

const levelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
  },
  colors: {
    fatal: 'red',
    error: 'magenta',
    warning: 'yellow',
    info: 'blue',
    http: 'green',
  }
};

export const logger = winston.createLogger({
  levels: levelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "http", 
      format: winston.format.combine(
        winston.format.colorize({ colors: levelOptions.colors }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: "src/logs/fatal.log",
      level: "fatal",
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: "src/logs/error.log",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: "src/logs/warning.log",
      level: "warning",
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: "src/logs/info.log",
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: "src/logs/http.log",
      level: "http",
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
        winston.format.simple()
      )
    })
  ]
});
