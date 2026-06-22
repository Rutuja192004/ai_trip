const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ===================
    // BASIC TRIP INFO
    // ===================

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    fromCity: {
      type: String,
      default: "",
      trim: true,
    },

    days: {
      type: Number,
      required: true,
      min: 1,
    },

    budgetLimit: {
      type: Number,
      required: true,
      min: 1000,
    },

    interests: {
      type: [String],
      default: [],
    },

    // ===================
    // AI GENERATED SUMMARY
    // ===================

    summary: {
      type: String,
      default: "",
    },

    // ===================
    // FULL AI RESPONSE
    // ===================

    itinerary: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ===================
    // BUDGET BREAKDOWN
    // ===================

    budget: {
      flights: {
        type: Number,
        default: 0,
      },

      accommodation: {
        type: Number,
        default: 0,
      },

      food: {
        type: Number,
        default: 0,
      },

      activities: {
        type: Number,
        default: 0,
      },

      total: {
        type: Number,
        default: 0,
      },
    },

    // ===================
    // HOTELS
    // ===================

    hotels: [
      {
        name: {
          type: String,
          default: "",
        },

        type: {
          type: String,
          default: "",
        },

        rating: {
          type: Number,
          default: 0,
        },

        location: {
          type: String,
          default: "",
        },

        description: {
          type: String,
          default: "",
        },

        whyRecommended: {
          type: String,
          default: "",
        },

        pricePerNight: {
          type: Number,
          default: 0,
        },
      },
    ],

    // ===================
    // AI CHAT HISTORY
    // ===================

    chatHistory: [
      {
        role: {
          type: String,
          default: "",
        },

        message: {
          type: String,
          default: "",
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.models.Trip || mongoose.model("Trip", tripSchema);
