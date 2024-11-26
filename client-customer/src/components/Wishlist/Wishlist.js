// src/components/Wishlist/WishlistPage.js
import React, { useEffect, useState } from 'react';
import { getWishlist, createWishlist, clearWishlistById, clearAllWishlist } from '../../api/wishlistApi';
import './Wishlist.css';

function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    // Gọi API lấy dữ liệu Wishlist khi component mount
    getWishlist()
      .then(response => {
        setWishlistItems(response.data);
      })
      .catch(error => console.error('Error fetching wishlist items:', error));
  }, []);

  // Hàm để thêm mới wishlist
  const handleAddWishlist = (wishlistData) => {
    createWishlist(wishlistData)
      .then(() => {
        // Lấy lại danh sách wishlist sau khi thêm thành công
        return getWishlist();
      })
      .then(response => {
        setWishlistItems(response.data);
      })
      .catch(error => console.error('Error creating wishlist item:', error));
  };

  // Hàm để xóa wishlist theo ID
  const handleRemoveWishlistItem = (wishlistId) => {
    clearWishlistById(wishlistId)
      .then(() => {
        // Lấy lại danh sách wishlist sau khi xóa thành công
        return getWishlist();
      })
      .then(response => {
        setWishlistItems(response.data);
      })
      .catch(error => console.error('Error deleting wishlist item:', error));
  };

  // Hàm để xóa tất cả wishlist
  const handleClearAllWishlist = () => {
    clearAllWishlist()
      .then(() => {
        // Sau khi xóa tất cả thành công, cập nhật lại danh sách
        setWishlistItems([]);
      })
      .catch(error => console.error('Error clearing all wishlist items:', error));
  };

  return (
    <div className="wishlist-page">
      <h2>Danh Sách Yêu Thích</h2>
      {wishlistItems.length === 0 ? (
        <p>Danh sách yêu thích của bạn đang trống.</p>
      ) : (
        <div className="wishlist-items">
          {wishlistItems.map(item => (
            <div key={item.id} className="wishlist-item">
              <img src={item.image} alt={item.name} className="wishlist-item-image" />
              <div className="wishlist-item-details">
                <h4>{item.name}</h4>
                <p>Giá: {item.price.toLocaleString()}₫</p>
                <button onClick={() => handleRemoveWishlistItem(item.id)}>Xóa</button>
              </div>
            </div>
          ))}
          <button onClick={handleClearAllWishlist} className="clear-all-button">Xóa tất cả</button>
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
