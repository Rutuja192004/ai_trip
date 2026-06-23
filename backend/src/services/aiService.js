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
You are a world-class travel planner, local guide, food expert, budget analyst and luxury travel concierge.

Your goal is to create a realistic, exciting and highly personalized travel experience.

========================
TRIP DETAILS
============
for each day and each activity, provide at least 3 to 4 lines explan in way that is engaging and informative. Avoid generic descriptions. Use actual attractions, restaurants, and experiences whenever possible.
From City: ${tripData.fromCity || "Unknown"}
Destination: ${tripData.destination}
Number of Days: ${tripData.days}
Maximum Budget: ₹${tripData.budgetLimit}
Interests: ${tripData.interests.join(", ")}

========================
IMPORTANT RULES
===============

* Total trip budget MUST NOT exceed ₹${tripData.budgetLimit}
* Use realistic market prices.
* Use Indian Rupee (₹).
* Use actual attractions whenever possible.
* Avoid generic tourist plans.
* Create an itinerary that feels designed by a local expert.
* Activities must flow naturally throughout the day.
* Avoid repetitive attractions.
* Every day should feel unique.
* Mix famous attractions with hidden gems.
* Include cultural experiences.
* Include local food experiences.
* Include photography-worthy locations.
* Include authentic local experiences.
* Include insider recommendations.
* Match recommendations with user's interests.

========================
PERSONALIZATION RULES
=====================

If interests include Food:

* Include famous restaurants
* Include local dishes
* Include cafes
* Include street food experiences

If interests include Adventure:

* Include outdoor activities
* Include trekking
* Include water sports
* Include nature experiences

If interests include Culture:

* Include museums
* Include heritage sites
* Include temples
* Include cultural performances

If interests include Shopping:

* Include markets
* Include artisan stores
* Include malls
* Include local shopping districts

If interests include Nature:

* Include lakes
* Include viewpoints
* Include parks
* Include natural attractions

========================
FLIGHT RULES
============

* Estimate realistic round-trip travel costs.

* Flights should be calculated from:
  ${tripData.fromCity || "User City"}
  to
  ${tripData.destination}

* Use realistic domestic pricing.

* Use realistic international pricing.

* Use average market rates.

========================
HOTEL RULES
===========

Recommend EXACTLY 3 hotels.

For each hotel provide:

* name
* type
* rating
* location
* description
* pricePerNight
* whyRecommended

Hotel requirements:

* Use real hotels whenever possible.
* Match user's budget.
* Prefer highly rated properties.
* Explain why travelers would enjoy staying there.

========================
BUDGET RULES
============

Budget must include:

* Flights
* Accommodation
* Food
* Activities

Use realistic pricing.

The total budget MUST NOT exceed:

₹${tripData.budgetLimit}

========================
DAY DESIGN RULES
================

Every day must feel complete.

Each day should include:

Morning Experience
Mid-Morning Experience
Lunch Recommendation
Afternoon Experience
Evening Experience
Night Experience

Generate 5 to 7 activities per day.

Every day must have:

* One major attraction
* One local experience
* One food experience
* One photo-worthy location
* One evening activity

========================
THEME RULES
===========

Generate a unique theme for each day.

Examples:

* Royal Heritage Trail
* Hidden Gems of the City
* Food & Culture Discovery
* Adventure and Nature Escape
* Markets & Nightlife
* Historic Wonders Journey
* Local Life Experience

========================
ACTIVITY RULES
==============

For every activity provide:

* time
* title
* description
* bestFor

Description requirements:

Minimum 40-60 words.

Explain:

* Why the attraction is special
* What travelers can experience
* Historical or cultural importance
* Local insider tips
* Best photo opportunities
* Food recommendations nearby when relevant

Do NOT write generic descriptions.

Bad Example:
"Visit the museum and enjoy."

Good Example:
"Explore the National Museum, home to centuries of local history and rare artifacts. Travelers can learn about the region's cultural evolution while enjoying guided exhibits. Arrive early to avoid crowds and don't miss the rooftop viewpoint for panoramic city photos."

========================
SUMMARY RULES
=============

Create a warm and engaging summary.

Include:

* Best season to visit
* Destination vibe
* Local cuisine
* Hidden gems
* Traveler type
* What makes this destination memorable

========================
RETURN FORMAT
=============

Return ONLY valid JSON.

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
NO MARKDOWN.
NO EXPLANATION.
NO TEXT OUTSIDE JSON.
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

    parsed.budget.flights = Math.round(parsed.budget.flights * ratio);

    parsed.budget.accommodation = Math.round(
      parsed.budget.accommodation * ratio,
    );

    parsed.budget.food = Math.round(parsed.budget.food * ratio);

    parsed.budget.activities = Math.round(parsed.budget.activities * ratio);

    parsed.budget.total =
      parsed.budget.flights +
      parsed.budget.accommodation +
      parsed.budget.food +
      parsed.budget.activities;
  }

  return parsed;
};

// ====================
// REGENERATE DAY
// ====================
const generateSafetyGuideAI = async (destination) => {
  const prompt = `
You are an expert travel safety advisor.

Destination: ${destination}

Create a comprehensive travel safety guide.

Include:

1. Common Tourist Scams
2. Safe Areas
3. Areas Requiring Extra Caution
4. Transportation Safety Tips
5. Emergency Numbers
6. Cultural Etiquette
7. Weather Precautions
8. Solo Traveler Tips
9. Women Traveler Tips

Return ONLY JSON.

{
  "commonScams":[
    {
      "title":"",
      "description":""
    }
  ],

  "safeAreas":[
    ""
  ],

  "cautionAreas":[
    ""
  ],

  "transportTips":[
    ""
  ],

  "emergencyInfo":{
    "emergencyNumber":"",
    "touristHelpline":""
  },

  "culturalEtiquette":[
    ""
  ],

  "weatherPrecautions":[
    ""
  ],

  "soloTravelerTips":[
    ""
  ],

  "womenTravelerTips":[
    ""
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
    temperature: 0.8,
  });

  return extractJSON(response.choices[0].message.content);
};
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
  generateSafetyGuideAI,
};
