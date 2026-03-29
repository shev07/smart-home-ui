import { useState } from "react";
import { Link } from "react-router-dom";

const TEMP_THRESHOLD_KEY = "smart-home-temp-threshold";

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

  return (
    <div style={{ padding: "24px", fontFamily: '"Segoe UI", sans-serif' }}>
      <Link to="/">Back to dashboard</Link>
      <h1>Settings</h1>

      <p>Temperature threshold:</p>
      <input type="number" value={threshold} onChange={handleChange} />

      <p>Current: {threshold}°C</p>
    </div>
  );
}

export default Settings;

