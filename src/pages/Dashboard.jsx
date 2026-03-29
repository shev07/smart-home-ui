import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getStoredUser, logoutUser } from "../api/auth";
import { controlDevice } from "../api/device";
import { getLatestSensor } from "../api/sensor";
import ChartTemp from "../components/ChartTemp";
import Control from "../components/Control";

const TEMP_THRESHOLD_KEY = "smart-home-temp-threshold";
const DEFAULT_THRESHOLD = 32;

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

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "18px",
  marginTop: "22px"
};

const cardStyle = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: "22px",
  padding: "22px",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
  marginTop: "20px"
};

const metricCardStyle = {
  borderRadius: "20px",
  padding: "22px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.14)"
};

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState({ fan: "off", light: "off" });
  const [user] = useState(() => getStoredUser());
  const [threshold] = useState(() => {
    const saved = Number(localStorage.getItem(TEMP_THRESHOLD_KEY));
    return Number.isFinite(saved) && saved > 0 ? saved : DEFAULT_THRESHOLD;
  });
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");
  const [refreshDevicesAt, setRefreshDevicesAt] = useState(0);
  const [pendingDevice, setPendingDevice] = useState("");
  const lastAutomationRef = useRef("");

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const fetchSensor = async () => {
      try {
        const res = await getLatestSensor();
        setData(res.data);
        setError("");
      } catch (fetchError) {
        setError(fetchError.message);
      }
    };

    fetchSensor();
    const interval = setInterval(fetchSensor, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }

    const nextAction = data.temperature > threshold ? "on" : "off";
    const shouldWarn = nextAction === "on";

    setWarning(
      shouldWarn
        ? `Temperature too high. Auto-turning fan ON because ${data.temperature.toFixed(1)}°C > ${threshold}°C.`
        : ""
    );

    if (lastAutomationRef.current === nextAction) {
      return;
    }

    if (deviceStatus.fan === nextAction) {
      lastAutomationRef.current = nextAction;
      return;
    }

    let isActive = true;

    const runAutomation = async () => {
      try {
        setPendingDevice("fan");
        await controlDevice("fan", nextAction);

        if (!isActive) {
          return;
        }

        lastAutomationRef.current = nextAction;
        setRefreshDevicesAt(Date.now());
      } catch (automationError) {
        if (isActive) {
          setError(automationError.message);
        }
      } finally {
        if (isActive) {
          setPendingDevice("");
        }
      }
    };

    runAutomation();

    return () => {
      isActive = false;
    };
  }, [data, deviceStatus.fan, threshold]);

  if (!data) {
    return <div style={{ padding: "24px" }}>{error || "Loading dashboard..."}</div>;
  }

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
                SMART HOME FLOW
              </div>
              <h1 style={{ fontSize: "2.2rem", margin: "10px 0 12px" }}>
                Dashboard synced with backend control + ESP32 automation
              </h1>
              <p style={{ maxWidth: "700px", margin: 0, color: "#cbd5e1", lineHeight: 1.6 }}>
                Frontend polls `GET /api/sensors/latest` every 3 seconds, triggers
                automation when temperature exceeds the threshold, and refreshes
                `GET /api/devices` after each control request so the UI reflects
                backend state immediately.
              </p>
            </div>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ color: "#cbd5e1" }}>
                {user?.fullName || user?.username || "Guest"}
              </div>
              <Link to="/history" style={{ color: "#f8fafc" }}>
                History
              </Link>
              <Link to="/settings" style={{ color: "#f8fafc" }}>
                Settings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  border: "1px solid rgba(248,250,252,0.25)",
                  background: "transparent",
                  color: "#f8fafc",
                  borderRadius: "999px",
                  padding: "10px 14px",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>
            </div>
          </div>

          <div style={gridStyle}>
            <div style={metricCardStyle}>
              <div style={{ color: "#94a3b8", marginBottom: "8px" }}>Temperature</div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800 }}>
                {data ? `${data.temperature.toFixed(1)}°C` : "--"}
              </div>
            </div>

            <div style={metricCardStyle}>
              <div style={{ color: "#94a3b8", marginBottom: "8px" }}>Humidity</div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800 }}>
                {data ? `${data.humidity.toFixed(1)}%` : "--"}
              </div>
            </div>

            <div style={metricCardStyle}>
              <div style={{ color: "#94a3b8", marginBottom: "8px" }}>Automation Threshold</div>
              <div style={{ fontSize: "2.4rem", fontWeight: 800 }}>{threshold}°C</div>
            </div>
          </div>
        </section>

        {warning && (
          <section
            style={{
              ...cardStyle,
              border: "1px solid #fca5a5",
              background: "#fef2f2",
              color: "#991b1b"
            }}
          >
            <strong>Automation Alert</strong>
            <div style={{ marginTop: "8px" }}>{warning}</div>
          </section>
        )}

        {error && (
          <section
            style={{
              ...cardStyle,
              border: "1px solid #fecaca",
              background: "#fff1f2",
              color: "#9f1239"
            }}
          >
            {error}
          </section>
        )}

        <section style={cardStyle}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px"
            }}
          >
            <div>
              <div style={{ color: "#64748b", marginBottom: "6px" }}>Latest update</div>
              <strong>{new Date(data.timestamp).toLocaleString()}</strong>
            </div>

            <div>
              <div style={{ color: "#64748b", marginBottom: "6px" }}>Fan status</div>
              <strong style={{ color: deviceStatus.fan === "on" ? "#16a34a" : "#64748b" }}>
                {deviceStatus.fan}
              </strong>
            </div>

            <div>
              <div style={{ color: "#64748b", marginBottom: "6px" }}>Light status</div>
              <strong style={{ color: deviceStatus.light === "on" ? "#d97706" : "#64748b" }}>
                {deviceStatus.light}
              </strong>
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <ChartTemp />
        </section>

        <section style={cardStyle}>
          <Control
            refreshKey={refreshDevicesAt}
            onStatusChange={setDeviceStatus}
            pendingDevice={pendingDevice}
          />
        </section>
      </div>
    </div>
  );
}

export default Dashboard;




