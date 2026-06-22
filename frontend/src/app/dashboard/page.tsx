"use client";

import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar";
import TripCard from "../../components/TripCard";
import Link from "next/link";

export default function Dashboard() {
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await API.get("/trips");
        setTrips(res.data.trips);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTrips();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-5xl font-bold">My Trips ✈️</h1>

              <p className="text-gray-500 mt-2">
                Manage and explore your AI-generated journeys
              </p>
            </div>

            <Link
              href="/create-trip"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow"
            >
              + Create Trip
            </Link>
          </div>

          {trips.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-12 text-center">
              <h2 className="text-2xl font-semibold">No Trips Yet</h2>

              <p className="text-gray-500 mt-3">
                Create your first AI-powered travel plan.
              </p>

              <Link
                href="/create-trip"
                className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
              >
                Create Trip
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
