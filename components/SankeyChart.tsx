// components/SankeyChart.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, ChartData, ChartOptions, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { SankeyController, Flow } from 'chartjs-chart-sankey';

// Register the necessary components with Chart.js
Chart.register(SankeyController, Flow, LinearScale, Title, Tooltip, Legend);

interface SankeyChartProps {
  data?: any;
  options?: ChartOptions<'sankey'>;
}

const SankeyChart: React.FC<SankeyChartProps> = ({ data, options }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart<'sankey'> | null>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');

    if (ctx) {
      // Destroy the previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create a new chart instance
      chartInstanceRef.current = new Chart(ctx, {
        type: 'sankey',
        data,
        options,
      });
    }

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, options]);

  return <canvas ref={chartRef} />;
};

export default SankeyChart;
