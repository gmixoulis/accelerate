const ENDPOINT = '/prompt-response-management/prompt';
import { instance } from "./powerflowRequest";

export async function getPrompts(params, userId) {

 try {
  const searchParams = new URLSearchParams();
  searchParams.append("user_id", userId.toString());
  searchParams.append("page", params.page);
  searchParams.append("page_size", params.pageSize);
  searchParams.append("status", params.status);
  searchParams.append("mode", params.mode);
  searchParams.append("search", params.search);
  searchParams.append("start_date", params.startDate);
  searchParams.append("end_date", params.endDate);


  const config = {
    params: searchParams,
    cache: "no-store",
  };


  const url = `${ENDPOINT}/`;

  const response = await instance.get(url, config);
  return response.data;

 } catch (err) {
   if (err.response) {
    return {message: err.message, status: err.response.status, data: err.response.data};
  }
  return {message: err.message};
 }
}

export async function getPrompt(chatId) {
  try {
    const config = {
      cache: "no-store",
    }

    const url = `${ENDPOINT}/${chatId}`

    const response = await instance.get(url, config)
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

//call API to delete prompts
export async function deletePrompt(chatId, userId) {
  try {
    //const params = new URLSearchParams()
    //params.append("user_id", userId.toString())

    const url = `${ENDPOINT}/${chatId}`

    const response = await instance.delete(url)
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

// calls API to send prompts
export async function sendPrompts(prompt) {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    const url = `${ENDPOINT}/`

    const response = await instance.post(url, prompt, config)
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
