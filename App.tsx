
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FilterState, PosData, Kpi, ChartDimension } from './types';
import { getDummyPosData, filterOptions } from './services/posDataService';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import KpiCard from './components/KpiCard';
import SalesChart from './components/SalesChart';
import DataTable from './components/DataTable';
import AiAnalysisModal from './components/AiAnalysisModal';
import KpiSelector from './components/KpiSelector';
import { SparklesIcon } from './components/icons/SparklesIcon';

const ALL_KPIS_CONFIG = [
  { id: 'salesAmount', title: '販売金額', description: '指定期間の合計売上', format: (v: number) => `¥${v.toLocaleString()}` },
  { id: 'salesQuantity', title: '販売数量', description: '指定期間の合計販売点数', format: (v: number) => `${v.toLocaleString()} 点` },
  { id: 'customerCount', title: '来店客数', description: '指定期間の合計来店客数', format: (v: number) => `${v.toLocaleString()} 人` },
  { id: 'avgCustomerSpend', title: '客単価', description: '顧客一人あたりの平均購入金額', format: (v: number) => `¥${Math.round(v).toLocaleString()}` },
  { id: 'inventoryCount', title: '在庫数', description: 'データポイントの合計在庫数', format: (v: number) => `${v.toLocaleString()} 点` },
  { id: 'inventoryAmount', title: '在庫金額', description: 'データポイントの合計在庫金額', format: (v: number) => `¥${v.toLocaleString()}` },
  { id: 'discountAmount', title: '値下金額', description: '指定期間の合計値引額', format: (v: number) => `¥${v.toLocaleString()}` },
  { id: 'yoySalesGrowth', title: '前年比(売上)', description: '前年同期間との売上比較', format: (v: number) => `${v.toFixed(1)}%` },
];

const CHART_DIMENSIONS: { id: ChartDimension; name: string }[] = [
    { id: 'date', name: '期間別' },
    { id: 'store', name: '店舗別' },
    { id: 'department', name: '部門別' },
    { id: 'category', name: 'カテゴリ別' },
];


const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    startDate: '2023-01-01',
    endDate: '2023-01-31',
    area: 'すべて',
    store: 'すべて',
    department: 'すべて',
    category: 'すべて',
    product: 'すべて',
  });
  
  const [selectedKpiIds, setSelectedKpiIds] = useState<string[]>(['salesAmount', 'salesQuantity', 'customerCount', 'avgCustomerSpend']);
  const [data, setData] = useState<PosData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [chartDimension, setChartDimension] = useState<ChartDimension>('date');

  const applyFilters = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setData(getDummyPosData(filters));
      setLoading(false);
    }, 500);
  }, [filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const kpis = useMemo<Kpi[]>(() => {
    if (!data.length) return [];

    const totals = data.reduce((acc, item) => {
      acc.salesAmount += item.salesAmount;
      acc.salesQuantity += item.salesQuantity;
      acc.inventoryCount += item.inventoryCount;
      acc.customerCount += item.customerCount;
      acc.inventoryAmount += item.inventoryAmount;
      acc.discountAmount += item.discountAmount;
      acc.salesAmountPrevYear += item.salesAmountPrevYear;
      return acc;
    }, {
      salesAmount: 0, salesQuantity: 0, inventoryCount: 0, customerCount: 0,
      inventoryAmount: 0, discountAmount: 0, salesAmountPrevYear: 0
    });

    const allCalculatedKpis: { [key: string]: number } = {
      salesAmount: totals.salesAmount,
      salesQuantity: totals.salesQuantity,
      customerCount: totals.customerCount,
      avgCustomerSpend: totals.customerCount > 0 ? totals.salesAmount / totals.customerCount : 0,
      inventoryCount: totals.inventoryCount,
      inventoryAmount: totals.inventoryAmount,
      discountAmount: totals.discountAmount,
      yoySalesGrowth: totals.salesAmountPrevYear > 0 ? ((totals.salesAmount / totals.salesAmountPrevYear) - 1) * 100 : 0,
    };
    
    return selectedKpiIds.map((id): Kpi | null => {
        const config = ALL_KPIS_CONFIG.find(k => k.id === id);
        if (!config) return null;
        return {
            id: config.id,
            title: config.title,
            description: config.description,
            value: allCalculatedKpis[id],
            format: config.format,
        };
    }).filter((kpi): kpi is Kpi => kpi !== null);

  }, [data, selectedKpiIds]);

  const chartTitle = useMemo(() => {
    const dimensionName = CHART_DIMENSIONS.find(d => d.id === chartDimension)?.name;
    return `売上分析 (${dimensionName})`;
  }, [chartDimension]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <Header />
      <FilterPanel filters={filters} setFilters={setFilters} onApply={applyFilters} filterOptions={filterOptions} />
      
      <main className="mt-6">
        <KpiSelector
          allKpis={ALL_KPIS_CONFIG}
          selectedIds={selectedKpiIds}
          setSelectedIds={setSelectedKpiIds}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {kpis.map(kpi => (
            <KpiCard key={kpi.id} title={kpi.title} value={kpi.value} format={kpi.format} description={kpi.description} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-3 bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h2 className="text-xl font-bold text-white mb-2 sm:mb-0">{chartTitle}</h2>
                <div className="flex-shrink-0 bg-gray-700 rounded-lg p-1 flex space-x-1">
                    {CHART_DIMENSIONS.map(dim => (
                        <button
                            key={dim.id}
                            onClick={() => setChartDimension(dim.id)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                chartDimension === dim.id
                                ? 'bg-cyan-600 text-white'
                                : 'text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {dim.name}
                        </button>
                    ))}
                </div>
            </div>
            {loading ? <div className="flex justify-center items-center h-80"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div></div> : <SalesChart data={data} dimension={chartDimension} />}
          </div>
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-center items-center">
             <h2 className="text-xl font-bold mb-4 text-white">AIによるデータ分析</h2>
             <p className="text-gray-400 text-center mb-6">現在のフィルタと表示項目に基づき、AIがデータからインサイトを抽出します。</p>
             <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
              >
                <SparklesIcon className="w-6 h-6" />
                <span>分析を開始</span>
              </button>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-white">詳細データ</h2>
          {loading ? <div className="flex justify-center items-center h-80"><p>データを読み込み中...</p></div> : <DataTable data={data} displayedColumns={selectedKpiIds} />}
        </div>
      </main>

      {isModalOpen && <AiAnalysisModal dataToAnalyze={{kpis, filters}} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default App;
