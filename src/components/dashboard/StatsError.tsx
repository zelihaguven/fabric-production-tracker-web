
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface StatsErrorProps {
  error: string;
  onRetry: () => void;
}

const StatsError = ({ error, onRetry }: StatsErrorProps) => {
  return (
    <div className="grid grid-cols-1 mb-8">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-700">{error}</p>
        <button 
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
};

export default StatsError;
