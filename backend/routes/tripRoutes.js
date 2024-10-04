const express = require("express");
const router = express.Router();
const multer = require("multer");
const trip_upload = require("../controllers/tripUpload");
const trip_details = require("../controllers/tripOpen");
const trip_delete = require("../controllers/tripDelete");

const upload = multer({ dest: "uploads/" });

router.get("/:vehicle_id", trip_details);

router.delete("/:vehicle_id", trip_delete);

router.post(
  "/:vehicle_id/:trip_name/upload",
  upload.single("file"),
  trip_upload
);

module.exports = router;
