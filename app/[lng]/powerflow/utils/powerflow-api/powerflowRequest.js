import axios from "axios";
const URL = process.env.POWERFLOW_API_URL;

export const instance = axios.create({
  baseURL: URL,
  headers: {
    'x-api-key': process.env.POWERFLOW_API_KEY,
  }
});