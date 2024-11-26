import React, { useState } from "react";
import API from "../../api/api";

const RequestPasswordReset = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/request-password-reset", {
        emailOrUsername,
      });
      setMessage(response.data.message || "Request sent successfully.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Request Password Reset</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email or Username:</label>
          <input
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Request</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RequestPasswordReset;