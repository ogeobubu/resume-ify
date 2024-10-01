import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Signup from "./pages/signup";
import Signin from "./pages/signin";

const App: React.FC = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="*" element={<p>400</p>} />
      </Routes>
    </div>
  );
};

export default App;
