import { useEffect, useState } from "react";
import { getLatestSensor } from "../api/sensor";
import ChartTemp from "../components/ChartTemp";
import Control from "../components/Control";
import { Link } from "react-router-dom";
import { controlDevice } from "../api/device";

const cardStyle = {
  border: "1px solid #e5e7eb",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
  background: "#ffffff",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
};

const containerStyle = {
  maxWidth: "900px",
  margin: "auto",
  fontFamily: "sans-serif",
  padding: "20px",
  background: "#f3f4f6",
  minHeight: "100vh"
};

function Dashboard() {
  const TEMP_THRESHOLD = 32;
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      getLatestSensor().then(res => setData(res.data));
    };

    fetchData();

    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
  if (!data) return;

  if (data.temperature > TEMP_THRESHOLD) {
    controlDevice("fan", "on");
  } else {
    controlDevice("fan", "off");
  }
  }, [data]);

  if (!data) return <div>Loading...</div>;

 return (
  <div style={containerStyle}>
    <h1 style={{ marginBottom: "20px" }}>🏠 Smart Home Dashboard</h1>

    <div style={{ marginBottom: "20px" }}>
      <Link to="/history">📜 History</Link> |{" "}
      <Link to="/settings">⚙️ Settings</Link>
    </div>

    {data.temperature > TEMP_THRESHOLD && (
      <div style={{ color: "red", marginBottom: "10px" }}>
        ⚠️ Temperature too high!
      </div>
    )}

    {/* SENSOR CARD */}
    <div style={cardStyle}>
      <h2>📡 Sensor</h2>
      <h1>🌡 {data.temperature.toFixed(1)}°C</h1>
      <h1>💧 {data.humidity.toFixed(1)}%</h1>
      <p>{new Date(data.timestamp).toLocaleString()}</p>
    </div>

    {/* CHART CARD */}
    <div style={cardStyle}>
      <ChartTemp />
    </div>

    {/* CONTROL CARD */}
    <div style={cardStyle}>
      <Control />
    </div>
  </div>
);
}

export default Dashboard;