const ENDPOINT = '/saving-streamed-chats';
import { instance } from "./powerflowRequest";

// calls API to send first stream message
export async function createStream(userId, model, title) {
    try {
      const params = new URLSearchParams()
      params.append("user_id", userId.toString())
      params.append("model", model)
      params.append("title", title)
  
      const config = {
        params: params,
      }
  
      const url = `${ENDPOINT}/`
  
      const response = await instance.post(url, params, config)
      return response.data
    } catch (err) {
      if (err.response) {
        return {
          message: err.message,
          status: err.response.status,
          data: err.response.data,
        }
      }
      return { message: err.message }
    }
  }
  
  
  export async function editStream(params) {
    try {

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      }

      const url = `${ENDPOINT}/${params.chat_id}`
  
      const response = await instance.put(url, params, config)
      return response.data
    } catch (err) {
      if (err.response) {
        return {
          message: err.message,
          status: err.response.status,
          data: err.response.data,
        }
      }
      return { message: err.message }
    }
  }