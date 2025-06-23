
import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle2, Package2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [fabricStatuses, setFabricStatuses] = useState<any[]>([]);
  const [criticalStocks, setCriticalStocks] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchProductionData();
      fetchCriticalStocks();
    }
  }, [user]);

  const fetchProductionData = async () => {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('fabric_status')
        .eq('user_id', user?.id);

      const statusCounts = {
        'kumaş sipariş edildi': 0,
        'kumaş geldi': 0,
        'kumaş kesime girdi': 0,
        'kumaş hazır': 0
      };

      products?.forEach(product => {
        if (product.fabric_status && statusCounts.hasOwnProperty(product.fabric_status)) {
          statusCounts[product.fabric_status as keyof typeof statusCounts]++;
        }
      });

      const statusArray = [
        { step: 'Kumaş Sipariş Edildi', count: statusCounts['kumaş sipariş edildi'], color: 'text-blue-600 bg-blue-100' },
        { step: 'Kumaş Geldi', count: statusCounts['kumaş geldi'], color: 'text-green-600 bg-green-100' },
        { step: 'Kumaş Kesime Girdi', count: statusCounts['kumaş kesime girdi'], color: 'text-purple-600 bg-purple-100' },
        { step: 'Kumaş Hazır', count: statusCounts['kumaş hazır'], color: 'text-orange-600 bg-orange-100' }
      ];

      setFabricStatuses(statusArray);
    } catch (error) {
      console.error('Error fetching production data:', error);
    }
  };

  const fetchCriticalStocks = async () => {
    try {
      const { data: products } = await supabase
        .from('products')
        .select('name, model, stock_quantity, min_stock_level')
        .eq('user_id', user?.id)
        .not('stock_quantity', 'is', null)
        .not('min_stock_level', 'is', null);

      const critical = products?.filter(product => 
        product.stock_quantity !== null && 
        product.min_stock_level !== null && 
        product.stock_quantity <= product.min_stock_level
      ).slice(0, 5).map(product => ({
        item: `${product.name} ${product.model ? `- ${product.model}` : ''}`,
        level: product.stock_quantity || 0,
        minimum: product.min_stock_level || 0,
        status: product.stock_quantity === 0 ? 'critical' : 
                product.stock_quantity <= (product.min_stock_level || 0) * 0.5 ? 'critical' : 'warning'
      })) || [];

      setCriticalStocks(critical);
    } catch (error) {
      console.error('Error fetching critical stocks:', error);
    }
  };

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

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Üretim Durumu & Kritik Stoklar</h3>
      
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

      {criticalStocks.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Kritik Stok Durumu
          </h4>
          <div className="space-y-3">
            {criticalStocks.map((stock, index) => {
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
      )}

      {criticalStocks.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <p className="text-gray-600">Tüm stoklar yeterli seviyede</p>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
