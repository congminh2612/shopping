import React, { useState, useEffect } from "react";
import API from "../../api/api"; // Import API instance đã cấu hình
import "./Modal.css"; // Import CSS cho modal

function ProductForm({ product = {}, onSave, onCancel }) {
  const [formValues, setFormValues] = useState({
    name: product.name || "",
    price: product.price || 0,
    stock: product.stock || 0,
    category: product.category || "",
    attributes: product.attributes || [],
  });
  const [categories, setCategories] = useState([]); // Lưu danh mục
  const [errors, setErrors] = useState({}); // Lưu lỗi

  // Lấy danh mục từ API khi component được mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get("/admin/categories"); // Gọi API
        setCategories(response.data); // Cập nhật state danh mục
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Validate dữ liệu
  const validateForm = () => {
    const newErrors = {};
    if (!formValues.name.trim()) {
      newErrors.name = "Tên sản phẩm là bắt buộc.";
    }
    if (formValues.price <= 0) {
      newErrors.price = "Giá sản phẩm phải lớn hơn 0.";
    }
    if (formValues.stock < 0) {
      newErrors.stock = "Số lượng không được nhỏ hơn 0.";
    }
    if (!formValues.category.trim()) {
      newErrors.category = "Danh mục là bắt buộc.";
    }
    formValues.attributes.forEach((attr, index) => {
      if (!attr.key.trim()) {
        newErrors[`attrKey-${index}`] =
          "Key của thuộc tính không được để trống.";
      }
      if (!attr.value.trim()) {
        newErrors[`attrValue-${index}`] =
          "Value của thuộc tính không được để trống.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Không có lỗi
  };

  // Xử lý thay đổi giá trị input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Thêm một thuộc tính mới
  const handleAddAttribute = () => {
    setFormValues({
      ...formValues,
      attributes: [...formValues.attributes, { key: "", value: "" }],
    });
  };

  // Thay đổi giá trị thuộc tính
  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...formValues.attributes];
    updatedAttributes[index][field] = value;
    setFormValues({ ...formValues, attributes: updatedAttributes });
  };

  // Xóa một thuộc tính
  const handleRemoveAttribute = (index) => {
    const updatedAttributes = formValues.attributes.filter(
      (_, i) => i !== index
    );
    setFormValues({ ...formValues, attributes: updatedAttributes });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formValues); // Gửi dữ liệu nếu hợp lệ
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onCancel}>
          &times;
        </button>
        <h2>{product.id ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tên sản phẩm:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              required
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Giá:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formValues.price}
              onChange={handleInputChange}
              required
            />
            {errors.price && <p className="error-text">{errors.price}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="stock">Số lượng:</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formValues.stock}
              onChange={handleInputChange}
              required
            />
            {errors.stock && <p className="error-text">{errors.stock}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Danh mục:</label>
            <select
              id="category"
              name="category"
              value={formValues.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="error-text">{errors.category}</p>}
          </div>

          <div className="form-actions">
            <button type="submit" className="save-button">
              Lưu
            </button>
            <button type="button" className="cancel-button" onClick={onCancel}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
