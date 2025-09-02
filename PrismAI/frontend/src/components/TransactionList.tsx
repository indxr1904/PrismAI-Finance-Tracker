import React, { useState } from "react";
import { api } from "../lib/api";

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
}

interface Props {
  transactions: Transaction[];
  searchTerm?: string;
  onChange?: () => void;
}

export const TransactionList: React.FC<Props> = ({
  transactions,
  searchTerm = "",
  onChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<any>({
    description: "",
    amount: 0,
    category: "General",
    type: "expense",
    date: "",
  });

  const handleDelete = async (id: string) => {
    try {
      await api(`/transactions/${id}`, { method: "DELETE" });
      onChange?.();
    } catch (err) {
      console.error("❌ Failed to delete transaction:", err);
    }
  };

  const handleEditClick = (t: Transaction) => {
    setEditingId(t._id);
    setEditValues({
      description: t.description,
      amount: t.amount,
      category: t.category,
      type: t.type,
      date: t.date.split("T")[0],
    });
  };

  const handleSave = async (id: string) => {
    try {
      await api(`/transactions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues),
      });
      setEditingId(null);
      onChange?.();
    } catch (err) {
      console.error("❌ Failed to update transaction:", err);
    }
  };

  const filtered = transactions.filter((t) =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {filtered.length === 0 ? (
        <p className="text-gray-400">No matching transactions.</p>
      ) : (
        filtered.map((t) => (
          <div
            key={t._id}
            className="flex justify-between items-center bg-gray-900 text-white px-4 py-3 rounded-xl shadow"
          >
            {editingId === t._id ? (
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="text"
                  value={editValues.description}
                  onChange={(e) =>
                    setEditValues((v: any) => ({ ...v, description: e.target.value }))
                  }
                  className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
                />
                <input
                  type="number"
                  value={editValues.amount}
                  onChange={(e) =>
                    setEditValues((v: any) => ({
                      ...v,
                      amount: parseFloat(e.target.value),
                    }))
                  }
                  className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
                />
                <input
                  type="date"
                  value={editValues.date || ""}
                  onChange={(e) =>
                    setEditValues((v: any) => ({ ...v, date: e.target.value }))
                  }
                  className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
                />
                <select
                  value={editValues.category}
                  onChange={(e) =>
                    setEditValues((v: any) => ({ ...v, category: e.target.value }))
                  }
                  className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
                >
                  <option>General</option>
                  <option>Food</option>
                  <option>Salary</option>
                  <option>Shopping</option>
                  <option>Transport</option>
                </select>
                <select
                  value={editValues.type}
                  onChange={(e) =>
                    setEditValues((v: any) => ({
                      ...v,
                      type: e.target.value as "income" | "expense",
                    }))
                  }
                  className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSave(t._id)}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-semibold">{t.description}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(t.date).toLocaleDateString()} — {t.category}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <span
                    className={`font-semibold ${
                      t.type === "income" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}₹{t.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleEditClick(t)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};
