import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import { AuthProvider } from "../components/AuthContext";
import ActiveUser from "../components/ActiveUser";
import DMPage from "../components/DMPage";
import SignUp from "../components/SignUp";

const Routing = () => {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<SignUp />} />

          <Route path="/online" element={<ActiveUser />} />
          <Route path="/dm/:userId" element={<DMPage />} />
        </Routes>
      </AuthProvider>
    </>
  );
};

export default Routing;
