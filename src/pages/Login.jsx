import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

const pageStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "24px",
  background:
    "linear-gradient(135deg, rgba(14,165,233,0.16), rgba(15,23,42,0.12)), linear-gradient(180deg, #e0f2fe 0%, #f8fafc 50%, #eef2ff 100%)",
  fontFamily: '"Segoe UI", sans-serif'
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  borderRadius: "24px",
  padding: "28px",
  background: "rgba(255,255,255,0.92)",
  boxShadow: "0 24px 64px rgba(15, 23, 42, 0.14)"
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  marginTop: "8px",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  border: "none",
  borderRadius: "12px",
  padding: "12px 16px",
  background: "#0f172a",
  color: "#f8fafc",
  fontWeight: 700,
  cursor: "pointer"
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modeLabel, setModeLabel] = useState("");

  const redirectTo = location.state?.from?.pathname || "/";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await loginUser(form);
      setModeLabel(result.fallback ? "Logged in with demo data fallback." : "");
      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ color: "#0ea5e9", fontWeight: 700, letterSpacing: "0.08em" }}>
          SMART HOME ACCESS
        </div>
        <h1 style={{ margin: "12px 0 8px", color: "#0f172a" }}>Login</h1>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
          Use your account to access the dashboard. If no backend is available,
          demo users still work through local fallback.
        </p>

        <div
          style={{
            marginTop: "18px",
            borderRadius: "14px",
            background: "#eff6ff",
            color: "#1d4ed8",
            padding: "12px 14px"
          }}
        >
          Demo accounts: `admin / admin123` or `khanh / khanh123`
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: "20px", display: "grid", gap: "16px" }}>
          <label>
            <div style={{ color: "#334155", fontWeight: 600 }}>Username</div>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter username"
            />
          </label>

          <label>
            <div style={{ color: "#334155", fontWeight: 600 }}>Password</div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter password"
            />
          </label>

          {error && (
            <div style={{ borderRadius: "12px", background: "#fef2f2", color: "#b91c1c", padding: "12px 14px" }}>
              {error}
            </div>
          )}

          {modeLabel && (
            <div style={{ borderRadius: "12px", background: "#ecfeff", color: "#155e75", padding: "12px 14px" }}>
              {modeLabel}
            </div>
          )}

          <button type="submit" style={buttonStyle} disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "18px", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/">Back to app</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
