"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../utils/superbase";
import Link from "next/link";

export default function Drinks() {
  const [drinks, setDrinks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getDrinks() {
      try {
        setLoading(true);
        const { data: drinks, error } = await supabase.from("drinks").select();
        if (error) throw error;
        setDrinks(drinks);
      } catch (err) {
        console.error("Error fetching drinks:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getDrinks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-10 px-4 overflow-hidden">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Drinks Page
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <i className="fas fa-spinner fa-spin text-blue-500 text-3xl"></i>
          </div>
        ) : error ? (
          <p className="text-red-600 text-center mb-4">Error: {error}</p>
        ) : drinks.length > 0 ? (
          <div
            className={`${
              drinks.length > 7
                ? "overflow-y-scroll max-h-[calc(100vh-300px)]"
                : ""
            }`}
          >
            <ul className="space-y-4">
              {drinks.map((drink) => (
                <li
                  key={drink.id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <span className="text-gray-700 font-medium">
                    {drink.drink_name}
                  </span>
                  <span className="text-gray-500">${drink.drink_price}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No drinks available</p>
        )}

        <div className="mt-6 flex justify-center">
          <Link
            href="/drinks/new"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Add Drink
          </Link>
        </div>
      </div>
    </div>
  );
}
