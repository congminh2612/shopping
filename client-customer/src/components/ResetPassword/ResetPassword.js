import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams(); // Lấy token từ URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const payload = { token, newPassword: password };
      console.log("Payload being sent for password reset:", payload);

      await API.post("/auth/reset-password", payload); // Endpoint cho user
      setMessage("Password reset successful! Please log in.");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password!");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Your Password</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            required
          />
          <label htmlFor="password">New Password*</label>
        </div>
        <div className="input-group">
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder=" "
            required
          />
          <label htmlFor="confirmPassword">Confirm Password*</label>
        </div>
        <button type="submit" className="reset-button">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
