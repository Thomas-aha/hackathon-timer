const express = require('express');
const router = express.Router();
const timerRoutes = require('./routes/timer');

// Use timer routes
router.use('/timer', timerRoutes);

module.exports = router; 