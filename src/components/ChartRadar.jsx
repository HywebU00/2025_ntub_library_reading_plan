import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function hexToRgba(hex, alpha = 1) {
  let c = hex.substring(1).toLowerCase();
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  if (c.length !== 6) {
    throw new Error('Invalid HEX color format. Please use #RGB or #RRGGBB.');
  }

  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);

  if (alpha < 0 || alpha > 1) {
    console.warn('Alpha value should be between 0 and 1. Clamping it.');
    alpha = Math.max(0, Math.min(1, alpha));
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Radar 圖元件
const RadarChart = ({ dataset, chartLabel, isLoading, axisOptions, categoryToTypeMap, colorToTypeMap }) => {
  const chartRadarRef = useRef(null);
  const chartRadarInstanceRef = useRef(null);

  useEffect(() => {
    if (chartRadarRef.current && dataset) {
      if (chartRadarInstanceRef.current) chartRadarInstanceRef.current.destroy();

      chartRadarInstanceRef.current = new Chart(chartRadarRef.current, {
        type: 'radar',
        data: {
          labels: dataset.map((row) => row.name),
          datasets: [
            {
              label: chartLabel,
              data: dataset.map((row) => row.count),
              backgroundColor: hexToRgba(colorToTypeMap.get(chartLabel), 0.2),
              borderColor: colorToTypeMap.get(chartLabel),
              pointBackgroundColor: colorToTypeMap.get(chartLabel),
              pointBorderColor: '#fff',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          elements: {
            line: { borderWidth: 2 },
          },
          scales: {
            r: {
              ...axisOptions,
              ticks: {
                ...axisOptions.ticks, // 保留 stepSize 等設定
                backdropColor: 'transparent', // 讓數字背景透明，避免擋住格線
                font: { size: 10 }, // 設定刻度（數值）的文字大小
              },
              pointLabels: {
                font: { size: 12 }, // 設定標籤（書名）的文字大小
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartRadarInstanceRef.current) chartRadarInstanceRef.current.destroy();
    };
  }, [dataset, isLoading, chartLabel, colorToTypeMap, axisOptions]);

  return (
    <div className='chart radarChart'>
      <div className={`chartTitle ${categoryToTypeMap.get(chartLabel)}`}>{chartLabel}</div>
      {isLoading ? <div className='loading'></div> : ''}
      <div className='box' style={{ height: 375 }}>
        <canvas ref={chartRadarRef}></canvas>
      </div>
    </div>
  );
};

export default RadarChart;
