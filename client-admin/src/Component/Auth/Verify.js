import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"; // Import arrow icon
import API from "../../api/api";
import "./Verify.css";

const Verify = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState(Array(6).fill("")); // 6 ô nhập mã xác minh
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false); // Trạng thái mã xác minh đã đúng

  useEffect(() => {
    const storedEmailOrUsername = localStorage.getItem("emailOrUsername");
    if (storedEmailOrUsername) {
      setEmailOrUsername(storedEmailOrUsername);
    }
  }, []);

  // Kiểm tra khi mã xác minh được nhập đầy đủ và xác minh tự động
  useEffect(() => {
    const isComplete = verificationCode.every((digit) => digit !== ""); // Kiểm tra tất cả ô đã được điền
    if (isComplete && !isVerified) {
      handleVerify();
    }
  }, [verificationCode]);

  const handleInputChange = (value, index) => {
    if (!/^\d$/.test(value) && value !== "") return; // Chỉ cho phép số (0-9)
    const updatedCode = [...verificationCode];
    updatedCode[index] = value; // Cập nhật giá trị ô hiện tại
    setVerificationCode(updatedCode);

    if (value && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus(); // Di chuyển sang ô tiếp theo
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && verificationCode[index] === "") {
      if (index > 0) {
        document.getElementById(`code-input-${index - 1}`).focus(); // Quay lại ô trước đó
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault(); // Ngăn chặn hành động paste
  };

  const handleVerify = async () => {
    try {
      const code = verificationCode.join(""); // Ghép 6 ký tự thành chuỗi
      const response = await API.post("/auth/verify", {
        email: emailOrUsername,
        code,
      });
      setMessage(
        response.data.message || "Verification successful! Please log in."
      );
      setError("");
      setIsVerified(true); // Đặt trạng thái mã đúng
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
      setMessage("");
      setIsVerified(false); // Đặt trạng thái mã sai
    }
  };

  return (
    <div className="verify-wrapper">
      <div className="verify-container">
        <h2>Verify Your Account</h2>
        <p>Please enter the 6-digit verification code sent to your email.</p>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <p>
          Email/Username: <strong>{emailOrUsername}</strong>
        </p>
        <div className="verification-code-container">
          {verificationCode.map((digit, index) => (
            <input
              key={index}
              id={`code-input-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste} // Chặn hành động paste
              className="verification-code-input"
              autoComplete="off"
            />
          ))}
        </div>
        {/* Hiển thị icon khi mã được xác minh */}
        {isVerified && (
          <div className="verified-icon">
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Verify;
