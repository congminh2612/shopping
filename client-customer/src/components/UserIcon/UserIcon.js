import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPowerOff } from "@fortawesome/free-solid-svg-icons";

const UserIcon = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Lấy token từ localStorage để kiểm tra đăng nhập

  const handleClick = () => {
    if (token) {
      // Nếu người dùng đang đăng nhập, thực hiện logout
      localStorage.removeItem("token");
      alert("Bạn đã đăng xuất thành công!");
      navigate("/login"); // Điều hướng về trang đăng nhập
    } else {
      // Nếu chưa đăng nhập, điều hướng đến trang login
      navigate("/login");
    }
  };

  return (
    <FontAwesomeIcon
      icon={token ? faPowerOff : faUser}
      onClick={handleClick}
      style={{ cursor: "pointer", fontSize: "24px" }}
    />
  );
};

export default UserIcon;
