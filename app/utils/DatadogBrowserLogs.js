"use client"

const shouldSendDatadogLogs =
  process.env.NEXT_PUBLIC_DATADOG_LOGGING_ACTIVE === "true"

class LogObject {
  constructor({ functionName, methodName }) {
    this.functionName = functionName
    this.methodName = methodName
  }
}

const ErrorStatusType = {
  warn: "warn",
  debug: "debug",
  error: "error",
  info: "info",
}

/**
 *
 * @param functionName string
 * @param methodName string
 * @param error Error
 * @param message string
 * @param statusType ErrorStatusType
 */
const Log = (message, statusType, functionName, methodName, error = null) => {
  const logObject = new LogObject({ functionName, methodName })

  if (shouldSendDatadogLogs === true) {
    window.DD_LOGS &&
      window.DD_LOGS.logger.log(message, logObject, statusType, error)
  } else {
    console[statusType](message, logObject, error)
  }
}

module.exports = { Log, ErrorStatusType }
