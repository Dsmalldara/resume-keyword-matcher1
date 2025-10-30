import { format, transports, createLogger } from "winston";
import { existsSync, mkdir } from "fs"; 
import DailyRotateFile from "winston-daily-rotate-file";
import winston from 'winston';

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue'
});

if(!existsSync('logs')){
    mkdir('logs', (err) => {
        if(err){
            console.error('Error creating logs directory', err);
        }
    });
}

const logger = createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true })
     
    ),
    transports:[
        new transports.Console({
            format: format.combine(
                format.colorize({ all: true }),
                format.printf(info => {
                    const { timestamp, level, message, ...meta } = info;
                    const metaStr = Object.keys(meta).length ? 
                        `\n${JSON.stringify(meta, null, 2)}` : '';
                    return `${timestamp} [${level}]: ${message}${metaStr}`;
                })
            )
        }),
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxFiles: '14d',
            format: format.json() // Add JSON format only for files
        }),
        new DailyRotateFile({
            filename: 'logs/warn-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'warn',
            maxFiles: '14d',
            format: format.json()
        }),
        new DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            maxFiles: '14d',
            format: format.json()
        })
    ]
});

export default logger;