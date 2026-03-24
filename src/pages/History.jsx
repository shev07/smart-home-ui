import { useEffect, useState } from "react";
import { getHistorySensor } from "../api/sensor";

function History() {
  const [data, setData] = useState([]);

  useEffect(() => {
  const fetchData = () => {
    getHistorySensor().then(res => setData(res.data));
  };

  fetchData();
  const interval = setInterval(fetchData, 5000);

  return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>📜 History</h1>

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