import { instance } from "./powerflowRequest";
const ENDPOINT = '/user-lists';

export async function getLists(user_id) {
  try {
    const url = `${ENDPOINT}/${user_id}`;
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

export async function getList(list_id, user_id) {
  try {
    const url = `${ENDPOINT}/${user_id}/${list_id}`;

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


export async function addList(llm_model) {
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

export async function editList(list) {
  try {
    const url = `${ENDPOINT}/${list.user_id}/${list.list_id}`;

    const config = {  
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const response = await instance.put(url, list, config);
    return response.data;

  } catch (err) {
    if (err.response) {
      return {message: err.message, status: err.response.status, data: err.response.data};
    }
    return {message: err.message};
  }
}

export async function deleteList(list_id, user_id) {
  try {
    const url = `${ENDPOINT}/${user_id}/${list_id}`;

    const response = await instance.delete(url);
    return response.data;

  } catch (err) {
    if (err.response) {
      return {message: err.message, status: err.response.status, data: err.response.data};
    }
    return {message: err.message};
  }
}