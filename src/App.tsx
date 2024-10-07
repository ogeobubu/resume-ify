import React from "react"
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "./api";
import Signup from "./pages/signup.tsx";
import Signin from "./pages/signin.tsx";
import Interview from "./pages/interview.tsx";
import { getUser } from "./api"

const App: React.FC = () => {
  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await getUser()
        console.log(response)
      } catch (error) {
        
      }
    }
    getProfile()
  }, [])
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/interview-prep" element={<Interview />} />
        <Route path="*" element={<p>400</p>} />
      </Routes>
    </div>
  );
};

export default App;
