const express = require("express");
const router = express.Router();

const { generateItinerary } = require("../services/aiService");

router.post("/generate", async (req, res) => {
  try {
    const result = await generateItinerary(req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
