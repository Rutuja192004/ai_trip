"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import API from "../../../services/api";

export default function TripDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const fetchTrip = async () => {
    try {
      const res = await API.get(`/trips/${id}`);
      setTrip(res.data.trip);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrip();
  }, []);

  const regenerateDay = async (day: number) => {
    try {
      const res = await API.post(`/trips/${id}/regenerate-day`, { day });

      setTrip(res.data.trip);
    } catch (error) {
      console.log(error);
      alert("Failed to regenerate day");
    }
  };

  const deleteTrip = async () => {
    if (!confirm("Delete this trip?")) return;

    await API.delete(`/trips/${id}`);
    router.push("/dashboard");
  };

  const askAI = async () => {
    try {
      const res = await API.post("/trips/chat/ask", {
        destination: trip.destination,
        question,
      });

      setAnswer(res.data.answer);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Trip Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold">{trip.destination}</h1>

              <p className="mt-3 text-lg opacity-90">
                {trip.days} Days • Budget ₹{trip.budgetLimit?.toLocaleString()}
              </p>
            </div>

            <button
              onClick={deleteTrip}
              className="bg-red-500 px-5 py-3 rounded-xl hover:bg-red-600"
            >
              Delete Trip
            </button>
          </div>

          {trip.summary && (
            <div className="mt-8 bg-white/10 p-5 rounded-xl">
              <h2 className="font-semibold mb-3">AI Trip Summary</h2>

              <p className="leading-7">{trip.summary}</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {/* ITINERARY */}

        <h2 className="text-3xl font-bold mb-6">Itinerary</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {trip.itinerary?.itinerary?.map((day: any) => (
            <div key={day.day} className="bg-white p-6 rounded-3xl shadow">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-xl font-bold">Day {day.day}</h3>

                  {day.theme && (
                    <p className="text-sm text-slate-500 mt-1">
                      ✨ {day.theme}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => regenerateDay(day.day)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  🔄 Regenerate
                </button>
              </div>

              <div className="space-y-4">
                {day.activities?.map((activity: any, index: number) =>
                  typeof activity === "string" ? (
                    <div key={index} className="bg-slate-100 p-4 rounded-xl">
                      {activity}
                    </div>
                  ) : (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-xl p-5 bg-slate-50"
                    >
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        🕒 {activity.time}
                      </span>

                      <h4 className="font-bold text-lg mt-3">
                        {activity.title}
                      </h4>

                      <p className="text-slate-600 mt-2">
                        {activity.description}
                      </p>

                      {activity.bestFor && (
                        <div className="mt-3 inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                          👥 {activity.bestFor}
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>

        {/* BUDGET */}

        <h2 className="text-3xl font-bold mt-12 mb-6">Budget Breakdown</h2>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-5 rounded-xl">
              ✈️ Flights
              <div className="text-2xl font-bold mt-2">
                ₹{trip.budget?.flights?.toLocaleString()}
              </div>
            </div>

            <div className="bg-green-50 p-5 rounded-xl">
              🏨 Accommodation
              <div className="text-2xl font-bold mt-2">
                ₹{trip.budget?.accommodation?.toLocaleString()}
              </div>
            </div>

            <div className="bg-orange-50 p-5 rounded-xl">
              🍽️ Food
              <div className="text-2xl font-bold mt-2">
                ₹{trip.budget?.food?.toLocaleString()}
              </div>
            </div>

            <div className="bg-purple-50 p-5 rounded-xl">
              🎯 Activities
              <div className="text-2xl font-bold mt-2">
                ₹{trip.budget?.activities?.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-6">
            <div className="text-3xl font-bold text-indigo-600">
              Total Budget ₹{trip.budget?.total?.toLocaleString()}
            </div>
          </div>
        </div>

        {/* HOTELS */}

        <h2 className="text-3xl font-bold mt-12 mb-6">Recommended Hotels</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {(trip.hotels || trip.itinerary?.hotels || []).map(
            (hotel: any, index: number) => (
              <div key={index} className="bg-white rounded-3xl shadow-lg p-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xl">{hotel.name}</h3>

                  {hotel.rating && (
                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      ⭐ {hotel.rating}
                    </span>
                  )}
                </div>

                <p className="text-blue-600 mt-2">{hotel.type}</p>

                {hotel.location && (
                  <p className="text-sm text-gray-500 mt-2">
                    📍 {hotel.location}
                  </p>
                )}

                <p className="text-gray-600 mt-4">{hotel.description}</p>

                {hotel.whyRecommended && (
                  <div className="mt-4 bg-blue-50 p-3 rounded-xl">
                    <p className="text-sm text-blue-700">
                      💡 {hotel.whyRecommended}
                    </p>
                  </div>
                )}

                <div className="mt-5 flex justify-between items-center">
                  <span className="font-bold text-green-600 text-lg">
                    ₹{hotel.pricePerNight?.toLocaleString()}
                  </span>

                  <span className="text-sm text-gray-500">per night</span>
                </div>
              </div>
            ),
          )}
        </div>

        {/* AI ASSISTANT */}

        <h2 className="text-3xl font-bold mt-12 mb-6">AI Travel Assistant</h2>

        <div className="bg-white rounded-3xl shadow p-6">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about this trip..."
            className="border w-full p-4 rounded-xl"
          />

          <button
            onClick={askAI}
            className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl"
          >
            Ask AI
          </button>

          {answer && (
            <div className="mt-6 bg-slate-100 p-5 rounded-xl">{answer}</div>
          )}
        </div>
      </div>
    </div>
  );
}
