import winston, { format, createLogger, transports } from 'winston';
import 'winston-daily-rotate-file';
import { v4 as uuidv4 } from 'uuid';

const { combine, timestamp, json, align, printf } = winston.format;

class MyLogger {
    constructor() {
        const formatPrint = format.printf(
            ({ level, message, context, requestId, timestamp, metadata }) => {
                return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`;
            }
        )

        this.logger = createLogger({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                formatPrint
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true, // true: backup log zipped archive
                    maxSize: '1m', // dung luong file log
                    maxFiles: '14d',
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    ),
                    level: 'info'
                }),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true, // true: backup log zipped archive
                    maxSize: '1m', // dung luong file log
                    maxFiles: '14d',
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    ),
                    level: 'error'
                }),
            ]
        })
    }

    commonParams(params) {
        let context, req, metadata;
        if (!Array.isArray(params)) {
            context = params
        } else {
            [context, req, metadata] = params;
        }

        const requestId = req?.requestId || uuidv4();
        return {
            requestId, context, metadata
        }
    }

    log(message, params) {
        const paramLog = this.commonParams(params)
        const logObject = Object.assign({
            message
        }, paramLog)

        this.logger.info(logObject)
    }

    error(message, params) {
        const paramLog = this.commonParams(params)
        const logObject = Object.assign({
            message
        }, paramLog)

        this.logger.error(logObject)
    }
}

export default new MyLogger();