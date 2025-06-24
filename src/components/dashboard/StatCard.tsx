
import React from 'react';
import { StatConfig } from '@/config/statsConfig';
import { StatsData } from '@/hooks/useStatsData';

interface StatCardProps {
  config: StatConfig;
  stats: StatsData;
}

const StatCard = ({ config, stats }: StatCardProps) => {
  const Icon = config.icon;
  const value = config.getValue(stats);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${config.gradient} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {config.changeType === 'warning' && value !== '0' && (
          <span className="text-sm font-semibold px-2 py-1 rounded-full text-orange-700 bg-orange-100">
            Dikkat!
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{config.title}</p>
    </div>
  );
};

export default StatCard;
