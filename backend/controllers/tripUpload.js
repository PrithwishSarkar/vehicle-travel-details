const Trip = require("../models/trip");
const csv = require("csv-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const axios = require("axios");

async function getPlaceName(latitude, longitude) {
  const apiKey = process.env.OPENCAGE_API_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.results.length > 0) {
      return response.data.results[0].components.city;
    } else {
      return "Unknown location";
    }
  } catch (error) {
    console.error("Error fetching place name:", error);
    return "Error fetching location";
  }
}

const trip_upload = async (req, res) => {
  const vehicleId = req.params.vehicle_id;
  const tripName = req.params.trip_name;
  const csvFilePath = req.file.path;

  if (!vehicleId || !csvFilePath) {
    return res.status(400).send("Vehicle ID and CSV file are required.");
  }

  try {
    const document = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        document.push({
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude),
          timestamp: new Date(row.timestamp),
          ignition: row.ignition,
        });
      })
      .on("end", async () => {
        const firstEntry = document[0];
        const lastEntry = document[document.length - 1];

        const source = await getPlaceName(
          firstEntry.latitude,
          firstEntry.longitude
        );
        const destination = await getPlaceName(
          lastEntry.latitude,
          lastEntry.longitude
        );

        const newTripData = new Trip({
          vehicle_id: new mongoose.Types.ObjectId(vehicleId),
          trip_name: tripName,
          trip_details: document,
          source,
          destination,
        });

        await newTripData.save();

        fs.unlinkSync(csvFilePath);

        const totalTrips = await Trip.find({ vehicle_id: vehicleId }).sort({
          createdAt: -1,
        });
        const tripCoordinates = totalTrips.map((trip) => ({
          trip_id: trip._id,
          source: trip.source,
          destination: trip.destination,
        }));

        res.json(tripCoordinates);
      });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while processing the file.");
  }
};

module.exports = trip_upload;
