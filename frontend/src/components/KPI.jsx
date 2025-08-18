import { getGrowthColor, getGrowthIcon, formatNumber, formatCurrency, formatPercentage } from '../utils/formatters';
import Card from './Card';

const colorMap = {
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
  },
};

const KPI = ({ title, value, unit, growth, icon: Icon, colorClass }) => {
  const formattedValue = unit === 'currency' ? formatCurrency(value) : formatNumber(value);
  const formattedGrowth = formatPercentage(growth);
  const growthColor = getGrowthColor(growth);
  const growthIcon = getGrowthIcon(growth);

  const colors = colorMap[colorClass] || colorMap.blue;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {formattedValue}
          </p>
        </div>
        <div className={`${colors.bg} p-3 rounded-full`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>
      <div className={`flex items-center mt-4 text-sm ${growthColor}`}>
        {growthIcon}
        <span className="ml-1">{formattedGrowth} from last month</span>
      </div>
    </Card>
  );
};

export default KPI;