const Trip = require("../models/trip");
const geolib = require("geolib");

const tripDetails = async (req, res) => {
  const tripIds = req.query.id.split(",");

  if (!tripIds || tripIds.length === 0) {
    return res.status(400).json({ error: "No trip IDs provided" });
  }

  try {
    const trips = await Trip.find({ _id: { $in: tripIds } }).sort({
      createdAt: -1,
    });

    if (trips.length === 0) {
      return res
        .status(404)
        .json({ message: "No trips found for the provided IDs" });
    }

    const tripResults = trips.map((trip) => {
      const { trip_details } = trip;
      let totalDistance = 0;
      let totalTravelDuration = 0;
      let overSpeedingDuration = 0;
      let overSpeedingDistance = 0;
      let totalStoppedDuration = 0;

      const stoppagePoints = [];
      const idlingPoints = [];
      const path = [];

      let currentIgnitionStatus = null;
      let isOverspeeding = false;
      let stopStartTime = null;
      let idleStartTime = null;
      let lastSpeed = 0;

      for (let i = 1; i < trip_details.length; i++) {
        const start = trip_details[i - 1];
        const end = trip_details[i];

        const distance =
          geolib.getDistance(
            { latitude: start.latitude, longitude: start.longitude },
            { latitude: end.latitude, longitude: end.longitude }
          ) / 1000;
        const duration =
          (new Date(end.timestamp) - new Date(start.timestamp)) / 1000 / 60;

        totalDistance += distance;
        totalTravelDuration += duration;

        const speed = distance / (duration / 60);
        if (speed > 60) {
          overSpeedingDuration += duration;
          overSpeedingDistance += distance;
          isOverspeeding = true;
        } else {
          isOverspeeding = false;
        }

        if (start.ignition === "OFF" && currentIgnitionStatus !== "OFF") {
          stopStartTime = new Date(start.timestamp);
        } else if (
          start.ignition === "ON" &&
          currentIgnitionStatus === "OFF" &&
          stopStartTime
        ) {
          totalStoppedDuration +=
            (new Date(start.timestamp) - stopStartTime) / 1000 / 60;
          stoppagePoints.push({
            latitude: start.latitude,
            longitude: start.longitude,
            stoppageDuration:
              (new Date(start.timestamp) - stopStartTime) / 1000 / 60,
          });
          stopStartTime = null;
        }

        if (start.ignition === "ON" && speed === 0 && lastSpeed > 0) {
          idleStartTime = new Date(start.timestamp);
        } else if (
          start.ignition === "ON" &&
          speed > 0 &&
          lastSpeed === 0 &&
          idleStartTime
        ) {
          idlingPoints.push({
            latitude: start.latitude,
            longitude: start.longitude,
            idlingDuration:
              (new Date(start.timestamp) - idleStartTime) / 1000 / 60,
          });
          idleStartTime = null;
        }

        path.push({
          start: {
            latitude: start.latitude,
            longitude: start.longitude,
            timestamp: start.timestamp,
          },
          end: {
            latitude: end.latitude,
            longitude: end.longitude,
            timestamp: end.timestamp,
            ignition: end.ignition,
          },
          distance,
          duration,
          speed,
          isOverspeeding,
        });

        lastSpeed = speed;
        currentIgnitionStatus = start.ignition;
      }
      return {
        trip_name: trip.trip_name,
        source: {
          latitude: trip_details[0].latitude,
          longitude: trip_details[0].longitude,
        },
        destination: {
          latitude: trip_details[trip_details.length - 1].latitude,
          longitude: trip_details[trip_details.length - 1].longitude,
        },
        total_distance_travelled: totalDistance,
        total_travel_duration: totalTravelDuration,
        overspeeding_duration: overSpeedingDuration,
        overspeeding_distance: overSpeedingDistance,
        total_stopped_duration: totalStoppedDuration,
        path,
        stoppage_points: stoppagePoints,
        idling_points: idlingPoints,
      };
    });

    res.status(200).json(tripResults);
  } catch (error) {
    console.error("Error fetching trip details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching trip details" });
  }
};

module.exports = tripDetails;
