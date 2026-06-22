require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateItinerary = async (tripData) => {
  const prompt = `
Destination: ${tripData.destination}
Days: ${tripData.days}
Budget: ${tripData.budgetType}
Interests: ${tripData.interests.join(", ")}

Generate a complete travel plan.

Return ONLY valid JSON.

{
"summary":"Short trip summary",

"itinerary":[
{
"day":1,
"activities":[
"Activity 1",
"Activity 2",
"Activity 3"
]
}
],

"budget":{
"flights":500,
"accommodation":300,
"food":200,
"activities":100,
"total":1100
},

"hotels":[
{
"name":"Hotel Name",
"type":"3-star",
"description":"Hotel description",
"pricePerNight":120
}
]
}

IMPORTANT:

* Return valid JSON only.
* Use double quotes only.
* No markdown.
* No explanations.
* hotels MUST be an array of objects.
  `;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  let content = response.choices[0].message.content;

  content = content.replace(/`json/g, "").replace(/`/g, "").trim();

  console.log("========== RAW AI ==========");
  console.log(content);

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch (err) {
    console.log("JSON PARSE FAILED");

    return {
      summary: `${tripData.destination} Trip`,
      itinerary: [],
      budget: {
        flights: 0,
        accommodation: 0,
        food: 0,
        activities: 0,
        total: 0,
      },
      hotels: [],
    };
  }

  // Hotels fix
  if (!parsed.hotels) {
    parsed.hotels = [];
  }

  if (typeof parsed.hotels === "string") {
    try {
      parsed.hotels = JSON.parse(parsed.hotels);
    } catch {
      parsed.hotels = [];
    }
  }

  // AI sometimes returns:
  // hotels: ["[{...}]"]

  if (
    Array.isArray(parsed.hotels) &&
    parsed.hotels.length > 0 &&
    typeof parsed.hotels[0] === "string"
  ) {
    try {
      let hotelString = parsed.hotels[0];

      ```
  hotelString = hotelString.replace(/'/g, '"');

  hotelString = hotelString.replace(
    /(\w+)\s*:/g,
    '"$1":'
  );

  parsed.hotels = JSON.parse(hotelString);
  ```;
    } catch {
      parsed.hotels = [];
    }
  }

  if (!Array.isArray(parsed.hotels)) {
    parsed.hotels = [];
  }

  if (!parsed.itinerary) {
    parsed.itinerary = [];
  }

  if (!parsed.budget) {
    parsed.budget = {
      flights: 0,
      accommodation: 0,
      food: 0,
      activities: 0,
      total: 0,
    };
  }

  console.log("FINAL HOTELS:");
  console.dir(parsed.hotels, { depth: null });

  return parsed;
};

const regenerateDayAI = async ({ destination, budgetType, interests, day }) => {
  const prompt = `
Destination: ${destination}
Budget: ${budgetType}
Interests: ${interests.join(", ")}

Generate 3 NEW activities for Day ${day}.

Return ONLY valid JSON:

{
"activities": [
"Activity 1",
"Activity 2",
"Activity 3"
],
"budgetImpact": 50,
"hotel": {
"name":"Optional Hotel",
"type":"4-star",
"description":"Nice hotel",
"pricePerNight":150
}
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  let content = response.choices[0].message.content;

  content = content.replace(/`json/g, "").replace(/`/g, "").trim();

  try {
    return JSON.parse(content);
  } catch {
    return {
      activities: [
        "Explore local attractions",
        "Try local cuisine",
        "Visit cultural landmarks",
      ],
      budgetImpact: 0,
    };
  }
};

module.exports = {
  generateItinerary,
  regenerateDayAI,
};
