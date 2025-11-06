import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const FeeStats = ({ stats }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Thống kê thu phí</h3>
      <div className="grid grid-cols-2 gap-4">
        <PieChart width={400} height={300}>
          <Pie
            data={stats}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
          >
            {stats.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
        <div className="p-4">
          <h4 className="font-semibold mb-2">Tổng quan</h4>
          <ul className="space-y-2">
            <li>Tổng số tiền đã thu: {stats.totalCollected}</li>
            <li>Tỷ lệ thu: {stats.collectionRate}%</li>
            <li>Số hộ đã nộp: {stats.householdsPaid}</li>
            <li>Số hộ chưa nộp: {stats.householdsUnpaid}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeeStats;