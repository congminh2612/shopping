import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash as faEyeSlashRegular } from "@fortawesome/free-regular-svg-icons";
import API from "../../api/api";
import "./Login.css";
import { AuthContext } from "../../contexts/AuthContext"; // Import AuthContext

function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmailOrUsername, setForgotEmailOrUsername] = useState("");
  const [isForgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext); // Sử dụng AuthContext để lấy hàm login

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { emailOrUsername, password };
      console.log("Payload being sent for login:", payload);
  
      const response = await API.post("/auth/login", payload);
  
      if (response.status === 200 && response.data && response.data.token) {
        // Lưu token vào localStorage và gọi hàm login từ AuthContext
        login(response.data.token); 
        alert("Đăng nhập thành công!");
        
        // Điều hướng về trang chủ
        navigate("/");
  
        // Reload lại trang để đảm bảo trạng thái của Header được cập nhật ngay lập tức
        setTimeout(() => {
          window.location.reload();
        }, 100); // Delay ngắn để đảm bảo chuyển hướng trước khi reload
      } else {
        throw new Error("Không có token được trả về từ server");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập! Xin vui lòng thử lại.");
    }
  };   

  const openForgotPasswordModal = () => {
    setForgotPasswordModalOpen(true);
    setForgotEmailOrUsername("");
    setError("");
  };

  const closeForgotPasswordModal = () => {
    setForgotPasswordModalOpen(false);
    setError("");
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!forgotEmailOrUsername) {
        setError("Vui lòng nhập email/username để nhận hướng dẫn đặt lại mật khẩu!");
        return;
      }
      const payload = { emailOrUsername: forgotEmailOrUsername };
      console.log("Payload being sent for forgot password:", payload);
      await API.post("/auth/request-password-reset", payload);
      alert("Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.");
      closeForgotPasswordModal();
    } catch (error) {
      console.error("Forgot password error:", error);
      setError(error.response?.data?.message || "Đã xảy ra lỗi!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2 className={location.pathname === "/login" ? "active-link" : ""} onClick={() => navigate("/login")}>
          Already Registered?
        </h2>
        <h2 className={location.pathname === "/register" ? "active-link" : ""} onClick={() => navigate("/register")}>
          Create Your Account
        </h2>
      </div>
      <div className="login-box">
        <p>If you are already registered, login here:</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="emailOrUsername"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="emailOrUsername">Email or Username*</label>
          </div>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="password">Password*</label>
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlashRegular : faEye}
              className="password-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          <button type="button" className="forgot-password" onClick={openForgotPasswordModal}>
            Forgot your password?
          </button>
          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>
      </div>

      {isForgotPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeForgotPasswordModal}>
              &times;
            </button>
            <h2>Forgot Your Password?</h2>
            <p>Enter your email or username to reset your password.</p>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  id="forgot-emailOrUsername"
                  value={forgotEmailOrUsername}
                  onChange={(e) => setForgotEmailOrUsername(e.target.value)}
                  placeholder=" "
                  required
                />
                <label htmlFor="forgot-emailOrUsername">Email or Username*</label>
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="submit-button">
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
