import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useLocation } from "react-router-dom";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [orders, setOrders] = useState([]);
  const [guestCount, setGuestCount] = useState(1);
  const location = useLocation();

  useEffect(() => {
    fetchTables();
    fetchMenu();

    // Nhận dữ liệu từ MenuUser (nếu có)
    const state = location.state;
    if (state?.preselectedCart) {
      setOrders(
        state.preselectedCart.map((item) => ({
          menuId: item.menuId,
          name: item.name,
          price: item.price,
          qty: item.qty || 1,
        }))
      );
      setGuestCount(state.guestCount || 1);
    }
  }, [location]);

  const fetchTables = async () => {
    try {
      const res = await api.get("/tables");
      setTables(res.data);
    } catch (err) {
      console.error("Lỗi tải bàn:", err);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu");
      setMenu(res.data);
    } catch (err) {
      console.error("Lỗi tải menu:", err);
    }
  };

  const handleSelectTable = (table) => {
    if (table.status !== "CHƯA_CÓ_KHÁCH") {
      alert("Bàn này đang có khách!");
      return;
    }
    setSelectedTable(table);
  };

  const addToOrder = (m) => {
    const exists = orders.find((o) => o.menuId === m.id);
    if (exists) {
      setOrders(
        orders.map((o) => (o.menuId === m.id ? { ...o, qty: o.qty + 1 } : o))
      );
    } else {
      setOrders([
        ...orders,
        { menuId: m.id, name: m.name, price: m.price, qty: 1 },
      ]);
    }
  };

  const updateQuantity = (menuId, qty) => {
    if (qty < 1) {
      setOrders(orders.filter((o) => o.menuId !== menuId));
    } else {
      setOrders(orders.map((o) => (o.menuId === menuId ? { ...o, qty } : o)));
    }
  };

  const handleOrder = async () => {
    if (!selectedTable) return alert("Vui lòng chọn bàn!");
    if (orders.length === 0) return alert("Chưa chọn món nào!");
    if (guestCount < 1) return alert("Số khách phải lớn hơn 0!");

    const payload = {
      tableId: selectedTable.id,
      guestCount,
      items: orders.map((o) => ({
        menuId: o.menuId,
        name: o.name,
        quantity: o.qty,
        price: o.price,
      })),
      orderType: "UỐNG_TẠI_QUÁN",
    };

    try {
      await api.post("/orders", payload);
      alert("Đặt bàn thành công!");
      setSelectedTable(null);
      setOrders([]);
      setGuestCount(1);
      fetchTables();
    } catch (err) {
      alert(
        "Lỗi đặt bàn: " +
          (err.response?.data?.message || "Vui lòng kiểm tra lại.")
      );
    }
  };

  return (
    <div className="container mt-4">
      <h3>Danh sách bàn</h3>
      <div className="row">
        {tables.map((t) => (
          <div key={t.id} className="col-md-3 mb-3">
            <div
              className={`card p-3 text-center ${
                t.status === "CHƯA_CÓ_KHÁCH"
                  ? "border-success"
                  : "border-warning"
              }`}
              style={{
                cursor:
                  t.status === "CHƯA_CÓ_KHÁCH" ? "pointer" : "not-allowed",
                opacity: t.status === "CHƯA_CÓ_KHÁCH" ? 1 : 0.7,
              }}
              onClick={() =>
                t.status === "CHƯA_CÓ_KHÁCH" && handleSelectTable(t)
              }
            >
              <h5>Bàn {t.name}</h5>
              <p>
                <strong>{t.status.replace(/_/g, " ")}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedTable && (
        <div className="mt-5 p-4 border rounded bg-light">
          <h4>Đặt món cho {selectedTable.name}</h4>

          {/* Input số khách */}
          <div className="mb-3">
            <label>Số lượng khách:</label>
            <input
              type="number"
              min="1"
              value={guestCount}
              onChange={(e) =>
                setGuestCount(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="form-control"
              style={{
                width: "100px",
                display: "inline-block",
                marginLeft: "10px",
              }}
            />
          </div>

          {/* Danh sách món */}
          <h5>Chọn món:</h5>
          <div className="row mb-3">
            {menu.map((m) => (
              <div key={m.id} className="col-md-3 mb-2">
                <div className="card p-2">
                  <h6 className="mb-1">{m.name}</h6>
                  <p className="mb-1">{m.price.toLocaleString()} đ</p>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => addToOrder(m)}
                  >
                    Chọn
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Giỏ hàng */}
          <div className="mt-4">
            <h5>Giỏ hàng:</h5>
            {orders.length === 0 ? (
              <p className="text-muted">Chưa chọn món nào</p>
            ) : (
              <ul className="list-group mb-3">
                {orders.map((o) => (
                  <li
                    key={o.menuId}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {o.name} × {o.qty}
                    </span>
                    <div>
                      <input
                        type="number"
                        min="0"
                        value={o.qty}
                        onChange={(e) =>
                          updateQuantity(o.menuId, parseInt(e.target.value))
                        }
                        style={{ width: "60px", marginRight: "8px" }}
                      />
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => updateQuantity(o.menuId, 0)}
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button className="btn btn-success btn-lg" onClick={handleOrder}>
              Xác nhận đặt bàn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
