import Card from './Card';
import { ResponsiveContainer } from 'recharts';

const ChartCard = ({ title, children, height = 400 }) => {
  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </Card>
  );
};

export default ChartCard;