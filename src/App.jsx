import { useMemo } from 'react';
import rawData from './assets/view.json';
import bookData from './assets/books.json';
import { useState } from 'react';
import Home from './views/Home.jsx';
import BookList from './views/BookList.jsx';
import BookList2 from './views/BookList2.jsx';

// 設定圖表顏色
const chartColor = [
  { type: 'type1', color: '#7474db', categories: '專業能力指標' },
  { type: 'type2', color: '#e65e7f', categories: '共同職能指標' },
];

const categoriesData = [
  {
    categories: '專業能力指標',
    sub_categories: ['商業分析與決策', '資訊管理應用', '商品設計與研發', '商管相關法令應用', '語言應用能力', '國際經貿知識與實務', '數位科技應用', '財務管理與金融投資', '組織與人力資源管理'],
  },
  {
    categories: '共同職能指標',
    sub_categories: ['溝通表達', '持續學習', '人際互動', '團隊合作', '問題解決', '創新能力', '工作責任與紀律', '資訊科技應用', '品格與人文素養'],
  },
];
const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  // 使用 useMemo 創建一個查詢用的 Map
  const categoryToTypeMap = useMemo(() => {
    const map = new Map();
    (chartColor || []).forEach((item) => {
      map.set(item.categories, item.type);
    });
    return map;
  }, []);
  const colorToTypeMap = useMemo(() => {
    const map = new Map();
    (chartColor || []).forEach((item) => {
      map.set(item.categories, item.color);
    });
    return map;
  }, []);

  return (
    <>
      <div className='readingPlan'>
        <div className='contentBox'>
          <div className='topBox'>
            <div className='container'>
              <h2>閱讀履歷</h2>
            </div>
            <nav className='tabTopNav'>
              <ul>
                <li>
                  <button className={activeTab === 0 ? 'active' : ''} onClick={() => setActiveTab(0)}>
                    閱讀履歷指標儀表板
                  </button>
                </li>
                <li>
                  <button className={activeTab === 1 ? 'active' : ''} onClick={() => setActiveTab(1)}>
                    主題書單
                  </button>
                </li>
                <li>
                  <button className={activeTab === 2 ? 'active' : ''} onClick={() => setActiveTab(2)}>
                    系所適用書單
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          <div className='tabContentBox'>
            {/* 根據 activeTab 的值，只顯示對應的內容 */}
            <div className='tabContent' style={{ display: activeTab === 0 ? 'block' : 'none' }}>
              <Home rawData={rawData} chartColor={chartColor} categoryToTypeMap={categoryToTypeMap} colorToTypeMap={colorToTypeMap} />
            </div>
            <div className='tabContent' style={{ display: activeTab === 1 ? 'block' : 'none' }}>
              <BookList chartColor={chartColor} categoriesData={categoriesData} bookData={bookData} categoryToTypeMap={categoryToTypeMap} />
            </div>
            <div className='tabContent' style={{ display: activeTab === 2 ? 'block' : 'none' }}>
              <BookList2 chartColor={chartColor} categoriesData={categoriesData} bookData={bookData} categoryToTypeMap={categoryToTypeMap} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
