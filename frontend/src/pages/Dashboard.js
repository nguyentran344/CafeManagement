import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({ totalCustomers: 0, totalRevenue: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      alert("Không thể lấy thống kê");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Thống kê hôm nay</h3>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card p-3 text-center">
            <h5>Tổng số khách</h5>
            <h2>{stats.totalCustomers}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 text-center">
            <h5>Doanh thu</h5>
            <h2>{stats.totalRevenue} VND</h2>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <button
          className="btn btn-primary"
          onClick={() => navigate("/manage-tables")}
        >
          Quản lý bàn
        </button>
      </div>
    </div>
  );
}
