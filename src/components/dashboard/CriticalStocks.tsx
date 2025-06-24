
import React from 'react';
import { AlertCircle, CheckCircle2, Clock, Package2 } from 'lucide-react';
import { CriticalStock } from '@/hooks/useDashboardData';

interface CriticalStocksProps {
  criticalStocks: CriticalStock[];
}

const CriticalStocks = ({ criticalStocks }: CriticalStocksProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'good':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Package2 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-orange-500';
      case 'good':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (criticalStocks.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <p className="text-gray-600">Tüm stoklar yeterli seviyede</p>
      </div>
    );
  }

  return (
    <div>
      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        Kritik Stok Durumu
      </h4>
      <div className="space-y-3">
        {criticalStocks.map((stock, index) => {
          const progressPercentage = stock.minimum > 0 ? (stock.level / stock.minimum) * 100 : 0;

          return (
            <div key={index} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(stock.status)}
                  <span className="text-sm font-medium text-gray-700">{stock.item}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {stock.level}/{stock.minimum || 'Min. belirsiz'} adet
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(stock.status)}`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CriticalStocks;
