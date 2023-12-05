import { BACKEND_URL } from "@/server"
import Cookies from "js-cookie"

import axiosRequest from "@/app/[lng]/hooks/axiosRequest"
import getAccessToken from "@/app/[lng]/hooks/getAccessToken"

const cookieNames = [
  "accessToken",
  "refreshToken",
  "CloudFront-Key-Pair-Id",
  "CloudFront-Signature",
  "CloudFront-Policy",
  "CloudfrontDomain",
]

function logoutFunction() {
  cookieNames.forEach(function (cookieName) {
    try {
      if (!cookieName.includes("CloudFront")) {
        Cookies.remove(cookieName)
      } else {
        Cookies.remove(cookieName, { domain: ".accelerate.unic.ac.cy" })
      }
    } catch (e) {
      console.log(e)
    }
  })
  Cookies.set("i18next", "en")
  localStorage.clear()
  localStorage.setItem("i18nextLng", "en")
  localStorage.setItem("theme", "system")

  //Force redirect to /signin
  window.location.replace("/signin")
}

const revokeSession = async () => {
  const { SessionID } = getAccessToken()

  //Make a dummy call to the health end-point
  const url = `${BACKEND_URL}health`
  const responseHealth = await axiosRequest(url, "get")
  console.log(responseHealth)
  try {
    const urlSession = `${BACKEND_URL}session/revoke/${SessionID}`
    const responseSession = await axiosRequest(urlSession, "patch")

    if (responseSession.status === 200 || responseSession.status === 204) {
      console.log("Session revoked successfully.")
      logoutFunction()

      //window.location.replace("/signin")
      //window.location.reload()
    } else {
      {
        process.env.NEXT_PUBLIC_APP_ENV !== "PROD"
          ? console.log("Failed to revoke session.")
          : null
      }

      logoutFunction()
    }
  } catch (error) {
    logoutFunction()

    {
      process.env.NEXT_PUBLIC_APP_ENV !== "PROD"
        ? console.error("Error revoking session:", error)
        : null
    }
  }
} //end revokeSession()

export default revokeSession
