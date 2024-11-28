import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash as faEyeSlashRegular } from "@fortawesome/free-regular-svg-icons";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import API from "../../api/api";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    birthday: "",
    password: "",
    role: "user", // Đổi role thành user
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    oneLowercase: false,
    oneUppercase: false,
    oneNumber: false,
    oneSpecialChar: false,
    minLength: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => {
      let updatedValue = value;

      // Auto-add '@' for username and ensure '@' is removed if input is empty
      if (name === "username") {
        if (value.trim() === "" || value === "@") {
          updatedValue = ""; // Remove '@' when input is empty or only '@' is present
        } else if (!value.startsWith("@")) {
          updatedValue = `@${value}`; // Add '@' if not present
        }
      }

      return {
        ...prevState,
        [name]: updatedValue,
      };
    });

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const specialChars = /[~!@#$%^&*_\/\-+=`]/;
    const requirements = {
      oneLowercase: /[a-z]/.test(password), // At least one lowercase letter
      oneUppercase: /[A-Z]/.test(password), // At least one uppercase letter
      oneNumber: /\d/.test(password), // At least one number
      oneSpecialChar: specialChars.test(password), // At least one special character
      minLength: password.length >= 8, // Minimum length of 8 characters
    };

    setPasswordRequirements(requirements);
  };

  const handleRegister = async () => {
    try {
      const payload = {
        ...formData,
        username: formData.username, // Ensure '@' is sent with username
      };
      console.log("Payload being sent:", payload);

      const response = await API.post("/auth/register", payload);
      setMessage(
        response.data.message ||
          "Registration successful! Please verify your account."
      );
      setError("");

      localStorage.setItem(
        "emailOrUsername",
        formData.email || formData.username
      );

      setTimeout(() => {
        navigate("/verify"); // Điều hướng đến trang verify của user
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      setMessage("");
    }
  };

  return (
    <div className="register-form">
      <div className="register-navigation">
        <a className="nav-link active" onClick={() => navigate("/login")}>
          ALREADY REGISTERED?
        </a>
        <a className="nav-link" onClick={() => navigate("/register")}>
          CREATE YOUR ACCOUNT
        </a>
      </div>

      <div className="register-container">
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <form>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
            />
            <label>Your Name *</label>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder=" "
              value={formData.username}
              onChange={handleChange}
            />
            <label>Username *</label>
          </div>

          <div className="input-group">
            <input
              type="date"
              name="birthday"
              value={formData.birthday} // Controlled value from state
              onChange={handleChange}
              placeholder="YYYY-MM-DD" // Placeholder text (for unsupported browsers)
            />
            <label>Day of birth *</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
            />
            <label>Email Address *</label>
          </div>

          <div className="password-requirements">
            <label className="requirements-title">Password Requirements</label>
            <ul>
              <li
                className={
                  passwordRequirements.oneLowercase ? "valid" : "invalid"
                }
              >
                <FontAwesomeIcon
                  icon={passwordRequirements.oneLowercase ? faCheck : faTimes}
                  className="requirement-icon"
                />
                At least one lowercase character
              </li>
              <li
                className={
                  passwordRequirements.oneUppercase ? "valid" : "invalid"
                }
              >
                <FontAwesomeIcon
                  icon={passwordRequirements.oneUppercase ? faCheck : faTimes}
                  className="requirement-icon"
                />
                At least one uppercase character
              </li>
              <li
                className={passwordRequirements.oneNumber ? "valid" : "invalid"}
              >
                <FontAwesomeIcon
                  icon={passwordRequirements.oneNumber ? faCheck : faTimes}
                  className="requirement-icon"
                />
                At least one number
              </li>
              <li
                className={
                  passwordRequirements.oneSpecialChar ? "valid" : "invalid"
                }
              >
                <FontAwesomeIcon
                  icon={passwordRequirements.oneSpecialChar ? faCheck : faTimes}
                  className="requirement-icon"
                />
                At least one special character (~!@#$%^&*_ /-+=`)
              </li>
              <li
                className={passwordRequirements.minLength ? "valid" : "invalid"}
              >
                <FontAwesomeIcon
                  icon={passwordRequirements.minLength ? faCheck : faTimes}
                  className="requirement-icon"
                />
                Minimum 8 characters
              </li>
            </ul>
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
            />
            <label>Password *</label>
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlashRegular : faEye}
              className="password-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>

          <button
            type="button"
            onClick={handleRegister}
            disabled={!Object.values(passwordRequirements).every((req) => req)}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
