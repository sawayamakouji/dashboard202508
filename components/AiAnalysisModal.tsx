
import React, { useState, useEffect } from 'react';
import { getAnalysisFromGemini } from '../services/geminiService';
import { Kpi, FilterState } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface AiAnalysisModalProps {
  onClose: () => void;
  dataToAnalyze: { kpis: Kpi[], filters: FilterState };
}

const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({ onClose, dataToAnalyze }) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAnalysisFromGemini(dataToAnalyze);
        setAnalysis(result);
      } catch (err) {
        setError('AI分析の取得中にエラーが発生しました。後でもう一度お試しください。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [dataToAnalyze]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
          <p className="text-gray-300">AIがデータを分析中です...</p>
        </div>
      );
    }
    if (error) {
      return <p className="text-red-400">{error}</p>;
    }
    // Format the AI response for better readability
    return analysis.split('\n').map((paragraph, index) => {
        if(paragraph.startsWith('* ')) {
            return <li key={index} className="ml-6 list-disc text-gray-300 mb-2">{paragraph.substring(2)}</li>
        }
        if(paragraph.startsWith('### ')) {
            return <h3 key={index} className="text-lg font-bold text-cyan-400 mt-4 mb-2">{paragraph.substring(4)}</h3>
        }
        return <p key={index} className="text-gray-300 mb-3">{paragraph}</p>
    })
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-cyan-400"/>
            AIによる分析結果
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto">
          {renderContent()}
        </div>
        <div className="p-4 border-t border-gray-700 text-right">
           <button 
             onClick={onClose} 
             className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-5 rounded-lg transition-colors"
           >
             閉じる
           </button>
        </div>
      </div>
    </div>
  );
};

export default AiAnalysisModal;
