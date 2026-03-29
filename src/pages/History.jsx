import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHistorySensor } from "../api/sensor";

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

const metricGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "16px",
  marginTop: "22px"
};

const metricCardStyle = {
  borderRadius: "20px",
  padding: "20px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.14)"
};

function History() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHistorySensor();
        setData(res.data);
        setError("");
      } catch (fetchError) {
        setError(fetchError.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  const latestRecord = data[0];
  const averageTemperature = data.length
    ? data.reduce((sum, item) => sum + item.temperature, 0) / data.length
    : 0;
  const averageHumidity = data.length
    ? data.reduce((sum, item) => sum + item.humidity, 0) / data.length
    : 0;

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
                SENSOR HISTORY
              </div>
              <h1 style={{ fontSize: "2.2rem", margin: "10px 0 12px" }}>
                Time-series records that match the dashboard visual language
              </h1>
              <p style={{ maxWidth: "700px", margin: 0, color: "#cbd5e1", lineHeight: 1.6 }}>
                This page polls the latest sensor history and presents it in a
                cleaner table with summary metrics, so it feels like part of the
                same product instead of a separate utility page.
              </p>
            </div>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link to="/" style={{ color: "#f8fafc" }}>
                Dashboard
              </Link>
              <Link to="/settings" style={{ color: "#f8fafc" }}>
                Settings
              </Link>
            </div>
          </div>

          <div style={metricGridStyle}>
            <div style={metricCardStyle}>
              <div style={{ color: "#94a3b8", marginBottom: "8px" }}>Records loaded</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 800 }}>{data.length}</div>
            </div>

            <div style={metricCardStyle}>
              <div style={{ color: "#94a3b8", marginBottom: "8px" }}>Average temperature</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 800 }}>
                {data.length ? `${averageTemperature.toFixed(1)}°C` : "--"}
              </div>
            </div>

            <div style={metricCardStyle}>
              <div style={{ color: "#94a3b8", marginBottom: "8px" }}>Average humidity</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 800 }}>
                {data.length ? `${averageHumidity.toFixed(1)}%` : "--"}
              </div>
            </div>
          </div>
        </section>

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
              <div style={{ color: "#64748b", marginBottom: "6px" }}>Latest timestamp</div>
              <strong>
                {latestRecord ? new Date(latestRecord.timestamp).toLocaleString() : "--"}
              </strong>
            </div>
            <div>
              <div style={{ color: "#64748b", marginBottom: "6px" }}>Latest temperature</div>
              <strong style={{ color: "#dc2626" }}>
                {latestRecord ? `${latestRecord.temperature.toFixed(1)}°C` : "--"}
              </strong>
            </div>
            <div>
              <div style={{ color: "#64748b", marginBottom: "6px" }}>Latest humidity</div>
              <strong style={{ color: "#2563eb" }}>
                {latestRecord ? `${latestRecord.humidity.toFixed(1)}%` : "--"}
              </strong>
            </div>
          </div>
        </section>

        <section style={{ ...cardStyle, overflowX: "auto" }}>
          <div style={{ marginBottom: "18px" }}>
            <h2 style={{ margin: 0, color: "#0f172a" }}>Sensor Table</h2>
            <p style={{ margin: "6px 0 0", color: "#475569" }}>
              Auto-refreshes every 5 seconds to reflect the latest available samples.
            </p>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "700px"
            }}
          >
            <thead>
              <tr style={{ background: "#e2e8f0", color: "#0f172a" }}>
                <th style={{ textAlign: "left", padding: "14px 16px" }}>Time</th>
                <th style={{ textAlign: "left", padding: "14px 16px" }}>Temperature</th>
                <th style={{ textAlign: "left", padding: "14px 16px" }}>Humidity</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid #e2e8f0",
                    background: i % 2 === 0 ? "rgba(248,250,252,0.9)" : "transparent"
                  }}
                >
                  <td style={{ padding: "14px 16px", color: "#334155" }}>
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#dc2626", fontWeight: 600 }}>
                    {item.temperature.toFixed(1)} °C
                  </td>
                  <td style={{ padding: "14px 16px", color: "#2563eb", fontWeight: 600 }}>
                    {item.humidity.toFixed(1)} %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default History;
