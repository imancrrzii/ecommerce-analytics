import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import KPI from '../components/KPI';

const OverviewTab = ({ overviewData }) => {
  if (!overviewData) {
    return null;
  }

  const kpiData = [
    {
      title: 'Total Revenue',
      value: overviewData.current_period.revenue,
      unit: 'currency',
      growth: overviewData.growth.revenue,
      icon: DollarSign,
      colorClass: 'green', 
    },
    {
      title: 'Total Orders',
      value: overviewData.current_period.orders,
      unit: 'number',
      growth: overviewData.growth.orders,
      icon: ShoppingCart,
      colorClass: 'blue', 
    },
    {
      title: 'Active Customers',
      value: overviewData.current_period.customers,
      unit: 'number',
      growth: overviewData.growth.customers,
      icon: Users,
      colorClass: 'orange',
    },
    {
      title: 'Avg Order Value',
      value: overviewData.current_period.avg_order,
      unit: 'currency',
      growth: overviewData.growth.avg_order,
      icon: Package,
      colorClass: 'purple',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <KPI
            key={index}
            title={kpi.title}
            value={kpi.value}
            unit={kpi.unit}
            growth={kpi.growth}
            icon={kpi.icon}
            colorClass={kpi.colorClass}
          />
        ))}
      </div>
    </div>
  );
};

export default OverviewTab;