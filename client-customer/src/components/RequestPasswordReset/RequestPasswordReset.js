import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";


const RequestPasswordReset = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { emailOrUsername };
      console.log("Payload being sent for password reset:", payload);

      await API.post("/auth/request-password-reset", payload); // Endpoint cho user
      setMessage("Instructions to reset your password have been sent to your email.");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send password reset instructions!");
    }
  };

  return (
    <div className="request-password-reset-container">
      <h2>Forgot Your Password?</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
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
        <button type="submit" className="reset-button">
          Request Password Reset
        </button>
      </form>
    </div>
  );
};

export default RequestPasswordReset;
