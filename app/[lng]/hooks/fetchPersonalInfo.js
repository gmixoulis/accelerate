import { NextResponse } from "next/server"
import { BACKEND_URL } from "@/server"

import axiosRequest from "@/app/[lng]/hooks/axiosRequest"
import getAccessToken from "@/app/[lng]/hooks/getAccessToken"

const fetchPersonalInfo = async () => {
  console.log("Fetching personal info")
  const { ProfileID } = getAccessToken()

  if (!ProfileID) {
    console.error("Failed to retrieve ProfileID from access token")
    return null
  }

  const response = await axiosRequest(`${BACKEND_URL}user-profile/${ProfileID}`)

  return response.data
}

export default fetchPersonalInfo
