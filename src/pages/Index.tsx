
import React from 'react';
import Sidebar from '../components/Sidebar';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import StatsCards from '../components/dashboard/StatsCards';
import ProductionChart from '../components/dashboard/ProductionChart';
import RecentOrders from '../components/dashboard/RecentOrders';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                StokPro - Stok Takip Sistemi
              </h1>
              <p className="text-gray-600">
                Stok yönetiminizi takip edin ve üretim süreçlerinizi optimize edin
              </p>
            </div>
            
            <StatsCards />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ProductionChart />
              <DashboardOverview />
            </div>
            
            <RecentOrders />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
