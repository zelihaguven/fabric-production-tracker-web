
import React from 'react';
import Sidebar from '../components/Sidebar';

const Reports = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Raporlar
              </h1>
              <p className="text-gray-600">
                Detaylı raporlarınızı görüntüleyin
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Rapor Merkezi</h2>
              <p className="text-gray-600">
                Raporlama özellikleri için Supabase entegrasyonu gerekiyor.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reports;
