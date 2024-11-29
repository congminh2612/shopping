import React, { useState, useEffect } from "react";
import API from "../../api/api";
import "./Verify.css";

const Verify = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [code, setCode] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedEmailOrUsername = localStorage.getItem("emailOrUsername");
    if (storedEmailOrUsername) {
      setEmailOrUsername(storedEmailOrUsername);
    }
  }, []);

  const handleInputChange = (element, index) => {
    const newCode = [...code];
    newCode[index] = element.value.slice(-1); // Chỉ nhận ký tự cuối cùng
    setCode(newCode);

    // Tự động chuyển đến ô tiếp theo
    if (element.value && index < 5) {
      document.getElementById(`input-${index + 1}`).focus();
    }

    // Tự động xác minh khi đã điền đủ 6 ký tự
    if (newCode.join("").length === 6 && !newCode.includes("")) {
      handleVerify(newCode.join(""));
    }
  };

  const handleVerify = async (verificationCode) => {
    try {
      const response = await API.post("/auth/verify", {
        email: emailOrUsername,
        code: verificationCode,
      });
      setMessage(
        response.data.message || "Verification successful! Redirecting..."
      );
      setError("");
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Nhập sai mã xác minh, vui lòng thử lại!"
      );
      setMessage("");
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      document.getElementById(`input-${index - 1}`).focus();
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
        <div className="code-inputs">
          {code.map((value, index) => (
            <input
              key={index}
              id={`input-${index}`}
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handleInputChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="code-input"
            />
          ))}
        </div>
        <p className="hint">Verification code has been sent to your email.</p>
      </div>
    </div>
  );
};

export default Verify;
