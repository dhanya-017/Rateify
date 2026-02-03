import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const RatingsChart = ({ ratingsData }) => {
  // Sample data for demonstration - replace with actual API data
  const monthlyData = [
    { month: 'Jan', ratings: 120, users: 45 },
    { month: 'Feb', ratings: 150, users: 52 },
    { month: 'Mar', ratings: 180, users: 61 },
    { month: 'Apr', ratings: 220, users: 73 },
    { month: 'May', ratings: 280, users: 89 },
    { month: 'Jun', ratings: 320, users: 95 },
  ];

  const ratingDistribution = [
    { name: '5 Stars', value: 45, color: '#10b981' },
    { name: '4 Stars', value: 30, color: '#3b82f6' },
    { name: '3 Stars', value: 15, color: '#f59e0b' },
    { name: '2 Stars', value: 7, color: '#f97316' },
    { name: '1 Star', value: 3, color: '#ef4444' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart - Monthly Ratings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Ratings Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="ratings" 
              fill="#3b82f6" 
              radius={[8, 8, 0, 0]}
              name="Total Ratings"
            />
            <Bar 
              dataKey="users" 
              fill="#10b981" 
              radius={[8, 8, 0, 0]}
              name="Active Users"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Rating Distribution */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={ratingDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {ratingDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RatingsChart;
