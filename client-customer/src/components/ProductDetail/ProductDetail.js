// src/components/ProductDetail/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/api';
import './ProductDetail.css'; // CSS cho ProductDetail

const ProductDetail = () => {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [value, setValue] = useState(1);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				console.log('Fetching product details for ID:', id);
				const res = await API.get(`/user/product/${id}`);
				if (res) {
					setProduct(res.data);
				}
			} catch (err) {
				console.error('Error fetching product:', err);
				setError(err.message || 'Có lỗi xảy ra khi lấy thông tin sản phẩm!');
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]);
	console.log(product);

	const handleAddWishlist = async () => {
		try {
			const addWishListRes = await API.post(`/wishlist/`, { productId: id });
			if (addWishListRes.data) {
				alert('add wishlist successfully');
			} else {
				alert('add wishlist fail');
			}
		} catch (error) {
			alert(error.response.data.message);
		}
	};
	const handleAddToCart = async () => {
		console.log(value);
		try {
			const addtocartRes = await API.post(`/cart/`, {
				productId: id,
				quantity: +value,
			});
			if (addtocartRes.data) {
				alert('add to cart successfully');
			} else {
				alert('add to cart fail');
			}
		} catch (error) {
			alert(error.response.data.message);
		}
	};

	if (loading) return <p>Loading...</p>; // Hiển thị loading khi đang fetch dữ liệu
	if (error) return <p>Error: {error}</p>; // Hiển thị lỗi nếu có
	if (!product) return <p>Không tìm thấy sản phẩm</p>; // Trường hợp không có sản phẩm

	return (
		<div className="product-detail-container max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
			<div className="product-detail-image flex-1">
				<img
					src={product.image}
					alt={product.name}
					className="w-full h-full object-cover rounded-lg shadow-md"
				/>
			</div>
			<div className="product-detail-info flex-1 flex flex-col gap-4">
				<h2 className="product-detail-title text-2xl font-bold text-gray-800">
					{product.name}
				</h2>
				<p className="product-detail-price text-xl text-red-500 font-semibold">
					{product.price.toLocaleString()} VND
				</p>
				<p className="product-detail-description text-gray-600">
					{product.description}
				</p>

				<div className="product-sizes">
					<h4 className="text-lg font-medium text-gray-700 mb-2">
						Chọn kích cỡ:
					</h4>
					<div className="flex gap-2">
						{product.sizes?.map((size) => (
							<button
								key={size}
								className="size-button px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
							>
								{size}
							</button>
						))}
					</div>
				</div>

				<div className="product-quantity flex items-center gap-4">
					<label htmlFor="quantity" className="text-gray-700 font-medium">
						Số lượng:
					</label>
					<input
						value={value}
						type="number"
						id="quantity"
						onChange={(e) => setValue(e.target.value)}
						min="1"
						defaultValue="1"
						className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="flex gap-4 mt-4">
					<button
						className="border-[1px] border-gray-500 rounded-md px-6 py-2 bg-blue-500 text-white hover:opacity-80 transition"
						onClick={handleAddToCart}
					>
						Thêm vào giỏ hàng
					</button>
					<button
						className="border-[1px] border-gray-500 rounded-md px-6 py-2 bg-red-500 text-white hover:opacity-80 transition"
						onClick={handleAddWishlist}
					>
						Thêm vào yêu thích
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductDetail;
