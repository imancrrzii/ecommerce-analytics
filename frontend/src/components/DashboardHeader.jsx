import { RefreshCw } from 'lucide-react';

const DashboardHeader = ({ timeRange, setTimeRange, onRefresh }) => {
  return (
    <div className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">E-Commerce Analytics</h1>
            <p className="text-gray-600 mt-1">Advanced business intelligence dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button
              onClick={onRefresh}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;