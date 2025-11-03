import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [user, setUser] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", user);

      // ✅ Lưu token và role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // ✅ Lưu thông tin user để MenuUser nhận biết đăng nhập
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: user.username,
          role: res.data.role,
        })
      );

      alert("Đăng nhập thành công!");

      // ✅ Điều hướng theo vai trò
      if (res.data.role === "ROLE_ADMIN") navigate("/admin/menu");
      else navigate("/menu");
    } catch (err) {
      alert(err.response?.data?.message || "Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div
      className="container mt-5"
      style={{
        maxWidth: "420px",
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3 className="text-center mb-4">Đăng nhập</h3>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mt-2"
          placeholder="Tên đăng nhập"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          required
        />
        <input
          type="password"
          className="form-control mt-3"
          placeholder="Mật khẩu"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className="btn btn-primary w-100 mt-4"
          style={{ padding: "10px", fontWeight: "bold" }}
        >
          Đăng nhập
        </button>
      </form>
      <div className="mt-3 text-center">
        <Link to="/register">Chưa có tài khoản? Đăng ký ngay</Link>
      </div>
    </div>
  );
}
