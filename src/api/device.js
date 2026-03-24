import { deviceStatus } from "../mock/device";

export const getDeviceStatus = async () => {
  return { data: deviceStatus };
};

export const controlDevice = async (device, action) => {
  deviceStatus[device] = action;
  return { success: true };
};