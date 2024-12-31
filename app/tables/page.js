"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../utils/superbase";
import NewTable from "./new/page";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function getTables() {
      try {
        setLoading(true);
        const { data: tables, error } = await supabase.from("tables").select();
        if (error) throw error;
        setTables(tables);
      } catch (err) {
        console.error("Error fetching tables:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getTables();
  }, []);

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  async function deleteTable(tableId) {
    if (!confirm("Are you sure you want to delete this table and its drinks?"))
      return;

    try {
      // Delete related rows in `single_table`
      const { error: deleteDrinksError } = await supabase
        .from("single_table")
        .delete()
        .eq("table_id", tableId);
      if (deleteDrinksError) throw deleteDrinksError;

      // Delete the table
      const { error: deleteTableError } = await supabase
        .from("tables")
        .delete()
        .eq("id", tableId);
      if (deleteTableError) throw deleteTableError;

      // Update state after deletion
      setTables((prevTables) =>
        prevTables.filter((table) => table.id !== tableId)
      );
      alert("Table and its drinks deleted successfully.");
    } catch (err) {
      console.error("Error deleting table:", err.message);
      alert("Failed to delete table: " + err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center py-10 px-4 overflow-hidden">
      {!isOpen && (
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Tables Page
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <i className="fas fa-spinner fa-spin text-blue-500 text-3xl"></i>
            </div>
          ) : error ? (
            <p className="text-red-600 text-center mb-4">Error: {error}</p>
          ) : tables.length > 0 ? (
            <div
              className={`${
                tables.length > 7
                  ? "overflow-y-scroll max-h-[calc(100vh-300px)]"
                  : ""
              }`}
            >
              <ul className="space-y-4">
                {tables.map((table) => (
                  <li
                    key={table.id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                  >
                    <Link href={`/tables/${table.id}`}>
                      <span className="font-medium">{table.table_name}</span>
                    </Link>
                    <button
                      onClick={() => deleteTable(table.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-600 text-center">No Tables available</p>
          )}

          <div className="mt-6 flex justify-center">
            <button
              className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={toggleModal}
            >
              Add Table
            </button>
          </div>
        </div>
      )}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <NewTable modal={toggleModal} />
        </div>
      )}
    </div>
  );
}
