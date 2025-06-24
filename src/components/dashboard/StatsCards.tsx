
import React from 'react';
import { useStatsData } from '@/hooks/useStatsData';
import { statsConfig } from '@/config/statsConfig';
import StatCard from './StatCard';
import StatsLoading from './StatsLoading';
import StatsError from './StatsError';

const StatsCards = () => {
  const { stats, loading, error, refetch } = useStatsData();

  if (loading) {
    return <StatsLoading />;
  }

  if (error) {
    return <StatsError error={error} onRetry={refetch} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsConfig.map((config, index) => (
        <StatCard key={index} config={config} stats={stats} />
      ))}
    </div>
  );
};

export default StatsCards;
