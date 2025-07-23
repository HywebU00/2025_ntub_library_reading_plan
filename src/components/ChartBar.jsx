import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

// Bar 圖元件
const BarChart = ({ dataset, chartLabel, isLoading, axisOptions, categoryToTypeMap, colorToTypeMap }) => {
  const chartBarRef = useRef(null);
  const chartBarInstanceRef = useRef(null);

  useEffect(() => {
    if (chartBarRef.current && dataset) {
      if (chartBarInstanceRef.current) chartBarInstanceRef.current.destroy();

      chartBarInstanceRef.current = new Chart(chartBarRef.current, {
        type: 'bar',
        data: {
          labels: dataset.map((row) => row.name),
          datasets: [{ data: dataset.map((row) => row.count) }],
        },
        options: {
          indexAxis: 'y',
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              ...axisOptions,
              grid: { display: false },
              ticks: {
                ...axisOptions.ticks, // 保留 stepSize 等設定
                font: { size: 12 }, // 設定X軸（數值）的文字大小
              },
            },
            y: {
              grid: { display: false },
              ticks: {
                font: { size: 14 }, // 設定Y軸（書名）的文字大小
              },
            },
          },
          elements: {
            bar: { backgroundColor: colorToTypeMap.get(chartLabel) },
          },
        },
      });
    }

    return () => {
      if (chartBarInstanceRef.current) chartBarInstanceRef.current.destroy();
    };
  }, [dataset, isLoading, chartLabel, colorToTypeMap, axisOptions]);

  return (
    <div className='chart barChart'>
      <div className={`chartTitle ${categoryToTypeMap.get(chartLabel)}`}>{chartLabel}</div>
      {isLoading ? <div className='loading'></div> : ''}
      <div className='box' style={{ height: 310 }}>
        <canvas ref={chartBarRef}></canvas>
      </div>
    </div>
  );
};

export default BarChart;
