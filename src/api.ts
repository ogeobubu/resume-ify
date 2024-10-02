import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const signin = async (data) => {
  const response = await axiosInstance.post(`/api/signin`, data);
  return response;
};

export const signup = async (data) => {
    const response = await axiosInstance.post(`/api/signup`, data);
    return response;
};
