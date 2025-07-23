import { useState, useMemo } from 'react';

import '../scss/pages/BookList.scss';
import Books from '../components/Books';
import SearchCheckBox from '../components/SearchCheckBox';

// categories
const BookList = ({ chartColor, categoriesData, bookData, categoryToTypeMap }) => {
  // 用於暫存使用者勾選的項目和輸入的搜尋詞
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 用於實際套用篩選的狀態，只在點擊「套用篩選」按鈕時更新
  const [activeFilters, setActiveFilters] = useState([]);

  const handleFilterChange = (filter, category) => {
    setSelectedFilters((prevFilters) => {
      const isExisting = prevFilters.some((item) => item.value === filter);
      if (isExisting) {
        return prevFilters.filter((item) => item.value !== filter);
      } else {
        return [...prevFilters, { category: category, value: filter }];
      }
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // 1. 「套用篩選」按鈕的處理函式
  const handleApplyFilters = () => {
    setActiveFilters(selectedFilters);
  };

  // 2. 「清除所有選擇」按鈕的處理函式
  const handleClearFilters = () => {
    setSelectedFilters([]);
    setActiveFilters([]);
  };

  // 3. 使用 useMemo 根據「即時搜尋詞」和「已套用的分類」來過濾書籍資料
  const filteredBooks = useMemo(() => {
    // 如果沒有任何已套用的篩選條件，直接返回所有書籍
    if (activeFilters.length === 0 && !searchTerm) {
      return bookData;
    }

    return bookData.filter((book) => {
      // 條件一：檢查書名是否符合搜尋詞 (如果沒有搜尋詞，則視為符合)
      const titleMatch = searchTerm ? book.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;

      // 條件二：檢查書籍分類是否符合 (如果沒有選擇分類，則視為符合)
      const categoryMatch = activeFilters.length === 0 ? true : activeFilters.some((filter) => book.categories.some((bookCategory) => bookCategory.main_category === filter.category && bookCategory.sub_category === filter.value));

      // 書籍必須「同時」滿足書名和分類的篩選條件 (AND 邏輯)
      return titleMatch && categoryMatch;
    });
  }, [searchTerm, activeFilters]); // 當 searchTerm 或 activeFilters 改變時重新計算

  return (
    <>
      <div className='mainBox'>
        <div className='bookList'>
          <div className='topBox'>
            <div className='searchBox'>
              <div className='infoTitle'>主題書單</div>
              <div className='inputBox'>
                <input placeholder='請輸入書名' aria-label='請輸入書名' type='text' value={searchTerm} onChange={handleSearchChange} />
              </div>
            </div>
            {categoriesData.map((item, index) => (
              <div className='searchBox' key={item.categories}>
                <div className='infoTitle'>{item.categories}</div>
                <SearchCheckBox chartColor={chartColor[index]} dataset={item.sub_categories} selectedFilters={selectedFilters} onFilterChange={(filterValue) => handleFilterChange(filterValue, item.categories)} />
              </div>
            ))}

            <div className='btnBox'>
              <button className='clear' onClick={handleClearFilters}>
                清除所有選擇
              </button>
              <button onClick={handleApplyFilters}>套用篩選</button>
            </div>
          </div>
          <div className='listBox'>
            {filteredBooks.length === 0 && <div className='noData'>查無資料...</div>}
            <Books dataset={filteredBooks} chartColor={chartColor} categoriesData={categoriesData} categoryToTypeMap={categoryToTypeMap} />
          </div>
        </div>
      </div>
    </>
  );
};
export default BookList;
