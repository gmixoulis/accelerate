import { BACKEND_URL } from "@/server"

import axiosRequest from "./axiosRequest"

const fetchApps = async () => {
  const response = await axiosRequest(`${BACKEND_URL}app/user/`)
  return response.data.apps
}

export default fetchApps
