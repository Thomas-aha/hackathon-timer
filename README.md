# Hackathon Timer

A beautiful and feature-rich timer application built with Vue 3 and Node.js, perfect for hackathons, presentations, and events. Features multiple timer styles, real-time synchronization, and a sleek user interface.

## Features

- 🕒 Multiple timer styles:
  - Digital Timer
  - Icon Timer
  - Flip Clock (with smooth animations)
- ⚡ Real-time synchronization across devices using MQTT
- 🌐 Multi-language support (English, Vietnamese)
- ⚙️ Customizable settings:
  - Time limit (minutes, seconds)
  - Warning threshold
  - Sound and visual alerts
- 🎯 Multiple timer modes:
  - Countdown
  - Stopwatch
- 🎨 Modern UI with Ant Design Vue
- 🔄 Auto-save settings
- ⌨️ Keyboard shortcuts (Space to start/pause)

## Tech Stack

### Frontend
- Vue 3 (Composition API)
- Ant Design Vue
- Vue Router
- Vue I18n
- MQTT.js for real-time communication
- Vite for development and building

### Backend
- Node.js
- Express
- MQTT for message broker
- CORS for cross-origin support

## Project Structure

```
hackathon-timer/
├── frontend/
│   ├── src/
│   │   ├── assets/          # Static assets
│   │   ├── components/      # Vue components
│   │   ├── i18n/           # Internationalization
│   │   ├── router/         # Vue Router configuration
│   │   ├── views/          # Page components
│   │   ├── config.js       # App configuration
│   │   ├── constants.js    # Constants and enums
│   │   └── main.js         # App entry point
│   ├── public/             # Public static files
│   ├── index.html          # HTML template
│   ├── vite.config.js      # Vite configuration
│   └── vitest.config.js    # Vitest configuration
│
└── backend/
    ├── src/
    │   ├── routes/         # Express routes
    │   ├── store/          # In-memory data store
    │   └── constants.js    # Shared constants
    └── server.js           # Server entry point
```

## Getting Started

### Prerequisites
- Node.js >= 18
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hackathon-timer.git
cd hackathon-timer
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

### Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The app will be available at http://localhost:5173

## Testing

The project uses Vitest for unit testing. Tests are located next to their respective components.

Run tests:
```bash
cd frontend
npm test           # Run tests in watch mode
```

### Test Structure
- Component tests check rendering and functionality
- Props validation
- Event emission
- State changes
- User interactions

## Deployment

### Frontend Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the contents of `dist/` to your static hosting service (Netlify, Vercel, etc.)

### Backend Deployment

1. Set environment variables:
```bash
PORT=3000
MQTT_URL=wss://broker.emqx.io:8084/mqtt
```

2. Start the production server:
```bash
cd backend
npm start
```

For production deployment, consider using PM2 or Docker:
```bash
npm install -g pm2
pm2 start server.js
```

## API Endpoints

### Timer Settings
- `GET /api/settings` - Get timer settings
- `POST /api/settings` - Save timer settings
- `POST /api/timer/start` - Start timer
- `POST /api/timer/stop` - Stop timer
- `POST /api/timer/reset` - Reset timer

## Real-time Communication

The application uses MQTT for real-time updates:

### Topics
- `timer/{presentationId}/{slideId}/start` - Timer start event
- `timer/{presentationId}/{slideId}/stop` - Timer stop event
- `timer/{presentationId}/{slideId}/reset` - Timer reset event
- `timer/{presentationId}/{slideId}/settings` - Settings update event

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 