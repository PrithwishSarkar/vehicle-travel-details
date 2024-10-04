const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tripDetailsSchema = new Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  ignition: {
    type: String,
    required: true,
  },
});

const tripSchema = new Schema(
  {
    vehicle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vehicle",
      required: true,
    },
    trip_name: {
      type: String,
      required: true,
    },
    trip_details: [tripDetailsSchema],
    source: { type: String },
    destination: { type: String },
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
