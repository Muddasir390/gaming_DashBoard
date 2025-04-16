import { useState } from "react";
import {
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

interface chartProps {
    data?: any[]
  }

  const CustomTooltip = ({ active, payload, activePie }:any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="custom-tooltip" style={{ background: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p><strong>Date:</strong> {data.date}</p>
          {activePie === 'daily' && <p><strong>Daily Active Users:</strong> {data?.["Daily Active Users"]}</p>}
          {activePie === 'signups' && <p><strong>New Signups:</strong> {data?.["New Sign Ups"]}</p>}
        </div>
      );
    }
    return null;
  };


const PieChartComp = ({ data }: chartProps) => {
    const COLORS = [
        "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#d45087", "#4dc9f6",
        "#a05195", "#ff6361", "#58508d", "#bc5090", "#ffa600", "#003f5c",
        "#374c80", "#7a5195", "#ef5675", "#ffa07a", "#4682b4", "#ff1493",
        "#32cd32", "#ff4500", "#ffd700", "#20b2aa", "#dc143c", "#7fff00",
        "#6a5acd", "#00ced1", "#ffb6c1", "#8b0000", "#bdb76b", "#5f9ea0"
    ];

  const [activePie, setActivePie] = useState<any>(null)
    return (
        <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          dataKey="Daily Active Users"
          nameKey="date"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
          onMouseEnter={() => setActivePie('daily')}
          onMouseLeave={() => setActivePie(null)}
        >
          {data && data.map((entry, index) => (
            <Cell key={`cell-daily-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Pie
          data={data}
          dataKey="New Sign Ups"
          nameKey="date"
          cx="50%"
          cy="50%"
          innerRadius={90}
          outerRadius={120}
          fill="#82ca9d"
          label
          onMouseEnter={() => setActivePie('signups')}
          onMouseLeave={() => setActivePie(null)}
        >
          {data && data.map((entry, index) => (
            <Cell key={`cell-signups-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip activePie={activePie} />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>)

}

export default PieChartComp