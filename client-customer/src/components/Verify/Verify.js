import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./Verify.css";

const Verify = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Lấy email hoặc username từ localStorage
    const storedEmailOrUsername = localStorage.getItem("emailOrUsername");
    if (storedEmailOrUsername) {
      setEmailOrUsername(storedEmailOrUsername);
    }
  }, []);

  const handleVerify = async () => {
    try {
      const payload = { email: emailOrUsername, code: verificationCode };
      console.log("Payload being sent for verification:", payload);

      const response = await API.post("/auth/verify", payload); // Endpoint cho user
      setMessage(response.data.message || "Verification successful! Redirecting to login...");
      setError("");

      // Xóa email/username khỏi localStorage sau khi xác minh
      localStorage.removeItem("emailOrUsername");

      // Chuyển hướng đến trang đăng nhập ngay sau khi xác minh thành công
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Verification failed. Please try again.");
      setMessage("");
    }
  };

  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  return (
    <div className="verify-container">
      <h2>Verify Your Account</h2>
      <p>Please enter the 6-digit verification code sent to your email.</p>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <p>
        Email/Username: <strong>{emailOrUsername}</strong>
      </p>
      <input
        type="text"
        placeholder="Enter Verification Code"
        value={verificationCode}
        onChange={handleCodeChange}
        required
      />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
};

export default Verify;
