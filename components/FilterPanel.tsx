
import React, { useState } from 'react';
import { FilterState, FilterOptions } from '../types';
import { FilterIcon } from './icons/FilterIcon';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onApply: () => void;
  filterOptions: FilterOptions;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, onApply, filterOptions }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-lg font-bold text-white mb-2">
        <span>フィルター</span>
        <FilterIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 items-end">
          {/* Date Range */}
          <div className="xl:col-span-2 grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-400 mb-1">開始日</label>
              <input type="date" name="startDate" id="startDate" value={filters.startDate} onChange={handleChange} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-400 mb-1">終了日</label>
              <input type="date" name="endDate" id="endDate" value={filters.endDate} onChange={handleChange} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500" />
            </div>
          </div>

          {/* Selects */}
          <FilterSelect label="エリア" name="area" value={filters.area} options={filterOptions.areas} onChange={handleChange} />
          <FilterSelect label="店" name="store" value={filters.store} options={filterOptions.stores} onChange={handleChange} />
          <FilterSelect label="部門" name="department" value={filters.department} options={filterOptions.departments} onChange={handleChange} />
          <FilterSelect label="カテゴリ" name="category" value={filters.category} options={filterOptions.categories} onChange={handleChange} />
          <FilterSelect label="商品" name="product" value={filters.product} options={filterOptions.products} onChange={handleChange} />

          {/* Apply Button */}
          <div className="xl:col-span-1">
            <button onClick={onApply} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors">
              適用
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


interface FilterSelectProps {
    label: string;
    name: keyof FilterState;
    value: string;
    options: string[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, name, value, options, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
            <option>すべて</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


export default FilterPanel;
