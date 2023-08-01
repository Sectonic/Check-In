import { PureComponent } from 'react';
import { ScatterChart, Scatter, Cell, XAxis, YAxis, PieChart, Pie, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

class AttendanceRates extends PureComponent {
    render() {
        return (
            <ResponsiveContainer width="100%" height={410}>
                <BarChart
                data={this.props.data}
                margin={{
                    top: 30,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend iconType='circle' />
                <Bar dataKey="present" stackId="a" fill="#80ced1" />
                <Bar dataKey="tardy" stackId="a" fill="#efd8bd" />
                <Bar dataKey="absent" stackId="a" fill="#e58b8b" />
                <text x="50%" y="20" textAnchor='middle' className="font-semibold p-2">
                    Attendance Rates Per Day
                </text>
                </BarChart>
            </ResponsiveContainer>
        )
    }
}

class AttendanceSubmitted extends PureComponent {
    render() {
        return (
            <ResponsiveContainer width="100%" height={400}>
                <ScatterChart
                margin={{
                    top: 30,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
                > 
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="minutes" unit=" min" />
                <YAxis type="number" dataKey="y" name="attendances" unit=" att" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="A school" data={this.props.data} fill="#80ced1" line />
                <text x="50%" y="20" textAnchor='middle' className="font-semibold p-2">
                    Attendance Submitted Per Minute
                </text>
                </ScatterChart>
            </ResponsiveContainer>
        )
    }
}

const COLORS = ['#80ced1', '#e58b8b', '#efd8bd'];
const DARK_COLORS = ['#5fa6a9', '#a8595e', '#c2a998']
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index, name }) => {
    const labelRadius = outerRadius + 30; // Adjust the radius to move the label further outside the circle
  
    const labelX = cx + labelRadius * Math.cos(-midAngle * RADIAN) + ( index === 1 ? -80 : 0);
    const labelY = cy + labelRadius * Math.sin(-midAngle * RADIAN) + ( index === 2 ? 15 : -15);
  
    const lineStartX = cx + (outerRadius + 10) * Math.cos(-midAngle * RADIAN); // Start of the line
    const lineStartY = cy + (outerRadius + 10) * Math.sin(-midAngle * RADIAN); // Start of the line
    const lineEndX = cx + labelRadius * Math.cos(-midAngle * RADIAN); // End of the line
    const lineEndY = cy + labelRadius * Math.sin(-midAngle * RADIAN); // End of the line

    const setAnchor = () => {
        if (index === 0) {
            return 'left'
        } else if (index === 1) {
            return 'left'
        } else {
            return 'middle'
        }
    }
  
    return (
      <>
        {/* Line pointing towards the label */}
        <line x1={lineStartX} y1={lineStartY} x2={lineEndX} y2={lineEndY} stroke="#999999" />
  
        {/* Label */}
        <text x={labelX} y={labelY} fill={DARK_COLORS[index]} textAnchor={setAnchor()} dominantBaseline="central">
          {name} {`${(percent * 100).toFixed(0)}%`}
        </text>
      </>
    );
};

class OverallAttendance extends PureComponent {
    render() {
        return (
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={this.props.data}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={renderCustomizedLabel}
                        outerRadius={130}
                        dataKey="value"
                        innerRadius={40} 
                    >
                        {this.props.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <text x="50%" y="15" textAnchor='middle' className="font-semibold p-2">
                        Overall Attendance
                    </text>
                </PieChart>
            </ResponsiveContainer>   
        )
    }
}

export { OverallAttendance, AttendanceSubmitted, AttendanceRates };