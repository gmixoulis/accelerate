import { BACKEND_URL } from "@/server"
import axios from "axios"
import Cookies from "js-cookie"

import { axiosBearerInterceptor } from "@/app/[lng]/hooks/axiosInterceptors"
import getAccessToken from "@/app/[lng]/hooks/getAccessToken"

const API_URL = ""

const bearerInstance = axios.create()

bearerInstance.interceptors.request.use(axiosBearerInterceptor, undefined)

bearerInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    error.config.retries = error.config.retries || 0

    try {
      if (error.response.status === 401) {
        const { refreshToken } = getAccessToken()

        const newResponse = await fetch(
          `${BACKEND_URL}rotateJwtTokens/`,

          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        )
        if (!newResponse.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const responseData = await newResponse.json()

        const newAccessToken = responseData.accessToken
        const newRefreshToken = responseData.refreshToken
        Cookies.set("accessToken", newAccessToken)
        Cookies.set("refreshToken", newRefreshToken)

        if (newAccessToken === Cookies.get("accessToken")) {
          console.log("Access Token is the same, has been updated.....")
        }
        return await axiosRequest(
          error.config.url,
          error.config.method,
          error.config.data
        )
      }
    } catch (err) {
      console.err("Error refreshing token:", err)
      // const response = NextResponse.redirect(new URL(`/${lng}/signin`, req.url))
    }

    // Retry The Request
    if (error.config.retries < 3) {
      error.config.retries++
      return axios(error.config)
    }

    throw error
  }
)

const axiosRequest = async (url, verb = "get", data) => {
  if (!data || data === "") {
    data = {}
  }

  let response

  if (verb === "get") {
    response = await bearerInstance.get(url, data)
  } else if (verb === "post") {
    response = await bearerInstance.post(url, data)
  } else if (verb === "patch") {
    response = await bearerInstance.patch(url, data)
  } else if (verb === "put") {
    response = await bearerInstance.put(url, data)
  } else if (verb === "delete") {
    response = await bearerInstance.delete(url, data)
  }

  if ((response.data && response.data.error) || !response.data) {
    throw new Error(response.data.error || "Undefined response data")
  }

  return response
}

export default axiosRequest
