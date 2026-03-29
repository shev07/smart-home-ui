import { useState } from "react";
import { Link } from "react-router-dom";

const TEMP_THRESHOLD_KEY = "smart-home-temp-threshold";

const pageStyle = {
  minHeight: "100vh",
  padding: "32px 20px 48px",
  background:
    "radial-gradient(circle at top, rgba(56,189,248,0.22), transparent 30%), linear-gradient(180deg, #e0f2fe 0%, #f8fafc 38%, #eef2ff 100%)",
  fontFamily: '"Segoe UI", sans-serif'
};

const shellStyle = {
  maxWidth: "1120px",
  margin: "0 auto"
};

const heroStyle = {
  background: "#0f172a",
  color: "#f8fafc",
  borderRadius: "28px",
  padding: "28px",
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)"
};

const cardStyle = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: "22px",
  padding: "22px",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
  marginTop: "20px"
};

function Settings() {
  const [threshold, setThreshold] = useState(() => {
    const saved = Number(localStorage.getItem(TEMP_THRESHOLD_KEY));
    return Number.isFinite(saved) && saved > 0 ? saved : 32;
  });

  const handleChange = (event) => {
    const nextValue = event.target.value;
    setThreshold(nextValue);
    localStorage.setItem(TEMP_THRESHOLD_KEY, nextValue);
  };

  const numericThreshold = Number(threshold) || 0;
  const severityLabel =
    numericThreshold >= 35 ? "High tolerance" : numericThreshold >= 30 ? "Balanced" : "Sensitive";

  return (
    <div style={pageStyle}>
      <div style={shellStyle}>
        <section style={heroStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20px",
              flexWrap: "wrap"
            }}
          >
            <div>
              <div style={{ color: "#7dd3fc", fontWeight: 700, letterSpacing: "0.08em" }}>
                SETTINGS
              </div>
              <h1 style={{ fontSize: "2.2rem", margin: "10px 0 12px" }}>
                Configure automation behavior with the same product styling
              </h1>
              <p style={{ maxWidth: "700px", margin: 0, color: "#cbd5e1", lineHeight: 1.6 }}>
                Adjust the local temperature threshold used by the dashboard automation.
                The value is stored in `localStorage` and applied immediately by the fan logic.
              </p>
            </div>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link to="/" style={{ color: "#f8fafc" }}>
                Dashboard
              </Link>
              <Link to="/history" style={{ color: "#f8fafc" }}>
                History
              </Link>
            </div>
          </div>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(320px, 1.2fr) minmax(280px, 0.8fr)",
            gap: "20px",
            marginTop: "20px"
          }}
        >
          <section style={cardStyle}>
            <div style={{ marginBottom: "18px" }}>
              <h2 style={{ margin: 0, color: "#0f172a" }}>Automation Threshold</h2>
              <p style={{ margin: "6px 0 0", color: "#475569" }}>
                Lower values make the fan react sooner. Higher values delay automatic fan activation.
              </p>
            </div>

            <label style={{ display: "block" }}>
              <div style={{ color: "#334155", fontWeight: 600, marginBottom: "10px" }}>
                Temperature threshold
              </div>
              <input
                type="number"
                value={threshold}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: "14px",
                  border: "1px solid #cbd5e1",
                  fontSize: "1rem",
                  boxSizing: "border-box"
                }}
              />
            </label>

            <div
              style={{
                marginTop: "18px",
                borderRadius: "16px",
                background: "#eff6ff",
                color: "#1d4ed8",
                padding: "14px 16px"
              }}
            >
              This value is read by the dashboard automation effect and compared against live sensor data.
            </div>
          </section>

          <section style={cardStyle}>
            <h2 style={{ marginTop: 0, color: "#0f172a" }}>Current Preview</h2>

            <div
              style={{
                borderRadius: "18px",
                background: "#0f172a",
                color: "#f8fafc",
                padding: "20px"
              }}
            >
              <div style={{ color: "#94a3b8", marginBottom: "8px" }}>Threshold value</div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800 }}>{numericThreshold}°C</div>

              <div style={{ color: "#94a3b8", margin: "18px 0 8px" }}>Behavior profile</div>
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  background:
                    severityLabel === "Sensitive"
                      ? "#dc2626"
                      : severityLabel === "Balanced"
                        ? "#0284c7"
                        : "#16a34a",
                  color: "#f8fafc",
                  fontWeight: 700
                }}
              >
                {severityLabel}
              </div>
            </div>

            <ul style={{ margin: "18px 0 0", paddingLeft: "18px", color: "#475569", lineHeight: 1.8 }}>
              <li>`Sensitive`: fan turns on sooner.</li>
              <li>`Balanced`: close to the current demo default.</li>
              <li>`High tolerance`: waits for hotter temperatures.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Settings;
