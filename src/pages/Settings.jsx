import { useState } from "react";

function Settings() {
  const [threshold, setThreshold] = useState(32);

  return (
    <div>
      <h1>⚙️ Settings</h1>

      <p>Temperature threshold:</p>
      <input
        type="number"
        value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
      />

      <p>Current: {threshold}°C</p>
    </div>
  );
}

export default Settings;