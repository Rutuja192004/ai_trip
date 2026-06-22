"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import API from "../../services/api";

export default function CreateTrip() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fromCity: "",
    destination: "",
    days: 5,
    budget: 50000,
    interests: "",
  });

  const createTrip = async (e: any) => {
    e.preventDefault();

    if (!form.destination.trim()) {
      return alert("Please enter destination");
    }

    if (!form.fromCity.trim()) {
      return alert("Please enter departure city");
    }

    if (form.days < 1) {
      return alert("Days must be greater than 0");
    }

    if (form.budget < 5000) {
      return alert("Budget should be at least ₹5000");
    }

    try {
      setLoading(true);

      const res = await API.post("/trips", {
        fromCity: form.fromCity,
        destination: form.destination,
        days: Number(form.days),
        budgetLimit: Number(form.budget),

        interests: form.interests
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
      });

      router.push(`/trip/${res.data.trip._id}`);
    } catch (error) {
      console.log(error);
      alert("Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {" "}
      <Navbar />
      ```
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-slate-800">
              ✈️ AI Trip Planner
            </h1>

            <p className="text-gray-500 mt-4 text-lg">
              Generate realistic travel plans with hotels, budgets and
              personalized itineraries
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <form onSubmit={createTrip} className="space-y-6">
              {/* From City */}

              <div>
                <label className="font-semibold block mb-2">
                  Departure City
                </label>

                <input
                  value={form.fromCity}
                  placeholder="Pune, Mumbai, Delhi..."
                  className="w-full border border-slate-300 p-4 rounded-xl"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fromCity: e.target.value,
                    })
                  }
                />
              </div>

              {/* Destination */}

              <div>
                <label className="font-semibold block mb-2">Destination</label>

                <input
                  value={form.destination}
                  placeholder="Goa, Paris, Tokyo..."
                  className="w-full border border-slate-300 p-4 rounded-xl"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      destination: e.target.value,
                    })
                  }
                />
              </div>

              {/* Days */}

              <div>
                <label className="font-semibold block mb-2">
                  Number of Days
                </label>

                <input
                  type="number"
                  min={1}
                  value={form.days}
                  className="w-full border border-slate-300 p-4 rounded-xl"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      days: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* Budget */}

              <div>
                <label className="font-semibold block mb-2">
                  Total Budget (₹)
                </label>

                <input
                  type="number"
                  value={form.budget}
                  className="w-full border border-slate-300 p-4 rounded-xl"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      budget: Number(e.target.value),
                    })
                  }
                />

                <div className="flex flex-wrap gap-3 mt-3">
                  {[25000, 50000, 100000, 200000].map((amount) => (
                    <button
                      type="button"
                      key={amount}
                      onClick={() =>
                        setForm({
                          ...form,
                          budget: amount,
                        })
                      }
                      className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                    >
                      ₹{amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}

              <div>
                <label className="font-semibold block mb-2">Interests</label>

                <input
                  value={form.interests}
                  placeholder="Food, Adventure, Nature, Culture, Shopping"
                  className="w-full border border-slate-300 p-4 rounded-xl"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      interests: e.target.value,
                    })
                  }
                />

                <p className="text-sm text-gray-500 mt-2">
                  Separate multiple interests using commas.
                </p>
              </div>

              {/* Submit */}

              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition"
              >
                {loading ? "Generating Your AI Trip..." : "🚀 Generate AI Trip"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
