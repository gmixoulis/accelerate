import axios from "axios"

const instance = axios.create({})

instance.interceptors.response.use(undefined, async (error) => {
  error.config.retries = error.config.retries || 0

  if (error.config.retries >= 2) {
    return Promise.reject(error)
  }

  error.config.retries++

  // Retry the request.
  return instance.request(error.config)
})

const axiosRequest = async (url, verb = "get", data) => {
  // const { refreshToken } = getAccessToken()

  if (!data || data === "") {
    data = {}
  }

  // try {
  let response

  if (verb === "get") {
    response = await instance.get(url, data)
  } else if (verb === "post") {
    response = await instance.post(url, data)
  } else if (verb === "patch") {
    response = await instance.patch(url, data)
  } else if (verb === "put") {
    response = await instance.put(url, data)
  } else if (verb === "delete") {
    response = await instance.delete(url, data)
  }

  /*console.log(response, "---> response")
    console.log(response.data, "response.data")*/

  // if (response.data && response.data.error) {
  //   throw new Error(response.data.error || "Undefined response data")
  // }

  return response
  // } catch (error) {
  //   console.error("Failed to fetch: ", error)
  //
  //   throw new Error(error)
  // }
}

export default axiosRequest
