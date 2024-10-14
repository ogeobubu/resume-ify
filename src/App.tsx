import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "./pages/signup";
import Signin from "./pages/signin";
import Interview from "./pages/interview";

const App: React.FC = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/interview-prep" element={<Interview />} />
        <Route path="*" element={<p>404 Not Found</p>} />
      </Routes>
    </div>
  );
};

export default App;
