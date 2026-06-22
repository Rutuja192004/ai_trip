import Link from "next/link";

export default function TripCard({ trip }: any) {
  return (
    <Link href={`/trip/${trip._id}`}>
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              📍 {trip.destination}
            </h2>

            <p className="text-gray-500 mt-1">{trip.days} Day Adventure</p>
          </div>

          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            ₹ {trip.budgetLimit?.toLocaleString()}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-600">
            <span>🗓️</span>
            <span>{trip.days} Days</span>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <span>💰</span>
            <span>Budget ₹ {trip.budgetLimit?.toLocaleString()}</span>
          </div>

          {trip.budget?.total > 0 && (
            <div className="flex items-center gap-2 text-slate-600">
              <span>💳</span>
              <span>Estimated Cost ₹ {trip.budget.total.toLocaleString()}</span>
            </div>
          )}

          <div className="flex items-start gap-2 text-slate-600">
            <span>🎯</span>

            <span>
              {trip.interests?.length
                ? trip.interests.join(", ")
                : "Travel Experience"}
            </span>
          </div>
        </div>

        {trip.summary && (
          <div className="mt-5 bg-slate-50 p-3 rounded-xl">
            <p className="text-sm text-slate-600 line-clamp-3">
              {trip.summary}
            </p>
          </div>
        )}

        <div className="mt-6">
          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold">
            View Trip →
          </button>
        </div>
      </div>
    </Link>
  );
}
