import { NextResponse } from "next/server"
import acceptLanguage from "accept-language"
import fetch from "isomorphic-unfetch"
import jwt_decode from "jwt-decode"

import { fallbackLng, languages } from "./app/i18n/settings"
import { authRoutes, protectedRoutes } from "./app/routes"
import { BACKEND_URL } from "./server"

acceptLanguage.languages(languages)

export const config = {
  // matcher: '/:lng*'
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
}

const cookieName = "i18next"

export async function middleware(req) {
  const csp = `media-src 'self' https://*.gleap.io;
  frame-src 'self' https://*.gleap.io https://messenger-app.gleap.io https://api.gleap.io;
  default-src 'self' http://localhost:3000 https://api.gleap.io https://*.gleap.io https://cdn.lr-intake.com/;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://browser-intake-datadoghq.eu/ https://www.datadoghq-browser-agent.com https://*.gleap.io https://cdn.lr-intake.com/ https://cdn.accelerate.unic.ac.cy https://stg-api.accelerate.unic.ac.cy https://cloudflare-eth.com/ https://explorer-api.walletconnect.com/;
  connect-src 'self' https://cdn.accelerate.unic.ac.cy https://cdn-stg.accelerate.unic.ac.cy https://browser-intake-datadoghq.eu/ https://*.s3.eu-central-1.amazonaws.com http://localhost:3000 https://*.gleap.io wss://ws.gleap.io https://api.gleap.io https://dashapi.gleap.io https://stg-api.accelerate.unic.ac.cy https://api.accelerate.unic.ac.cy https://jee16cr0z2.execute-api.eu-central-1.amazonaws.com wss://relay.walletconnect.com/ https://cloudflare-eth.com/ https://cdn.accelerate.unic.ac.cy https://cdn.lr-intake.com/logger-1.min.j;
  img-src 'self'  https://cdn-stg.accelerate.unic.ac.cy https://*.gleap.io https:  blob: data:;
  style-src 'self' 'unsafe-inline';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self';`
    .replace(/\s{2,}/g, " ")
    .trim()

  let resp = NextResponse.next()

  if (
    req.nextUrl.pathname.indexOf("icon") > -1 ||
    req.nextUrl.pathname.indexOf("chrome") > -1
  ) {
    resp.headers.set("Content-Security-Policy", csp)

    if (req.nextUrl.pathname.startsWith("stg-api")) {
      resp.headers.append(
        "Access-Control-Allow-Origin",
        "https://stg-api.accelerate.unic.ac.cy"
      )
    } else if (req.nextUrl.pathname.startsWith("api")) {
      resp.headers.append(
        "Access-Control-Allow-Origin",
        "https://api.accelerate.unic.ac.cy"
      )
    } else {
      resp.headers.append(
        "Access-Control-Allow-Origin",
        "http://localhost:3000"
      )
    }

    return resp
  }

  const pathWithoutLanguagePrefix = req.nextUrl.pathname
    .split("/")
    .slice(2)
    .join("/")
  let lng
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName).value)
  if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"))
  if (!lng) lng = fallbackLng

  let accessToken = req.cookies.get("accessToken")?.value
  let currentUser = accessToken ? JSON.stringify(jwt_decode(accessToken)) : null
  let refreshToken = req.cookies.get("refreshToken")?.value
  // let refreshTimes = req.cookies.get("refreshTimes")?.value || 0
  // Check if the token is about to expire
  if (currentUser && Date.now() / 1000 > JSON.parse(currentUser).exp - 60) {
    // 2 minutes before expiry
    // Call the refresh token API
    //const response = NextResponse.next()

    // accessToken = req.cookies.get("accessToken")?.value
    // currentUser = accessToken ? JSON.stringify(jwt_decode(accessToken)) : null
    // refreshToken = req.cookies.get("refreshToken")?.value
    // refreshTimes = req.cookies.get("refreshTimes")?.value
    try {
      let respo = await fetch(`${BACKEND_URL}rotateJwtTokens/`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      })
      if (respo.error || respo.data?.error) {
        throw new Error(`HTTP error! status: ${respo.status}`)
      }
      const data = await respo.json()
      // Update the accessToken and refreshToken with the new ones from the response

      const newAccessToken = data.accessToken
      if (newAccessToken) {
        // Make the POST request to the specified endpoint
        const response = await fetch(
          `${BACKEND_URL}system/get-cloudfront-signed-cookie`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
            // Add any headers or data as needed
          }
        )

        if (response.error || response.data?.error) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        // Parse the response to get cloudFrontCookies
        const cloudFrontCookies = await response.json()

        // Set cookies for .accelerate.unic.ac.cy with required attributes
        for (const [name, value] of Object.entries(cloudFrontCookies)) {
          resp.cookies.set(name, value, {
            domain: ".accelerate.unic.ac.cy",
            secure: true, // Secured
            sameSite: "none",
          })
        }
      }

      const newRefreshToken = data.refreshToken
      resp.cookies.set("accessToken", newAccessToken)
      resp.cookies.set("refreshToken", newRefreshToken)

      currentUser = JSON.stringify(jwt_decode(newAccessToken))
      return resp
    } catch (error) {
      console.error("Error refreshing token:", error)
      const response = NextResponse.redirect(new URL(`/${lng}/signin`, req.url))
      response.cookies.delete("accessToken")
      response.cookies.delete("refreshToken")
      return response
    }
  }

  if (currentUser && pathWithoutLanguagePrefix === "signin") {
    const response = NextResponse.redirect(new URL(`/`, req.url))
    response.headers.set("Content-Security-Policy", csp)
    return response
  }

  if (
    (protectedRoutes.includes(pathWithoutLanguagePrefix) ||
      pathWithoutLanguagePrefix.startsWith("powerflow/") ||
      pathWithoutLanguagePrefix.startsWith("system-app/") ||
      pathWithoutLanguagePrefix.startsWith("tenants-app/") ||
      pathWithoutLanguagePrefix.startsWith("myfiles/")) &&
    (!currentUser || Date.now() / 1000 > JSON.parse(currentUser).exp)
  ) {
    req.cookies.delete("accessToken")
    const response = NextResponse.redirect(new URL(`/${lng}/signin`, req.url))
    response.cookies.delete("accessToken")
    response.cookies.delete("refreshToken")
    response.headers.set("Content-Security-Policy", csp)
    return response
  }

  if (authRoutes.includes(pathWithoutLanguagePrefix) && currentUser) {
    const response = NextResponse.redirect(new URL(`/`, req.url))
    response.headers.set("Content-Security-Policy", csp)
    return response
  }
  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.rewrite(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
    )
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer"))
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    )
    const response = NextResponse.next()

    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  resp.headers.set("Content-Security-Policy", csp)
  return resp
}
