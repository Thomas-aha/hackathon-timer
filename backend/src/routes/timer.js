const express = require('express');
const router = express.Router();
const timerSettings = require('../store/timerSettings');
const { TIMER_MODES } = require('../constants');

// POST endpoint to save timer settings
router.post('/settings', (req, res) => {
  const { presentationId, title, slideId, minutes, seconds, style, settings, mode } = req.body;
  
  if (!presentationId || !slideId) {
    return res.status(400).json({ error: 'Presentation ID and Slide ID are required' });
  }
  
  const key = `${presentationId}_${slideId}`;
  timerSettings.set(key, {
    minutes,
    seconds,
    title,
    style,
    settings,
    isRunning: false,
    timeLeft: mode === TIMER_MODES.COUNT_DOWN ? minutes * 60 + seconds : 0,
    mode
  });
  res.json({ success: true });
});


// GET endpoint to retrieve timer settings
router.get('/settings', (req, res) => {
  const { presentationId, slideId } = req.query;
  
  if (!presentationId || !slideId) {
    return res.status(400).json({ error: 'Presentation ID and Slide ID are required' });
  }

  const key = `${presentationId}_${slideId}`;
  const settings = timerSettings.get(key);
  if (!settings) {
    return res.status(404).json({ error: 'Settings not found' });
  }

  res.json(settings);
});

module.exports = router; 