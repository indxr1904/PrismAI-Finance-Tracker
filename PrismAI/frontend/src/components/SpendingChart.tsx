import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#6366F1", "#F43F5E", "#10B981", "#F59E0B", "#3B82F6", "#8B5CF6"];

interface SpendingChartProps {
  breakdown: Record<string, number>;
}

export const SpendingChart = ({ breakdown }: SpendingChartProps) => {
  const data = Object.entries(breakdown).map(([category, value]) => ({
    name: category,
    value,
  }));

  return (
    <div className="w-full h-80">
      {data.length === 0 ? (
        <p className="text-center text-muted-foreground">No spending data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              dataKey="value"
              label={({ name, value }) => `${name}: ₹${value}`}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `₹${value}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
