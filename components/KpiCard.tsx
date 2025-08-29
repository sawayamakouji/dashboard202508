
import React from 'react';

interface KpiCardProps {
  title: string;
  value: number;
  format?: (value: number) => string;
  description?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, format, description }) => {
  const formattedValue = format ? format(value) : value.toLocaleString();

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-shadow duration-300" title={description}>
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-white mt-2">{formattedValue}</p>
    </div>
  );
};

export default KpiCard;
