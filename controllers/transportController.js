const TransportPosition = require('../models/TransportPosition');
const Route = require('../models/Route');

// Get current transport positions for a route
const getTransportPositions = async (req, res) => {
  try {
    const { routeId } = req.params;
    if (!routeId) {
      return res.status(400).json({ message: 'routeId is required' });
    }
    const positions = await TransportPosition.find({ routeId });
    res.json(positions);
  } catch (error) {
    console.error('Error fetching transport positions:', error);
    res.status(500).json({ message: 'Server error fetching transport positions' });
  }
};

// Mock ETA calculation based on distance and average speed
const calculateETA = (distanceMeters, averageSpeedKmh) => {
  if (!distanceMeters || !averageSpeedKmh) return null;
  const speedMps = (averageSpeedKmh * 1000) / 3600;
  const etaSeconds = distanceMeters / speedMps;
  return etaSeconds; // in seconds
};

// Get ETA for a stop on a route
const getETAForStop = async (req, res) => {
  try {
    const { routeId, stopId } = req.params;
    if (!routeId || !stopId) {
      return res.status(400).json({ message: 'routeId and stopId are required' });
    }

    // Find route and stop
    const route = await Route.findOne({ routeId });
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    const stop = route.stops.find(s => s.stopId === stopId);
    if (!stop) {
      return res.status(404).json({ message: 'Stop not found on route' });
    }

    // Get transport positions for route
    const positions = await TransportPosition.find({ routeId });
    if (positions.length === 0) {
      return res.status(404).json({ message: 'No transport positions available' });
    }

    // For simplicity, take the closest vehicle to the stop
    const stopCoords = stop.location.coordinates;
    let closestVehicle = null;
    let minDistance = Infinity;

    positions.forEach(pos => {
      const [lng, lat] = pos.location.coordinates;
      const distance = getDistanceMeters(lat, lng, stopCoords[1], stopCoords[0]);
      if (distance < minDistance) {
        minDistance = distance;
        closestVehicle = pos;
      }
    });

    // Calculate ETA assuming average speed 20 km/h (can be improved)
    const averageSpeedKmh = 20;
    const etaSeconds = calculateETA(minDistance, averageSpeedKmh);

    res.json({
      vehicleId: closestVehicle.vehicleId,
      etaSeconds,
      distanceMeters: minDistance,
      delaySeconds: closestVehicle.delaySeconds || 0,
    });
  } catch (error) {
    console.error('Error calculating ETA:', error);
    res.status(500).json({ message: 'Server error calculating ETA' });
  }
};

// Helper function to calculate distance between two lat/lng points in meters
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }
  const R = 6378137; // Earth’s mean radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLong = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d; // returns the distance in meters
}

module.exports = {
  getTransportPositions,
  getETAForStop,
};
