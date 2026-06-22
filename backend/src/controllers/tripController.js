const Trip = require("../models/Trip");

const {
  generateItinerary,
  regenerateDayAI,
  travelChatAI,
} = require("../services/aiService");

// =======================
// CREATE TRIP
// =======================

exports.createTrip = async (req, res) => {
  try {
    const { destination, days, budgetLimit, interests, fromCity } = req.body;

    const aiTrip = await generateItinerary({
      destination,
      days,
      budgetLimit,
      interests,
      fromCity,
    });

    const trip = await Trip.create({
      userId: req.user.userId,

      destination,
      days,
      budgetLimit,
      interests,
      fromCity,

      summary: aiTrip.summary,

      itinerary: {
        itinerary: aiTrip.itinerary,
        budget: aiTrip.budget,
        hotels: aiTrip.hotels,
      },

      budget: aiTrip.budget,

      hotels: aiTrip.hotels,
    });

    res.status(201).json({
      success: true,
      trip,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET ALL TRIPS
// =======================

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      trips,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET SINGLE TRIP
// =======================

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.json({
      success: true,
      trip,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// UPDATE TRIP
// =======================

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      req.body,
      {
        new: true,
      },
    );

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.json({
      success: true,
      trip,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// DELETE TRIP
// =======================

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    res.json({
      success: true,
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// AI CHAT
// =======================

exports.travelChat = async (req, res) => {
  try {
    const { destination, question } = req.body;

    const answer = await travelChatAI({
      destination,
      question,
    });

    res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// REGENERATE DAY
// =======================

exports.regenerateDay = async (req, res) => {
  try {
    const { id } = req.params;
    const { day } = req.body;

    const trip = await Trip.findOne({
      _id: id,
      userId: req.user.userId,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    const aiResponse = await regenerateDayAI({
      destination: trip.destination,
      budgetLimit: trip.budgetLimit,
      interests: trip.interests,
      day,
    });

    // Update itinerary activities

    if (
      trip.itinerary &&
      trip.itinerary.itinerary &&
      trip.itinerary.itinerary[day - 1]
    ) {
      trip.itinerary.itinerary[day - 1].activities = aiResponse.activities;

      if (aiResponse.theme) {
        trip.itinerary.itinerary[day - 1].theme = aiResponse.theme;
      }
    }

    // Update activity budget

    if (aiResponse.budget?.activities) {
      trip.budget.activities = Number(aiResponse.budget.activities);

      trip.budget.total =
        Number(trip.budget.flights || 0) +
        Number(trip.budget.accommodation || 0) +
        Number(trip.budget.food || 0) +
        Number(trip.budget.activities || 0);

      trip.itinerary.budget = trip.budget;
    }

    // Add hotel recommendation

    if (aiResponse.hotel) {
      if (!trip.hotels) {
        trip.hotels = [];
      }

      if (!trip.itinerary.hotels) {
        trip.itinerary.hotels = [];
      }

      const hotelExists = trip.hotels.some(
        (hotel) =>
          hotel.name?.toLowerCase() === aiResponse.hotel.name?.toLowerCase(),
      );

      if (!hotelExists) {
        trip.hotels.unshift(aiResponse.hotel);
        trip.itinerary.hotels.unshift(aiResponse.hotel);
      }
    }

    trip.markModified("itinerary");
    trip.markModified("budget");
    trip.markModified("hotels");

    await trip.save();

    res.json({
      success: true,
      trip,
    });
  } catch (error) {
    console.error("REGENERATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
