import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getHistorySensor } from "../api/sensor";

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

  return (
    <div style={{ padding: "24px", fontFamily: '"Segoe UI", sans-serif' }}>
      <Link to="/">Back to dashboard</Link>
      <h1>Sensor History</h1>

      {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Time</th>
            <th>Temperature</th>
            <th>Humidity</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{new Date(item.timestamp).toLocaleString()}</td>
              <td>{item.temperature.toFixed(1)} °C</td>
              <td>{item.humidity.toFixed(1)} %</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;

