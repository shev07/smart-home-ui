export function normalizeSensor(sensor) {
  return {
    temperature: Number(sensor?.temperature ?? 0),
    humidity: Number(sensor?.humidity ?? 0),
    timestamp: sensor?.createdAt || sensor?.timestamp || new Date().toISOString()
  };
}

export function normalizeDevices(payload) {
  if (Array.isArray(payload)) {
    return payload.reduce((acc, item) => {
      const key = item?.type || item?.device || item?.name;

      if (!key) {
        return acc;
      }

      acc[key] = item?.status || "off";
      return acc;
    }, {});
  }

  if (payload && typeof payload === "object") {
    if (payload.devices) {
      return normalizeDevices(payload.devices);
    }

    return {
      fan: payload.fan || payload?.fan?.status || "off",
      light: payload.light || payload?.light?.status || "off"
    };
  }

  return { fan: "off", light: "off" };
}
