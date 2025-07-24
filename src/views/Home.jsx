import { useState, useEffect, useCallback, useMemo } from 'react';

import '../scss/pages/Home.scss';
import '../scss/components/Chart.scss';

import ChartBar from '../components/ChartBar';
import ChartRadar from '../components/ChartRadar';
import dImg from '../assets/images/img.png';
import Success from '../assets/images/i_success.svg';

const Home = ({ rawData, chartColor, categoryToTypeMap, colorToTypeMap }) => {
  const [finalData, setFinalData] = useState([]);
  const [FirstIsLoading, setFirstIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  // 為日期分別建立 state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [open, setOpen] = useState(false);

  const processData = useCallback(
    (start, end) => {
      setIsLoading(true);

      // 使用 setTimeout 模擬非同步操作 (例如 API 請求)
      setTimeout(() => {
        // 處理日期範圍
        // 將 YYYY-MM-DD 格式的日期字串轉換為數字以便比較
        const startDateNum = start ? parseInt(start.replace(/-/g, ''), 10) : null;
        const endDateNum = end ? parseInt(end.replace(/-/g, ''), 10) : null;

        // 如果沒有選擇日期 startDate 記錄所有資料中最早的日期，endDate 記錄所有資料中最晚的日期
        if (!startDateNum && !endDateNum && rawData && rawData.length > 0) {
          // 找出所有資料中的最早和最晚日期，這樣更穩健，不受資料排序影響
          const allDates = rawData.map((item) => item.date);
          // 因為日期格式是 YYYY-MM-DD，可以直接用字串比較大小
          const minDate = allDates.reduce((a, b) => (a < b ? a : b));
          const maxDate = allDates.reduce((a, b) => (a > b ? a : b));
          setStartDate(minDate);
          setEndDate(maxDate);
        }

        const filteredByDate = (rawData || []).filter((entry) => {
          if (!startDateNum || !endDateNum) return true; // 如果沒有選擇日期，則處理所有資料
          const entryDateNum = parseInt(entry.date.replace(/-/g, ''), 10);
          return entryDateNum >= startDateNum && entryDateNum <= endDateNum;
        });

        // 匯總每本書的閱讀次數
        const aggregated = {};
        filteredByDate.forEach((book) => {
          // 使用 name 和 type 作為複合鍵，確保不同類型的同書名被分開計算
          const key = `${book.name}|${book.categories}`;
          if (aggregated[key]) {
            aggregated[key].count += 1;
          } else {
            aggregated[key] = { ...book }; // 複製 book 物件以避免修改原始資料
            aggregated[key].count = 1;
          }
        });

        const aggregatedList = Object.values(aggregated);
        const finalDataMap = new Map(); // 使用 Map 來儲存 category

        aggregatedList.forEach((book) => {
          const { categories } = book;
          let categoryData = finalDataMap.get(categories);

          // 如果是第一次遇到這個 category
          if (!categoryData) {
            // 建立新的 category 物件，包含 type 和空的 books 陣列
            categoryData = { categories: categories, books: [] };
            finalDataMap.set(categories, categoryData);
          }

          // 將書本資料推進對應 category 的 books 陣列中
          categoryData.books.push({ ...book });
        });

        // 最後將 Map 的值轉換回陣列形式，得到最終結果
        let finalDataToArray = Array.from(finalDataMap.values());

        // 建立一個用於排序的 Map，將 category 名稱映射到它在 chartColor 中的索引
        const categoryOrderMap = new Map((chartColor || []).map((item, index) => [item.categories, index]));

        // 根據 chartColor 中的順序對 finalDataToArray 進行排序
        finalDataToArray.sort((a, b) => {
          // 從 map 中取得排序索引，如果找不到，給一個很大的值讓它排到後面
          const orderA = categoryOrderMap.get(a.categories) ?? Infinity;
          const orderB = categoryOrderMap.get(b.categories) ?? Infinity;
          return orderA - orderB;
        });

        // 更新 state
        setFinalData(finalDataToArray);
        setOpen(true);
        setIsLoading(false);
        setFirstIsLoading(false);
      }, 500); // 模擬 0.5 秒延遲
    },
    [rawData, chartColor]
  );

  // 使用 useMemo 一次性計算出所有與圖表座標軸相關的設定
  const chartSettings = useMemo(() => {
    // 使用 flatMap 將巢狀陣列中的所有 book.count 攤平成一個單一的數字陣列
    const allCounts = finalData.flatMap((item) => item.books.map((book) => Number(book.count)));

    const dataMax = Math.max(...allCounts, 0);

    let axisMax;
    // 當沒有資料時，提供一個預設的座標軸
    if (dataMax === 0) {
      axisMax = 20;
    } else {
      // 決定座標軸的最大值。至少為 20，並向上取到最接近的 10 的倍數
      axisMax = Math.ceil(Math.max(20, dataMax) / 10) * 10;
    }

    // 動態產生刻度值 (例如，我們希望有 5 個區間)
    const tickIncrement = axisMax / 5;

    // 回傳完整的設定物件
    return {
      options: { min: 0, max: axisMax, ticks: { stepSize: tickIncrement } },
    };
  }, [finalData]);

  // 使用 useEffect 在元件首次載入時，處理一次所有資料
  useEffect(() => {
    if (rawData) processData(null, null);
  }, [rawData, processData]);

  // 查詢按鈕的事件處理函式現在只負責觸發資料處理
  const handleQuery = () => processData(startDate, endDate);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={`dialog ${open ? 'open' : ''}`}>
        <div className='dialogContent'>
          <div className='pic'>
            <img src={Success} alt='' />
          </div>
          <div className='title'>報告已生成</div>
          <p>您的閱讀履歷報告已成功生成！</p>
          <button onClick={handleClose} className='btn'>
            確定
          </button>
        </div>
      </div>

      <div className='mainBox hasSide'>
        <div className='dImg'>
          <img src={dImg} alt='' />
        </div>
        <aside>
          <div className='reader'>
            <div className='infoTitle'>讀者資料</div>
            <ul>
              <li>
                <div className='title'>姓名 /</div>
                <div className='content'>王小明</div>
              </li>
              <li>
                <div className='title'>證號 /</div>
                <div className='content'>11300001</div>
              </li>
              <li>
                <div className='title'>身分 /</div>
                <div className='content'>大學部學生</div>
              </li>
              <li>
                <div className='title'>系所 /</div>
                <div className='content'>資訊工程系</div>
              </li>
            </ul>
          </div>
          <div className='search'>
            <div className='infoTitle'>查詢設定</div>
            <ul>
              <li>
                <div className='title'>起始日期</div>
                <div className='content'>
                  <input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} max={endDate || ''} />
                </div>
              </li>
              <li>
                <div className='title'>結束日期</div>
                <div className='content'>
                  <input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate || ''} />
                </div>
              </li>
            </ul>
            <button onClick={handleQuery} disabled={isLoading}>
              {isLoading ? '產生中...' : '產生報告'}
            </button>
          </div>
        </aside>
        <div className='chartBox'>
          <div className='infoTitle'>
            閱讀指標分析{' '}
            <span>
              {startDate || endDate ? '報告期間：' : null}
              {startDate} {endDate ? '至' : null} {endDate}
            </span>
          </div>
          {FirstIsLoading ? <div className='loading'></div> : ''}
          <div className='outerBox'>
            {finalData.map((item, index) => (
              <ChartBar key={`bar-${index}`} dataset={item.books} chartLabel={item.categories} isLoading={isLoading} axisOptions={chartSettings.options} categoryToTypeMap={categoryToTypeMap} colorToTypeMap={colorToTypeMap} />
            ))}
            {finalData.map((item, index) => (
              <ChartRadar key={`radar-${index}`} dataset={item.books} chartLabel={item.categories} isLoading={isLoading} axisOptions={chartSettings.options} categoryToTypeMap={categoryToTypeMap} colorToTypeMap={colorToTypeMap} />
            ))}
          </div>
          <div className='bottomBox'>
            <div className='total'>
              閱讀冊數 (統計樣本)：<span>{rawData?.length || 0}</span>本
            </div>
            <div className='btnBox'>
              <button className='printBtn' onClick={handleClose}>
                列印報告
              </button>
              <button className='exportBtn' onClick={handleClose}>
                匯出PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
