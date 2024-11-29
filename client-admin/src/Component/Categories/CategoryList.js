// import React, { useState, useEffect } from "react";
// import CategoryForm from "./CategoryForm";
// import { useNavigate } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEdit,
//   faTrash,
//   faPlus,
//   faBars,
// } from "@fortawesome/free-solid-svg-icons";
// import "./Categories.css";
// import API from "../../api/api";

// function CategoryList() {
//   const [categories, setCategories] = useState([]);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Fetch categories from API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       setLoading(true);
//       try {
//         const response = await API.get("/admin/categories");
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const handleLogout = () => {
//     navigate("/admin/login");
//   };

//   const handleAddCategory = async (newCategory) => {
//     try {
//       const response = await API.post("/admin/category", newCategory);
//       setCategories([...categories, response.data]);
//     } catch (error) {
//       console.error("Error adding category:", error);
//     }
//     setIsFormOpen(false);
//   };

//   const handleEditCategory = async (updatedCategory) => {
//     try {
//       const response = await API.put(
//         `/admin/category/${updatedCategory.id}`,
//         updatedCategory
//       );
//       setCategories(
//         categories.map((category) =>
//           category.id === updatedCategory.id ? response.data : category
//         )
//       );
//     } catch (error) {
//       console.error("Error editing category:", error);
//     }
//     setIsFormOpen(false);
//     setEditingCategory(null);
//   };

//   const handleDeleteCategory = async (id) => {
//     const isConfirmed = window.confirm(
//       "Are you sure you want to delete this category?"
//     );
//     if (!isConfirmed) return;

//     try {
//       await API.delete(`/admin/category/${id}`);
//       setCategories(categories.filter((category) => category.id !== id));
//     } catch (error) {
//       console.error("Error deleting category:", error);
//     }
//   };

//   const openForm = (category = null) => {
//     setEditingCategory(category);
//     setIsFormOpen(true);
//   };

//   return (
//     <div className="home-container">
//       <header className="home-header">
//         <div className="logo">Trang chủ admin</div>
//         <div className="left-section">
//           {!isMenuOpen && (
//             <div className="menu-button" onClick={toggleMenu}>
//               <FontAwesomeIcon icon={faBars} /> Menu
//             </div>
//           )}
//           {isMenuOpen && (
//             <div className={`menu-container ${isMenuOpen ? "open" : ""}`}>
//               <button className="close-button" onClick={toggleMenu}>
//                 <FontAwesomeIcon icon={faBars} />
//               </button>
//               <ul className="menu-list">
//                 <li onClick={() => navigate("/admin/home")}>Dashboard</li>
//                 <li onClick={() => navigate("/admin/products")}>
//                   Quản lý sản phẩm
//                 </li>
//                 <li onClick={() => navigate("/admin/categories")}>
//                   Quản lý mục lục
//                 </li>
//                 <li onClick={() => navigate("/admin/users")}>
//                   Quản lý người dùng
//                 </li>
//                 <li onClick={() => navigate("/admin/orders")}>
//                   Quản lý đơn hàng
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//         <div className="user-menu">
//           <div
//             className="user-icon"
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//           >
//             <img
//               src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
//               alt="User Icon"
//               className="user-avatar"
//             />
//           </div>
//           {dropdownOpen && (
//             <div className="user-dropdown">
//               <button
//                 className="dropdown-button"
//                 onClick={() => navigate("/admin/users")}
//               >
//                 Chỉnh sửa người dùng
//               </button>
//               <button className="dropdown-button" onClick={handleLogout}>
//                 Đăng xuất
//               </button>
//             </div>
//           )}
//         </div>
//       </header>

//       <div className="categories-container">
//         <h1>Manage Categories</h1>
//         <button className="add-button" onClick={() => openForm()}>
//           <FontAwesomeIcon icon={faPlus} /> Add Category
//         </button>
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <table className="categories-table">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Category Name</th>
//                 <th>Description</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {categories.map((category) => (
//                 <tr key={category.id}>
//                   <td>{category.id}</td>
//                   <td>{category.name}</td>
//                   <td>{category.description}</td>
//                   <td>
//                     <button
//                       className="action-icon"
//                       onClick={() => openForm(category)}
//                     >
//                       <FontAwesomeIcon icon={faEdit} title="Edit" />
//                     </button>
//                     <button
//                       className="action-icon"
//                       onClick={() => handleDeleteCategory(category.id)}
//                     >
//                       <FontAwesomeIcon icon={faTrash} title="Delete" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//         {isFormOpen && (
//           <CategoryForm
//             category={editingCategory}
//             onSave={editingCategory ? handleEditCategory : handleAddCategory}
//             onCancel={() => setIsFormOpen(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// export default CategoryList;

import React, { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import "./Categories.css";
import API from "../../api/api";

function CategoryList() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const navigate = useNavigate();

  // Fetch categories from API
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    console.log("Đăng xuất thành công");
    navigate("/admin/login");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null); // Reset any previous error
      try {
        const response = await API.get("/admin/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Unable to fetch categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async (newCategory) => {
    try {
      const response = await API.post("/admin/category", newCategory);
      setCategories((prevCategories) => [...prevCategories, response.data]);
    } catch (err) {
      console.error("Error adding category:", err);
      alert("Failed to add category. Please try again.");
    }
    setIsFormOpen(false);
  };

  const handleEditCategory = async (updatedCategory) => {
    try {
      const response = await API.put(
        `/admin/category/${updatedCategory._id}`,
        updatedCategory
      );
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === updatedCategory._id ? response.data : category
        )
      );
    } catch (err) {
      console.error("Error editing category:", err);
      alert("Failed to update category. Please try again.");
    }
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!isConfirmed) return;

    try {
      await API.delete(`/admin/category/${id}`);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== id)
      );
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category. Please try again.");
    }
  };

  const confirmDeleteCategory = async () => {
    try {
      await API.delete(`/admin/category/${categoryToDelete._id}`);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== categoryToDelete._id)
      );
      closeDeleteModal();
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category. Please try again.");
    }
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setCategoryToDelete(null);
    setIsDeleteModalOpen(false);
  };
  
  const openForm = (category = null) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">Trang chủ admin</div>
        <div className="left-section">
          {!isMenuOpen && (
            <div className="menu-button" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faBars} /> Menu
            </div>
          )}
          {isMenuOpen && (
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

      <div className="categories-container">
        <h1>Manage Categories</h1>
        <button className="add-button" onClick={() => openForm()}>
          <FontAwesomeIcon icon={faPlus} /> Add Category
        </button>

        {loading && <p>Loading categories...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && categories.length === 0 && (
          <p>No categories found.</p>
        )}

        {!loading && !error && categories.length > 0 && (
          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>
                    <button
                      className="action-icon"
                      onClick={() => openForm(category)}
                      title="Edit"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="action-icon"
                      onClick={() => openDeleteModal(category)}
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isFormOpen && (
          <CategoryForm
            category={editingCategory}
            onSave={editingCategory ? handleEditCategory : handleAddCategory}
            onCancel={() => setIsFormOpen(false)}
          />
        )}
        {isDeleteModalOpen && (
          <div className="delete-modal-overlay">
            <div className="delete-modal">
              <h2>Xác nhận xóa</h2>
              <p>
                Bạn có chắc chắn muốn xóa danh mục{" "}
                <strong>{categoryToDelete?.name}</strong> không?
              </p>
              <div className="modal-actions">
                <button className="cancel-button" onClick={closeDeleteModal}>
                  Hủy
                </button>
                <button className="delete-button" onClick={confirmDeleteCategory}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryList;
