import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await API.post(
        "/auth/reset-password",
        { newPassword },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setSuccess("Password reset successful!");
      setError("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
      setSuccess("");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <div className="password-requirements">
        <ul>
          <li>No repetition of more than two characters</li>
          <li>One number</li>
          <li>
            At least 1 special character from `!@#$%^&*-_/+=`
          </li>
          <li>One lowercase character</li>
          <li>One uppercase character</li>
          <li>8 characters minimum</li>
        </ul>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="password"
            placeholder="New Password*"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm New Password*"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/login")}
          >
            Cancel
          </button>
          <button type="submit" className="save-button">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
