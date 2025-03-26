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
  }


const LineChartComp = ({ data, isLoading }: chartProps)=>{
  
return(
  <>
                {isLoading ?   
                 <div className="w-full h-[300px] flex flex-col items-center justify-center space-y-4">
                 <div className="w-full h-[250px] bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] rounded-lg relative overflow-hidden shadow-md animate-pulse">
                   <div className="absolute inset-0 bg-gradient-to-r from-[#f1f5f9] via-[#e2e8f0] to-[#f1f5f9] animate-[shimmer_1.8s_infinite]"></div>
           
                   <div className="absolute bottom-0 left-[10%] w-[12%] h-[50%] bg-[#cbd5e1] opacity-60 rounded-lg"></div>
                   <div className="absolute bottom-0 left-[30%] w-[12%] h-[70%] bg-[#94a3b8] opacity-50 rounded-lg"></div>
                   <div className="absolute bottom-0 left-[50%] w-[12%] h-[40%] bg-[#cbd5e1] opacity-60 rounded-lg"></div>
                   <div className="absolute bottom-0 left-[70%] w-[12%] h-[80%] bg-[#94a3b8] opacity-50 rounded-lg"></div>
                   <div className="absolute bottom-0 left-[90%] w-[12%] h-[60%] bg-[#cbd5e1] opacity-60 rounded-lg"></div>
                 </div>
                 <div className="w-1/3 h-6 bg-[#e2e8f0] rounded-md animate-pulse shadow-sm"></div>
               </div>: 
               <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
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
                    <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>}
                </>
              )

}

export default LineChartComp