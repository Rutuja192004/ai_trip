# ✈️ TravelAI - AI Powered Travel Planner

TravelAI is a full-stack AI-powered travel planning application that generates personalized travel itineraries, budget estimates, hotel recommendations, and travel guidance using Generative AI.

Users can create customized travel plans by providing a destination, trip duration, budget, and interests. The AI then generates a complete day-wise itinerary along with realistic cost estimations and accommodation suggestions.

---

# 🚀 Features

## 🔐 User Authentication

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Logout Functionality

---

## 🤖 AI Trip Generation

Users provide:

- Destination
- Number of Days
- Total Budget (INR)
- Interests

The AI generates:

- Humanized Trip Summary
- Day-wise Itinerary
- Budget Breakdown
- Hotel Recommendations

---

## 🗓️ Smart Itinerary Planning

Each day contains:

- Activity Timings
- Activity Name
- Detailed Description
- Best Suitable Traveler Type
- Local Experiences
- Food Recommendations
- Hidden Gems

Example:

- 09:00 AM – Visit Eiffel Tower
- Description: Enjoy panoramic views of Paris and explore the history behind one of the world's most iconic landmarks.
- Best For: Couples, Photographers

---

## 💰 Dynamic Budget Planning

Users specify a maximum budget.

The system automatically distributes expenses across:

- Flights
- Accommodation
- Food
- Activities

Budget calculations remain within the user's specified budget limit.

---

## 🏨 AI Hotel Recommendations

Recommended hotels include:

- Hotel Name
- Hotel Type
- Rating
- Location
- Description
- Price Per Night
- Recommendation Reason

---

## 🔄 Regenerate Day Feature

Users can regenerate an individual day's itinerary without affecting the remaining days.

Regeneration updates:

- Activities
- Timings
- Recommendations
- Daily Budget

---

## 💬 AI Travel Assistant

Users can ask travel-related questions such as:

- What is famous in Paris?
- Best shopping places in Tokyo?
- What food should I try in Goa?

The AI provides contextual travel guidance.

---

## 📊 Dashboard

Users can:

- View all trips
- Access trip history
- Open detailed itineraries
- Manage generated trips

---

# 🛠️ Tech Stack

## Frontend

- Next.js
- React.js
- TypeScript
- Tailwind CSS
- Axios

## Backend

- Node.js
- Express.js
- JWT Authentication

## Database

- MongoDB
- Mongoose

## AI

- Groq API
- Llama 3.3 70B Versatile

---

# 📂 Project Structure

backend/

├── controllers/

├── middleware/

├── models/

├── routes/

├── services/

├── server.js

frontend/

├── app/

├── components/

├── services/

├── public/

├── next.config.js

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/travelai.git

cd travelai
```

## Backend Setup

```bash
cd backend

npm install
```

Create .env

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret

GROQ_API_KEY=your_groq_api_key
```

Start Backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Start Frontend

```bash
npm run dev
```

Application:

```text
http://localhost:3000
```

---

# API Endpoints

## Authentication

POST /api/auth/register

POST /api/auth/login

---

## Trips

POST /api/trips

GET /api/trips

GET /api/trips/:id

PUT /api/trips/:id

DELETE /api/trips/:id

POST /api/trips/:id/regenerate-day

POST /api/trips/chat/ask

---

# Database Schema

## Trip

```js
{
  (destination,
    days,
    budgetLimit,
    interests,
    summary,
    itinerary,
    budget,
    hotels,
    chatHistory);
}
```

---

# Key Challenges Solved

## AI JSON Validation

AI models occasionally return invalid JSON.

Implemented a safe JSON extraction layer to:

- Remove markdown wrappers
- Extract JSON payloads
- Handle parsing failures gracefully

---

## Budget Control

The AI is instructed to:

- Stay within the user's budget
- Generate realistic INR estimates
- Balance expenses across categories

---

## Hotel Deduplication

Duplicate hotel recommendations are automatically filtered.

---

## Partial Itinerary Regeneration

Users can regenerate a specific day without recreating the entire trip.

---

# Future Enhancements

- Real Flight Price APIs
- Real Hotel APIs
- Google Maps Integration
- Weather Forecasting
- PDF Export
- Shareable Trip Links
- Multi-user Collaboration
- Voice-based Travel Assistant
- Booking Integration

---

# Learning Outcomes

Through this project, we gained hands-on experience with:

- Full Stack Development
- REST API Design
- JWT Authentication
- MongoDB Data Modeling
- Generative AI Integration
- Prompt Engineering
- Next.js Application Development
- State Management
- AI Response Validation

---

Extra Features Added

1. Humanized AI Itinerary ⭐

Instead of generating:

Visit Eiffel Tower
Visit Museum
Have Lunch

Your AI generates:

09:00 AM

Visit Eiffel Tower

Enjoy breathtaking panoramic views of Paris
and learn the fascinating history behind one
of the world's most iconic landmarks.

Best For:
Couples, Photographers
Extra Value
Real travel-guide style
Time-based planning
Personalized descriptions
Better user experience 2. Dynamic Budget System ⭐

Originally:

Low
Medium
High

Now:

User enters ₹50,000

AI generates:

Flights
Hotels
Food
Activities
Total Cost

within the budget.

Extra Value
More realistic planning
User-controlled budget
Better personalization 3. Day Regeneration Feature ⭐

Users can regenerate:

Day 2 only

without affecting:

Day 1
Day 3
Day 4
Day 5
Extra Value

Most travel planners regenerate the entire trip.

Your system regenerates only the selected day.

4. AI Travel Assistant Chat ⭐

Users can ask:

What food should I try in Paris?

Best shopping places?

How much cash should I carry?

and receive AI responses.

Extra Value

Makes the planner interactive after trip generation.

5. Hotel Recommendation Engine ⭐

Each hotel includes:

Name
Type
Rating
Location
Price Per Night
Description
Extra Value

Not just itinerary generation.

Provides accommodation planning too.

6. Hotel Deduplication Logic ⭐

Prevented:

Hotel A
Hotel A
Hotel A

from appearing multiple times after regeneration.

Extra Value

Cleaner recommendations.

7. Budget Validation Layer ⭐

If AI returns:

Budget = ₹75,000

while user selected:

₹50,000

your backend scales the budget.

Extra Value

Prevents AI hallucinations.

8. Safe JSON Extraction Layer ⭐

AI sometimes returns:

````json
{ ... }

Extra explanation


You implemented:

```js
extractJSON()

to safely parse responses.

Extra Value

Improves system reliability.

9. Personalized Interest-Based Planning ⭐

User enters:

Food
Adventure
Nature
Culture

AI generates activities accordingly.

Extra Value

Customized experience.

10. Detailed Activity Cards ⭐

Every activity includes:

Time
Title
Description
Best For

instead of a simple string.

Extra Value

Much richer UI.

11. Modern Dashboard ⭐

Features:

Trip History
Budget Display
Destination Cards
Quick Access
Extra Value

Professional product feel.

12. JWT Protected Trip Management ⭐

Only the trip owner can:

View Trip
Update Trip
Delete Trip
Regenerate Day
Extra Value



### 🌟 Creative Feature – AI Travel Safety Guide

In addition to the core project requirements, I implemented an **AI-powered Travel Safety Guide** to help travelers make safer and more informed decisions before visiting a destination.

### Problem

Most travel planners focus only on attractions, hotels, and itineraries. Travelers often need important information such as:

* Common tourist scams
* Safe neighborhoods
* Areas requiring caution
* Transportation safety tips
* Emergency contact information
* Cultural etiquette
* Weather-related precautions
* Advice for solo and women travelers

Finding this information usually requires searching multiple websites and travel forums.

### Solution

The AI Travel Safety Guide generates destination-specific safety recommendations using a Large Language Model (LLM).

Users can click the **"🛡️ Travel Safety Guide"** button from the trip details page to receive personalized safety insights for their selected destination.

### Features

* 🚨 Common Tourist Scams
* 🏙️ Safe Areas
* ⚠️ Areas Requiring Caution
* 🚕 Transportation Safety Tips
* 🏥 Emergency Information
* 🙏 Cultural Etiquette
* 🌦️ Weather Precautions
* 🎒 Solo Traveler Tips
* 👩 Women Traveler Safety Tips

### Technical Implementation

* Frontend: Next.js + Tailwind CSS
* Backend: Node.js + Express
* AI Model: Groq Llama 3.3 70B Versatile
* API Endpoint: `/api/trips/safety-guide`

The feature dynamically generates safety recommendations based on the selected destination and displays them in an easy-to-read format within the application.

### Why This Feature?

This feature demonstrates:

* Creativity
* Problem Solving
* Real-world usefulness
* Practical application of AI beyond itinerary generation

It enhances the travel planning experience by helping users travel more confidently and safely.



Production-style security.
# Author

Rutuja Uphale

B.Tech Computer Engineering

TravelAI – AI Powered Travel Planning System
````
