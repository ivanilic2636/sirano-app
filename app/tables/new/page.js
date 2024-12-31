"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/utils/superbase";

export default function NewTable({ modal }) {
  const router = useRouter();

  async function addTable(formData) {
    let table_name = formData.get("table_name");
    table_name =
      table_name.charAt(0).toUpperCase() + table_name.slice(1).toLowerCase();

    try {
      const { data, error } = await supabase.from("tables").insert([
        {
          table_name,
        },
      ]);

      if (error) {
        console.error("Error inserting table:", error.message);
        alert("Failed to add table: " + error.message);
      } else {
        router.push("/tables");
        modal();
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
      alert("An unexpected error occurred: " + err.message);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    addTable(formData);
    e.target.reset();
  }

  return (
    <>
      <button
        onClick={modal}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <i className="fas fa-times text-xl"></i>
      </button>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
      >
        <div className="mb-4">
          <label
            htmlFor="table_name"
            className="block text-gray-700 font-medium mb-2"
          >
            Table Name
          </label>
          <input
            type="text"
            name="table_name"
            id="table_name"
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Add
        </button>
      </form>
    </>
  );
}
