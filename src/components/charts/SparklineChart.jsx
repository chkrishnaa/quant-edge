import { Area, AreaChart, ResponsiveContainer } from 'recharts'

function SparklineChart({ data, positive }) {
  return (
    <div className="h-12 w-24">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <Area
            type="monotone"
            dataKey="value"
            stroke={positive ? '#22c55e' : '#ef4444'}
            fill={positive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SparklineChart
