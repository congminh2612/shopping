import React, { useState, useEffect } from "react";
import API from "../../api/api";
import "./Verify.css";

const Verify = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedEmailOrUsername = localStorage.getItem("emailOrUsername");
    if (storedEmailOrUsername) {
      setEmailOrUsername(storedEmailOrUsername);
    }
  }, []);

  const handleVerify = async () => {
    try {
      const response = await API.post("/auth/verify", {
        email: emailOrUsername,
        code: verificationCode,
      });
      setMessage(
        response.data.message || "Verification successful! Please log in."
      );
      setError("");
      setTimeout(() => {
        window.location.href = "/user/login";
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
      setMessage("");
    }
  };

  const handleCodeChange = (e) => {
    setVerificationCode(e.target.value);
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
        <input
          type="text"
          placeholder="Enter Verification Code"
          value={verificationCode}
          onChange={handleCodeChange}
        />
        <button onClick={handleVerify}>Verify</button>
      </div>
    </div>
  );
};

export default Verify;
