import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";
import { getHistorySensor } from "../api/sensor";

function ChartTemp() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      getHistorySensor().then(res => {
        if (!res.data) return;

        const formatted = res.data.map(item => ({
          time: new Date(item.timestamp).toLocaleTimeString(),
          temperature: item.temperature,
          humidity: item.humidity
        }));

        setData(formatted.reverse());
      });
    };

    fetchData();

    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!data.length) return <div>Loading chart...</div>;

  return (
    <div>
      <h2>📈 Sensor Chart</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#eee" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ef4444"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#3b82f6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartTemp;