import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    rating: 5,
    image: null,
  });
  const [editingItem, setEditingItem] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // ✅ Lấy danh sách món khi vào trang
  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu");
      setMenu(res.data);
    } catch (err) {
      console.error("Lỗi tải menu:", err);
    }
  };

  // ✅ Xử lý chọn ảnh (hiện preview)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewItem({ ...newItem, image: file });
    setPreviewImage(URL.createObjectURL(file));
  };

  // ✅ Thêm món mới
  const addItem = async () => {
    if (!newItem.name || !newItem.price)
      return alert("Vui lòng nhập đủ thông tin");

    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("price", newItem.price);
    formData.append("rating", newItem.rating);
    if (newItem.image) formData.append("image", newItem.image);

    try {
      await api.post("/menu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Thêm món thành công!");
      setNewItem({ name: "", price: "", rating: 5, image: null });
      setPreviewImage(null);
      fetchMenu();
    } catch (err) {
      alert("Không thể thêm món (chỉ admin)");
    }
  };

  // ✅ Bắt đầu sửa món
  const startEdit = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      price: item.price,
      rating: item.rating,
      image: null,
    });
    setPreviewImage(
      item.imageUrl ? `http://localhost:8080${item.imageUrl}` : null
    );
  };

  // ✅ Lưu cập nhật món
  const saveEdit = async () => {
    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("price", newItem.price);
    formData.append("rating", newItem.rating);
    if (newItem.image) formData.append("image", newItem.image);

    try {
      await api.put(`/menu/${editingItem.id || editingItem._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Cập nhật món thành công!");
      setEditingItem(null);
      setNewItem({ name: "", price: "", rating: 5, image: null });
      setPreviewImage(null);
      fetchMenu();
    } catch (err) {
      alert("Không thể cập nhật món (chỉ admin)");
    }
  };

  // ✅ Xóa món
  const deleteItem = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa món này?")) return;
    try {
      await api.delete(`/menu/${id}`);
      fetchMenu();
    } catch (err) {
      alert("Không thể xóa món (chỉ admin)");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">🍹 Quản lý Menu</h3>

      <div className="card p-4 mb-5">
        <h5>{editingItem ? "✏️ Sửa món" : "➕ Thêm món mới"}</h5>

        <div className="row mt-3">
          <div className="col-md-4">
            {previewImage ? (
              <img
                src={previewImage}
                alt="preview"
                className="img-fluid rounded"
                style={{ height: "180px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center border rounded bg-light"
                style={{ height: "180px" }}
              >
                <small className="text-muted">Chưa chọn ảnh</small>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="form-control mt-2"
              onChange={handleImageChange}
            />
          </div>

          <div className="col-md-8">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Tên món"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Giá (VND)"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
            />
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Số sao (1–5)"
              min="1"
              max="5"
              value={newItem.rating}
              onChange={(e) =>
                setNewItem({ ...newItem, rating: e.target.value })
              }
            />
            {editingItem ? (
              <button className="btn btn-warning me-2" onClick={saveEdit}>
                💾 Lưu thay đổi
              </button>
            ) : (
              <button className="btn btn-success" onClick={addItem}>
                ➕ Thêm món
              </button>
            )}
            {editingItem && (
              <button
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setEditingItem(null);
                  setNewItem({ name: "", price: "", rating: 5, image: null });
                  setPreviewImage(null);
                }}
              >
                ❌ Hủy
              </button>
            )}
          </div>
        </div>
      </div>

      <h5>📋 Danh sách món</h5>
      <div className="row">
        {menu.map((m) => (
          <div key={m.id || m._id} className="col-md-3 mb-4">
            <div className="card shadow-sm p-2">
              <img
                src={
                  m.imageUrl
                    ? `http://localhost:8080${m.imageUrl}`
                    : "https://via.placeholder.com/150"
                }
                alt={m.name}
                className="card-img-top rounded"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h6>{m.name}</h6>
                <p className="mb-1 text-muted">{m.price} VND</p>
                <p className="mb-2 text-warning">⭐ {m.rating}/5</p>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => startEdit(m)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => deleteItem(m.id || m._id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
