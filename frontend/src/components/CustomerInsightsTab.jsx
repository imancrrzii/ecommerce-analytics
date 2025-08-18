import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Card from "../components/Card";
import ChartCard from "../components/ChartCard";
import { formatLargeNumber } from '../utils/formatters';

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00ff00",
  "#ff00ff",
];

const CustomerInsightsTab = ({ customerInsights }) => {
  if (!customerInsights) {
    return (
      <p className="text-gray-500 text-center">
        Data wawasan pelanggan tidak tersedia.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Customer Segments" height={300}>
          <PieChart>
            <Pie
              data={customerInsights.segments}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="revenue"
              label={({ segment, percent }) =>
                `${segment} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {customerInsights.segments.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatLargeNumber(value)} />
          </PieChart>
        </ChartCard>

        <ChartCard title="Age Group Distribution" height={300}>
          <BarChart data={customerInsights.age_groups}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age_group" tick={{ fontSize: 14 }} />
            <YAxis
              width={75}
              tickFormatter={(value) => formatLargeNumber(value)}
              tick={{ fontSize: 14 }}
            />
            <Tooltip formatter={(value) => formatLargeNumber(value)} />
            <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
          </BarChart>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {customerInsights.segments.map((segment, index) => (
          <Card key={index}>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {segment.segment}
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Revenue:{" "}
                <span className="font-medium">
                  {formatLargeNumber(segment.revenue)}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Customers:{" "}
                <span className="font-medium">
                  {formatLargeNumber(segment.customers)}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                AOV:{" "}
                <span className="font-medium">
                  {formatLargeNumber(segment.avg_order_value)}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Satisfaction:{" "}
                <span className="font-medium">
                  {segment.avg_satisfaction}/5.0
                </span>
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Revenue by Acquisition Channel">
          <BarChart data={customerInsights.acquisition_channels}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="channel" tick={{ fontSize: 14 }} />
            <YAxis width={75}
              tickFormatter={(value) => formatLargeNumber(value)}
              tick={{ fontSize: 14 }}
            />
            <Tooltip formatter={(value) => formatLargeNumber(value)} />
            <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
          </BarChart>
        </ChartCard>

        <ChartCard title="Customers & LTV by Channel">
          <ComposedChart data={customerInsights.acquisition_channels}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="channel" tick={{ fontSize: 14 }} />
            <YAxis
              yAxisId="left"
              tickFormatter={(value) => formatLargeNumber(value)}
              tick={{ fontSize: 14 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => formatLargeNumber(value)}
              tick={{ fontSize: 14 }}
            />
            <Tooltip
              formatter={(value, name) => [formatLargeNumber(value), name]}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="customers"
              fill="#82ca9d"
              name="Customers"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="lifetime_value"
              stroke="#ff7300"
              strokeWidth={3}
              name="Customer LTV"
            />
          </ComposedChart>
        </ChartCard>
      </div>
    </div>
  );
};

export default CustomerInsightsTab;
