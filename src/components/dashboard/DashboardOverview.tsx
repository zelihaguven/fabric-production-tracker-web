
import React from 'react';
import { Clock, AlertCircle, CheckCircle2, Package2 } from 'lucide-react';

const DashboardOverview = () => {
  const productionSteps = [
    { step: 'Kumaş İstendi', count: 15, color: 'text-blue-600 bg-blue-100' },
    { step: 'Kumaş Geldi', count: 12, color: 'text-green-600 bg-green-100' },
    { step: 'Kumaş Kesildi', count: 8, color: 'text-purple-600 bg-purple-100' },
    { step: 'Dikime Başlandı', count: 6, color: 'text-orange-600 bg-orange-100' },
    { step: 'Dikim Bitti', count: 4, color: 'text-indigo-600 bg-indigo-100' },
    { step: 'Etiketler Takıldı', count: 3, color: 'text-pink-600 bg-pink-100' },
    { step: 'Paketlendi', count: 2, color: 'text-emerald-600 bg-emerald-100' }
  ];

  const criticalStocks = [
    { item: 'Pamuklu Kumaş - Beyaz', level: 15, minimum: 50, status: 'critical' },
    { item: 'Beden Etiketi - L', level: 25, minimum: 30, status: 'warning' },
    { item: 'Marka Etiketi - X Brand', level: 80, minimum: 40, status: 'good' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Üretim Durumu & Kritik Stoklar</h3>
      
      <div className="mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Mevcut Üretim Aşamaları
        </h4>
        <div className="space-y-3">
          {productionSteps.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-700">{item.step}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.color}`}>
                {item.count} sipariş
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          Kritik Stok Durumu
        </h4>
        <div className="space-y-3">
          {criticalStocks.map((stock, index) => {
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

            const progressPercentage = (stock.level / stock.minimum) * 100;

            return (
              <div key={index} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(stock.status)}
                    <span className="text-sm font-medium text-gray-700">{stock.item}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {stock.level}/{stock.minimum} adet
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
    </div>
  );
};

export default DashboardOverview;
