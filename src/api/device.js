import { apiRequest } from "./client";
import { normalizeDevices } from "../utils/normalize";
import { deviceStatus } from "../mock/device";

export const getDeviceStatus = async () => {
  try {
    const data = await apiRequest("/devices");
    return { data: normalizeDevices(data) };
  } catch (error) {
    return { data: { ...deviceStatus }, fallback: true, error };
  }
};

export const controlDevice = async (deviceId, action) => {
  try {
    const data = await apiRequest("/devices/control", {
      method: "POST",
      body: { deviceId, action }
    });

    return { data };
  } catch (error) {
    deviceStatus[deviceId] = action;
    return { data: { deviceId, status: action }, fallback: true, error };
  }
};
