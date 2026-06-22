require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const extractJSON = (content) => {
  content = content.replace(/`json/g, "").replace(/`/g, "").trim();

  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("No valid JSON found in AI response");
  }

  return JSON.parse(content.slice(start, end + 1));
};

// ====================
// GENERATE FULL TRIP
// ====================

const generateItinerary = async (tripData) => {
  const prompt = `
You are an expert travel planner and local guide.

From City: ${tripData.fromCity || "Unknown"}
Destination: ${tripData.destination}
Days: ${tripData.days}
Maximum Budget: ₹${tripData.budgetLimit}
Interests: ${tripData.interests.join(", ")}

IMPORTANT BUDGET RULES:

* Total budget MUST NOT exceed ₹${tripData.budgetLimit}
* Use realistic Indian Rupee pricing.
* Use actual market prices.
* Flights should be estimated from From City to Destination.
* Accommodation = hotel price × nights.
* Food costs should be realistic per day.
* Activities should have realistic entry fees.

FLIGHT RULES:

* Estimate round-trip travel cost.
* Use domestic pricing for domestic trips.
* Use international pricing for international trips.
* Use market averages.

HOTEL RULES:

* Recommend exactly 3 hotels.
* Prefer real hotels.
* Include rating.
* Include location.
* Include whyRecommended.
* Match user budget.

Return ONLY JSON.

{
"summary":"",
"itinerary":[
{
"day":1,
"theme":"",
"activities":[
{
"time":"",
"title":"",
"description":"",
"bestFor":""
}
]
}
],
"budget":{
"flights":0,
"accommodation":0,
"food":0,
"activities":0,
"total":0
},
"hotels":[
{
"name":"",
"type":"",
"rating":4.5,
"location":"",
"description":"",
"pricePerNight":0,
"whyRecommended":""
}
]
}

ONLY JSON.
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

  const parsed = extractJSON(response.choices[0].message.content);

  const total =
    Number(parsed?.budget?.flights || 0) +
    Number(parsed?.budget?.accommodation || 0) +
    Number(parsed?.budget?.food || 0) +
    Number(parsed?.budget?.activities || 0);

  parsed.budget.total = total;

  if (tripData.budgetLimit && parsed.budget.total > tripData.budgetLimit) {
    const ratio = tripData.budgetLimit / parsed.budget.total;

    ```
parsed.budget.flights = Math.round(
  parsed.budget.flights * ratio,
);

parsed.budget.accommodation = Math.round(
  parsed.budget.accommodation * ratio,
);

parsed.budget.food = Math.round(
  parsed.budget.food * ratio,
);

parsed.budget.activities = Math.round(
  parsed.budget.activities * ratio,
);

parsed.budget.total =
  parsed.budget.flights +
  parsed.budget.accommodation +
  parsed.budget.food +
  parsed.budget.activities;
```;
  }

  return parsed;
};

// ====================
// REGENERATE DAY
// ====================

const regenerateDayAI = async ({
  destination,
  budgetLimit,
  interests,
  day,
}) => {
  const prompt = `
You are a premium travel planner.

Destination: ${destination}
Maximum Budget: ₹${budgetLimit}
Interests: ${interests.join(", ")}

Generate a completely different Day ${day} plan.

Requirements:

* 4 to 6 activities
* Exact times
* Hidden gems
* Local foods
* Explain why each activity matters
* Mention who would enjoy it

IMPORTANT:

* Stay within budget
* Use realistic costs
* Recommend one realistic hotel

Return ONLY JSON.

{
"theme":"",
"activities":[
{
"time":"",
"title":"",
"description":"",
"bestFor":""
}
],
"budget":{
"activities":0
},
"hotel":{
"name":"",
"type":"",
"rating":4.5,
"location":"",
"description":"",
"pricePerNight":0,
"whyRecommended":""
}
}

ONLY JSON.
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.9,
  });

  return extractJSON(response.choices[0].message.content);
};

// ====================
// CHATBOT
// ====================

const travelChatAI = async ({ destination, question }) => {
  const prompt = `
You are a friendly travel assistant.

Destination: ${destination}

Question:
${question}

Provide a concise and helpful answer.
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

  return response.choices[0].message.content;
};

module.exports = {
  generateItinerary,
  regenerateDayAI,
  travelChatAI,
};
