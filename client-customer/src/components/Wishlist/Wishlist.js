// src/components/Wishlist/WishlistPage.js
import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import {
	getWishlist,
	createWishlist,
	clearWishlistById,
	clearAllWishlist,
} from '../../api/wishlistApi';
import './Wishlist.css';

function WishlistPage() {
	const [wishlistItems, setWishlistItems] = useState([]);

	useEffect(() => {
		const fetchWishlist = async () => {
			try {
				const { data } = await API.get(`/wishlist/`);
				if (data) {
					console.log(data);
					setWishlistItems(data.wishlist.items);
				}
			} catch (err) {
				console.error('Error fetching products:', err);
			}
		};

		fetchWishlist();
	}, []);
	console.log(wishlistItems);
	// Hàm để thêm mới wishlist
	const handleAddWishlist = (wishlistData) => {
		createWishlist(wishlistData)
			.then(() => {
				// Lấy lại danh sách wishlist sau khi thêm thành công
				return getWishlist();
			})
			.then((response) => {
				setWishlistItems(response.data);
			})
			.catch((error) => console.error('Error creating wishlist item:', error));
	};

	// Hàm để xóa wishlist theo ID
	const handleRemoveWishlistItem = async (wishlistId) => {
		try {
			const deleteWishlistRes = await API.delete(`/wishlist/${wishlistId}`);
			if (deleteWishlistRes) {
				alert('delete successfully');
			}
		} catch (error) {
			alert('delete fail');
		}
	};

	// Hàm để xóa tất cả wishlist
	const handleClearAllWishlist = async () => {
		try {
			const deleteWishlistRes = await API.delete(`/wishlist/`);
			if (deleteWishlistRes) {
				alert('delete successfully');
			}
		} catch (error) {}
	};

	return (
		<div className="wishlist-page p-4">
			<h2 className="text-2xl font-bold mb-4 text-gray-800">
				Danh Sách Yêu Thích
			</h2>
			{wishlistItems.length === 0 ? (
				<p className="text-gray-500">Danh sách yêu thích của bạn đang trống.</p>
			) : (
				<div className="wishlist-items grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{wishlistItems.map((item) => (
						<div
							key={item._id}
							className="wishlist-item bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition duration-200"
						>
							<img
								src={
									item.productId?.images[0] || 'https://via.placeholder.com/150'
								}
								alt={item.productId?.name}
								className="wishlist-item-image w-full h-48 object-cover rounded-lg"
							/>
							<div className="wishlist-item-details mt-4">
								<h4 className="text-lg font-semibold text-gray-700">
									{item.productId?.name}
								</h4>
								<p className="text-gray-500 text-sm mt-1">
									Giá:{' '}
									<span className="text-red-500 font-bold">
										{item.productId?.price}
									</span>
								</p>
								<p className="text-sm text-gray-500 mt-1">
									Kho: {item.productId?.stock} sản phẩm
								</p>
								<p className="text-sm text-gray-500 mt-1">
									{item.productId?.attributes.map((attr) => (
										<span key={attr._id} className="mr-2">
											<span className="font-medium text-gray-600">
												{attr.key}:
											</span>{' '}
											{attr.value}
										</span>
									))}
								</p>
								<button
									onClick={() => handleRemoveWishlistItem(item._id)}
									className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200"
								>
									Xóa
								</button>
							</div>
						</div>
					))}
				</div>
			)}
			{wishlistItems.length > 0 && (
				<button
					onClick={handleClearAllWishlist}
					className="clear-all-button mt-6 w-[200px] bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition duration-200"
				>
					Xóa tất cả
				</button>
			)}
		</div>
	);
}

export default WishlistPage;
