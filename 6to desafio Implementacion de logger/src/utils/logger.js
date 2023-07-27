import winston from "winston";

const levelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    fatal: 'red',
    error: 'orange',
    warning: 'yellow',
    info: 'blue',
    debug: 'white',
  }
};

export const logger = winston.createLogger({
  levels: levelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
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
      filename: "src/logs/debug.log",
      level: "debug",
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
        winston.format.simple()
      )
    })
  ]
});
