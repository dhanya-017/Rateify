import React from 'react';
import { Users, Store, Star, TrendingUp } from 'lucide-react';

const KPICards = ({ dashboardData }) => {
  const kpiData = [
    {
      title: 'Total Users',
      value: dashboardData?.totalUsers || 0,
      icon: Users,
      color: 'blue',
      trend: '+12%',
      trendDirection: 'up'
    },
    {
      title: 'Total Stores',
      value: dashboardData?.totalStores || 0,
      icon: Store,
      color: 'green',
      trend: '+8%',
      trendDirection: 'up'
    },
    {
      title: 'Total Ratings',
      value: dashboardData?.totalRatings || 0,
      icon: Star,
      color: 'yellow',
      trend: '+25%',
      trendDirection: 'up'
    },
    {
      title: 'Avg Rating',
      value: dashboardData?.averageRating ? dashboardData.averageRating.toFixed(1) : '0.0',
      icon: TrendingUp,
      color: 'purple',
      trend: '+5%',
      trendDirection: 'up'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        iconBg: 'bg-blue-600',
        iconText: 'text-blue-600',
        text: 'text-blue-900',
        trend: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        iconBg: 'bg-green-600',
        iconText: 'text-green-600',
        text: 'text-green-900',
        trend: 'text-green-600'
      },
      yellow: {
        bg: 'bg-yellow-50',
        iconBg: 'bg-yellow-600',
        iconText: 'text-yellow-600',
        text: 'text-yellow-900',
        trend: 'text-yellow-600'
      },
      purple: {
        bg: 'bg-purple-50',
        iconBg: 'bg-purple-600',
        iconText: 'text-purple-600',
        text: 'text-purple-900',
        trend: 'text-purple-600'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        const colors = getColorClasses(kpi.color);
        
        return (
          <div key={index} className={`${colors.bg} rounded-xl p-6 shadow-sm border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className={`text-sm font-medium ${colors.text} opacity-80`}>
                  {kpi.title}
                </p>
                <p className={`text-3xl font-bold ${colors.text} mt-2`}>
                  {kpi.value}
                </p>
                <div className="flex items-center mt-2 space-x-1">
                  <TrendingUp className={`w-4 h-4 ${colors.trend}`} />
                  <span className={`text-sm font-medium ${colors.trend}`}>
                    {kpi.trend}
                  </span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className={`${colors.iconBg} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;
