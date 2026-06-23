const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth");
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  regenerateDay,
  travelChat,
  getSafetyGuide,
} = require("../controllers/tripController");
// Create Trip
router.post("/", protect, createTrip);
router.post("/safety-guide", protect, getSafetyGuide);
// All Trips
router.get("/", protect, getTrips);

// Single Trip
router.get("/:id", protect, getTripById);

// Update Trip
router.put("/:id", protect, updateTrip);

// Delete Trip
router.delete("/:id", protect, deleteTrip);

// AI Regenerate Day
router.post("/:id/regenerate-day", protect, regenerateDay);

// AI Travel Chat
router.post("/chat/ask", protect, travelChat);

// Future PDF Export
router.get("/:id/export-pdf", protect, (req, res) => {
  res.json({
    success: true,
    message: "PDF Export Coming Soon",
  });
});

module.exports = router;
