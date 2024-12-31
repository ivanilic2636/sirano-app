"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/utils/superbase";
import { useParams } from "next/navigation";

export default function SingleTable() {
  const params = useParams();
  const { id } = params || {};
  const [currentTable, setCurrentTable] = useState(null);
  const [drinks, setDrinks] = useState([]);
  const [currentTableTab, setCurrentTableTab] = useState([]);
  const [dropdownDrink, setDropdownDrink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);

        // Fetch table information
        const { data: tablesData, error: tableError } = await supabase
          .from("tables")
          .select("*")
          .eq("id", id)
          .single();
        if (tableError) throw tableError;

        // Fetch all available drinks
        const { data: drinksData, error: drinksError } = await supabase
          .from("drinks")
          .select("*");
        if (drinksError) throw drinksError;

        // Fetch orders for this table
        const { data: singleTableData, error: ordersError } = await supabase
          .from("single_table")
          .select("*, drinks(*)") // Fetch drink details for each order
          .eq("table_id", id);
        if (ordersError) throw ordersError;

        setCurrentTable(tablesData);
        setDrinks(drinksData);
        setCurrentTableTab(singleTableData);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // Add a new drink to the table
  async function addDrinkToTable(drinkId) {
    try {
      const existingOrder = currentTableTab.find(
        (order) => order.drink_id === drinkId
      );

      if (existingOrder) {
        // Increment quantity
        const { error } = await supabase
          .from("single_table")
          .update({ quantity: existingOrder.quantity + 1 })
          .eq("id", existingOrder.id);
        if (error) throw error;
      } else {
        // Add new order
        const { error } = await supabase.from("single_table").insert({
          table_id: id,
          drink_id: drinkId,
          quantity: 1,
        });
        if (error) throw error;
      }

      // Refetch the updated table orders
      const { data: updatedOrders, error: fetchError } = await supabase
        .from("single_table")
        .select("*, drinks(*)")
        .eq("table_id", id);

      if (fetchError) throw fetchError;

      setCurrentTableTab(updatedOrders); // Update the orders state
    } catch (err) {
      console.error("Error adding drink:", err.message);
      setError(err.message);
    }
  }

  // Decrement drink quantity
  async function decrementDrink(drinkId) {
    try {
      const existingOrder = currentTableTab.find(
        (order) => order.drink_id === drinkId
      );

      if (!existingOrder) {
        console.error("Drink not found in the current table tab:", drinkId);
        return;
      }

      if (existingOrder.quantity === 1) {
        // Remove order
        const { error } = await supabase
          .from("single_table")
          .delete()
          .eq("id", existingOrder.id);
        if (error) throw error;

        setCurrentTableTab((prevOrders) =>
          prevOrders.filter((order) => order.id !== existingOrder.id)
        );
      } else {
        // Decrement quantity
        const { error } = await supabase
          .from("single_table")
          .update({ quantity: existingOrder.quantity - 1 })
          .eq("id", existingOrder.id);
        if (error) throw error;

        setCurrentTableTab((prevOrders) =>
          prevOrders.map((order) =>
            order.id === existingOrder.id
              ? { ...order, quantity: order.quantity - 1 }
              : order
          )
        );
      }

      // Refetch the updated table orders
      const { data: updatedOrders, error: fetchError } = await supabase
        .from("single_table")
        .select("*, drinks(*)")
        .eq("table_id", id);

      if (fetchError) throw fetchError;

      setCurrentTableTab(updatedOrders); // Update the orders state
    } catch (err) {
      console.error("Error decrementing drink:", err.message);
      setError(err.message);
    }
  }

  // Calculate the total price for the table
  const totalPrice = currentTableTab.reduce(
    (total, item) =>
      total + (item.drinks?.drink_price || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 relative">
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4">{currentTable.table_name}</h1>
          <div className="mb-4">
            <label htmlFor="drink-dropdown" className="block mb-2">
              Select a drink:
            </label>
            <select
              id="drink-dropdown"
              className="p-2 rounded bg-gray-700 text-white"
              onChange={(e) => setDropdownDrink(e.target.value)}
              value={dropdownDrink || ""}
            >
              <option value="">-- Select Drink --</option>
              {drinks.map((drink) => (
                <option key={drink.id} value={drink.id}>
                  {drink.drink_name} (${drink.drink_price})
                </option>
              ))}
            </select>
            <button
              onClick={() => addDrinkToTable(dropdownDrink)}
              className="ml-4 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
              disabled={!dropdownDrink}
            >
              Add
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-4">Drinks Ordered:</h2>
          <ul>
            {currentTableTab.map((table) => (
              <li key={table.id} className="flex justify-between mb-2">
                <span>
                  {table.drinks.drink_name} (${table.drinks.drink_price})
                </span>
                <div className="flex items-center">
                  <button
                    onClick={() => decrementDrink(table.drink_id)}
                    className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
                  >
                    -
                  </button>
                  <span className="px-4">{table.quantity}</span>
                  <button
                    onClick={() => addDrinkToTable(table.drink_id)}
                    className="px-3 py-1 bg-green-500 rounded hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="absolute bottom-4 right-4 bg-gray-800 p-4 rounded shadow">
            <h3 className="text-xl font-bold">Total: ${totalPrice}</h3>
          </div>
        </div>
      )}
    </div>
  );
}
