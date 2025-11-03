import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MenuUser() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [user, setUser] = useState(null);
  const [showGuestPopup, setShowGuestPopup] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const navigate = useNavigate();

  // Lấy menu và user từ localStorage
  useEffect(() => {
    fetchMenu();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu");
      setMenu(res.data);
    } catch (err) {
      console.error("Lỗi khi tải menu:", err);
    }
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = (item) => {
    if (!user) {
      alert("Vui lòng đăng nhập để chọn món!");
      return;
    }

    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // Cập nhật số lượng
  const handleQuantityChange = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  };

  // Xóa món
  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Bắt đầu thanh toán: hỏi số khách
  const handleCheckout = () => {
    if (cart.length === 0) return alert("Giỏ hàng trống!");
    setShowGuestPopup(true);
  };

  // Xác nhận số khách và xử lý đặt món
  const confirmGuestAndCheckout = () => {
    if (guestCount < 1) return alert("Số khách phải lớn hơn 0!");

    const choice = window.confirm(
      "Bạn muốn mang về?\n\n• OK = Mang về (thanh toán ngay)\n• Cancel = Uống tại quán (chọn bàn)"
    );

    if (choice) {
      // MANG VỀ: Gửi order ngay
      const payload = {
        tableId: null,
        guestCount,
        items: cart.map((c) => ({
          menuId: c.id,
          name: c.name,
          quantity: c.qty,
          price: c.price,
        })),
        orderType: "MANG_VỀ",
      };

      api
        .post("/orders", payload)
        .then(() => {
          alert("Đặt món mang về thành công! Đơn đã được thanh toán.");
          setCart([]);
          setShowCart(false);
          setShowGuestPopup(false);
        })
        .catch((err) => {
          console.error("Lỗi đặt món mang về:", err);
          alert(
            "Lỗi đặt món: " +
              (err.response?.data?.message || "Vui lòng kiểm tra đăng nhập.")
          );
        });
    } else {
      // UỐNG TẠI QUÁN: Chuyển sang trang đặt bàn với giỏ hàng
      navigate("/tables", {
        state: {
          preselectedCart: cart.map((c) => ({
            menuId: c.id,
            name: c.name,
            price: c.price,
            qty: c.qty,
          })),
          guestCount,
        },
      });
      setShowGuestPopup(false);
      setShowCart(false);
    }
  };

  return (
    <div className="menu-page" style={{ padding: "20px" }}>
      {/* Header */}
      <div
        className="menu-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Menu Quán Cà Phê</h1>

        {user ? (
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => setShowCart(!showCart)}
          >
            <FaShoppingCart size={28} color="#444" />
            {cart.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -10,
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cart.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            )}
          </div>
        ) : (
          <span style={{ color: "#888" }}>(Đăng nhập để đặt món)</span>
        )}
      </div>

      {/* Danh sách món */}
      <div
        className="menu-list"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {menu.map((item) => (
          <div
            key={item.id}
            className="menu-card"
            style={{
              border: "1px solid #eee",
              borderRadius: "10px",
              padding: "15px",
              width: "250px",
              textAlign: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            {item.imageUrl ? (
              <img
                src={`http://localhost:8080${item.imageUrl}`}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/180?text=No+Image";
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "180px",
                  background: "#f0f0f0",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#aaa",
                }}
              >
                No Image
              </div>
            )}
            <h3 style={{ margin: "10px 0 5px" }}>{item.name}</h3>
            <p style={{ fontWeight: "bold", color: "#d32f2f" }}>
              {item.price.toLocaleString()} đ
            </p>
            <button
              onClick={() => handleAddToCart(item)}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 16px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Chọn món
            </button>
          </div>
        ))}
      </div>

      {/* Popup giỏ hàng */}
      {showCart && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "20px",
            width: "380px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
            zIndex: 1000,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Giỏ hàng</h3>
          {cart.length === 0 ? (
            <p style={{ color: "#888", fontStyle: "italic" }}>
              Chưa có món nào.
            </p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <strong>{item.name}</strong>
                    <br />
                    <small>{item.price.toLocaleString()} đ</small>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      style={{ width: "50px", textAlign: "center" }}
                    />
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        width: "28px",
                        height: "28px",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={handleCheckout}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px",
                  marginTop: "15px",
                  width: "100%",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Thanh toán
              </button>
            </>
          )}
        </div>
      )}

      {/* Popup nhập số khách */}
      {showGuestPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              width: "400px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h4>Bạn đi mấy người</h4>
            <input
              type="number"
              min="1"
              value={guestCount}
              onChange={(e) =>
                setGuestCount(Math.max(1, parseInt(e.target.value) || 1))
              }
              style={{
                width: "100px",
                padding: "10px",
                fontSize: "18px",
                margin: "15px 0",
                textAlign: "center",
              }}
            />
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              <button
                onClick={confirmGuestAndCheckout}
                style={{
                  background: "#28a745",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Xác nhận
              </button>
              <button
                onClick={() => setShowGuestPopup(false)}
                style={{
                  background: "#6c757d",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuUser;
