# 🏠 Smart Home Web App

## 📌 Overview

This project is a **Smart Home Web Application** that allows users to monitor environmental data and control devices remotely.

The system simulates a real IoT architecture using:

* Sensor data (temperature & humidity)
* Device control (fan & light)
* Automation rules
* Real-time dashboard visualization

---

## 🎯 Features

### 📡 Sensor Monitoring

* Display **temperature & humidity**
* Auto-refresh every few seconds
* Real-time simulation (mock data)

### 📈 Data Visualization

* Line chart for:

  * Temperature
  * Humidity
* Time-based history tracking

### 🎮 Device Control

* Turn **fan / light ON/OFF**
* Display current device status

### ⚠️ Alert System

* Show warning when temperature exceeds threshold

### 🤖 Automation

* Automatically turn on fan when:

```text
Temperature > threshold
```

### 📜 History Page

* Table view of sensor data
* Timestamp + values

### ⚙️ Settings Page

* (Basic UI) for future configuration

---

## 🧠 System Architecture

### Sensor Data Flow

```text
ESP32 → HTTP POST → Backend → Database → Web UI
```

### Device Control Flow

```text
Web UI → Backend → Command → ESP32 → Relay → Device
```

---

## 🛠 Tech Stack

* **Frontend:** React (Vite)
* **Chart:** Recharts
* **Backend (planned):** Node.js + Express
* **Database (planned):** MongoDB
* **Hardware (planned):** ESP32

---

## 📂 Project Structure

```text
src/
 ├── api/          # API layer (mock / real switch)
 ├── mock/         # Mock data
 ├── pages/        # Dashboard, History, Settings
 ├── components/   # Chart, Control
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run project

```bash
npm run dev
```

### 3. Open in browser

```text
http://localhost:5173
```

---

## 🔌 API Contract

### Sensor Data

```json
{
  "deviceId": "esp32-01",
  "temperature": 30.5,
  "humidity": 65.2,
  "timestamp": "2026-03-11T10:00:00Z"
}
```

### Device Control

```json
{
  "device": "fan",
  "action": "on"
}
```

---

## ⚡ Demo Highlights

* Real-time dashboard
* Interactive chart
* Device control UI
* Automation logic
* Clean UI layout

---

## 📌 Notes

* Currently using **mock data** for development
* Backend integration can be added without changing UI
* Designed for **fast prototyping and demo stability**

---

## 👨‍💻 Author

* Frontend: Khánh
* Team project (Smart Home System)

---

## 🚀 Future Improvements

* Connect real backend API
* Integrate ESP32 hardware
* Add authentication (login/register)
* Enhance UI (dark mode, animations)

---
