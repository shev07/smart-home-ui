export const latestSensor = {
  temperature: 30,
  humidity: 65,
  timestamp: new Date().toISOString()
};

export const historySensor = Array.from({ length: 20 }, (_, i) => ({
  temperature: 25 + Math.random() * 5,
  humidity: 60 + Math.random() * 10,
  timestamp: new Date(Date.now() - i * 60000).toISOString()
}));