import { BACKEND_URL } from "@/server"

import axiosRequest from "@/app/[lng]/hooks/axiosRequest"
import getAccessToken from "@/app/[lng]/hooks/getAccessToken"

const fetchSocials = async () => {
  const { UserID } = getAccessToken()

  const response = await axiosRequest(
    `${BACKEND_URL}user-social/UserID/${UserID}`
  )
  return response.data
}

export default fetchSocials
