const express = require('express');
const router = express.Router();
const {
  getTransportPositions,
  getETAForStop,
} = require('../controllers/transportController');

router.get('/transport/:routeId/positions', getTransportPositions);
router.get('/transport/:routeId/stops/:stopId/eta', getETAForStop);

module.exports = router;
