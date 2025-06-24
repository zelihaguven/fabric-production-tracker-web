
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DashboardErrorProps {
  error: string;
  onRetry: () => void;
}

const DashboardError = ({ error, onRetry }: DashboardErrorProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Üretim Durumu & Kritik Stoklar</h3>
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
        <p className="text-red-700 mb-4">{error}</p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
};

export default DashboardError;
