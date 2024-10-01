import axios from "axios"
import { toast } from "react-toastify"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const signin = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/signin`, data)
    toast.success(response.data.message)
  } catch (error) {
    return toast.error(error.response?.data?.message || "An error occurred! Try again later.")
  }
}

export const signup = async (data) => {
  try {
    const response = await axiosInstance.post(`/api/signup`, data)
    toast.success(response.data.message)
  } catch (error) {
    return toast.error(error.response?.data?.message || "An error occurred! Try again later.")
  }
}