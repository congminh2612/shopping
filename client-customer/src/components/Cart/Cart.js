import React, { useEffect, useState } from 'react';
// Import các hàm từ CartApi.js
import { getAllCartItems, removeCartItem, createCart } from '../../api/CartApi';
import API from '../../api/api';

import './Cart.css';

function Cart() {
	const [cartItems, setCartItems] = useState([]);

	useEffect(() => {
		const fetchCartList = async () => {
			try {
				const { data } = await API.get(`/cart/`);
				if (data) {
					setCartItems(data.items);
				}
			} catch (err) {
				console.error('Error fetching products:', err);
			}
		};
		fetchCartList();
	}, []);

	// Hàm tính tổng tiền
	const getTotalPrice = () => {
		return (
			cartItems
				.reduce((total, item) => total + item.price * item.quantity, 0)
				.toLocaleString() + '₫'
		);
	};

	// Hàm xóa sản phẩm khỏi giỏ hàng
	const handleRemoveItem = async (itemId) => {
		console.log(itemId);
		try {
			const deleteCartRes = await API.delete(`/cart/${itemId}`);
			if (deleteCartRes) {
				alert('delete successfully');
			}
		} catch (error) {
			alert('delete fail');
		}
	};

	// Hàm xử lý khi nhấn nút thanh toán (có thể gọi API tạo đơn hàng)
	const handleCheckout = () => {
		const cartData = { items: cartItems };
		createCart(cartData)
			.then(() => {
				alert('Đơn hàng của bạn đã được tạo thành công!');
			})
			.catch((error) => console.error('Error creating cart:', error));
	};

	return (
		<div className="cart-page">
			<h2>Giỏ Hàng Của Bạn</h2>
			{cartItems.length === 0 ? (
				<p>Giỏ hàng của bạn hiện đang trống.</p>
			) : (
				<div className="cart-items">
					{cartItems.map((item) => (
						<div key={item.productId} className="cart-item">
							<img
								src={item.image}
								alt={item.name}
								className="cart-item-image"
							/>
							<div className="cart-item-details">
								<h4>{item.name}</h4>
								<p>Giá: {item.price.toLocaleString()}₫</p>
								<p>Số lượng: {item.quantity}</p>
								<button
									className="remove-item-button"
									onClick={() => handleRemoveItem(item.productId)}
								>
									Xóa
								</button>
							</div>
						</div>
					))}
				</div>
			)}
			<div className="cart-summary">
				<h3>Tổng cộng: {getTotalPrice()}</h3>
				<button className="checkout-button" onClick={handleCheckout}>
					Thanh Toán
				</button>
			</div>
		</div>
	);
}

export default Cart;
