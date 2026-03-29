import { apiRequest } from "./client";
import { normalizeSensor } from "../utils/normalize";
import { getMockHistorySensor, getMockLatestSensor } from "../mock/sensor";

export const getLatestSensor = async () => {
  try {
    const data = await apiRequest("/sensors/latest");
    return { data: normalizeSensor(data) };
  } catch (error) {
    return {
      data: normalizeSensor(getMockLatestSensor()),
      fallback: true,
      error
    };
  }
};

export const getHistorySensor = async () => {
  try {
    const data = await apiRequest("/sensors");
    const list = Array.isArray(data) ? data : data?.items || data?.data || [];

    return { data: list.map(normalizeSensor) };
  } catch (error) {
    return {
      data: getMockHistorySensor().map(normalizeSensor),
      fallback: true,
      error
    };
  }
};
