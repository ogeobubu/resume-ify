import axios from "axios"
import { toast } from "react-toastify"

export const signin = async (data) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/signin`, data)
    toast.success(response.data.message)
  } catch (error) {
    return toast.error(error.response?.data?.message || "An error occurred! Try again later.")
  }
}

export const signup = async (data) => {
  try {
    const response = await axios.post(`http://localhost:3000/api/signup`, data)
    toast.success(response.data.message)
  } catch (error) {
    return toast.error(error.response?.data?.message || "An error occurred! Try again later.")
  }
}