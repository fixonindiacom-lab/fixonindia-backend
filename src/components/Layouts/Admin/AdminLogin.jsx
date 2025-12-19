import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const ADMIN_PIN = "@9310";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = () => {
    if (pin === ADMIN_PIN) {
      localStorage.setItem("ADMIN_ACCESS_GRANTED", "true");
      navigate("/admin");
    } else {
      setError("Invalid admin PIN");
    }
  };

  return (
    <div className="admin-login">
      <div className="login-card">
        <h2>Admin Login</h2>
        <p>Enter 6-digit PIN</p>

        <input
          type="password"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        {error && <span className="error">{error}</span>}

        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}
