'use client';

import React, { useEffect, useRef } from 'react';
import { Chart, ChartData, ChartOptions, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { SankeyController, Flow } from 'chartjs-chart-sankey';

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
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: 'sankey',
        data,
        options,
      });
    }

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
