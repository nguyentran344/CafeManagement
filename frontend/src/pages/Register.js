import React, { useState } from "react";
import api from "../api/axiosConfig";
export default function Register() {
  const [user, setUser] = useState({ username: "", password: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", user);
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi đăng ký");
    }
  };
  return (
    <div className="container mt-5">
      {" "}
      <h3>Đăng ký tài khoản</h3>{" "}
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        {" "}
        <input
          className="form-control mt-2"
          placeholder="Username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />{" "}
        <input
          type="password"
          className="form-control mt-2"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />{" "}
        <button className="btn btn-primary mt-3">Đăng ký</button>{" "}
      </form>{" "}
    </div>
  );
}
