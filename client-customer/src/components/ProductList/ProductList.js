// src/components/ProductList/ProductList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';
import './ProductList.css'; // CSS cho ProductList

const ProductList = ({ category }) => {
	const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
	const [loading, setLoading] = useState(true); // State để theo dõi trạng thái loading
	const [error, setError] = useState(null); // State để theo dõi lỗi
	const token = localStorage.getItem('token');
	console.log('token', token);
	console.log(123);

	const navigate = useNavigate();

	useEffect(() => {
		// Fetch products từ API
		const fetchProducts = async () => {
			try {
				const { data } = await API.get(`/user/products?category=${category}`);
				console.log('Fetched products:', data);
				setProducts(data);
			} catch (err) {
				console.error('Error fetching products:', err);
				setError(err.message || 'Có lỗi xảy ra!');
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [category]); // useEffect sẽ chạy khi mount hoặc khi category thay đổi

	if (loading) return <p>Loading...</p>; // Hiển thị loading khi đang fetch dữ liệu
	if (error) return <p>Error: {error}</p>; // Hiển thị lỗi nếu có

	return (
		<div className="product-list-container">
			<h1 className="product-list-title">Danh sách sản phẩm</h1>
			<div className="product-grid">
				{products.length > 0 ? (
					products.map((product) => (
						<div
							className="product-card"
							key={product._id}
							onClick={() => navigate(`/product/${product._id}`)} // Điều hướng đến trang chi tiết sản phẩm
						>
							{product.images && (
								<img
									src={product.images[0]}
									alt={product.name}
									className="product-image"
								/>
							)}
							<div className="product-card-content">
								<h3 className="product-name">{product.name}</h3>{' '}
								{/* Hiển thị tên sản phẩm */}
								<p className="product-price">{product.price} VND</p>{' '}
								{/* Hiển thị giá */}
							</div>
						</div>
					))
				) : (
					<p>Không có sản phẩm nào</p> // Trường hợp không có sản phẩm
				)}
			</div>
		</div>
	);
};

export default ProductList;
