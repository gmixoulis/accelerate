import { BACKEND_URL } from "@/server"
import qs from "qs"

import axiosRequest from "@/app/[lng]/hooks/axiosRequest"
import getAccessToken from "@/app/[lng]/hooks/getAccessToken"

const fetchPersonalInfo = async (data) => {
  const { ProfileID } = getAccessToken()

  data = qs(data)

  const url = `${BACKEND_URL}user-profile/${ProfileID}`
  try {
    const response = await axiosRequest(url, "patch", data)
    return response.data
  } catch (error) {
    console.log("Error:", error)
    return null
  }
}
export default fetchPersonalInfo
