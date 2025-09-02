import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DailySpendingChartProps {
  data: { date: string; amount: number }[];
}

export const DailySpendingChart = ({ data }: DailySpendingChartProps) => {
  return (
    <Card className="w-full h-[350px] shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold"></CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: number) => [`₹${value}`, "Spent"]}
              labelStyle={{ fontWeight: "bold" }}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
