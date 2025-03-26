import {
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";


const PieChartComp = (data: any) => {
    const COLORS = [
        "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#d45087", "#4dc9f6",
        "#a05195", "#ff6361", "#58508d", "#bc5090", "#ffa600", "#003f5c",
        "#374c80", "#7a5195", "#ef5675", "#ffa07a", "#4682b4", "#ff1493",
        "#32cd32", "#ff4500", "#ffd700", "#20b2aa", "#dc143c", "#7fff00",
        "#6a5acd", "#00ced1", "#ffb6c1", "#8b0000", "#bdb76b", "#5f9ea0"
    ];
    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={data?.data}
                    dataKey="users"
                    nameKey="date"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                >
                    {data.data.map((entry: any, index: any) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>)

}

export default PieChartComp