import winston from "winston";

const levelOptions ={
    levels:{
        fatal: 0,
        error: 1,
        warning:2,
        info: 3,
        debug: 4,
    },
    color:{
        fatal: 'red',
        error: 'orange',
        warning:'yellow',
        info: 'blue',
        debug: 'white',
    }
}
    const logger = winston.createLogger({
        levels:levelOptions.levels,
        transports:[
            new winston.transports.Console({ level :"info",
            format: winston.format.combine(
                winston.format.colorize({colors: levelOptions.color}),
                winston.format.simple()
            )
        }),
            new winston.transports.File({ filename: "./error.log", level:"warning",
            format: winston.format.simple()})
        ]
    })


    export const addLogger =(req,res,next)=>{
        req.logger=logger;
        req.logger.info(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`)
        next();
    }