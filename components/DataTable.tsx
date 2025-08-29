
import React from 'react';
import { PosData } from '../types';

interface DataTableProps {
  data: PosData[];
  displayedColumns: string[];
}

const DataTable: React.FC<DataTableProps> = ({ data, displayedColumns }) => {
  if (data.length === 0) {
    return <p className="text-center text-gray-400 py-10">表示するデータがありません。</p>;
  }

  const allColumns = [
    { key: 'date', name: '日付' },
    { key: 'area', name: 'エリア' },
    { key: 'store', name: '店' },
    { key: 'department', name: '部門' },
    { key: 'category', name: 'カテゴリ' },
    { key: 'product', name: '商品' },
    { key: 'salesAmount', name: '販売金額', format: (v: number) => `¥${v.toLocaleString()}` },
    { key: 'salesQuantity', name: '販売数量' },
    { key: 'customerCount', name: '客数' },
    { key: 'inventoryCount', name: '在庫数' },
    { key: 'inventoryAmount', name: '在庫金額', format: (v: number) => `¥${v.toLocaleString()}` },
    { key: 'discountAmount', name: '値下金額', format: (v: number) => `¥${v.toLocaleString()}` },
    { key: 'salesAmountPrevYear', name: '前年販売金額', format: (v: number) => `¥${v.toLocaleString()}` },
  ];
  
  const kpiIdToColumnKeyMap: { [key: string]: string } = {
      salesAmount: 'salesAmount',
      salesQuantity: 'salesQuantity',
      customerCount: 'customerCount',
      inventoryCount: 'inventoryCount',
      inventoryAmount: 'inventoryAmount',
      discountAmount: 'discountAmount',
      yoySalesGrowth: 'salesAmountPrevYear', // Show previous year data for context
  };

  const baseColumnKeys = ['date', 'product'];
  const metricColumnKeys = displayedColumns.map(id => kpiIdToColumnKeyMap[id]).filter(Boolean);
  const finalColumnKeys = [...new Set([...baseColumnKeys, ...metricColumnKeys])];

  const columns = finalColumnKeys
      .map(key => allColumns.find(col => col.key === key))
      .filter((col): col is typeof allColumns[0] => col !== undefined);


  return (
    <div className="overflow-x-auto">
      <div className="max-h-96 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700 sticky top-0">
            <tr>
              {columns.map(col => (
                <th key={col.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-700/50">
                {columns.map(col => {
                    const value = item[col.key as keyof PosData];
                    return (
                        <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                            {col.format && typeof value === 'number' ? col.format(value) : String(value)}
                        </td>
                    )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
