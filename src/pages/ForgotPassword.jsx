import { useState } from "react";
import { Link } from "react-router-dom";
import { recoverPassword } from "../api/auth";

const pageStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "24px",
  background:
    "linear-gradient(135deg, rgba(56,189,248,0.14), rgba(30,41,59,0.12)), linear-gradient(180deg, #f8fafc 0%, #e0f2fe 100%)",
  fontFamily: '"Segoe UI", sans-serif'
};

const cardStyle = {
  width: "100%",
  maxWidth: "460px",
  borderRadius: "24px",
  padding: "28px",
  background: "rgba(255,255,255,0.94)",
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
  background: "#0284c7",
  color: "#f8fafc",
  fontWeight: 700,
  cursor: "pointer"
};

function ForgotPassword() {
  const [form, setForm] = useState({ username: "", phone: "" });
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setResult(null);

    try {
      const response = await recoverPassword(form);
      setResult(response.data);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={{ color: "#0284c7", fontWeight: 700, letterSpacing: "0.08em" }}>
          ACCOUNT RECOVERY
        </div>
        <h1 style={{ margin: "12px 0 8px", color: "#0f172a" }}>Forgot Password</h1>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
          Enter the correct username and phone number. For this demo, the app
          returns the stored password directly.
        </p>

        <div
          style={{
            marginTop: "18px",
            borderRadius: "14px",
            background: "#fff7ed",
            color: "#9a3412",
            padding: "12px 14px"
          }}
        >
          Demo only: returning plaintext passwords is not safe for a real system.
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
            <div style={{ color: "#334155", fontWeight: 600 }}>Phone number</div>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter phone number"
            />
          </label>

          {error && (
            <div style={{ borderRadius: "12px", background: "#fef2f2", color: "#b91c1c", padding: "12px 14px" }}>
              {error}
            </div>
          )}

          {result && (
            <div style={{ borderRadius: "12px", background: "#ecfeff", color: "#155e75", padding: "12px 14px" }}>
              <div>Your password is: <strong>{result.password}</strong></div>
              {result.message && <div style={{ marginTop: "6px" }}>{result.message}</div>}
            </div>
          )}

          <button type="submit" style={buttonStyle} disabled={isSubmitting}>
            {isSubmitting ? "Recovering..." : "Find Password"}
          </button>
        </form>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "18px", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/login">Back to login</Link>
          <span style={{ color: "#64748b" }}>Demo phones: 0901234567, 0912345678</span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
