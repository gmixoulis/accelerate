import { BACKEND_URL } from "@/server"

import axiosRequest from "../../hooks/axiosRequest"

const fetchApps = async () => {
  const response = await axiosRequest(`${BACKEND_URL}continent/`)
  return response.data
}

export default fetchApps
