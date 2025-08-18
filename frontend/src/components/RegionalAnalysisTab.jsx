import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { CreditCard } from 'lucide-react';
import Card from '../components/Card';
import ChartCard from '../components/ChartCard';
import { formatLargeNumber } from '../utils/formatters';


const RegionalAnalysisTab = ({ regionalData }) => {
  if (!regionalData || regionalData.length === 0) {
    return <p className="text-gray-500 text-center">Data analisis regional tidak tersedia.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Revenue by Region" height={300}>
          <BarChart data={regionalData.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
            <YAxis width={75} tickFormatter={(value) => formatLargeNumber(value)} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => formatLargeNumber(value)} />
            <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
          </BarChart>
        </ChartCard>
        <ChartCard title="Return Rate by Region" height={300}>
          <BarChart data={regionalData.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="return_rate" fill="#ff7300" name="Return Rate (%)" />
          </BarChart>
        </ChartCard>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Performance Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">AOV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shipping Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Top Payment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regionalData.map((region, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {region.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLargeNumber(region.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLargeNumber(region.orders)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLargeNumber(region.customers)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLargeNumber(region.avg_order_value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatLargeNumber(region.avg_shipping_cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      region.return_rate < 3 ? 'bg-green-100 text-green-800' :
                      region.return_rate < 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {region.return_rate.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-1" />
                      {region.popular_payment_method}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default RegionalAnalysisTab;