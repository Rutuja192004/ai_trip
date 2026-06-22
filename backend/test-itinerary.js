const { generateItinerary } = require("./src/aiService/aiService");

(async () => {
  const result = await generateItinerary({
    destination: "Tokyo",
    days: 5,
    budgetType: "Medium",
    interests: ["Food", "Culture"],
  });

  console.log(result);
})();
