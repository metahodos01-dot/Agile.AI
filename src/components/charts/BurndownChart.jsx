import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    ComposedChart
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl">
                <p className="text-zinc-300 font-bold mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-mono font-bold">{entry.value}h</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const BurndownChart = ({ data, idealHours, totalDays }) => {
    // If no data, show empty state or simple placeholder
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center bg-zinc-800/30 rounded-xl border border-dashed border-zinc-700">
                <p className="text-zinc-500">Nessun dato Burndown disponibile</p>
                <p className="text-xs text-zinc-600 mt-1">Avvia lo sprint per iniziare il tracciamento</p>
            </div>
        );
    }

    return (
        <div className="h-[300px] w-full">
            <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-4 ml-2">Burndown Chart (Ore)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" vertical={false} />
                    <XAxis
                        dataKey="day"
                        stroke="#71717a"
                        tick={{ fill: '#71717a', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#71717a"
                        tick={{ fill: '#71717a', fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        label={{ value: 'Ore Rimanenti', angle: -90, position: 'insideLeft', fill: '#52525b', fontSize: 10 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />

                    {/* Area under the Real line for better visualization */}
                    <Area
                        type="monotone"
                        dataKey="real"
                        fill="#6366f1"
                        fillOpacity={0.1}
                        stroke="none"
                    />

                    {/* Ideal Line (Dashed) */}
                    <Line
                        type="linear"
                        dataKey="ideal"
                        name="Ideale"
                        stroke="#71717a"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        activeDot={false}
                    />

                    {/* Real Line (Solid, Colored) */}
                    <Line
                        type="monotone"
                        dataKey="real"
                        name="Reale"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ fill: '#18181b', stroke: '#6366f1', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#818cf8' }}
                        animationDuration={1500}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BurndownChart;
