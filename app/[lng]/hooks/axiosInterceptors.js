// Create a global error interceptor
// import axios from "axios"

import getAccessToken from "@/app/[lng]/hooks/getAccessToken"

// let axiosNoBearerErrorHandler = async (error) => {
//   error.config.retries = error.config.retries || 0
//
//   if (error.config.retries >= 3) {
//     return Promise.reject(error)
//   }
//   console.log("Error Retries>>>>>>>...", error.config.retries)
//
//   error.config.retries += 1
//
//   // Retry the request.
//   return instance.request(error.config)
// }

// const axiosBearerErrorHandler = async (error, instance) => {
//   console.log("=========axiosBearerErrorHandler")
//   console.log("error", error)
//   error.config.retries = error.config.retries || 0
//   if (error.config.retries >= 2) {
//     throw error
//   }
//
//   console.log("Error Retries>>>>>>>...", error.config.retries)
//   error.config.retries++
//
//   // // Retry the request.
//   return await instance(error.config)
// }

const axiosBearerInterceptor = async (config) => {
  console.log("Axios Request Interceptor")
  const { accessToken, refreshToken } = getAccessToken()

  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`
    // axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
  }

  return config
}

export { axiosBearerInterceptor }
