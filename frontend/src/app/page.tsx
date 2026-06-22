"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-br from-blue-50 via-white to-indigo-100">
        {/* HERO */}

        <section className="max-w-7xl mx-auto px-8 py-28 text-center">
          <span className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-medium">
            🚀 AI Powered Travel Planning
          </span>

          <h1 className="text-7xl font-extrabold mt-8 text-slate-900 leading-tight">
            Plan Your Dream Trip
            <br />
            In Seconds
          </h1>

          <p className="text-xl text-gray-600 mt-8 max-w-3xl mx-auto">
            Generate personalized itineraries, hotel recommendations, travel
            budgets and activity plans instantly using AI.
          </p>

          <div className="flex justify-center gap-5 mt-12">
            {loggedIn ? (
              <Link
                href="/create-trip"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg"
              >
                Create Trip →
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg"
                >
                  Start Planning →
                </Link>

                <Link
                  href="/login"
                  className="bg-white border px-8 py-4 rounded-xl text-lg font-semibold shadow"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </section>

        {/* FEATURES */}

        <section className="max-w-7xl mx-auto px-8 py-20">
          <h2 className="text-5xl font-bold text-center mb-14">
            Why TravelAI?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="text-5xl mb-5">🗺️</div>

              <h3 className="text-2xl font-bold mb-3">Smart Itineraries</h3>

              <p className="text-gray-600">
                AI creates day-wise plans based on destination, budget and
                interests.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="text-5xl mb-5">💰</div>

              <h3 className="text-2xl font-bold mb-3">Budget Planning</h3>

              <p className="text-gray-600">
                Flights, hotels, food and activities estimated automatically.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="text-5xl mb-5">🏨</div>

              <h3 className="text-2xl font-bold mb-3">Hotel Suggestions</h3>

              <p className="text-gray-600">
                Personalized hotel recommendations generated for your trip.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}

        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-5xl font-bold text-center mb-14">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">📍</div>

              <h3 className="text-xl font-bold">Choose Destination</h3>

              <p className="text-gray-500 mt-2">
                Enter where you want to travel.
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-4">🤖</div>

              <h3 className="text-xl font-bold">AI Generates Plan</h3>

              <p className="text-gray-500 mt-2">
                Groq AI creates itinerary, budget and hotels.
              </p>
            </div>

            <div className="text-center">
              <div className="text-6xl mb-4">✈️</div>

              <h3 className="text-xl font-bold">Enjoy Your Trip</h3>

              <p className="text-gray-500 mt-2">
                Explore your personalized travel plan.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}

        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-24">
          <div className="max-w-5xl mx-auto text-center px-8">
            <h2 className="text-5xl font-bold">Ready To Explore?</h2>

            <p className="mt-5 text-xl opacity-90">
              Generate your first AI-powered travel itinerary today.
            </p>

            <Link
              href="/create-trip"
              className="inline-block mt-8 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold"
            >
              Create Trip
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
