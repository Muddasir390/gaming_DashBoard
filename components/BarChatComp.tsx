import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface chartProps {
  data?: any[]
  name?: string
  value?: any
  loading?: boolean
}


const BarChatComp = ({ data, name, value, loading }: chartProps) => {


  const COLORS = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#d45087", "#4dc9f6",
    "#a05195", "#ff6361", "#58508d", "#bc5090", "#ffa600", "#003f5c",
    "#374c80", "#7a5195", "#ef5675", "#ffa07a", "#4682b4", "#ff1493",
    "#32cd32", "#ff4500", "#ffd700", "#20b2aa", "#dc143c", "#7fff00",
    "#6a5acd", "#00ced1", "#ffb6c1", "#8b0000", "#bdb76b", "#5f9ea0"
  ];
  return (
    <>
      {loading ? <div className="w-full h-[300px] flex flex-col items-center justify-center space-y-4">
        <div className="w-full h-[250px] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] rounded-lg relative overflow-hidden shadow-md animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f1f5f9] via-[#e2e8f0] to-[#f1f5f9] animate-[shimmer_1.8s_infinite]"></div>

          <div className="absolute bottom-0 left-[10%] w-[12%] h-[50%] bg-[#cbd5e1] opacity-60 rounded-lg"></div>
          <div className="absolute bottom-0 left-[30%] w-[12%] h-[70%] bg-[#94a3b8] opacity-50 rounded-lg"></div>
          <div className="absolute bottom-0 left-[50%] w-[12%] h-[40%] bg-[#cbd5e1] opacity-60 rounded-lg"></div>
          <div className="absolute bottom-0 left-[70%] w-[12%] h-[80%] bg-[#94a3b8] opacity-50 rounded-lg"></div>
          <div className="absolute bottom-0 left-[90%] w-[12%] h-[60%] bg-[#cbd5e1] opacity-60 rounded-lg"></div>
        </div>
        <div className="w-1/3 h-6 bg-[#e2e8f0] rounded-md animate-pulse shadow-sm"></div>
      </div> : <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey={name} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {value?.map((item:any, index:any)=>{
            return(<Bar
              dataKey={item}
              fill={COLORS[index]}
              shape={value?.length === 1 ? (props: any) => {
                const { fill, ...rest } = props;
                return <rect {...rest} fill={COLORS[rest.index % COLORS.length]} />;
              } : undefined}
            />)
          })}
         
        </BarChart>
      </ResponsiveContainer>}
    </>
  )

}

export default BarChatComp