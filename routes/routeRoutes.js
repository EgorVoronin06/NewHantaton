const express = require('express');
const router = express.Router();
const {
  getAllRoutes,
  getRouteById,
  getStopsNearLocation,
} = require('../controllers/routeController');

router.get('/routes', getAllRoutes);
router.get('/routes/:id', getRouteById);
router.get('/stops/near', getStopsNearLocation);

module.exports = router;
