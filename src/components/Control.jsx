import { useEffect, useState } from "react";
import { getDeviceStatus, controlDevice } from "../api/device";

function Control() {
  const [status, setStatus] = useState({ fan: "off", light: "off" });

  const fetchStatus = () => {
    getDeviceStatus().then(res => setStatus({ ...res.data }));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleClick = async (device, action) => {
    await controlDevice(device, action);
    fetchStatus();
  };

  const buttonStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginRight: "10px"
  };

  return (
    <div>
      <h2>🎮 Control</h2>

      {/* FAN */}
      <div style={{ marginBottom: "15px" }}>
        <p>
          Fan:{" "}
          <span style={{ color: status.fan === "on" ? "green" : "gray" }}>
            {status.fan}
          </span>
        </p>

        <button
          style={{ ...buttonStyle, background: "green", color: "white" }}
          onClick={() => handleClick("fan", "on")}
        >
          ON
        </button>

        <button
          style={{ ...buttonStyle, background: "red", color: "white" }}
          onClick={() => handleClick("fan", "off")}
        >
          OFF
        </button>
      </div>

      {/* LIGHT */}
      <div>
        <p>
          Light:{" "}
          <span style={{ color: status.light === "on" ? "green" : "gray" }}>
            {status.light}
          </span>
        </p>

        <button
          style={{ ...buttonStyle, background: "green", color: "white" }}
          onClick={() => handleClick("light", "on")}
        >
          ON
        </button>

        <button
          style={{ ...buttonStyle, background: "red", color: "white" }}
          onClick={() => handleClick("light", "off")}
        >
          OFF
        </button>
      </div>
    </div>
  );
}

export default Control;