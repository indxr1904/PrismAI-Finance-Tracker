import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    monthly: { income: 0, expenses: 0, savings: 0 },
  });

  const fetchStats = async () => {
    try {
      const data = await api("/transactions/stats");
      setStats(data);
    } catch (err) {
      console.error("❌ Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); 
    return () => clearInterval(interval);
  }, []);

  const chartData = [
    { name: "Income", value: stats.monthly.income },
    { name: "Expenses", value: stats.monthly.expenses },
  ];
  const COLORS = ["#4CAF50", "#F44336"];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-xl text-center text-white">
          <p className="text-sm text-gray-400">Income</p>
          <p className="text-xl font-semibold text-green-400">
            ₹{stats.monthly.income.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl text-center text-white">
          <p className="text-sm text-gray-400">Expenses</p>
          <p className="text-xl font-semibold text-red-400">
            ₹{stats.monthly.expenses.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl text-center text-white">
          <p className="text-sm text-gray-400">Savings</p>
          <p className="text-xl font-semibold text-blue-400">
            ₹{stats.monthly.savings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-gray-900 p-6 rounded-xl h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
