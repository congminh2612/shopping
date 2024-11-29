import React, { useEffect, useState } from 'react';
import API from '../../api/api'; // Đảm bảo đường dẫn tới file API
import { Link } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/user/categories'); // Lấy danh sách các danh mục
        setCategories(data);
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Danh Mục Sản Phẩm</h1>
      <ul>
        {categories.map(category => (
          <li key={category}>
            <Link to={`/products/${category.toLowerCase()}`}>{category}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
