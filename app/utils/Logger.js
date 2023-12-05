// import { createLogger, format, transports } from "winston"
//
// class LogObject {
//   constructor({ level, error, message }) {
//     this.level = level
//     this.error = error
//     this.message = message
//   }
// }
//
// const httpTransportOptions = {
//   host: "http-intake.logs.datadoghq.eu",
//   path: `/api/v2/logs?dd-api-key=${process.env.DATADOG_API_KEY}&ddsource=nodejs&service=accelerate-front-${process.env.JS_APP_ENV}`,
//   ssl: true,
//   onError: (e) => {
//     console.error(e)
//   },
// }
//
// const getLoggerTransports = () => {
//   const useTransports = []
//   if (process.env.JS_APP_ENV === "local") {
//     useTransports.push(new transports.Console())
//   } else {
//     useTransports.push(new transports.Http(httpTransportOptions))
//   }
//
//   return useTransports
// }
//
// const logger = createLogger({
//   level: "info",
//   exitOnError: false,
//   format: format.json(),
//   transports: getLoggerTransports(),
// })
//
// /**
//  *
//  * @param req Request
//  * @param message string
//  * @param error Error
//  * @param level string
//  * @constructor
//  */
// const Log = (req, message, error, level = "error") => {
//   const logObject = new LogObject({
//     level,
//     error,
//     message,
//   })
//
//   logger.log(level, logObject)
// }
//
// module.exports = { LogObject, Log }
