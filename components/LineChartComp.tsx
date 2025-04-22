import {
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface chartProps {
  data?: any[]
  isLoading?: boolean
  rentation?: boolean
}


const LineChartComp = ({ data, rentation }: chartProps) => {

  return (
    <>
      {
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}
           >
            <defs>
              <linearGradient
                id="colorGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#FFD700" stopOpacity={0.8} />
                <stop
                  offset="100%"
                  stopColor="#9370DB"
                  stopOpacity={0.8}
                />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            {rentation ? <Line type="monotone" dataKey="Retention" stroke="#8884d8" strokeWidth={4} /> : <><Line type="monotone" dataKey="Daily Active Users" stroke="#8884d8" strokeWidth={4} />
              <Line type="monotone" dataKey="New Sign Ups" stroke="red" strokeWidth={4} /></>}
          </LineChart>
        </ResponsiveContainer>}
    </>
  )

}

export default LineChartComp
