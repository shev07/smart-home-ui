import { latestSensor, historySensor } from "../mock/sensor";

export const getLatestSensor = async () => {
  return {
    data: {
      ...latestSensor,
      temperature: 25 + Math.random() * 5,
      humidity: 60 + Math.random() * 10,
      timestamp: new Date().toISOString()
    }
  };
};

export const getHistorySensor = async () => {
  return { data: historySensor };
};