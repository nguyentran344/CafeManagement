import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function ManageTables() {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState({}); // { orderId: order }
  const [newTable, setNewTable] = useState({ name: "" });

  useEffect(() => {
    fetchTables();
    fetchAllOrders();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await api.get("/tables");
      setTables(res.data);
    } catch (err) {
      console.error("Lỗi tải bàn:", err);
    }
  };

  const fetchAllOrders = async () => {
    try {
      const res = await api.get("/orders");
      const map = {};
      res.data.forEach((o) => (map[o.id] = o));
      setOrders(map);
    } catch (err) {
      console.error("Lỗi tải orders:", err);
    }
  };

  const addTable = async () => {
    if (!newTable.name) return alert("Nhập tên bàn");
    try {
      await api.post("/tables", newTable);
      setNewTable({ name: "" });
      fetchTables();
    } catch {
      alert("Chỉ admin mới được thêm bàn");
    }
  };

  const deleteTable = async (id) => {
    if (!window.confirm("Xóa bàn này?")) return;
    try {
      await api.delete(`/tables/${id}`);
      fetchTables();
    } catch {
      alert("Không thể xóa bàn");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tables/${id}/status`, { status }); // GIỮ NGUYÊN ENDPOINT CỦA BẠN
      fetchTables();
    } catch (err) {
      alert("Không thể cập nhật trạng thái");
      console.error(err);
    }
  };

  // Tính số khách + món
  const getOrderInfo = (table) => {
    if (table.status !== "ĐANG_PHỤC_VỤ" || !table.currentOrderId) {
      return { guestCount: 0, totalItems: 0 };
    }
    const order = orders[table.currentOrderId];
    if (!order) return { guestCount: 0, totalItems: 0 };

    const totalItems = order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const guestCount = order.guestCount || 0;
    return { guestCount, totalItems };
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-3">Quản lý Bàn</h3>

      <div className="d-flex mb-4 gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Tên bàn mới"
          value={newTable.name}
          onChange={(e) => setNewTable({ name: e.target.value })}
        />
        <button className="btn btn-success" onClick={addTable}>
          Thêm bàn
        </button>
      </div>

      <div className="row">
        {tables.map((t) => {
          const { guestCount, totalItems } = getOrderInfo(t);
          const isBusy = t.status === "ĐANG_PHỤC_VỤ";

          return (
            <div key={t.id || t._id} className="col-md-4 mb-3">
              <div
                className={`card p-3 ${
                  isBusy ? "border-warning bg-warning-subtle" : ""
                }`}
              >
                <h5>{t.name}</h5>
                <p>
                  Trạng thái:{" "}
                  <span className="fw-bold text-primary">{t.status}</span>
                </p>

                {/* HIỂN THỊ SỐ KHÁCH & MÓN */}
                {isBusy && (
                  <div className="mb-2 text-start">
                    <small className="d-block">
                      <strong>Khách:</strong> {guestCount} người
                    </small>
                    <small className="d-block">
                      <strong>Món:</strong> {totalItems} món
                    </small>
                  </div>
                )}

                <select
                  className="form-select mb-2"
                  value={t.status}
                  onChange={(e) => updateStatus(t.id || t._id, e.target.value)}
                >
                  <option value="CHƯA_CÓ_KHÁCH">Chưa có khách</option>
                  <option value="ĐANG_PHỤC_VỤ">Đang phục vụ</option>
                  <option value="ĐÃ_THANH_TOÁN">Đã thanh toán</option>
                </select>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteTable(t.id || t._id)}
                >
                  Xóa bàn
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
