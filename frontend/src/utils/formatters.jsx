import { TrendingUp, TrendingDown } from 'lucide-react';

export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatNumber = (value) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('id-ID').format(value);
};

export const formatPercentage = (value) => {
  if (value === null || value === undefined) return '-';
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

export const getGrowthColor = (value) => {
  if (value === null || value === undefined) return 'text-gray-500';
  return value >= 0 ? 'text-green-600' : 'text-red-600';
};

export const getGrowthIcon = (value) => {
  if (value === null || value === undefined) return null;
  return value >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
};

export const formatLargeNumber = (value) => {
  if (!value || value === 0) return "0";
  
  if (value >= 1_000_000_000)
    return (value / 1_000_000_000) % 1 === 0
      ? value / 1_000_000_000 + " M"
      : (value / 1_000_000_000).toFixed(1) + " M";
      
  if (value >= 1_000_000)
    return (value / 1_000_000) % 1 === 0
      ? value / 1_000_000 + " Juta"
      : (value / 1_000_000).toFixed(1) + " Juta";
      
  if (value >= 1_000)
    return (value / 1_000) % 1 === 0
      ? value / 1_000 + " Ribu"
      : (value / 1_000).toFixed(1) + " Ribu";
      
  return value.toString();
};