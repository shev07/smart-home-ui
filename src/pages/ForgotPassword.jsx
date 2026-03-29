import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword, verifyRecoveryIdentity } from "../api/auth";

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
  const [identityForm, setIdentityForm] = useState({ username: "", phone: "" });
  const [resetForm, setResetForm] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setIdentityForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setResetForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setResult(null);

    try {
      const response = await verifyRecoveryIdentity(identityForm);
      setResult(response.data);
      setIsVerified(true);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setResult(null);

    if (resetForm.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      setIsSubmitting(false);
      return;
    }

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      setError("Password confirmation does not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await resetPassword({
        ...identityForm,
        newPassword: resetForm.newPassword
      });
      setResult(response.data);
      setResetForm({ newPassword: "", confirmPassword: "" });
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
          Enter the correct username and phone number, then set a new password.
          This is much closer to a production-safe recovery flow.
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
          Safer approach: verify identity first, then reset password. Do not send
          plaintext passwords back to users.
        </div>

        <form onSubmit={handleVerify} style={{ marginTop: "20px", display: "grid", gap: "16px" }}>
          <label>
            <div style={{ color: "#334155", fontWeight: 600 }}>Username</div>
            <input
              name="username"
              value={identityForm.username}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter username"
              disabled={isVerified}
            />
          </label>

          <label>
            <div style={{ color: "#334155", fontWeight: 600 }}>Phone number</div>
            <input
              name="phone"
              value={identityForm.phone}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter phone number"
              disabled={isVerified}
            />
          </label>

          {!isVerified && (
            <button type="submit" style={buttonStyle} disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify Account"}
            </button>
          )}
        </form>

        {isVerified && (
          <form onSubmit={handleReset} style={{ marginTop: "18px", display: "grid", gap: "16px" }}>
            <label>
              <div style={{ color: "#334155", fontWeight: 600 }}>New password</div>
              <input
                type="password"
                name="newPassword"
                value={resetForm.newPassword}
                onChange={handlePasswordChange}
                style={inputStyle}
                placeholder="Enter new password"
              />
            </label>

            <label>
              <div style={{ color: "#334155", fontWeight: 600 }}>Confirm password</div>
              <input
                type="password"
                name="confirmPassword"
                value={resetForm.confirmPassword}
                onChange={handlePasswordChange}
                style={inputStyle}
                placeholder="Confirm new password"
              />
            </label>

            <button type="submit" style={buttonStyle} disabled={isSubmitting}>
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {error && (
          <div
            style={{
              borderRadius: "12px",
              background: "#fef2f2",
              color: "#b91c1c",
              padding: "12px 14px",
              marginTop: "16px"
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <div
            style={{
              borderRadius: "12px",
              background: "#ecfeff",
              color: "#155e75",
              padding: "12px 14px",
              marginTop: "16px"
            }}
          >
            {result.message}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "18px",
            gap: "12px",
            flexWrap: "wrap"
          }}
        >
          <Link to="/login">Back to login</Link>
          <span style={{ color: "#64748b" }}>Demo phones: 0901234567, 0912345678</span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
