import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FinancialProposal() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([
    { id: 1, name: "Logistics", icon: "/assets/icons/logistics.svg" , alt: "Logistics", items: [] },
    { id: 2, name: "Furniture", icon: "/assets/icons/furniture.svg", items: [] },
    {
      id: 3,
      name: "Methodology / Execution Costs",
      icon: "/assets/icons/methodology.svg", alt:"Methodology",
      items: [],
    },
    { id: 4, name: "Other Items", icon: "/assets/icons/other.svg", alt:"Other Items", items: [] },
  ]);

  const addItem = (categoryId) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
            ...cat,
            items: [
              ...cat.items,
              { desc: "", qty: 1, price: 0 },
            ],
          }
          : cat
      )
    );
  };

  const updateItem = (catId, index, field, value) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === catId
          ? {
            ...cat,
            items: cat.items.map((item, i) =>
              i === index ? { ...item, [field]: value } : item
            ),
          }
          : cat
      )
    );
  };

  const totalProjectCost = categories.reduce(
    (sum, c) =>
      sum +
      c.items.reduce((s, i) => s + i.qty * i.price, 0),
    0
  );

  return (
    <div className="px-6 lg:px-20 py-10 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2">
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold">Financial Proposal</h1>
            <p className="text-gray-500 text-sm">
              pdf. كراسة الشروط والمواصفات
            </p>
          </div>
        </div>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2">
          <img src="/assets/icons/plus-icon.svg" alt="plus" className="w-4 h-4" />
          Generate
        </button>
      </div>

      {/* TOTAL CARD */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white p-8 mb-10 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <div className="bg-white/20 p-4 rounded-2xl">
            <img src="/assets/icons/financial-icon.svg" alt="financial-icon" className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm opacity-80">Total Project Cost</p>
            <h2 className="text-4xl font-bold">
              SAR {totalProjectCost.toLocaleString()}
            </h2>
          </div>
        </div>

        <div className="text-right text-sm opacity-80">
          {categories.length} Items
          <br />
          Across {categories.length} Categories
        </div>
      </div>

      {/* CATEGORIES */}
      {categories.map((cat) => (
        <div key={cat.id} className="bg-white rounded-3xl shadow mb-8 p-6">

          {/* CATEGORY HEADER */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-4 rounded-2xl">
                <img src={cat.icon} alt="Test" className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold">{cat.name}</h3>
            </div>

            <button
              onClick={() => addItem(cat.id)}
              className="border px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <img src="/assets/icons/plus.svg" alt="plus" className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-4 gap-4 bg-gray-50 px-4 py-3 rounded-xl text-gray-600 text-sm font-medium">
            <span>Description</span>
            <span>Quantity</span>
            <span>Price Per Item</span>
            <span>Total</span>
          </div>

          {/* EMPTY */}
          {cat.items.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No items added yet. Click "Add Item" to start.
            </div>
          )}

          {/* ITEMS */}
          {cat.items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-4 gap-4 items-center mt-4"
            >
              <input
                className="p-3 border rounded-xl"
                placeholder="e.g., Chairs, Tables, Sofas"
                value={item.desc}
                onChange={(e) =>
                  updateItem(cat.id, i, "desc", e.target.value)
                }
              />

              <input
                type="number"
                min="1"
                className="p-3 border rounded-xl"
                value={item.qty}
                onChange={(e) =>
                  updateItem(cat.id, i, "qty", Number(e.target.value))
                }
              />

              <input
                type="number"
                min="0"
                className="p-3 border rounded-xl"
                placeholder="SAR 0"
                value={item.price}
                onChange={(e) =>
                  updateItem(cat.id, i, "price", Number(e.target.value))
                }
              />

              <span className="font-semibold">
                SAR {(item.qty * item.price).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ))}

      {/* GENERATE BUTTON */}
      <div className="flex justify-center mt-12">
        <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl shadow flex items-center gap-3">
          <img src="/assets/icons/ai-icon.svg" alt="ai-icon" className="w-5 h-5" />
          Generate Financial Sheet
        </button>
      </div>
    </div>
  );
}
