const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const timerRoutes = require('./src/routes/timer');
const timerSettings = require('./src/store/timerSettings');
const { TIMER_MODES } = require('./src/constants');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Use timer routes
app.use('/api', timerRoutes);

// MQTT client setup
const mqttClient = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});

mqttClient.on('error', (error) => {
  console.error('MQTT Error:', error);
});

// API endpoints for timer actions
app.post('/api/timer/start', (req, res) => {
  const { presentationId, slideId, timerMode, timeLeft } = req.body;
  const topic = `timer/${presentationId}/${slideId}/start`;
  const key = `${presentationId}_${slideId}`;
  const settings = timerSettings.get(key) || {};
  timerSettings.set(key, { ...settings, timeLeft, isRunning: true, startTime: Date.now() });
  mqttClient.publish(topic, JSON.stringify({ action: 'start', timerMode, timeLeft }));
  res.json({ success: true, isRunning: true });
});

app.post('/api/timer/stop', (req, res) => {
  const { presentationId, slideId, timeLeft } = req.body;
  const topic = `timer/${presentationId}/${slideId}/stop`;
  const key = `${presentationId}_${slideId}`;
  const settings = timerSettings.get(key) || {};
  timerSettings.set(key, { ...settings, timeLeft, isRunning: false });
  mqttClient.publish(topic, JSON.stringify({ action: 'stop', timeLeft }));
  res.json({ success: true, isRunning: false });
});

app.post('/api/timer/reset', (req, res) => {
  const { presentationId, slideId, timerMode } = req.body;
  const topic = `timer/${presentationId}/${slideId}/reset`;
  const key = `${presentationId}_${slideId}`;
  const settings = timerSettings.get(key) || {};
  timerSettings.set(key, { ...settings, timeLeft: mode === TIMER_MODES.COUNT_DOWN ? minutes * 60 + seconds : 0, isRunning: false });
  mqttClient.publish(topic, JSON.stringify({ action: 'reset', timerMode }));
  res.json({ success: true, isRunning: false });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
}); 