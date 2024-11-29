import React, { useState, useEffect } from "react";
import UserForm from "./UserForm";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faBars } from "@fortawesome/free-solid-svg-icons";
import "./Users.css";
import API from "../../api/api";

function UserList() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, id: null });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Chuyển đổi menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Xử lý đăng xuất
  const handleLogout = () => {
    console.log("Đăng xuất thành công");
    navigate("/admin/login");
  };

  // Lấy danh sách người dùng từ API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await API.get("/admin/users");
        setUsers(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Chỉnh sửa người dùng
  const handleEditUser = async (updatedUser) => {
    try {
      const response = await API.put(
        `/admin/user/${updatedUser.id}`,
        updatedUser
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? response.data : user
        )
      );
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa người dùng:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    }
    setEditingUser(null);
    setIsFormOpen(false);
  };

  // Xóa người dùng
  const handleDeleteUser = async () => {
    try {
      await API.delete(`/admin/user/${confirmDelete.id}`);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== confirmDelete.id)
      );
      alert("Xóa thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      alert("Xóa thất bại. Vui lòng thử lại.");
    }
    setConfirmDelete({ show: false, id: null });
  };

  // Mở form chỉnh sửa người dùng
  const openEditForm = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  // Mở modal xác nhận xóa
  const openDeleteConfirm = (id) => {
    setConfirmDelete({ show: true, id });
  };

  return (
    <div className="users-container">
      {/* Header */}
      <header className="home-header">
        <div className="logo">Quản lý người dùng</div>
        <div className="left-section">
          {!isMenuOpen ? (
            <div className="menu-button" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBars} /> Menu
            </div>
          ) : (
            <div className={`menu-container ${isMenuOpen ? "open" : ""}`}>
              <button className="close-button" onClick={toggleMenu}>
                <FontAwesomeIcon icon={faBars} />
              </button>
              <ul className="menu-list">
                <li onClick={() => navigate("/admin/home")}>Dashboard</li>
                <li onClick={() => navigate("/admin/products")}>
                  Quản lý sản phẩm
                </li>
                <li onClick={() => navigate("/admin/categories")}>
                  Quản lý danh mục
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

      {/* Danh sách người dùng */}
      <div className="users-content">
        <h1>Danh sách người dùng</h1>
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="action-icon"
                      onClick={() => openEditForm(user)}
                    >
                      <FontAwesomeIcon icon={faEdit} title="Sửa" />
                    </button>
                    <button
                      className="action-icon"
                      onClick={() => openDeleteConfirm(user.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} title="Xóa" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form chỉnh sửa người dùng */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>
              {editingUser
                ? "Chỉnh sửa thông tin người dùng"
                : "Thêm người dùng mới"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditUser(editingUser);
              }}
            >
              <div className="form-group">
                <label htmlFor="name">Tên:</label>
                <input
                  type="text"
                  id="name"
                  value={editingUser?.name || ""}
                  onChange={(e) =>
                    setEditingUser((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Nhập tên người dùng"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={editingUser?.email || ""}
                  onChange={(e) =>
                    setEditingUser((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Nhập email người dùng"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Vai trò:</label>
                <select
                  id="role"
                  value={editingUser?.role || ""}
                  onChange={(e) =>
                    setEditingUser((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="confirm-actions">
                <button type="submit" className="save-button">
                  Lưu
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingUser(null);
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {confirmDelete.show && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Xác nhận xóa</h2>
            <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
            <div className="confirm-actions">
              <button className="delete-button" onClick={handleDeleteUser}>
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
    </div>
  );
}

export default UserList;
