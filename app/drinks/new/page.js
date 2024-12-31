"use client";

import React from "react";
import { supabase } from "@/app/utils/superbase";
import { useRouter } from "next/navigation";

export default function NewDrink() {
  const router = useRouter();

  async function addDrink(formData) {
    let drink_name = formData.get("drink_name");
    const drink_price = formData.get("drink_price");
    drink_name =
      drink_name.charAt(0).toUpperCase() + drink_name.slice(1).toLowerCase();

    try {
      const { data, error } = await supabase.from("drinks").insert([
        {
          drink_name,
          drink_price,
        },
      ]);

      if (error) {
        console.error("Error inserting drink:", error.message);
        alert("Failed to add drink: " + error.message);
      } else {
        router.push("/drinks");
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
      alert("An unexpected error occurred: " + err.message);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    addDrink(formData);
    e.target.reset();
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Add a New Drink
        </h2>
        <div className="mb-4">
          <label
            htmlFor="drink_name"
            className="block text-gray-700 font-medium mb-2"
          >
            Drink Name
          </label>
          <input
            type="text"
            name="drink_name"
            id="drink_name"
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="drink_price"
            className="block text-gray-700 font-medium mb-2"
          >
            Drink Price
          </label>
          <input
            type="number"
            name="drink_price"
            id="drink_price"
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Add Drink
        </button>
      </form>
    </div>
  );
}
