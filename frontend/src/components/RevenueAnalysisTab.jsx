import {
  ComposedChart,
  Line,
  Bar,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency, formatNumber } from "../utils/formatters";
import Card from "../components/Card";
import ChartCard from "../components/ChartCard";
import { formatLargeNumber } from '../utils/formatters';


const RevenueAnalysisTab = ({ revenueTrend }) => {
  if (!revenueTrend || revenueTrend.length === 0) {
    return (
      <p className="text-gray-500 text-center">
        Data tren pendapatan tidak tersedia.
      </p>
    );
  }

  const totalRevenue = revenueTrend.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const totalProfit = revenueTrend.reduce((sum, item) => sum + item.profit, 0);
  const profitMargin = (totalProfit / totalRevenue) * 100;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-6">Revenue Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <h4 className="text-md font-semibold mb-4">Total Revenue</h4>
            <p className="text-2xl font-bold text-sky-600">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {formatLargeNumber(totalRevenue)}
            </p>
          </Card>
          <Card>
            <h4 className="text-md font-semibold mb-4">Total Profit</h4>
            <p className="text-2xl font-bold text-lime-600">
              {formatCurrency(totalProfit)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {formatLargeNumber(totalProfit)}
            </p>
          </Card>
          <Card>
            <h4 className="text-md font-semibold mb-4">Profit Margin</h4>
            <p className="text-2xl font-bold text-indigo-600">
              {profitMargin.toFixed(1)}%
            </p>
          </Card>
        </div>
      </div>

      <ChartCard title="Detailed Revenue Analysis">
        <ComposedChart data={revenueTrend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis
            yAxisId="left"
            tickFormatter={formatLargeNumber}
            width={90}
            label={{
              value: "IDR",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            width={90}
            tickFormatter={formatLargeNumber}
            label={{ value: "AOV", angle: 90, position: "insideRight" }}
          />
          <Tooltip
            formatter={(value, name) => [
              name.includes("Revenue") ||
              name.includes("Profit") ||
              name.includes("Returns") ||
              name.includes("AOV")
                ? formatCurrency(value)
                : formatNumber(value),
              name,
            ]}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
          <Bar yAxisId="left" dataKey="profit" fill="#82ca9d" name="Profit" />
          <Bar yAxisId="left" dataKey="returns" fill="#ff7300" name="Returns" />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avg_order_value"
            stroke="#ff0000"
            strokeWidth={3}
            name="Avg Order Value (AOV)"
          />
        </ComposedChart>
      </ChartCard>

      <ChartCard title="Customer Acquisition Trend" height={300}>
        <AreaChart data={revenueTrend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip formatter={(value) => formatNumber(value)} />
          <Legend />
          <Area
            type="monotone"
            dataKey="new_customers"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
            name="New Customers"
          />
          <Area
            type="monotone"
            dataKey="returning_customers"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
            name="Returning Customers"
          />
        </AreaChart>
      </ChartCard>
    </div>
  );
};

export default RevenueAnalysisTab;
