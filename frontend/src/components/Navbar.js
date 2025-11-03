import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/" style={{ textDecoration: "none", fontWeight: "bold" }}>
          CafeMgmt
        </Link>

        <Link to="/" style={{ textDecoration: "none" }}>
          Menu
        </Link>

        <Link to="/tables" style={{ textDecoration: "none" }}>
          Đặt bàn
        </Link>

        {role === "ROLE_ADMIN" && (
          <>
            <Link to="/admin/menu" style={{ textDecoration: "none" }}>
              Quản lý menu
            </Link>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              Dashboard
            </Link>
          </>
        )}
      </div>

      <div>
        {token ? (
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
