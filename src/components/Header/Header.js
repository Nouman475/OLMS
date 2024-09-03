import { useAuthContext } from "contexts/AuthContext";
import React, { useRef } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const { isAuthenticated } = useAuthContext();
  let nav = useRef(null);

  const toggleMenu = () => {
    nav.current.classList.toggle("active");
  };

  return (
    <header className="header mb-0">
      <div className="logo">
        <span id="logo">OLMS</span>
      </div>
      <div className="menu-toggle" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <nav className="nav" ref={nav}>
        {isAuthenticated ? (
          <>
            <Link to="/products">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/auth/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}
