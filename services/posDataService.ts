
import { FilterState, PosData, FilterOptions } from '../types';

const filterOptions: FilterOptions = {
    areas: ['関東', '関西', '中部', '九州'],
    stores: ['渋谷店', '新宿店', '梅田店', '名古屋店', '福岡店'],
    departments: ['生鮮食品', '加工食品', '飲料', '雑貨'],
    categories: ['野菜', '精肉', '鮮魚', '乳製品', '冷凍食品', 'ソフトドリンク', 'アルコール', '洗剤'],
    products: ['トマト', '国産牛', 'サーモン', '牛乳', '冷凍ピザ', '緑茶', 'ビール', '洗濯洗剤'],
};

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const generateSingleRecord = (id: number, date: string): PosData => {
    const department = getRandomItem(filterOptions.departments);
    const category = getRandomItem(filterOptions.categories);
    const product = getRandomItem(filterOptions.products);
    const salesQuantity = getRandomNumber(1, 20);
    const salesAmount = salesQuantity * getRandomNumber(100, 3000);
    const inventoryCount = getRandomNumber(50, 200);

    return {
        id,
        date,
        area: getRandomItem(filterOptions.areas),
        store: getRandomItem(filterOptions.stores),
        department,
        category,
        product,
        salesAmount,
        salesQuantity,
        inventoryCount,
        inventoryAmount: inventoryCount * getRandomNumber(80, 2500),
        discountAmount: Math.round(salesAmount * getRandomNumber(0, 15) / 100),
        customerCount: getRandomNumber(1, 5),
        salesAmountPrevYear: Math.round(salesAmount * (1 + (getRandomNumber(-20, 20) / 100))),
    };
};

const getDummyPosData = (filters: FilterState): PosData[] => {
    const data: PosData[] = [];
    const startDate = new Date(filters.startDate);
    const endDate = new Date(filters.endDate);
    
    let id = 1;
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        const recordsPerDay = getRandomNumber(5, 15);
        for(let i = 0; i < recordsPerDay; i++) {
            data.push(generateSingleRecord(id++, dateString));
        }
    }

    return data.filter(item => 
        (filters.area === 'すべて' || item.area === filters.area) &&
        (filters.store === 'すべて' || item.store === filters.store) &&
        (filters.department === 'すべて' || item.department === filters.department) &&
        (filters.category === 'すべて' || item.category === filters.category) &&
        (filters.product === 'すべて' || item.product === filters.product)
    );
};

export { getDummyPosData, filterOptions };
