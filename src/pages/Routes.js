import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuthContext } from "contexts/AuthContext";
import Header from "../components/Header/Header";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import Footer from "components/Footer/Footer";
import Frontend from "./Frontend";

export default function Index() {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  const showFooter = !location.pathname.startsWith('/dashboard');

  return (
    <>
      <Header />
      <Routes>
        <Route path="/*" element={<Frontend />} />
        <Route
          path="auth/*"
          element={!isAuthenticated ? <Auth /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard/*"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth/login" />}
        />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
}
