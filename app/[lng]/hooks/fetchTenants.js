import { BACKEND_URL } from "@/server"

import axiosRequest from "@/app/[lng]/hooks/axiosRequest"
import getAccessToken from "@/app/[lng]/hooks/getAccessToken"

const fetchTenants = async () => {
  const { UserID } = getAccessToken()
  const response = await axiosRequest(`${BACKEND_URL}tenant/userID/${UserID}`)
  return response.data
}

export default fetchTenants
