
import React, { useState } from 'react';
import { ViewIcon } from './icons/ViewIcon';

interface KpiSelectorProps {
    allKpis: { id: string, title: string, description?: string }[];
    selectedIds: string[];
    setSelectedIds: (ids: string[]) => void;
}

const KpiSelector: React.FC<KpiSelectorProps> = ({ allKpis, selectedIds, setSelectedIds }) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleToggle = (id: string) => {
        const newSelectedIds = selectedIds.includes(id)
            ? selectedIds.filter(selectedId => selectedId !== id)
            : [...selectedIds, id];
        setSelectedIds(newSelectedIds);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg mb-6">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-lg font-bold text-white">
                <span>表示項目の選択</span>
                <ViewIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-4">
                    {allKpis.map(kpi => (
                        <label key={kpi.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 cursor-pointer" title={kpi.description}>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(kpi.id)}
                                onChange={() => handleToggle(kpi.id)}
                                className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-cyan-600 focus:ring-cyan-500"
                                aria-label={kpi.title}
                            />
                            <span className="text-gray-300 font-medium">{kpi.title}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default KpiSelector;
