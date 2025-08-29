
import { GoogleGenAI } from "@google/genai";
import { Kpi, FilterState } from '../types';

const getAnalysisFromGemini = async (data: { kpis: Kpi[], filters: FilterState }): Promise<string> => {
    if (!process.env.API_KEY) {
        // This is a fallback for development environments where the key might not be set.
        // In a real application, you might want to handle this more gracefully.
        console.warn("API_KEY environment variable not set. Returning mock data.");
        return new Promise(resolve => setTimeout(() => resolve(
`### 分析サマリー
今回の分析データに基づくと、特に**加工食品**部門の売上が好調です。特に、**冷凍ピザ**が全体の売上を牽引しています。

### 主なインサイト
* **期間全体の傾向:** 分析期間中、売上は週末にかけて増加する傾向が見られます。
* **好調なカテゴリ:** 「冷凍食品」カテゴリは、販売金額と販売数量の両方でトップクラスの成績を収めています。
* **改善の機会:** 「雑貨」部門の売上が比較的低迷しています。特に「洗濯洗剤」の販売促進キャンペーンを検討する価値があるかもしれません。

### 推奨アクション
1.  **冷凍ピザのバンドル販売:** 好調な冷凍ピザと「ソフトドリンク」をセットで販売し、客単価の向上を図る。
2.  **週末限定セールの実施:** 来店客数が増加する週末にターゲットを絞ったセールを実施し、さらなる売上増を狙う。
3.  **雑貨部門の可視性向上:** 洗剤などの雑貨商品を、より目立つ通路の棚に配置転換することを推奨します。`
        ), 1500));
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const kpiText = data.kpis.map(kpi => `- ${kpi.title}: ${kpi.format ? kpi.format(kpi.value) : kpi.value.toLocaleString()}`).join('\n');
    const filterText = Object.entries(data.filters)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n');

    const prompt = `
あなたは優秀なデータアナリストです。以下のPOSデータサマリーを分析し、ビジネス上のインサイトと具体的な改善アクションを提案してください。

### 分析対象データサマリー
${kpiText}

### フィルタ条件
${filterText}

### 指示
1.  **分析サマリー:** データの全体像を簡潔にまとめてください。
2.  **主なインサイト:** データから読み取れる特に注目すべき点（好調な点、不振な点、興味深い傾向など）を3つ挙げてください。
3.  **推奨アクション:** インサイトに基づき、売上向上や課題解決のための具体的なアクションを3つ提案してください。

回答は簡潔かつ分かりやすく、Markdown形式で記述してください。
`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};

export { getAnalysisFromGemini };
