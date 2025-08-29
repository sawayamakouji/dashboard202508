
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PosData, ChartDimension } from '../types';

interface SalesChartProps {
  data: PosData[];
  dimension: ChartDimension;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, dimension }) => {

    const aggregatedData = data.reduce((acc, curr) => {
        const key = curr[dimension];
        if (!acc[key]) {
            acc[key] = { [dimension]: key, salesAmount: 0, salesQuantity: 0 };
        }
        acc[key].salesAmount += curr.salesAmount;
        acc[key].salesQuantity += curr.salesQuantity;
        return acc;
    }, {} as { [key: string]: { [key: string]: string | number; salesAmount: number; salesQuantity: number } });

    let chartData = Object.values(aggregatedData);

    if (dimension === 'date') {
        chartData.sort((a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime());
    } else {
        chartData.sort((a, b) => b.salesAmount - a.salesAmount);
    }


  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey={dimension} stroke="#A0AEC0" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="left" orientation="left" stroke="#A0AEC0" tick={{ fontSize: 12 }} tickFormatter={(value) => `¥${Number(value) / 1000}k`} />
          <YAxis yAxisId="right" orientation="right" stroke="#A0AEC0" tick={{ fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #2D3748' }}
            labelStyle={{ color: '#E2E8F0' }}
          />
          <Legend wrapperStyle={{color: '#E2E8F0'}} />
          <Bar yAxisId="left" dataKey="salesAmount" name="販売金額" fill="#06B6D4" />
          <Bar yAxisId="right" dataKey="salesQuantity" name="販売数量" fill="#8B5CF6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
