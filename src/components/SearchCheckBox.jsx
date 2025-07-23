import '../scss/components/SearchCheck.scss';
const SearchCheckBox = ({ type, dataset, selectedFilters, onFilterChange }) => {
  return (
    <>
      <div className={`checkBox ${type}`}>
        {dataset.map((item, index) => (
          // 1. 使用 item 作為 key，確保其唯一性
          <div className='checkItem' key={`${item}${index}`}>
            <input
              type='checkbox'
              name={item}
              // 2. id 應基於唯一的 item 值，而不是 index，以確保穩定性
              id={`checkbox-${type}-${index}`}
              // 3. 改用 .some() 檢查 selectedFilters 陣列中是否有任何物件的 value 等於目前的 item
              checked={selectedFilters.some((filter) => filter.value === item)}
              // 4. 當點擊時，呼叫從父元件傳來的 onFilterChange 函式，並將自身的值傳回去
              onChange={() => onFilterChange(item)}
            />
            <label htmlFor={`checkbox-${type}-${index}`}>{item}</label>
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchCheckBox;
