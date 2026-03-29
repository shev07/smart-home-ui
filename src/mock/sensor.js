const randomInRange = (min, max) => min + Math.random() * (max - min);

const createSensorPoint = (timestamp = new Date().toISOString()) => ({
  temperature: randomInRange(28, 35),
  humidity: randomInRange(55, 75),
  timestamp
});

export const getMockLatestSensor = () => createSensorPoint();

export const getMockHistorySensor = () =>
  Array.from({ length: 20 }, (_, i) =>
    createSensorPoint(new Date(Date.now() - i * 60000).toISOString())
  );
