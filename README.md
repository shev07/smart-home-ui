# Smart Home UI

Frontend dashboard for a smart home demo with:

- sensor monitoring
- device control
- temperature-based automation
- login and protected routes
- password recovery by username and phone
- automatic fallback to mock data when the backend is offline

The UI is structured around a real backend flow, but it can still be previewed without a backend during demo or design work.

## Features

- Dashboard showing latest temperature and humidity
- Fan and light control with ON/OFF actions
- Auto refresh for sensor data and device status
- Automation that turns the fan on when temperature passes the threshold
- History page for sensor records
- Settings page for local temperature threshold
- Chart view using Recharts
- Login page with mock-backed authentication fallback
- Forgot password flow that verifies identity before resetting password
- Mock fallback when API requests fail

## Runtime Behavior

### Frontend control flow

1. User clicks a device action in the dashboard.
2. Frontend sends `POST /api/devices/control`.
3. Frontend fetches `GET /api/devices` again to sync UI state.
4. Device cards re-render with the latest status.

### Frontend automation flow

1. Dashboard polls `GET /api/sensors/latest` every 3 seconds.
2. If temperature is above the configured threshold, frontend triggers `controlDevice("fan", "on")`.
3. If temperature drops below the threshold, frontend triggers `controlDevice("fan", "off")`.
4. The dashboard shows an automation warning when the threshold is exceeded.

### Fallback behavior

If the backend is unavailable, the app automatically falls back to local mock data:

- sensor endpoints return generated demo values
- device control updates local mock state
- auth login uses local demo accounts
- password recovery verifies username + phone locally, then updates the demo password
- the UI remains usable for presentation and layout testing

### Authentication flow

1. Unauthenticated users are redirected to `/login`.
2. Login stores a token in `localStorage` and unlocks protected routes.
3. Forgot password verifies `username + phone`.
4. After verification, the user sets a new password instead of receiving the old one.
5. Dashboard provides logout and clears the local session.

## API Expectations

Default API base URL:

```text
http://localhost:5000/api
```

You can override it with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Expected endpoints:

- `POST /api/auth/login`
- `POST /api/auth/forgot-password/verify`
- `POST /api/auth/reset-password`
- `GET /api/sensors/latest`
- `GET /api/sensors`
- `GET /api/devices`
- `POST /api/devices/control`

Example control payload:

```json
{
  "deviceId": "fan",
  "action": "on"
}
```

Example login payload:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

## Tech Stack

- React 19
- Vite 8
- React Router
- Recharts

## Project Structure

```text
src/
  api/          API layer and backend client
  components/   Reusable UI blocks
  mock/         Local fallback data
  pages/        Dashboard, History, Settings
  utils/        Response normalization helpers
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Open:

```text
http://localhost:5173
```

## Notes

- JWT is read from `localStorage.getItem("token")` when calling the backend.
- Demo accounts are `admin / admin123` and `khanh / khanh123`.
- The current version is safe to demo even without backend services.
- The recovery flow now resets passwords instead of returning plaintext passwords.
- Once the backend is ready, the same UI can switch to live data without changing the page structure.
