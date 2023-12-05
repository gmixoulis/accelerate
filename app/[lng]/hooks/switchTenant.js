import { BACKEND_URL } from "@/server"
import Cookies from "js-cookie"

import axiosRequest from "./axiosRequest"

export default async function switchTenant(roleId, tenantId) {
  const data = {
    RoleID: roleId,
    TenantID: tenantId,
  }
  try {
    const response = await axiosRequest(
      BACKEND_URL + `tenant/switch`,
      "patch",
      data
    )
    Cookies.set("accessToken", response.data.accessToken)

    Cookies.set("refreshToken", response.data.refreshToken)
    if (response.data.accessToken) {
      try {
        const response2 = await axiosRequest(
          `${BACKEND_URL}system/get-cloudfront-signed-cookie`,
          "post"
        )
        const cloudFrontCookies = await response2.json()
        for (const [name, value] of Object.entries(cloudFrontCookies)) {
          resp.cookies.set(name, value, {
            domain: ".accelerate.unic.ac.cy",
            secure: true, // Secured
            sameSite: "none",
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
    return response.data.success
  } catch (error) {
    return error.response.data.error
  }
}
