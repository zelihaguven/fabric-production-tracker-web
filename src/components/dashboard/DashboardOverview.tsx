
import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import FabricStatuses from './FabricStatuses';
import CriticalStocks from './CriticalStocks';
import DashboardLoading from './DashboardLoading';
import DashboardError from './DashboardError';

const DashboardOverview = () => {
  const { fabricStatuses, criticalStocks, loading, error, refetch } = useDashboardData();

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return <DashboardError error={error} onRetry={refetch} />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Üretim Durumu & Kritik Stoklar</h3>
      
      <FabricStatuses fabricStatuses={fabricStatuses} />
      <CriticalStocks criticalStocks={criticalStocks} />
    </div>
  );
};

export default DashboardOverview;
