
import React from 'react';
import { Clock } from 'lucide-react';
import { FabricStatus } from '@/hooks/useDashboardData';

interface FabricStatusesProps {
  fabricStatuses: FabricStatus[];
}

const FabricStatuses = ({ fabricStatuses }: FabricStatusesProps) => {
  return (
    <div className="mb-8">
      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2" />
        Kumaş Durumları
      </h4>
      <div className="space-y-3">
        {fabricStatuses.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-sm font-medium text-gray-700">{item.step}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.color}`}>
              {item.count} ürün
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FabricStatuses;
