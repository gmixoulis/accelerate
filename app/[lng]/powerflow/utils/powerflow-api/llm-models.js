import { instance } from "./powerflowRequest";
const ENDPOINT = '/llm-model-management';

export async function getModels(api_name) {
  try {
    const url = `${ENDPOINT}/${api_name}`;

    const config = {
      cache: 'no-store'
    }

    const response = await instance.get(url, config);
    return response.data;
  } catch (err) {
    if (err.response) {
      return {message: err.message, status: err.response.status, data: err.response.data};
    }
    return {message: err.message};
  }
}


export async function addModel(llm_model) {
  try {
    const url = `${ENDPOINT}/`;

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await instance.post(url, llm_model, config);
    return response.data;

  } catch (err) {
    if (err.response) {
      return {message: err.message, status: err.response.status, data: err.response.data};
    }
    return {message: err.message};
  }
}

export async function editModel(llm_model) {
  try {
    const url = `${ENDPOINT}/${llm_model.model_id}`;

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await instance.put(url, llm_model, config);
    return response.data;

  } catch (err) {
    if (err.response) {
      return {message: err.message, status: err.response.status, data: err.response.data};
    }
    return {message: err.message};
  }
}

export async function deleteModel(model_id) {
  try {
    const url = `${ENDPOINT}/${model_id}`;

    const response = await instance.delete(url);
    return response.data;

  } catch (err) {
    if (err.response) {
      return {message: err.message, status: err.response.status, data: err.response.data};
    }
    return {message: err.message};
  }
}