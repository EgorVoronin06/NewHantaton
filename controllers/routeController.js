const Route = require('../models/Route');

const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({}, 'routeId name');
    res.json(routes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ message: 'Server error fetching routes' });
  }
};

const getRouteById = async (req, res) => {
  try {
    const route = await Route.findOne({ routeId: req.params.id });
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json(route);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ message: 'Server error fetching route' });
  }
};

const getStopsNearLocation = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 1000 } = req.query;
    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    // Find stops within maxDistance meters from the given location
    const routes = await Route.aggregate([
      { $unwind: '$stops' },
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          distanceField: 'distance',
          maxDistance: parseInt(maxDistance),
          spherical: true,
          key: 'stops.location',
        },
      },
      {
        $group: {
          _id: '$routeId',
          routeName: { $first: '$name' },
          stops: {
            $push: {
              stopId: '$stops.stopId',
              name: '$stops.name',
              location: '$stops.location',
              distance: '$distance',
            },
          },
        },
      },
    ]);

    res.json(routes);
  } catch (error) {
    console.error('Error fetching stops near location:', error);
    res.status(500).json({ message: 'Server error fetching stops' });
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  getStopsNearLocation,
};
