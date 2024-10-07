// api.ts

import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";
import { SignInData, SignUpData, ApiResponse } from "./types";

const token = JSON.parse(localStorage.getItem("resumeToken") || "null");

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const signin = async (data: SignInData): Promise<ApiResponse<{ token: string }>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<{ token: string }>>(`/api/signin`, data);
        return response.data;
    } catch (error) {
        toast.error("Sign-in failed!");
        throw error;
    }
};

export const signup = async (data: SignUpData): Promise<ApiResponse<null>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<null>>(`/api/signup`, data);
        return response.data;
    } catch (error) {
        toast.error("Sign-up failed!");
        throw error;
    }
};

export const getUser = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<any>>(`/api/user`)
    return response
  } catch (error) {
    throw error;
  }
}

export const interviewPrep = async (data: any): Promise<ApiResponse<any>> => {
    try {
        const response = await axiosInstance.post<ApiResponse<any>>(`/api/interview-prep`, data);
        return response.data;
    } catch (error) {
        toast.error("Interview preparation failed!");
        throw error;
    }
};