const Trip = require("../models/trip");

const trip_delete = async (req, res) => {
  try {
    const vehicleId = req.params.vehicle_id;
    const ids = req.query.id.split(",");

    if (!ids || ids.length === 0) {
      return res.status(400).json({ error: "No IDs provided for deletion" });
    }

    const result = await Trip.deleteMany({
      _id: { $in: ids },
    });

    if (result.deletedCount > 0) {
      const totalTrips = await Trip.find({ vehicle_id: vehicleId }).sort({
        createdAt: -1,
      });
      const tripCoordinates = totalTrips.map((trip) => ({
        trip_id: trip._id,
        source: trip.source,
        destination: trip.destination,
      }));

      res.json(tripCoordinates);
    } else {
      return res
        .status(404)
        .json({ message: "No trips found for the provided IDs" });
    }
  } catch (error) {
    console.error("Error deleting trips:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting trips" });
  }
};

module.exports = trip_delete;
