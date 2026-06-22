"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.clear();

    window.location.href = "/login";
  };
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
        {/* Logo */}

        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
            ✈️
          </div>

          <div>
            <h1 className="font-bold text-xl">TravelAI</h1>

            <p className="text-xs text-gray-500">AI Trip Planner</p>
          </div>
        </Link>

        {/* Links */}

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-slate-600 hover:text-blue-600 transition"
          >
            Home
          </Link>

          <Link
            href="/dashboard"
            className="text-slate-600 hover:text-blue-600 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/create-trip"
            className="text-slate-600 hover:text-blue-600 transition"
          >
            Create Trip
          </Link>
        </div>

        {/* Actions */}

        <div className="flex items-center gap-3">
          <Link
            href="/create-trip"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl shadow"
          >
            + New Trip
          </Link>

          <button
            onClick={logout}
            className="border border-slate-300 px-5 py-2 rounded-xl hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
