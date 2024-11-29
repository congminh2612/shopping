import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";
import API from "../../api/api";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message
  const navigate = useNavigate();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await API.get("/orders/all");
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else if (
          response.data.orders &&
          Array.isArray(response.data.orders)
        ) {
          setOrders(response.data.orders);
        } else {
          setError("Invalid orders data format.");
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    console.log("Đăng xuất thành công");
    navigate("/admin/login");
  };

  // Edit existing order
  const handleEditOrder = async (updatedOrder) => {
    try {
      // Gửi PUT request để cập nhật đơn hàng
      const response = await API.put(
        `/orders/${updatedOrder._id}`,
        updatedOrder
      );
      // Cập nhật lại đơn hàng trong state sau khi sửa thành công
      setOrders(
        orders.map((order) =>
          order._id === updatedOrder._id ? response.data : order
        )
      );
      setEditingOrder(null); // Đóng form chỉnh sửa
      setErrorMessage(""); // Xóa thông báo lỗi nếu có
    } catch (error) {
      console.error("Error updating order:", error);
      setErrorMessage("Không thể lưu đơn hàng. Vui lòng thử lại.");
    }
  };

  // Delete order
  const handleDeleteOrder = async () => {
    try {
      await API.delete(`/orders/${confirmDelete.id}`); // DELETE API
      setOrders(orders.filter((order) => order._id !== confirmDelete.id));
    } catch (error) {
      console.error("Error deleting order:", error);
      setErrorMessage("Không thể xóa đơn hàng. Vui lòng thử lại.");
    }
    setConfirmDelete({ show: false, id: null });
  };

  const openEditForm = (order) => {
    setEditingOrder(order);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">Quản lý đơn hàng</div>
        <div className="left-section">
          {!isMenuOpen && (
            <div className="menu-button" onClick={toggleMenu}>
              <span>☰</span> Menu
            </div>
          )}
          {isMenuOpen && (
            <div className={`menu-container ${isMenuOpen ? "open" : ""}`}>
              <button className="close-button" onClick={toggleMenu}>
                ✖ Đóng
              </button>
              <ul className="menu-list">
                <li onClick={() => navigate("/admin/home")}>Dashboard</li>
                <li onClick={() => navigate("/admin/products")}>
                  Quản lý sản phẩm
                </li>
                <li onClick={() => navigate("/admin/categories")}>
                  Quản lý mục lục
                </li>
                <li onClick={() => navigate("/admin/users")}>
                  Quản lý người dùng
                </li>
                <li onClick={() => navigate("/admin/orders")}>
                  Quản lý đơn hàng
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="user-menu">
          <div
            className="user-icon"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
              alt="User Icon"
              className="user-avatar"
            />
          </div>
          {dropdownOpen && (
            <div className="user-dropdown">
              <button
                className="dropdown-button"
                onClick={() => navigate("/admin/users")}
              >
                Chỉnh sửa người dùng
              </button>
              <button className="dropdown-button" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="orders-container">
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(orders) &&
                orders
                  .filter(
                    (order) =>
                      order.userId &&
                      order.items.every((item) => item.productId)
                  )
                  .map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.userId?.name || "Unknown"}</td>
                      <td>{order.totalPrice}₫</td>
                      <td>{order.status}</td>
                      <td>
                        <button onClick={() => openEditForm(order)}>Sửa</button>
                        <button
                          onClick={() =>
                            setConfirmDelete({ show: true, id: order._id })
                          }
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        )}

        {/* Display error message if any */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {confirmDelete.show && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <h2>Xác nhận xóa</h2>
              <p>Bạn có chắc chắn muốn xóa đơn hàng này?</p>
              <div className="confirm-actions">
                <button className="confirm-button" onClick={handleDeleteOrder}>
                  Xóa
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setConfirmDelete({ show: false, id: null })}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {editingOrder && (
          <div className="edit-form">
            <h2>Chỉnh sửa đơn hàng</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditOrder(editingOrder);  // Gửi đơn hàng đã chỉnh sửa lên server
              }}
            >
              <label>
                Tổng tiền:
                <input
                  type="number"
                  value={editingOrder.totalPrice}  // Giá trị của tổng tiền trong đơn hàng
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      totalPrice: e.target.value,  // Cập nhật lại giá trị tổng tiền khi người dùng thay đổi
                    })
                  }
                />
              </label>

              <label>
                Trạng thái:
                <select
                  value={editingOrder.status}  // Giá trị của trạng thái đơn hàng
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      status: e.target.value,  // Cập nhật lại giá trị trạng thái khi người dùng thay đổi
                    })
                  }
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="shipped">Đã gửi</option>
                  <option value="delivered">Đã giao</option>
                </select>
              </label>

              <div className="form-actions">
                <button type="submit" className="submit-button">Lưu</button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditingOrder(null)}  // Hủy chỉnh sửa và đóng form
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderList;
